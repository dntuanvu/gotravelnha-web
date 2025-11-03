import { defineEventHandler, getQuery } from 'h3'
import prisma from '~/server/utils/prisma'

/**
 * GET /api/referrals/my-code?userId=xxx
 * Get user's referral code (create if doesn't exist)
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

    // Find existing referral code
    let referral = await prisma.referral.findFirst({
      where: {
        referrerId: userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Create if doesn't exist
    if (!referral) {
      const userIdPrefix = userId.substring(0, 8).replace(/-/g, '')
      const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase()
      const referralCode = `GVH${userIdPrefix}${randomSuffix}`.toUpperCase()

      referral = await prisma.referral.create({
        data: {
          referrerId: userId,
          referralCode,
          status: 'PENDING'
        }
      })
    }

    return {
      success: true,
      code: referral.referralCode,
      referral
    }
  } catch (error: any) {
    console.error('Error fetching referral code:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch referral code'
    }
  }
})

