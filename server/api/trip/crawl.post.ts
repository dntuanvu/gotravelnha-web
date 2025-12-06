import { defineEventHandler, readBody } from 'h3'
import { createError } from 'h3'
import prisma from '~/server/utils/prisma'
import { crawlTripCom } from '~/server/services/trip-crawler'

interface CrawlRequest {
  fullCrawl?: boolean
  maxPages?: number
  categories?: string[]
  urls?: string[]
  background?: boolean // Run in background (fire and forget)
}

/**
 * POST /api/trip/crawl
 * Trigger Trip.com background crawl
 */
export default defineEventHandler(async (event) => {
  try {
    const body = (await readBody(event)) as CrawlRequest
    const {
      fullCrawl = false,
      maxPages = 5,
      categories = ['all'],
      urls = [],
      background = true
    } = body

    // Check if crawling is enabled
    const crawlEnabled = process.env.TRIP_CRAWL_ENABLED !== 'false'
    if (!crawlEnabled) {
      return {
        success: true,
        message: 'Trip.com crawl is disabled. Set TRIP_CRAWL_ENABLED=true to enable.',
        cached: true
      }
    }

    // Create or get scraper source
    const sourceUrl = urls.length > 0 ? urls[0] : `trip-crawl-${categories.join('-')}`
    let source = await prisma.scraperSource.findUnique({
      where: { url: sourceUrl }
    })

    if (!source) {
      source = await prisma.scraperSource.create({
        data: {
          url: sourceUrl,
          platform: 'trip',
          sourceType: 'promotion_page',
          isActive: true
        }
      })
    }

    // Create a scraper job record
    const job = await prisma.scraperJob.create({
      data: {
        platform: 'trip',
        sourceUrl: source.url,
        jobType: 'deal',
        status: 'PENDING',
        priority: 5,
        metadata: {
          fullCrawl,
          maxPages,
          categories,
          urls
        }
      }
    })

    console.log(`📋 Created Trip.com crawl job: ${job.id}`)

    // Run crawl (in background or wait for result)
    if (background) {
      // Fire and forget - run in background
      crawlTripCom({
        fullCrawl,
        maxPages,
        categories,
        urls,
        jobId: job.id
      }).catch((error) => {
        console.error('Background Trip.com crawl error:', error)
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
        message: 'Trip.com crawl started in background',
        status: 'running'
      }
    } else {
      // Wait for crawl to complete
      try {
        const result = await crawlTripCom({
          fullCrawl,
          maxPages,
          categories,
          urls,
          jobId: job.id
        })

        return {
          success: true,
          jobId: job.id,
          message: 'Trip.com crawl completed',
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
    console.error('Trip.com crawl API error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to start Trip.com crawl'
    })
  }
})

