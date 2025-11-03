import { defineEventHandler, readBody, getQuery } from 'h3'
import prisma from '~/server/utils/prisma'
import { chromium } from 'playwright'
import * as cheerio from 'cheerio'
import { createError } from 'h3'

/**
 * GET/POST /api/admin/scraper/jobs
 * Get list of jobs or create a new scraper job
 */
export default defineEventHandler(async (event) => {
  // Handle GET request
  if (event.node.req.method === 'GET') {
    try {
      const query = getQuery(event)
      const limit = query.limit ? parseInt(query.limit as string) : 50
      const skip = query.skip ? parseInt(query.skip as string) : 0

      const jobs = await prisma.scraperJob.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          _count: {
            select: {
              dataItems: true
            }
          }
        }
      })

      const total = await prisma.scraperJob.count()

      return {
        success: true,
        data: jobs,
        total,
        limit,
        skip
      }
    } catch (error: any) {
      console.error('Error fetching scraper jobs:', error)
      throw createError({
        statusCode: 500,
        message: error.message || 'Failed to fetch scraper jobs'
      })
    }
  }

  // Handle POST request
  if (event.node.req.method !== 'POST') {
    throw createError({
      statusCode: 405,
      message: 'Method not allowed'
    })
  }

  const body = await readBody(event)
  const { sourceUrl, platform, jobType, startImmediately } = body

  if (!sourceUrl || !platform || !jobType) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields: sourceUrl, platform, jobType'
    })
  }

  try {
    // Check if source exists, create if not
    let source = await prisma.scraperSource.findUnique({
      where: { url: sourceUrl }
    })

    if (!source) {
      source = await prisma.scraperSource.create({
        data: {
          url: sourceUrl,
          platform,
          sourceType: 'affiliate_link',
          isActive: true,
          scrapeCount: 0,
          metadata: {}
        }
      })
    }

    // Create job
    const job = await prisma.scraperJob.create({
      data: {
        platform,
        sourceUrl,
        jobType,
        status: 'PENDING',
        priority: 0,
        metadata: {}
      },
      include: {
        source: true
      }
    })

    // Start immediately if requested
    if (startImmediately) {
      // Run scraper in background
      runScraperJob(job.id).catch(err => {
        console.error(`Job ${job.id} failed:`, err)
      })
    }

    return {
      success: true,
      job: {
        id: job.id,
        platform: job.platform,
        sourceUrl: job.sourceUrl,
        jobType: job.jobType,
        status: job.status,
        createdAt: job.createdAt
      }
    }
  } catch (error: any) {
    console.error('Error creating scraper job:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to create scraper job'
    })
  }
})

/**
 * Background scraper job runner
 */
