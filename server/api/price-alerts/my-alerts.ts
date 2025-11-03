import { defineEventHandler, getQuery } from 'h3'
import prisma from '~/server/utils/prisma'

/**
 * GET /api/price-alerts/my-alerts?userId=xxx
 * Get user's price alerts
 */
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const userId = query.userId as string

    if (!userId) {
      return {
        success: false,
        error: 'User ID is required'
      }
    }

    const alerts = await prisma.priceAlert.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    return {
      success: true,
      data: alerts
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    }
  }
})

