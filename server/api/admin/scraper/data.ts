import { defineEventHandler, getQuery } from 'h3'
import prisma from '~/server/utils/prisma'
import { createError } from 'h3'

/**
 * GET /api/admin/scraper/data
 * Get scraped data with filtering and pagination
 */
export default defineEventHandler(async (event) => {
  if (event.node.req.method !== 'GET') {
    throw createError({
      statusCode: 405,
      message: 'Method not allowed'
    })
  }

  try {
    const query = getQuery(event)
    const limit = query.limit ? parseInt(query.limit as string) : 50
    const skip = query.skip ? parseInt(query.skip as string) : 0
    const category = query.category as string | undefined
    const jobId = query.jobId as string | undefined

    const where: any = {
      isValid: true
    }

    if (category) {
      where.category = category
    }

    if (jobId) {
      where.jobId = jobId
    }

    const data = await prisma.tripScrapedData.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        job: {
          select: {
            platform: true,
            sourceUrl: true,
            status: true
          }
        }
      }
    })

    const total = await prisma.tripScrapedData.count({ where })

    return {
      success: true,
      data,
      total,
      limit,
      skip
    }
  } catch (error: any) {
    console.error('Error fetching scraped data:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to fetch scraped data'
    })
  }
})