async function runScraperJob(jobId: string) {
  const job = await prisma.scraperJob.findUnique({
    where: { id: jobId },
    include: { source: true }
  })

  if (!job) {
    throw new Error(`Job ${jobId} not found`)
  }

  // Update job status to RUNNING
  await prisma.scraperJob.update({
    where: { id: jobId },
    data: {
      status: 'RUNNING',
      startedAt: new Date()
    }
  })

  try {
    // Launch browser
    const browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
      ]
    })

    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    })

    const page = await context.newPage()

    try {
      // Navigate to the URL
      await page.goto(job.sourceUrl, {
        waitUntil: 'networkidle',
        timeout: 60000
      })

      // Wait for content to load
      await page.waitForTimeout(3000)

      // Get page content
      const content = await page.content()
      const $ = cheerio.load(content)

      // Debug: Log page title to see if we got the right page
      const pageTitle = $('title').text()
      console.log(`Page title: ${pageTitle}`)
      
      // Check if we hit a login page
      if (pageTitle.toLowerCase().includes('login') || 
          pageTitle.toLowerCase().includes('sign in') ||
          $('.login, #login, [class*="login-form"]').length > 0) {
        console.warn('⚠️ Detected login page - Popular Deals may require authentication')
      }

      // Extract deals based on platform and job type
      const deals = await extractDeals($, job.platform, job.jobType, job.sourceUrl)
      
      console.log(`Extracted ${deals.length} deals from page`)

      // Save to database
      for (const deal of deals) {
        await prisma.tripScrapedData.create({
          data: {
            jobId: job.id,
            title: deal.title,
            description: deal.description,
            originalPrice: deal.originalPrice ? parseFloat(deal.originalPrice) : null,
            discountedPrice: deal.discountedPrice ? parseFloat(deal.discountedPrice) : null,
            discount: deal.discount,
            currency: deal.currency || 'SGD',
            image: deal.image,
            affiliateLink: deal.link,
            location: deal.location,
            dates: deal.dates,
            category: deal.category || job.jobType,
            metadata: {}
          }
        })
      }

      // Update source stats
      await prisma.scraperSource.update({
        where: { url: job.sourceUrl },
        data: {
          lastScrapedAt: new Date(),
          scrapeCount: { increment: 1 }
        }
      })

      // Update job status to COMPLETED
      await prisma.scraperJob.update({
        where: { id: jobId },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          metadata: {
            itemsScraped: deals.length
          }
        }
      })

      await browser.close()

      console.log(`✅ Job ${jobId} completed: ${deals.length} items scraped`)

    } catch (error: any) {
      await browser.close()
      throw error
    }
  } catch (error: any) {
    console.error(`❌ Job ${jobId} failed:`, error)

    // Update job status to FAILED
    await prisma.scraperJob.update({
      where: { id: jobId },
      data: {
        status: 'FAILED',
        error: error.message
      }
    })
  }
}

/**
 * Extract deals from HTML based on platform
 */
async function extractDeals(
  $: cheerio.CheerioAPI,
  platform: string,
  jobType: string,
  sourceUrl: string
): Promise<any[]> {
  const deals: any[] = []

  // Trip.com specific extraction
  if (platform === 'trip') {
    // Check if this is a grid/list page with multiple deals (e.g., Popular Deals)
    const isGridPage = sourceUrl.includes('/promotion/popularDeals') ||
                       sourceUrl.includes('/popularDeals') ||
                       sourceUrl.includes('/promotion/')
    
    if (isGridPage) {
      // Grid page - extract multiple deal links and scrape each
      console.log('Detected grid page, extracting multiple deals')
      const gridDeals = extractGridDeals($, platform, sourceUrl)
      deals.push(...gridDeals)
    }
    
    // Check if this is a single-product sale page (e.g., /sale/w/XXXX/YYYY.html)
    const isSalePage = sourceUrl.includes('/sale/w/')
    
    if (isSalePage) {
      // Single-product sale pages - extract from entire page
      console.log('Detected single-product sale page, extracting from page content')
      const deal = extractSingleSalePage($, platform, sourceUrl)
      if (deal && deal.title && deal.title.length > 5) {
        deals.push(deal)
      }
    }
    
    // Check if this is a promotional widget page with multiple deals
    const isPromotionPage = sourceUrl.includes('/partners/ad/') ||
                            sourceUrl.includes('/promo/') ||
                            sourceUrl.includes('/deals') ||
                            (sourceUrl.includes('/sale/') && !sourceUrl.includes('/sale/w/'))
    
    if (isPromotionPage && deals.length === 0) {
      // Promotional widget pages - extract from grid/list
      const promoSelectors = [
        '.promo-item',
        '.deal-item',
        '.sale-item',
        '.product-card',
        '.offer-card',
        'div[data-testid*="deal"]',
        'div[class*="product-card"]',
        'div[class*="promo"]',
        'div[class*="deal-card"]',
        'div[class*="sale-card"]'
      ]
      
      for (const selector of promoSelectors) {
        const items = $(selector)
        if (items.length > 0) {
          console.log(`Found ${items.length} items with selector: ${selector}`)
          items.each((_, element) => {
            const $item = $(element)
            const deal = extractPromotionalDealInfo($item, platform, sourceUrl)
            if (deal && deal.title && deal.title.length > 5) {
              deals.push(deal)
            }
          })
          if (deals.length > 0) break
        }
      }
    }
    
    // If no promotional deals found, try generic selectors
    if (deals.length === 0) {
      const genericSelectors = [
        '.hotel-item',
        '.hotel-card',
        '.product-item',
        '.deal-item',
        '[class*="hotel"]',
        '[class*="product"]'
      ]

      for (const selector of genericSelectors) {
        const items = $(selector)
        if (items.length > 0) {
          items.each((_, element) => {
            const $item = $(element)
            const deal = extractDealInfo($item, platform)
            if (deal.title && deal.title.length > 3) {
              deals.push(deal)
            }
          })
          if (deals.length > 0) break
        }
      }
    }
  }

  return deals
}

