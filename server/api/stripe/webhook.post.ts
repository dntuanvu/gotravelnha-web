import Stripe from 'stripe'
import { defineEventHandler, createError, readRawBody } from 'h3'
import prisma from '~/server/utils/prisma'
import type { RuntimeConfig } from 'nuxt/schema'
import type { PrismaClient } from '@prisma/client'
import { sendEmail } from '~/server/utils/email'

const db = prisma as PrismaClient
const bookings = (db as unknown as Record<string, any>)['attractionsgBooking']

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
  const webhookSecret = config.STRIPE_WEBHOOK_SECRET

  if (!secretKey || !webhookSecret) {
    throw createError({
      statusCode: 500,
      message: 'Stripe webhook not configured.'
    })
  }

  const rawBody = await readRawBody(event, 'utf8')
  const signature = event.node.req.headers['stripe-signature']

  if (!rawBody || !signature) {
    throw createError({
      statusCode: 400,
      message: 'Invalid webhook payload.'
    })
  }

  const stripe = getStripeClient(secretKey)
  let stripeEvent: Stripe.Event

  try {
    stripeEvent = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (err: any) {
    console.error('Stripe webhook signature verification failed:', err)
    throw createError({
      statusCode: 400,
      message: 'Invalid signature.'
    })
  }

  try {
    const clientRef = (stripeEvent.data.object as { client_reference_id?: string }).client_reference_id

    switch (stripeEvent.type) {
      case 'checkout.session.completed': {
        const session = stripeEvent.data.object as Stripe.Checkout.Session
        console.info('[stripe] checkout.session.completed', session.id, 'ref:', clientRef)
        await handleCheckoutCompleted(session, config)
        break
      }
      case 'checkout.session.expired': {
        const session = stripeEvent.data.object as Stripe.Checkout.Session
        console.info('[stripe] checkout.session.expired', session.id, 'ref:', clientRef)
        await bookings.updateMany({
          where: { stripeSessionId: session.id, status: 'PENDING' },
          data: { status: 'CANCELLED' }
        })
        break
      }
      case 'payment_intent.succeeded': {
        const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent
        console.info('[stripe] payment_intent.succeeded', paymentIntent.id, 'ref:', clientRef)
        await handlePaymentIntentSuccess(paymentIntent, config)
        break
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent
        console.warn('[stripe] payment_intent.payment_failed', paymentIntent.id, 'ref:', clientRef)
        if (typeof paymentIntent.metadata?.stripeSessionId === 'string') {
          await bookings.updateMany({
            where: {
              stripeSessionId: paymentIntent.metadata.stripeSessionId,
              status: 'PENDING'
            },
            data: { status: 'FAILED' }
          })
        }
        break
      }
      default:
        console.info('[stripe] ignored event', stripeEvent.type, 'ref:', clientRef)
        break
    }
  } catch (err) {
    console.error('Stripe webhook handler error:', err)
    throw createError({
      statusCode: 500,
      message: 'Failed to process webhook.'
    })
  }

  return { received: true }
})

