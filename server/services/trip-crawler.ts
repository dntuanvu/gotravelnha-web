import { chromium } from 'playwright'
import * as cheerio from 'cheerio'
import prisma from '~/server/utils/prisma'

const BASE_URL = 'https://sg.trip.com'

export interface TripCrawlRequest {
  fullCrawl?: boolean
  maxPages?: number
  categories?: string[]
  urls?: string[]
  jobId?: string
}

export interface TripDeal {
  title: string
  description?: string
  originalPrice?: number
  discountedPrice?: number
  discount?: string
  currency?: string
  image?: string
  affiliateLink?: string
  location?: string
  dates?: string
  category?: string
  metadata?: Record<string, any>
}

/**
 * Trip.com Background Crawler Service
 * Crawls promotional sale pages and extracts deal information
 */
export async function crawlTripCom(request: TripCrawlRequest = {}) {
  const {
    fullCrawl = false,
    maxPages = 5,
    categories = ['all'],
    urls = [],
    jobId
  } = request

  console.log('🕷️ Starting Trip.com crawl...')
  console.log(`   Config: fullCrawl=${fullCrawl}, maxPages=${maxPages}, categories=${categories.join(',')}, urls=${urls.length}`)

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
    const allDeals: TripDeal[] = []

    // If specific URLs provided, crawl those
    if (urls.length > 0) {
      console.log(`📄 Crawling ${urls.length} specific URLs...`)
      for (const url of urls) {
        try {
          const deals = await crawlTripUrl(page, url)
          allDeals.push(...deals)
          console.log(`✅ Crawled ${url}: ${deals.length} deals found`)
        } catch (error: any) {
          console.error(`❌ Error crawling ${url}:`, error.message)
        }
      }
    } else {
      // Crawl by categories
      const saleUrls = await getSalePageUrls(categories, maxPages)
      console.log(`📄 Found ${saleUrls.length} sale pages to crawl...`)

      for (const saleUrl of saleUrls) {
        try {
          const deals = await crawlTripUrl(page, saleUrl)
          allDeals.push(...deals)
          console.log(`✅ Crawled ${saleUrl}: ${deals.length} deals found`)
          
          // Rate limiting - wait between pages
          await page.waitForTimeout(2000)
        } catch (error: any) {
          console.error(`❌ Error crawling ${saleUrl}:`, error.message)
        }
      }
    }

    // Store deals in database
    const storedCount = await storeTripDeals(allDeals, jobId)

    console.log(`✅ Trip.com crawl complete: ${allDeals.length} deals extracted, ${storedCount} stored/updated`)

    return {
      success: true,
      total: allDeals.length,
      stored: storedCount,
      deals: allDeals
    }
  } catch (error: any) {
    console.error('❌ Trip.com crawl error:', error)
    throw error
  } finally {
    await browser.close()
  }
}

/**
 * Crawl a specific Trip.com URL and extract deals
 */
async function crawlTripUrl(page: any, url: string): Promise<TripDeal[]> {
  try {
    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 60000
    })

    // Wait for content to load
    await page.waitForTimeout(3000)

    // Get page content
    const content = await page.content()
    const $ = cheerio.load(content)

    // Extract deals based on URL type
    const deals = extractDealsFromPage($, url)

    return deals
  } catch (error: any) {
    console.error(`Error crawling ${url}:`, error.message)
    return []
  }
}

/**
 * Extract deals from a Trip.com page
 */
function extractDealsFromPage($: cheerio.CheerioAPI, url: string): TripDeal[] {
  const deals: TripDeal[] = []

  // Check if this is a sale/promotion page
  if (url.includes('/sale/') || url.includes('/partners/ad/')) {
    // Extract promotional deals from sale pages
    const saleSelectors = [
      '.sale-item',
      '.deal-item',
      '.promo-item',
      '.product-item',
      'div[class*="deal"]',
      'div[class*="promo"]',
      'div[class*="offer"]',
      '.card',
      '.item-card',
      '.listing-item'
    ]

    for (const selector of saleSelectors) {
      const items = $(selector)
      if (items.length > 0) {
        items.each((_, element) => {
          const $item = $(element)
          const deal = extractDealInfo($item, url)
          if (deal.title) {
            deals.push(deal)
          }
        })
        if (deals.length > 0) break
      }
    }
  }

  // Also try single deal page extraction (if URL is a specific deal)
  if (deals.length === 0 && url.includes('/sale/')) {
    const singleDeal = extractSingleDealPage($, url)
    if (singleDeal) {
      deals.push(singleDeal)
    }
  }

  return deals
}

