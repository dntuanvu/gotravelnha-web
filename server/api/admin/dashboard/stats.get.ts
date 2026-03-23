import { createError, defineEventHandler } from 'h3'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  try {
    const [
      totalEntities,
      activeUsers,
      conversionRevenueSgd,
      conversionRevenueAll,
      latestOfferUpdate
    ] = await Promise.all([
      prisma.affiliateEntity.count({
        where: { status: 'active' }
      }),
      prisma.user.count({
        where: { isActive: true }
      }),
      prisma.affiliateConversionEvent.aggregate({
        where: { currency: 'SGD' },
        _sum: { commission: true }
      }),
      prisma.affiliateConversionEvent.aggregate({
        _sum: { commission: true }
      }),
      prisma.affiliateOffer.aggregate({
        _max: { updatedAt: true }
      })
    ])

    const revenue =
      conversionRevenueSgd._sum.commission ??
      conversionRevenueAll._sum.commission ??
      0

    return {
      success: true,
      data: {
        totalEvents: totalEntities,
        activeUsers,
        revenue: Number(revenue) || 0,
        lastScrapeAt: latestOfferUpdate._max.updatedAt
      }
    }
  } catch (error: any) {
    console.error('Admin dashboard stats fetch error:', error)
    throw createError({
      statusCode: 500,
      message: error?.message || 'Failed to load dashboard stats'
    })
  }
})
