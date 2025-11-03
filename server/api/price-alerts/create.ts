import { defineEventHandler, readBody } from 'h3'
import prisma from '~/server/utils/prisma'

/**
 * POST /api/price-alerts/create
 * Create a price drop alert
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { userId, platform, productType, productId, productName, currentPrice, targetPrice, originalUrl } = body

    if (!userId || !platform || !productType || !productId || !productName || !originalUrl) {
      return {
        success: false,
        error: 'Missing required fields'
      }
    }

    // Check if alert already exists
    const existing = await prisma.priceAlert.findFirst({
      where: {
        userId,
        platform,
        productId,
        isActive: true
      }
    })

    if (existing) {
      return {
        success: false,
        error: 'You already have an active alert for this product'
      }
    }

    const alert = await prisma.priceAlert.create({
      data: {
        userId,
        platform,
        productType,
        productId,
        productName,
        currentPrice: currentPrice || null,
        targetPrice: targetPrice || null,
        originalUrl,
        isActive: true
      }
    })

    return {
      success: true,
      data: alert,
      message: 'Price alert created! We\'ll notify you when the price drops.'
    }
  } catch (error: any) {
    console.error('Error creating price alert:', error)
    return {
      success: false,
      error: error.message || 'Failed to create price alert'
    }
  }
})

