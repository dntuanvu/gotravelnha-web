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
    const { url, existingUrl, platform, sourceType, isActive } = body

    try {
      // Toggle active/inactive only
      if (url && !platform && !sourceType && typeof isActive === 'boolean') {
        const toggled = await prisma.scraperSource.update({
          where: { url },
          data: { isActive }
        })
        return { success: true, data: toggled }
      }

      if (!url || !platform || !sourceType) {
        throw createError({
          statusCode: 400,
          message: 'Missing required fields: url, platform, sourceType'
        })
      }

      // Edit flow where URL might be changed (PK = url)
      if (existingUrl && existingUrl !== url) {
        const result = await prisma.$transaction(async (tx) => {
          const previous = await tx.scraperSource.findUnique({
            where: { url: existingUrl }
          })

          if (!previous) {
            throw createError({
              statusCode: 404,
              message: 'Existing source not found'
            })
          }

          const updated = await tx.scraperSource.upsert({
            where: { url },
            create: {
              url,
              platform,
              sourceType,
              isActive: isActive !== false,
              scrapeCount: previous.scrapeCount || 0,
              lastScrapedAt: previous.lastScrapedAt || null,
              metadata: previous.metadata || null
            },
            update: {
              platform,
              sourceType,
              isActive: isActive !== false
            }
          })

          // Keep history and avoid FK disruption by disabling old URL
          await tx.scraperSource.update({
            where: { url: existingUrl },
            data: { isActive: false }
          })

          return updated
        })

        return {
          success: true,
          data: result
        }
      }

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

  // Handle DELETE request
  if (event.node.req.method === 'DELETE') {
    const body = await readBody(event)
    const { url } = body || {}

    if (!url) {
      throw createError({
        statusCode: 400,
        message: 'Missing required field: url'
      })
    }

    try {
      await prisma.scraperSource.delete({
        where: { url }
      })

      return {
        success: true
      }
    } catch (error: any) {
      console.error('Error deleting scraper source:', error)
      throw createError({
        statusCode: 500,
        message: error.message || 'Failed to delete scraper source'
      })
    }
  }

  // Method not allowed
  throw createError({
    statusCode: 405,
    message: 'Method not allowed'
  })
})

