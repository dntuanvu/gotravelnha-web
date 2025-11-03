import { defineEventHandler, readBody } from 'h3'
import prisma from '~/server/utils/prisma'
import { createError } from 'h3'

/**
 * GET/POST /api/admin/scraper/sources
 * Get list of scraper sources or create/update a source
 */
export default defineEventHandler(async (event) => {
  // Handle GET request
  if (event.node.req.method === 'GET') {
    try {
      const sources = await prisma.scraperSource.findMany({
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          _count: {
            select: {
              jobs: true
            }
          }
        }
      })

      return {
        success: true,
        data: sources
      }
    } catch (error: any) {
      console.error('Error fetching scraper sources:', error)
      throw createError({
        statusCode: 500,
        message: error.message || 'Failed to fetch scraper sources'
      })
    }
  }

  // Handle POST request
  if (event.node.req.method === 'POST') {
    const body = await readBody(event)
    const { url, platform, sourceType, isActive } = body

    if (!url || !platform || !sourceType) {
      throw createError({
        statusCode: 400,
        message: 'Missing required fields: url, platform, sourceType'
      })
    }

    try {
      const source = await prisma.scraperSource.upsert({
        where: { url },
        create: {
          url,
          platform,
          sourceType,
          isActive: isActive !== false,
          scrapeCount: 0
        },
        update: {
          platform,
          sourceType,
          isActive: isActive !== false
        }
      })

      return {
        success: true,
        data: source
      }
    } catch (error: any) {
      console.error('Error creating/updating scraper source:', error)
      throw createError({
        statusCode: 500,
        message: error.message || 'Failed to create/update scraper source'
      })
    }
  }

  // Method not allowed
  throw createError({
    statusCode: 405,
    message: 'Method not allowed'
  })
})

