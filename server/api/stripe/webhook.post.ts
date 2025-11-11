import Stripe from 'stripe'
import { defineEventHandler, createError, readRawBody } from 'h3'
import prisma from '~/server/utils/prisma'
import { sendEmail } from '~/server/utils/email'

let stripeClient: Stripe | null = null

function getStripeClient(secretKey: string) {
  if (!stripeClient) {
    stripeClient = new Stripe(secretKey, {
      apiVersion: '2023-10-16'
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
    stripeEvent = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret
    )
  } catch (err: any) {
    console.error('Stripe webhook signature verification failed:', err)
    throw createError({
      statusCode: 400,
      message: 'Invalid signature.'
    })
  }

  try {
    switch (stripeEvent.type) {
      case 'checkout.session.completed': {
        const session = stripeEvent.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session, config)
        break
      }
      case 'checkout.session.expired': {
        const session = stripeEvent.data.object as Stripe.Checkout.Session
        await prisma.attractionsgBooking.updateMany({
          where: { stripeSessionId: session.id, status: 'PENDING' },
          data: { status: 'CANCELLED' }
        })
        break
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent
        if (paymentIntent.metadata?.stripeSessionId) {
          await prisma.attractionsgBooking.updateMany({
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

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
  config: Record<string, any>
) {
  const booking = await prisma.attractionsgBooking.findUnique({
    where: { stripeSessionId: session.id },
    include: {
      event: true
    }
  })

  if (!booking) {
    console.warn('Checkout completed but booking not found:', session.id)
    return
  }

  if (booking.status === 'PAID') {
    return
  }

  const customerDetails = session.customer_details

  const updatedBooking = await prisma.attractionsgBooking.update({
    where: { id: booking.id },
    data: {
      status: 'PAID',
      amount:
        typeof session.amount_total === 'number'
          ? session.amount_total / 100
          : booking.amount,
      customerEmail:
        customerDetails?.email ??
        booking.customerEmail ??
        undefined,
      customerName:
        customerDetails?.name ??
        booking.customerName ??
        undefined,
      customerPhone:
        customerDetails?.phone ??
        booking.customerPhone ??
        undefined,
      stripePaymentIntentId:
        typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent?.id ?? booking.stripePaymentIntentId
    },
    include: {
      event: true
    }
  })

  const notifyEmail =
    config.SELF_BOOKING_NOTIFY_EMAIL || config.SMTP_USER

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
  } catch (err) {
    console.error('Failed to send booking notification:', err)
  }
}