/**
 * Extract deal information from an HTML element
 */
function extractDealInfo($item: cheerio.Cheerio<any>, url: string): TripDeal {
  // Extract title
  const title = $item.find('h1, h2, h3, h4, .title, [class*="title"], [class*="name"]').first().text().trim() ||
                $item.text().substring(0, 100).trim()

  // Extract price
  const priceElement = $item.find('.price, [class*="price"], .amount, [class*="amount"]').first()
  const priceText = priceElement.text().trim()
  const priceMatch = priceText.match(/(\d+[,\.]?\d*)/)
  const discountedPrice = priceMatch ? parseFloat(priceMatch[1].replace(',', '')) : undefined

  // Extract original price
  const originalPriceElement = $item.find('.original-price, .old-price, [class*="original"], [class*="old"], [class*="was"]').first()
  const originalPriceText = originalPriceElement.text().trim()
  const originalPriceMatch = originalPriceText.match(/(\d+[,\.]?\d*)/)
  const originalPrice = originalPriceMatch ? parseFloat(originalPriceMatch[1].replace(',', '')) : undefined

  // Extract discount
  const discountElement = $item.find('.discount, [class*="discount"], .sale, [class*="sale"], .badge')
  const discount = discountElement.first().text().trim()

  // Extract currency
  const currencyMatch = $item.text().match(/(SGD|USD|EUR|GBP|JPY|CNY)/i)
  const currency = currencyMatch ? currencyMatch[1].toUpperCase() : 'SGD'

  // Extract image
  let image = $item.find('img').first().attr('src') || 
              $item.find('img').first().attr('data-src') ||
              $item.find('[style*="background-image"]').first().attr('style')?.match(/url\(["']?(.+?)["']?\)/)?.[1]
  
  if (image && !image.startsWith('http')) {
    image = image.startsWith('//') ? `https:${image}` : `https://www.trip.com${image}`
  }

  // Extract link
  let link = $item.find('a').first().attr('href')
  if (link && !link.startsWith('http')) {
    link = link.startsWith('//') ? `https:${link}` : `https://www.trip.com${link}`
  } else if (!link && url.includes('/sale/')) {
    link = url
  }

  // Extract location
  const location = $item.find('.location, [class*="location"], .city, [class*="city"], .destination').first().text().trim()

  // Extract description
  const description = $item.find('.description, p, [class*="desc"]').first().text().trim()

  // Extract dates/validity
  const dates = $item.find('.dates, .valid, [class*="date"], [class*="valid"]').first().text().trim()

  // Determine category from URL or content
  let category = 'general'
  if (url.includes('/hotel') || $item.text().toLowerCase().includes('hotel')) category = 'hotel'
  else if (url.includes('/flight') || $item.text().toLowerCase().includes('flight')) category = 'flight'
  else if (url.includes('/activity') || $item.text().toLowerCase().includes('activity')) category = 'activity'

  return {
    title,
    description: description || undefined,
    originalPrice,
    discountedPrice,
    discount: discount || undefined,
    currency,
    image: image || undefined,
    affiliateLink: link || undefined,
    location: location || undefined,
    dates: dates || undefined,
    category,
    metadata: {
      sourceUrl: url,
      extractedAt: new Date().toISOString()
    }
  }
}

/**
 * Extract single deal from a detail page
 */
function extractSingleDealPage($: cheerio.CheerioAPI, url: string): TripDeal | null {
  try {
    // Extract from page title/meta
    const title = $('h1').first().text().trim() ||
                  $('title').text().trim() ||
                  $('meta[property="og:title"]').attr('content') || ''
    
    if (!title) return null

    const description = $('meta[name="description"]').attr('content') ||
                        $('.description, .content').first().text().trim() || ''

    // Extract price
    const priceText = $('.price, [class*="price"]').first().text().trim()
    const priceMatch = priceText.match(/(\d+[,\.]?\d*)/)
    const discountedPrice = priceMatch ? parseFloat(priceMatch[1].replace(',', '')) : undefined

    // Extract image
    let image = $('meta[property="og:image"]').attr('content') ||
                $('img').first().attr('src') ||
                $('img').first().attr('data-src')
    
    if (image && !image.startsWith('http')) {
      image = image.startsWith('//') ? `https:${image}` : `https://www.trip.com${image}`
    }

    // Extract currency
    const currencyMatch = $('body').text().match(/(SGD|USD|EUR|GBP|JPY|CNY)/i)
    const currency = currencyMatch ? currencyMatch[1].toUpperCase() : 'SGD'

    return {
      title,
      description: description || undefined,
      discountedPrice,
      currency,
      image: image || undefined,
      affiliateLink: url,
      category: url.includes('/hotel') ? 'hotel' : url.includes('/flight') ? 'flight' : 'activity',
      metadata: {
        sourceUrl: url,
        extractedAt: new Date().toISOString()
      }
    }
  } catch (error) {
    return null
  }
}

/**
 * Get sale page URLs to crawl
 * In a real implementation, this could fetch from affiliate portal or known sale page patterns
 */
async function getSalePageUrls(categories: string[], maxPages: number): Promise<string[]> {
  // Common Trip.com sale page patterns
  // In production, these could be:
  // 1. Fetched from affiliate portal API
  // 2. Discovered by crawling the sale index page
  // 3. Maintained as a curated list

  const baseUrls: string[] = [
    // Example sale pages - replace with actual URLs from affiliate portal
    'https://sg.trip.com/sale/w/4747/flightrebate.html',
    'https://sg.trip.com/sale/w/28065/everydayescape.html',
    'https://sg.trip.com/sale/w/14373/swisstravelpass2025.html',
  ]

  // If categories include 'all' or specific categories, add category-specific URLs
  if (categories.includes('all') || categories.includes('hotel')) {
    baseUrls.push('https://sg.trip.com/hotels/')
  }

  if (categories.includes('all') || categories.includes('flight')) {
    baseUrls.push('https://sg.trip.com/flights/')
  }

  // Limit to maxPages
  return baseUrls.slice(0, maxPages)
}

/**
 * Store or update deals in the database
 */
async function storeTripDeals(deals: TripDeal[], jobId?: string): Promise<number> {
  let storedCount = 0

  // Create or get job record
  let job
  if (jobId) {
    job = await prisma.scraperJob.findUnique({ where: { id: jobId } })
  }

  if (!job && jobId) {
    // Create job if provided but doesn't exist
    job = await prisma.scraperJob.create({
      data: {
        id: jobId,
        platform: 'trip',
        sourceUrl: 'multiple',
        jobType: 'deal',
        status: 'RUNNING',
        priority: 5
      }
    })
  }

  // Store each deal
  for (const deal of deals) {
    try {
      // Use affiliateLink or title as unique identifier
      const uniqueKey = deal.affiliateLink || deal.title

      if (!uniqueKey) continue

      // Check if deal already exists (by affiliateLink or title)
      const existing = await prisma.tripScrapedData.findFirst({
        where: {
          OR: [
            { affiliateLink: deal.affiliateLink || undefined },
            { title: deal.title }
          ]
        }
      })

      const dealData = {
        title: deal.title,
        description: deal.description || null,
        originalPrice: deal.originalPrice ? deal.originalPrice : null,
        discountedPrice: deal.discountedPrice ? deal.discountedPrice : null,
        discount: deal.discount || null,
        currency: deal.currency || 'SGD',
        image: deal.image || null,
        affiliateLink: deal.affiliateLink || null,
        location: deal.location || null,
        dates: deal.dates || null,
        category: deal.category || 'general',
        metadata: deal.metadata || {},
        isValid: true
      }

      if (existing) {
        // Update existing deal
        await prisma.tripScrapedData.update({
          where: { id: existing.id },
          data: dealData
        })
      } else {
        // Create new deal - jobId is required in schema
        const finalJobId = job?.id || jobId
        if (finalJobId) {
          await prisma.tripScrapedData.create({
            data: {
              ...dealData,
              jobId: finalJobId
            }
          })
        } else {
          console.warn(`⚠️ Skipping deal "${deal.title}" - no jobId provided`)
        }
      }

      storedCount++
    } catch (error: any) {
      console.error(`Error storing deal "${deal.title}":`, error.message)
    }
  }

  // Update job status if exists
  if (job) {
    await prisma.scraperJob.update({
      where: { id: job.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date()
      }
    })
  }

  return storedCount
}

