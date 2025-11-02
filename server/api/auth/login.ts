import * as bcrypt from 'bcrypt'
import { defineEventHandler, readBody } from 'h3'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Validate input
    if (!body.username || !body.password) {
      throw createError({
        statusCode: 400,
        message: 'Username and password are required'
      })
    }

    // Find user by username or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: body.username },
          { email: body.username }
        ],
        isActive: true
      }
    })

    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Invalid username or password'
      })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(body.password, user.password)

    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        message: 'Invalid username or password'
      })
    }

    // Return user data (without password)
    const { password, ...userWithoutPassword } = user

    return {
      success: true,
      user: userWithoutPassword,
      role: user.role
    }
  } catch (error: any) {
    console.error('Login error:', error)
    throw error
  }
})

