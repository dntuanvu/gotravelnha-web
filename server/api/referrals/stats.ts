import { defineEventHandler, getQuery } from 'h3'
import prisma from '~/server/utils/prisma'

/**
 * GET /api/referrals/stats?userId=xxx
 * Get referral statistics for a user
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

    const [totalReferrals, signedUp, completedBookings, totalRewards] = await Promise.all([
      prisma.referral.count({
        where: { referrerId: userId }
      }),
      prisma.referral.count({
        where: {
          referrerId: userId,
          status: { in: ['SIGNED_UP', 'COMPLETED_BOOKING', 'REWARDED'] }
        }
      }),
      prisma.referral.count({
        where: {
          referrerId: userId,
          status: { in: ['COMPLETED_BOOKING', 'REWARDED'] }
        }
      }),
      prisma.referral.aggregate({
        where: { referrerId: userId },
        _sum: {
          rewardPoints: true
        }
      })
    ])

    const referrals = await prisma.referral.findMany({
      where: { referrerId: userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        referee: {
          select: {
            id: true,
            username: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    })

    return {
      success: true,
      stats: {
        totalReferrals,
        signedUp,
        completedBookings,
        totalRewards: totalRewards._sum.rewardPoints || 0
      },
      recentReferrals: referrals
    }
  } catch (error: any) {
    console.error('Error fetching referral stats:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch referral stats'
    }
  }
})