/**
 * Extract multiple deals from Trip.com grid/list pages (e.g., Popular Deals)
 */
function extractGridDeals($: cheerio.CheerioAPI, platform: string, sourceUrl: string): any[] {
  const deals: any[] = []
  
  // Find all deal cards in the grid
  const gridSelectors = [
    '.deal-card',
    '.promo-card',
    '.sale-card',
    '.offer-card',
    '.product-card',
    '[class*="deal-card"]',
    '[class*="promo-card"]',
    'div[data-testid*="deal"]'
  ]
  
  for (const selector of gridSelectors) {
    const cards = $(selector)
    if (cards.length > 0) {
      console.log(`Found ${cards.length} deal cards with selector: ${selector}`)
      
      cards.each((_, card) => {
        const $card = $(card)
        
        // Extract basic info from grid card
        const deal: any = {}
        
        // Title
        deal.title = $card.find('h2, h3, h4, .title, [class*="title"]').first().text().trim()
        
        // Image
        deal.image = $card.find('img').first().attr('src') || 
                     $card.find('img').first().attr('data-src')
        
        // Make image URL absolute
        if (deal.image && !deal.image.startsWith('http')) {
          deal.image = deal.image.startsWith('//') ? `https:${deal.image}` : `https://www.trip.com${deal.image}`
        }
        
        // Offer/description text
        deal.description = $card.find('.offer, .description, [class*="offer"], [class*="desc"]').first().text().trim()
        
        // Expiry date
        deal.validDate = $card.find('.ends, .expires, [class*="end"], [class*="expire"]').first().text().trim()
        
        // Link to detailed page
        const link = $card.find('a').first().attr('href')
        if (link) {
          deal.link = link.startsWith('http') ? link : `https://www.trip.com${link}`
        }
        
        // Extract discount from offer text
        const discountMatch = deal.description?.match(/(\d+)%/)
        if (discountMatch) {
          deal.discount = discountMatch[0]
          deal.discountPercent = discountMatch[1]
        }
        
        // Extract currency
        const currencyMatch = $card.text().match(/(SGD|USD|EUR|GBP|JPY|CNY|VND|MYR|THB|IDR)/i)
        if (currencyMatch) {
          deal.currency = currencyMatch[1].toUpperCase()
        } else {
          deal.currency = 'SGD' // Default for Singapore
        }
        
        // Set category based on content
        if (deal.description?.toLowerCase().includes('hotel')) {
          deal.category = 'hotel'
        } else if (deal.description?.toLowerCase().includes('flight')) {
          deal.category = 'flight'
        } else if (deal.description?.toLowerCase().includes('train')) {
          deal.category = 'train'
        } else {
          deal.category = 'generic'
        }
        
        // Only add if we have basic info
        if (deal.title && deal.title.length > 5) {
          deals.push(deal)
        }
      })
      
      if (deals.length > 0) break
    }
  }
  
  return deals
}

/**
 * Extract single product information from Trip.com sale page
 */
