import { defineEventHandler, readBody } from 'h3'
import { createError } from 'h3'
import prisma from '~/server/utils/prisma'
import { crawlKlook } from '~/server/services/klook-crawler'

interface CrawlRequest {
  type?: 'activities' | 'promos' | 'hotels' | 'all'
  categories?: string[]
  locations?: string[]
  maxItems?: number
  background?: boolean // Run in background (fire and forget)
}

/**
 * POST /api/klook/crawl
 * Trigger Klook background crawl
 */
export default defineEventHandler(async (event) => {
  try {
    const body = (await readBody(event)) as CrawlRequest
    const {
      type = 'all',
      categories = [],
      locations = ['Singapore'],
      maxItems = 50,
      background = true
    } = body

    // Check if crawling is enabled
    const crawlEnabled = process.env.KLOOK_CRAWL_ENABLED !== 'false'
    if (!crawlEnabled) {
      return {
        success: true,
        message: 'Klook crawl is disabled. Set KLOOK_CRAWL_ENABLED=true to enable.',
        cached: true
      }
    }

    // Create or get scraper source
    const sourceUrl = `klook-${type}-${locations.join('-')}`
    let source = await prisma.scraperSource.findUnique({
      where: { url: sourceUrl }
    })

    if (!source) {
      source = await prisma.scraperSource.create({
        data: {
          url: sourceUrl,
          platform: 'klook',
          sourceType: type === 'all' ? 'mixed' : type,
          isActive: true
        }
      })
    }

    // Create a scraper job record
    const job = await prisma.scraperJob.create({
      data: {
        platform: 'klook',
        sourceUrl: source.url,
        jobType: type === 'all' ? 'mixed' : type,
        status: 'PENDING',
        priority: 5,
        metadata: {
          type,
          categories,
          locations,
          maxItems
        }
      }
    })

    console.log(`📋 Created Klook crawl job: ${job.id}`)

    // Run crawl (in background or wait for result)
    if (background) {
      // Fire and forget - run in background
      crawlKlook({
        type,
        categories,
        locations,
        maxItems,
        jobId: job.id
      }).catch((error) => {
        console.error('Background Klook crawl error:', error)
        // Update job status to failed
        prisma.scraperJob.update({
          where: { id: job.id },
          data: {
            status: 'FAILED',
            error: error.message
          }
        }).catch(console.error)
      })

      return {
        success: true,
        jobId: job.id,
        message: 'Klook crawl started in background',
        status: 'running'
      }
    } else {
      // Wait for crawl to complete
      try {
        const result = await crawlKlook({
          type,
          categories,
          locations,
          maxItems,
          jobId: job.id
        })

        return {
          success: true,
          jobId: job.id,
          message: 'Klook crawl completed',
          ...result
        }
      } catch (error: any) {
        // Update job status to failed
        await prisma.scraperJob.update({
          where: { id: job.id },
          data: {
            status: 'FAILED',
            error: error.message
          }
        })

        throw error
      }
    }
  } catch (error: any) {
    console.error('Klook crawl API error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to start Klook crawl'
    })
  }
})