async function handleCheckoutCompleted(session: Stripe.Checkout.Session, config: RuntimeConfig) {
  const existingBooking = await bookings.findUnique({
    where: { stripeSessionId: session.id },
    include: {
      event: true
    }
  })

  let targetBooking = existingBooking

  if (!targetBooking && session.client_reference_id) {
    targetBooking = await bookings.findFirst({
      where: {
        eventId: session.client_reference_id,
        status: 'PENDING'
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        event: true
      }
    })
  }

  if (!targetBooking) {
    console.warn('Checkout completed but booking not found:', session.id, 'ref:', session.client_reference_id)
    return
  }

  if (targetBooking.status === 'PAID') {
    console.info('Booking already marked as PAID:', targetBooking.id)
    return
  }

  const customerDetails = session.customer_details

  console.info('Updating booking as paid:', targetBooking.id)

  const updatedBooking = await bookings.update({
    where: { id: targetBooking.id },
    data: {
      status: 'PAID',
      amount:
        typeof session.amount_total === 'number'
          ? session.amount_total / 100
          : targetBooking.amount,
      customerEmail:
        customerDetails?.email ??
        targetBooking.customerEmail ??
        undefined,
      customerName:
        customerDetails?.name ??
        targetBooking.customerName ??
        undefined,
      customerPhone:
        customerDetails?.phone ??
        targetBooking.customerPhone ??
        undefined,
      stripePaymentIntentId:
        typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent?.id ?? targetBooking.stripePaymentIntentId
    },
    include: {
      event: true
    }
  })

  const notifyEmail = config.SELF_BOOKING_NOTIFY_EMAIL || config.SMTP_USER

  if (!notifyEmail) {
    console.warn('No notification email configured for bookings.')
    return
  }

  const optionInfo =
    updatedBooking.optionName || updatedBooking.optionCode
      ? `<p><strong>Ticket Option:</strong> ${[
          updatedBooking.optionName,
          updatedBooking.optionCode
        ]
          .filter(Boolean)
          .join(' - ')}</p>`
      : ''

  const checkoutNotes =
    updatedBooking.event.checkoutNotes
      ? `<p><strong>Checkout Notes:</strong> ${updatedBooking.event.checkoutNotes}</p>`
      : ''

  const metaBlock = updatedBooking.metadata
    ? `<pre style="background:#f3f4f6;padding:12px;border-radius:8px;">${JSON.stringify(
        updatedBooking.metadata,
        null,
        2
      )}</pre>`
    : ''

  const html = `
    <h2>✅ New Paid Booking via GoVietHub</h2>
    <p>A customer completed a Stripe checkout for <strong>${updatedBooking.eventTitle}</strong>.</p>
    <p><strong>Quantity:</strong> ${updatedBooking.quantity}</p>
    <p><strong>Amount Paid:</strong> SGD ${updatedBooking.amount.toFixed(2)}</p>
    ${optionInfo}
    <p><strong>Customer:</strong> ${
      updatedBooking.customerName || 'N/A'
    }</p>
    <p><strong>Email:</strong> ${
      updatedBooking.customerEmail || 'N/A'
    }</p>
    <p><strong>Phone:</strong> ${
      updatedBooking.customerPhone || 'N/A'
    }</p>
    ${checkoutNotes}
    <p><strong>Stripe Session:</strong> ${updatedBooking.stripeSessionId}</p>
    <p><strong>Stripe Payment Intent:</strong> ${
      updatedBooking.stripePaymentIntentId || 'N/A'
    }</p>
    ${metaBlock}
    <p>Please fulfill the ticket order via the SG Attractions reseller portal.</p>
  `

  try {
    await sendEmail({
      to: notifyEmail,
      subject: `New Attraction Booking - ${updatedBooking.eventTitle}`,
      html
    })
    console.info('Booking payment notification sent:', updatedBooking.id)
  } catch (err) {
    console.error('Failed to send booking notification:', err)
  }
}

async function handlePaymentIntentSuccess(paymentIntent: Stripe.PaymentIntent, config: RuntimeConfig) {
  const secretKey = config.STRIPE_SECRET_KEY
  if (!secretKey) {
    console.warn('Stripe secret missing in payment intent handler')
    return
  }

  let session: Stripe.Checkout.Session | null = null

  if (typeof paymentIntent.metadata?.stripeSessionId === 'string') {
    try {
      const stripe = getStripeClient(secretKey)
      session = await stripe.checkout.sessions.retrieve(paymentIntent.metadata.stripeSessionId)
    } catch (err) {
      console.error('Failed to retrieve checkout session by id:', err)
    }
  }

  if (!session) {
    try {
      const stripe = getStripeClient(secretKey)
      const sessions = await stripe.checkout.sessions.list({
        payment_intent: paymentIntent.id,
        limit: 1
      })
      session = sessions.data[0] ?? null
    } catch (err) {
      console.error('Failed to list checkout sessions for payment intent:', err)
    }
  }

  if (session) {
    await handleCheckoutCompleted(session, config)
    return
  }

  if (typeof paymentIntent.metadata?.bookingId === 'string') {
    const bookingRecord = await bookings.findUnique({
      where: { id: paymentIntent.metadata.bookingId }
    })

    if (bookingRecord && bookingRecord.status !== 'PAID') {
      console.info('Marking booking paid via payment_intent.succeeded fallback:', bookingRecord.id)
      await bookings.update({
        where: { id: bookingRecord.id },
        data: {
          status: 'PAID',
          stripePaymentIntentId: paymentIntent.id
        }
      })
    }
  } else {
    console.warn('payment_intent.succeeded received with no metadata. PaymentIntent ID:', paymentIntent.id)
  }
}

