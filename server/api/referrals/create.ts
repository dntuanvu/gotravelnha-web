import { defineEventHandler, readBody } from 'h3'
import prisma from '~/server/utils/prisma'

/**
 * POST /api/referrals/create
 * Create a new referral code for a user
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { userId, email } = body

    if (!userId) {
      return {
        success: false,
        error: 'User ID is required'
      }
    }

    // Check if user already has a referral code
    const existingReferral = await prisma.referral.findFirst({
      where: {
        referrerId: userId,
        status: 'PENDING'
      }
    })

    if (existingReferral) {
      return {
        success: true,
        data: existingReferral,
        code: existingReferral.referralCode
      }
    }

    // Generate unique referral code
    const userIdPrefix = userId.substring(0, 8).replace(/-/g, '')
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase()
    const referralCode = `GVH${userIdPrefix}${randomSuffix}`.toUpperCase()

    // Create referral
    const referral = await prisma.referral.create({
      data: {
        referrerId: userId,
        referralCode,
        email: email || null,
        status: 'PENDING'
      }
    })

    return {
      success: true,
      data: referral,
      code: referralCode
    }
  } catch (error: any) {
    console.error('Error creating referral:', error)
    return {
      success: false,
      error: error.message || 'Failed to create referral'
    }
  }
})

