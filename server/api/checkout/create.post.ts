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
  const eventId = body?.eventId as string | undefined
  const quantity = Math.max(1, parseInt(String(body?.quantity ?? '1'), 10))
  const selectedOption = body?.selectedOption as Record<string, any> | undefined
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

  const basePrice =
    attraction.publicPrice ??
    attraction.priceAmount ??
    attraction.originalPriceAmount

  const baseUnitPrice = Number(basePrice)

  if (!basePrice || Number.isNaN(baseUnitPrice) || baseUnitPrice <= 0) {
    throw createError({
      statusCode: 400,
      message: 'This attraction does not have a valid public price.'
    })
  }

  const currency = 'sgd'
  const unitAmount = Math.round(baseUnitPrice * 100)

  const stripe = getStripeClient(secretKey)
  const stripePercent = Number(config.public?.stripeFeePercent ?? 0.034)
  const stripeFixed = Number(config.public?.stripeFeeFixed ?? 0.5)
  const resellerUnitCost =
    attraction.resellerPriceAmount ??
    attraction.priceAmount ??
    attraction.originalPriceAmount ??
    null
  const estimatedStripeFeePerUnit = estimateStripeFee(baseUnitPrice, stripePercent, stripeFixed)
  const totalStripeFeeEstimate = Number((estimatedStripeFeePerUnit * quantity).toFixed(2))
  const totalResellerCost = resellerUnitCost !== null ? Number((resellerUnitCost * quantity).toFixed(2)) : null
  const totalAmount = Number(((unitAmount / 100) * quantity).toFixed(2))
  const totalNetAfterFees = Number((totalAmount - totalStripeFeeEstimate).toFixed(2))

  const metadata: Record<string, string> = {
    eventId: attraction.id,
    eventTitle: attraction.title,
    eventSlug: attraction.slug || '',
    quantity: String(quantity),
    estimatedStripeFee: String(totalStripeFeeEstimate),
    resellerUnitCost: resellerUnitCost !== null ? String(resellerUnitCost) : '',
    totalResellerCost: totalResellerCost !== null ? String(totalResellerCost) : ''
  }

  if (selectedOption?.code) metadata.optionCode = String(selectedOption.code)
  if (selectedOption?.name) metadata.optionName = String(selectedOption.name)
  if (selectedOption?.priceText) metadata.optionPriceText = String(selectedOption.priceText)
  if (customerName) metadata.customerName = customerName
  if (customerEmail) metadata.customerEmail = customerEmail

  const lineItem = attraction.stripePriceId
    ? {
        price: attraction.stripePriceId,
        quantity
      }
    : {
        price_data: {
          currency,
          unit_amount: unitAmount,
          product_data: {
            name: attraction.title,
            description:
              selectedOption?.name ||
              selectedOption?.code ||
              attraction.location ||
              undefined
          }
        },
        quantity
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
      quantity,
      amount: (unitAmount / 100) * quantity,
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
      optionCode: selectedOption?.code ?? null,
      optionName: selectedOption?.name ?? null,
      metadata: selectedOption ?? null,
      notes: attraction.checkoutNotes ?? null,
      resellerCost: totalResellerCost,
      stripeFeeAmount: totalStripeFeeEstimate,
      netRevenue: totalNetAfterFees
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

