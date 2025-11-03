import { defineEventHandler, readBody } from 'h3'
import prisma from '~/server/utils/prisma'
import { sendEmail } from '~/server/utils/email'

/**
 * POST /api/newsletter/subscribe
 * Subscribe to newsletter
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, name, source } = body

    if (!email || !email.includes('@')) {
      return {
        success: false,
        error: 'Valid email is required'
      }
    }

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existing) {
      if (existing.isActive) {
        return {
          success: true,
          message: 'You are already subscribed!',
          alreadySubscribed: true
        }
      } else {
        // Reactivate subscription
        await prisma.newsletterSubscriber.update({
          where: { id: existing.id },
          data: {
            isActive: true,
            subscribedAt: new Date(),
            unsubscribedAt: null
          }
        })
        return {
          success: true,
          message: 'Welcome back! You have been resubscribed.'
        }
      }
    }

    // Create new subscription
    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email: email.toLowerCase(),
        name: name || null,
        source: source || 'website',
        isActive: true
      }
    })

    // Send welcome email
    try {
      await sendEmail({
        to: email,
        subject: 'Welcome to GoVietHub Newsletter! 🎉',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4F46E5;">Welcome to GoVietHub!</h1>
            <p>Thank you for subscribing to our newsletter. You'll receive:</p>
            <ul>
              <li>📧 Weekly travel deals and discounts</li>
              <li>✈️ Exclusive offers from Trip.com, Klook, and more</li>
              <li>🎯 Price drop alerts for destinations you're interested in</li>
              <li>📝 Travel tips and guides</li>
            </ul>
            <p>Happy travels! 🗺️</p>
            <hr>
            <p style="font-size: 12px; color: #666;">
              <a href="${process.env.NUXT_PUBLIC_API_BASE || 'https://gotravelnha.com'}/newsletter/unsubscribe?email=${encodeURIComponent(email)}">Unsubscribe</a>
            </p>
          </div>
        `
      })
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError)
      // Don't fail subscription if email fails
    }

    return {
      success: true,
      message: 'Successfully subscribed! Check your email for confirmation.',
      subscriber
    }
  } catch (error: any) {
    console.error('Newsletter subscription error:', error)
    return {
      success: false,
      error: error.message || 'Failed to subscribe. Please try again.'
    }
  }
})

