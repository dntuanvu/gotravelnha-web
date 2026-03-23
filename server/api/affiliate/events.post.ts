import { createError, defineEventHandler, readBody } from 'h3'
import prisma from '~/server/utils/prisma'

interface AffiliateEventBody {
  eventName: 'affiliate_offer_impression' | 'affiliate_offer_fallback_used' | 'affiliate_offer_unavailable'
  sessionId?: string
  provider?: string
  entityId?: string
  offerId?: string
  placementKey?: string
  pagePath?: string
  metadata?: Record<string, any>
}

export default defineEventHandler(async (event) => {
  try {
    const body = (await readBody(event)) as AffiliateEventBody
    if (!body?.eventName) {
      throw createError({ statusCode: 400, message: 'eventName is required' })
    }

    const allowedEvents = new Set([
      'affiliate_offer_impression',
      'affiliate_offer_fallback_used',
      'affiliate_offer_unavailable'
    ])

    if (!allowedEvents.has(body.eventName)) {
      throw createError({ statusCode: 400, message: 'Unsupported eventName' })
    }

    await prisma.userActivity.create({
      data: {
        sessionId: body.sessionId || 'anonymous',
        timestamp: new Date(),
        page: body.pagePath || 'unknown',
        action: body.eventName,
        data: {
          provider: body.provider || null,
          entityId: body.entityId || null,
          offerId: body.offerId || null,
          placementKey: body.placementKey || null,
          ...body.metadata
        }
      }
    })

    return {
      success: true
    }
  } catch (error: any) {
    console.error('Affiliate event tracking error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to track affiliate event'
    })
  }
})

