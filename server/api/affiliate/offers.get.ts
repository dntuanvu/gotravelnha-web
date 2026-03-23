import { createError, defineEventHandler, getQuery } from 'h3'
import { resolveAffiliateOffers } from '~/server/services/affiliate-offer.service'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const entityId = query.entityId ? String(query.entityId) : undefined
    const slug = query.slug ? String(query.slug) : undefined
    const placementKey = query.placementKey ? String(query.placementKey) : undefined
    const pagePath = query.pagePath ? String(query.pagePath) : undefined
    const sessionId = query.sessionId ? String(query.sessionId) : undefined

    if (!entityId && !slug) {
      throw createError({
        statusCode: 400,
        message: 'entityId or slug is required'
      })
    }

    return await resolveAffiliateOffers({
      entityId,
      slug,
      placementKey,
      pagePath,
      sessionId
    })
  } catch (error: any) {
    console.error('Affiliate offers resolve error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to resolve affiliate offers'
    })
  }
})

