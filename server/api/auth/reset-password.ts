import { defineEventHandler, readBody } from 'h3'
import * as bcrypt from 'bcrypt'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { token, password } = body

    if (!token || !password) {
      throw createError({
        statusCode: 400,
        message: 'Token and password are required'
      })
    }

    if (password.length < 8) {
      throw createError({
        statusCode: 400,
        message: 'Password must be at least 8 characters'
      })
    }

    // Find user by reset token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: {
          gt: new Date() // Token not expired
        }
      }
    })

    if (!user) {
      throw createError({
        statusCode: 400,
        message: 'Invalid or expired reset token'
      })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update user password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null
      }
    })

    return {
      success: true,
      message: 'Password has been reset successfully'
    }
  } catch (error: any) {
    console.error('Reset password error:', error)
    throw error
  }
})

