import { defineEventHandler, readBody } from 'h3'
import prisma from '~/server/utils/prisma'

/**
 * POST /api/referrals/track-click
 * Track when someone clicks a referral link
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { code, email } = body

    if (!code) {
      return {
        success: false,
        error: 'Referral code is required'
      }
    }

    // Find referral by code
    const referral = await prisma.referral.findUnique({
      where: {
        referralCode: code
      }
    })

    if (!referral) {
      return {
        success: false,
        error: 'Invalid referral code'
      }
    }

    // Update referral with email if provided (for tracking before signup)
    if (email && !referral.email) {
      await prisma.referral.update({
        where: {
          id: referral.id
        },
        data: {
          email
        }
      })
    }

    return {
      success: true,
      message: 'Referral click tracked'
    }
  } catch (error: any) {
    console.error('Error tracking referral click:', error)
    return {
      success: false,
      error: error.message || 'Failed to track referral click'
    }
  }
})

