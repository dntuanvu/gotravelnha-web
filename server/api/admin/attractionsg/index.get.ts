import { defineEventHandler, createError, getQuery } from 'h3'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const page = parseInt(String(query.page || '1'), 10)
    const limit = Math.min(parseInt(String(query.limit || '50'), 10), 200)
    const skip = (page - 1) * limit
    const search = String(query.search || '').toLowerCase()
    const status = String(query.status || 'all')
    const sort = String(query.sort || 'latest')

    const where: any = {}

    if (status === 'published') {
      where.isPublished = true
    } else if (status === 'draft') {
      where.isPublished = false
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } }
      ]
    }

    const orderBy: any[] = []
    switch (sort) {
      case 'alpha':
        orderBy.push({ title: 'asc' })
        break
      case 'priceAsc':
        orderBy.push({ publicPrice: 'asc' }, { priceAmount: 'asc' })
        break
      case 'priceDesc':
        orderBy.push({ publicPrice: 'desc' }, { priceAmount: 'desc' })
        break
      case 'latest':
      default:
        orderBy.push({ updatedAt: 'desc' })
        break
    }

    const [data, total] = await Promise.all([
      prisma.attractionsgEvent.findMany({
        where,
        orderBy,
        skip,
        take: limit
      }),
      prisma.attractionsgEvent.count({ where })
    ])

    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  } catch (error: any) {
    console.error('Admin attractions fetch error:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to load attractions events'
    })
  }
})

