import { defineEventHandler, readBody, getRouterParam } from 'h3'
import * as bcrypt from 'bcrypt'
import prisma from '~/server/utils/prisma'

// GET user by ID
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const method = event.node.req.method

  // GET - Read user
  if (method === 'GET') {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'User not found'
      })
    }

    return { success: true, user }
  }

  // PUT - Update user
  if (method === 'PUT') {
    const body = await readBody(event)

    // Hash password if provided
    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10)
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        username: body.username,
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
        role: body.role,
        isActive: body.isActive,
        ...(body.password && { password: body.password })
      },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return { success: true, user }
  }

  // DELETE - Delete user
  if (method === 'DELETE') {
    await prisma.user.delete({
      where: { id }
    })

    return { success: true, message: 'User deleted successfully' }
  }
})

