import { defineEventHandler, readBody, createError } from 'h3'
import Stripe from 'stripe'
import prisma from '~/server/utils/prisma'
import { estimateStripeFee } from '~/utils/pricing'

let stripeClient: Stripe | null = null

function getStripeClient(secretKey: string) {
  if (!stripeClient) {
    stripeClient = new Stripe(secretKey, {
      apiVersion: '2024-06-20'
    })
  }
  return stripeClient
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const secretKey = config.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw createError({
      statusCode: 500,
      message: 'Stripe is not configured.'
    })
  }

  const body = await readBody(event)
  const eventId = typeof body?.eventId === 'string' ? body.eventId : undefined
  const cart = body?.cart && typeof body.cart === 'object' ? body.cart : null
  const selectedOption = body?.selectedOption && typeof body.selectedOption === 'object'
    ? body.selectedOption
    : null
  const parseCount = (value: unknown) => {
    const num = Number.parseInt(String(value ?? ''), 10)
    return Number.isFinite(num) && num > 0 ? num : 0
  }

  if (!cart) {
    throw createError({
      statusCode: 400,
      message: 'Cart is empty. Please add tickets before checkout.'
    })
  }

  const adultCount = parseCount(cart.adultCount ?? cart.quantityAdults)
  const childCount = parseCount(cart.childCount ?? cart.quantityChildren)
  let totalQuantity = parseCount(cart.quantity)

  if (adultCount + childCount > 0) {
    totalQuantity = adultCount + childCount
  }

  if (!Number.isFinite(totalQuantity) || totalQuantity <= 0) {
    throw createError({
      statusCode: 400,
      message: 'Please specify at least one ticket before proceeding to checkout.'
    })
  }
  const customerEmail = typeof body?.customerEmail === 'string' ? body.customerEmail : undefined
  const customerName = typeof body?.customerName === 'string' ? body.customerName : undefined
  const customerPhone = typeof body?.customerPhone === 'string' ? body.customerPhone : undefined

  if (!eventId) {
    throw createError({
      statusCode: 400,
      message: 'eventId is required.'
    })
  }

  const attraction = await prisma.attractionsgEvent.findUnique({
    where: { id: eventId }
  })

  if (!attraction || !attraction.isPublished || !attraction.isSelfBookable) {
    throw createError({
      statusCode: 404,
      message: 'Attraction not available for self checkout.'
    })
  }

  const rawOptions = ((attraction as any)?.raw?.options as Record<string, any>[] | undefined) ?? []

  const normalize = (value: unknown) =>
    typeof value === 'string' ? value.trim().toLowerCase() : undefined

  const requestedCode = normalize(cart.optionCode) ?? normalize(selectedOption?.code)
  const requestedName = normalize(cart.optionName) ?? normalize(selectedOption?.name)

  const matchedOption =
    rawOptions.find((option) => normalize(option?.code) === requestedCode) ||
    rawOptions.find((option) => normalize(option?.name) === requestedName) ||
    (rawOptions.length === 1 ? rawOptions[0] : undefined)

  const resolveNumber = (value: any) => {
    const num = typeof value === 'number' ? value : parseFloat(String(value ?? ''))
    return Number.isFinite(num) ? num : null
  }

  const priceCandidates = [
    resolveNumber(matchedOption?.priceAmount),
    resolveNumber(matchedOption?.price),
    resolveNumber(selectedOption?.priceAmount),
    resolveNumber(selectedOption?.price),
    resolveNumber(cart.unitPrice),
    resolveNumber(attraction.publicPrice),
    resolveNumber(attraction.priceAmount),
    resolveNumber(attraction.originalPriceAmount)
  ]

  const unitPublicPrice = priceCandidates.find((price) => price !== null && price > 0) ?? null

  if (!unitPublicPrice || unitPublicPrice <= 0) {
    throw createError({
      statusCode: 400,
      message: 'Unable to determine a valid ticket price for checkout.'
    })
  }

  const currency = 'sgd'
  const unitAmount = Math.round(unitPublicPrice * 100)

  const stripe = getStripeClient(secretKey)
  const stripePercent = Number(config.public?.stripeFeePercent ?? 0.034)
  const stripeFixed = Number(config.public?.stripeFeeFixed ?? 0.5)
  const resellerUnitCost =
    [
      resolveNumber(matchedOption?.priceAmount),
      resolveNumber(attraction.resellerPriceAmount),
      resolveNumber(attraction.priceAmount),
      resolveNumber(attraction.originalPriceAmount)
    ].find((price) => price !== null && price > 0) ?? null
  const totalAmount = Number((unitPublicPrice * totalQuantity).toFixed(2))
  const totalStripeFeeEstimate = Number(estimateStripeFee(totalAmount, stripePercent, stripeFixed).toFixed(2))
  const totalResellerCost =
    resellerUnitCost !== null ? Number((resellerUnitCost * totalQuantity).toFixed(2)) : null
  const totalNetAfterFees = Number((totalAmount - totalStripeFeeEstimate).toFixed(2))

  const normalizedCart = {
    optionCode: matchedOption?.code ?? cart.optionCode ?? selectedOption?.code ?? null,
    optionName: matchedOption?.name ?? cart.optionName ?? selectedOption?.name ?? null,
    unitPrice: unitPublicPrice,
    unitCurrency: currency.toUpperCase(),
    quantity: totalQuantity,
    adultCount,
    childCount,
    totalPrice: totalAmount,
    stripeFeeEstimate: totalStripeFeeEstimate,
    resellerCost: totalResellerCost,
    unitResellerPrice: resellerUnitCost
  }

  const metadata: Record<string, string> = {
    eventId: attraction.id,
    eventTitle: attraction.title,
    eventSlug: attraction.slug || '',
    quantity: String(totalQuantity),
    estimatedStripeFee: String(totalStripeFeeEstimate),
    resellerUnitCost: resellerUnitCost !== null ? String(resellerUnitCost) : '',
    totalResellerCost: totalResellerCost !== null ? String(totalResellerCost) : '',
    unitPrice: unitPublicPrice.toFixed(2),
    totalPrice: totalAmount.toFixed(2),
    adultCount: String(adultCount),
    childCount: String(childCount)
  }

  if (selectedOption?.code) metadata.optionCode = String(selectedOption.code)
  if (selectedOption?.name) metadata.optionName = String(selectedOption.name)
  if (selectedOption?.priceText) metadata.optionPriceText = String(selectedOption.priceText)
  if (customerName) metadata.customerName = customerName
  if (customerEmail) metadata.customerEmail = customerEmail

  const productDescriptorParts: string[] = []
  if (adultCount > 0) productDescriptorParts.push(`Adults: ${adultCount}`)
  if (childCount > 0) productDescriptorParts.push(`Children: ${childCount}`)

  const productName = normalizedCart.optionName
    ? `${attraction.title} – ${normalizedCart.optionName}`
    : `${attraction.title} Ticket`

  const lineItem = {
    price_data: {
      currency,
      unit_amount: unitAmount,
      product_data: {
        name: productName,
        description: productDescriptorParts.join(' | ') || attraction.location || undefined
      }
    },
    quantity: totalQuantity
  }

  const successUrlBase =
    config.public?.siteUrl || 'https://gotravelnha.com'

  const successUrl = `${successUrlBase}/attractionsg/${attraction.slug || attraction.id}?checkout=success`
  const cancelUrl = `${successUrlBase}/attractionsg/${attraction.slug || attraction.id}?checkout=cancel`

  let session: Stripe.Checkout.Session
  try {
    session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [lineItem],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      client_reference_id: attraction.id,
      metadata,
      payment_intent_data: {
        metadata
      },
      allow_promotion_codes: true,
      automatic_tax: { enabled: false }
    })
  } catch (err: any) {
    console.error('Stripe session error:', err)
    throw createError({
      statusCode: 500,
      message: err?.message || 'Unable to create checkout session.'
    })
  }

  const booking = await prisma.attractionsgBooking.create({
    data: {
      eventId: attraction.id,
      eventTitle: attraction.title,
      eventSlug: attraction.slug,
      quantity: totalQuantity,
      adultCount,
      childCount,
      unitPrice: unitPublicPrice,
      amount: totalAmount,
      currency: (session.currency || 'sgd').toUpperCase(),
      status: 'PENDING',
      stripeSessionId: session.id,
      stripePaymentIntentId:
        typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent?.id ?? null,
      customerEmail: customerEmail || session.customer_details?.email || null,
      customerName: customerName || session.customer_details?.name || null,
      customerPhone: customerPhone || session.customer_details?.phone || null,
      optionCode: normalizedCart.optionCode ?? null,
      optionName: normalizedCart.optionName ?? null,
      metadata: normalizedCart,
      notes: attraction.checkoutNotes ?? null,
      resellerCost: totalResellerCost,
      stripeFeeAmount: totalStripeFeeEstimate,
      netRevenue: totalNetAfterFees,
      cart: normalizedCart
    }
  })

  const enrichedMetadata = {
    ...metadata,
    bookingId: booking.id,
    stripeSessionId: session.id
  }

  try {
    await stripe.checkout.sessions.update(session.id, {
      metadata: enrichedMetadata
    })

    if (typeof session.payment_intent === 'string') {
      await stripe.paymentIntents.update(session.payment_intent, {
        metadata: enrichedMetadata
      })
    }
  } catch (err) {
    console.error('Failed to update Stripe metadata:', err)
  }

  return {
    success: true,
    url: session.url
  }
})