function extractSingleSalePage($: cheerio.CheerioAPI, platform: string, sourceUrl: string): any {
  const deal: any = {}
  
  // Extract title from page - try main heading or meta
  deal.title = $('h1').first().text().trim() || 
               $('.main-title, .page-title, [class*="main-title"]').first().text().trim() ||
               $('title').text().trim() ||
               'Special Offer'

  // Extract from page-level elements for single-product pages
  deal.description = $('.description, .intro, [class*="description"]').first().text().trim() ||
                    $('meta[name="description"]').attr('content') ||
                    ''

  // Extract price from any price element on page
  const priceElement = $('.price, [class*="price"], [class*="amount"]').first()
  const priceText = priceElement.text().trim()
  const priceMatch = priceText.match(/(\d+[,\.]?\d*)/)
  if (priceMatch) {
    deal.discountedPrice = priceMatch[1].replace(',', '')
  }

  // Extract original price
  const originalPrice = $('.original-price, .old-price, [class*="original"]').first().text().trim()
  const originalPriceMatch = originalPrice.match(/(\d+[,\.]?\d*)/)
  if (originalPriceMatch) {
    deal.originalPrice = originalPriceMatch[1].replace(',', '')
  }

  // Extract discount
  const discountText = $('.discount, [class*="discount"], .save, [class*="save"]').first().text().trim()
  if (discountText) {
    deal.discount = discountText
    const discountMatch = discountText.match(/(\d+)%/)
    if (discountMatch) {
      deal.discountPercent = discountMatch[1]
    }
  }

  // Extract image - prefer hero image or main image
  deal.image = $('.hero-image img, .main-image img, [class*="hero"] img').first().attr('src') ||
               $('.product-image img').first().attr('src') ||
               $('img').first().attr('src')

  // Make image URL absolute
  if (deal.image && !deal.image.startsWith('http')) {
    deal.image = deal.image.startsWith('//') ? `https:${deal.image}` : `https://www.trip.com${deal.image}`
  }

  // Extract CTA link or use source URL
  const ctaLink = $('.cta-button a, .book-now a, [class*="cta"] a, .btn-primary a').first().attr('href')
  deal.link = ctaLink ? (ctaLink.startsWith('http') ? ctaLink : `https://www.trip.com${ctaLink}`) : sourceUrl

  // Extract location if available
  deal.location = $('.location, .destination, [class*="location"]').first().text().trim()

  // Extract currency
  const currencyMatch = $('body').text().match(/(SGD|USD|EUR|GBP|JPY|CNY|VND|MYR|THB|IDR)/i)
  if (currencyMatch) {
    deal.currency = currencyMatch[1].toUpperCase()
  }

  // Extract validity/dates
  deal.validDate = $('.valid-date, .valid-until, [class*="valid"]').first().text().trim()

  // Set category based on URL or content
  if (sourceUrl.includes('hotel')) deal.category = 'hotel'
  else if (sourceUrl.includes('flight')) deal.category = 'flight'
  else if (sourceUrl.includes('activity') || sourceUrl.includes('attraction')) deal.category = 'activity'
  else if (sourceUrl.includes('train')) deal.category = 'train'
  else deal.category = 'generic'

  return deal
}

/**
 * Extract promotional deal information from HTML element (optimized for Trip.com sale/promo pages)
 */
