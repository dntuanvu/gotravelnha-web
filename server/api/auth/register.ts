import * as bcrypt from 'bcrypt'
import { defineEventHandler, readBody } from 'h3'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Validate input
    if (!body.username || !body.email || !body.password) {
      throw createError({
        statusCode: 400,
        message: 'Username, email, and password are required'
      })
    }

    // Check if username already exists
    const existingUsername = await prisma.user.findUnique({
      where: { username: body.username }
    })

    if (existingUsername) {
      throw createError({
        statusCode: 400,
        message: 'Username already exists'
      })
    }

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email: body.email }
    })

    if (existingEmail) {
      throw createError({
        statusCode: 400,
        message: 'Email already exists'
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, 10)

    // Create user (default role is USER)
    const user = await prisma.user.create({
      data: {
        username: body.username,
        email: body.email,
        password: hashedPassword,
        firstName: body.firstName,
        lastName: body.lastName,
        role: 'USER',
        isActive: true
      }
    })

    // Process referral if code provided
    if (body.referralCode) {
      try {
        const referral = await prisma.referral.findUnique({
          where: { referralCode: body.referralCode }
        })

        if (referral && referral.referrerId !== user.id) {
          // Update referral to link to new user
          await prisma.referral.update({
            where: { id: referral.id },
            data: {
              refereeId: user.id,
              status: 'SIGNED_UP',
              signupAt: new Date(),
              email: user.email
            }
          })

          // Award points to referrer (when referee signs up)
          await prisma.loyaltyPoint.create({
            data: {
              userId: referral.referrerId,
              points: 100, // Points for successful referral signup
              reason: `Referral signup: ${user.username}`
            }
          })
        }
      } catch (referralError) {
        console.error('Error processing referral:', referralError)
        // Don't fail registration if referral processing fails
      }
    }

    // Return user data (without password)
    const { password, ...userWithoutPassword } = user

    return {
      success: true,
      user: userWithoutPassword,
      message: 'Account created successfully'
    }
  } catch (error: any) {
    console.error('Registration error:', error)
    throw error
  }
})

