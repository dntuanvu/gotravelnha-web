import { createError, defineEventHandler, readBody } from 'h3'
import prisma from '~/server/utils/prisma'
import { buildAffiliateLink } from '~/server/services/affiliate-link.service'

interface AffiliateClickBody {
  offerId?: string
  entityId?: string
  provider?: string
  baseUrl?: string
  placementKey?: string
  pagePath?: string
  sessionId?: string
  referrer?: string
  userId?: string
  metadata?: Record<string, any>
}

function detectDeviceType(userAgent: string): string {
  const ua = userAgent.toLowerCase()
  if (ua.includes('ipad') || (ua.includes('android') && !ua.includes('mobile'))) return 'tablet'
  if (ua.includes('mobile') || ua.includes('iphone') || ua.includes('android')) return 'mobile'
  if (!ua) return 'unknown'
  return 'desktop'
}

export default defineEventHandler(async (event) => {
  try {
    const body = (await readBody(event)) as AffiliateClickBody
    const uaHeader = event.node.req.headers['user-agent']
    const userAgent = Array.isArray(uaHeader) ? uaHeader.join(' ') : String(uaHeader || '')

    let offer = null as any
    let baseUrl = body.baseUrl || ''
    let provider = body.provider || ''
    let entityId = body.entityId || null

    if (body.offerId) {
      offer = await prisma.affiliateOffer.findUnique({
        where: { id: body.offerId },
        select: {
          id: true,
          entityId: true,
          provider: true,
          baseUrl: true,
          isActive: true
        }
      })

      if (!offer || !offer.isActive) {
        throw createError({ statusCode: 404, message: 'Offer not found or inactive' })
      }

      baseUrl = offer.baseUrl
      provider = offer.provider
      entityId = offer.entityId
    }

    if (!baseUrl || !provider) {
      throw createError({
        statusCode: 400,
        message: 'offerId or (provider + baseUrl) is required'
      })
    }

    const { url: outboundUrl, subId } = buildAffiliateLink({
      provider,
      baseUrl,
      context: {
        entityId: entityId || undefined,
        offerId: offer?.id,
        placementKey: body.placementKey,
        pagePath: body.pagePath,
        sessionId: body.sessionId
      }
    })

    const placement = body.placementKey
      ? await prisma.affiliatePlacement.findUnique({
          where: { key: body.placementKey },
          select: { id: true }
        })
      : null

    const click = await prisma.affiliateClickEvent.create({
      data: {
        sessionId: body.sessionId || 'anonymous',
        userId: body.userId || null,
        entityId,
        offerId: offer?.id || null,
        provider,
        placementKey: body.placementKey || null,
        placementId: placement?.id || null,
        pagePath: body.pagePath || null,
        referrer: body.referrer || null,
        deviceType: detectDeviceType(userAgent),
        subId,
        outboundUrl,
        metadata: body.metadata || null
      }
    })

    return {
      success: true,
      clickId: click.id,
      subId,
      outboundUrl
    }
  } catch (error: any) {
    console.error('Affiliate click tracking error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to track affiliate click'
    })
  }
})