function extractPromotionalDealInfo($item: cheerio.Cheerio<any>, platform: string, sourceUrl: string): any {
  const deal: any = {}

  // Extract title - try multiple common selectors
  deal.title = $item.find('h2, h3, h4, .title, [class*="title"], [class*="name"], [class*="deal-title"]').first().text().trim() ||
                $item.find('a').first().attr('title') ||
                $item.text().substring(0, 150).trim()

  // Extract price - look for current/sale price
  const priceElement = $item.find('.price, .current-price, .sale-price, [class*="price"], [class*="amount"]').first()
  const priceText = priceElement.text().trim()
  
  // Try to extract numeric price
  const priceMatch = priceText.match(/(\d+[,\.]?\d*)/)
  if (priceMatch) {
    deal.discountedPrice = priceMatch[1].replace(',', '')
  }

  // Extract original price
  const originalPrice = $item.find('.original-price, .old-price, [class*="original"], [class*="old"], [class*="was"]').first().text().trim()
  const originalPriceMatch = originalPrice.match(/(\d+[,\.]?\d*)/)
  if (originalPriceMatch) {
    deal.originalPrice = originalPriceMatch[1].replace(',', '')
  }

  // Extract discount percentage
  const discountText = $item.find('.discount, .discount-badge, [class*="discount"], .save, [class*="save"]').first().text().trim()
  if (discountText) {
    deal.discount = discountText
    // Try to extract numeric discount
    const discountMatch = discountText.match(/(\d+)%/)
    if (discountMatch) {
      deal.discountPercent = discountMatch[1]
    }
  }

  // Extract image - try multiple sources
  deal.image = $item.find('img').first().attr('src') || 
               $item.find('img').first().attr('data-src') ||
               $item.find('img').first().attr('data-lazy-src') ||
               $item.find('[style*="background-image"]').first().attr('style')?.match(/url\(["']?(.+?)["']?\)/)?.[1]

  // Make image URL absolute if relative
  if (deal.image && !deal.image.startsWith('http')) {
    deal.image = deal.image.startsWith('//') ? `https:${deal.image}` : `https://www.trip.com${deal.image}`
  }

  // Extract link
  const link = $item.find('a').first().attr('href')
  if (link) {
    deal.link = link.startsWith('http') ? link : `https://www.trip.com${link}`
  }

  // Extract location/destination
  deal.location = $item.find('.location, .destination, [class*="location"], [class*="destination"], [class*="city"]').first().text().trim()

  // Extract description - more aggressive
  deal.description = $item.find('.description, .desc, p, [class*="desc"], [class*="summary"]').first().text().trim()

  // Extract currency
  const currencyMatch = $item.text().match(/(SGD|USD|EUR|GBP|JPY|CNY|VND|MYR|THB|IDR)/i)
  if (currencyMatch) {
    deal.currency = currencyMatch[1].toUpperCase()
  }

  // Extract deal validity/dates
  deal.validDate = $item.find('.valid-date, .valid-until, [class*="valid"], [class*="expire"]').first().text().trim()

  // Extract rating/reviews if available
  const rating = $item.find('.rating, .star-rating, [class*="rating"], [class*="star"]').first().text().trim()
  if (rating) {
    deal.rating = rating
  }

  // Extract badge or special offer label
  deal.badge = $item.find('.badge, .tag, [class*="badge"], [class*="tag"]').first().text().trim()

  return deal
}

/**
 * Extract deal information from HTML element (generic extraction)
 */
function extractDealInfo($item: cheerio.Cheerio<any>, platform: string): any {
  const deal: any = {}

  // Extract title
  deal.title = $item.find('h2, h3, h4, .title, [class*="title"], [class*="name"]').first().text().trim() ||
                $item.text().substring(0, 100).trim()

  // Extract price
  const priceElement = $item.find('.price, [class*="price"], .amount, [class*="amount"]').first()
  const priceText = priceElement.text().trim()
  
  // Try to extract numeric price
  const priceMatch = priceText.match(/(\d+[,\.]?\d*)/)
  if (priceMatch) {
    deal.discountedPrice = priceMatch[1].replace(',', '')
  }

  // Extract original price
  const originalPrice = $item.find('.original-price, .old-price, [class*="original"], [class*="old"]').first().text().trim()
  const originalPriceMatch = originalPrice.match(/(\d+[,\.]?\d*)/)
  if (originalPriceMatch) {
    deal.originalPrice = originalPriceMatch[1].replace(',', '')
  }

  // Extract discount
  deal.discount = $item.find('.discount, [class*="discount"], .sale, [class*="sale"]').first().text().trim()

  // Extract image
  deal.image = $item.find('img').first().attr('src') || 
               $item.find('img').first().attr('data-src') ||
               $item.find('[style*="background-image"]').first().attr('style')?.match(/url\(["']?(.+?)["']?\)/)?.[1]

  // Extract link
  const link = $item.find('a').first().attr('href')
  if (link) {
    deal.link = link.startsWith('http') ? link : `https://www.trip.com${link}`
  }

  // Extract location
  deal.location = $item.find('.location, [class*="location"], .city, [class*="city"]').first().text().trim()

  // Extract description
  deal.description = $item.find('.description, p, [class*="desc"]').first().text().trim()

  // Extract currency
  const currencyMatch = $item.text().match(/(SGD|USD|EUR|GBP|JPY|CNY)/i)
  if (currencyMatch) {
    deal.currency = currencyMatch[1].toUpperCase()
  }

  return deal
}

