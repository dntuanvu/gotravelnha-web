import { defineEventHandler, readBody } from 'h3'
import { chromium } from 'playwright'
import * as cheerio from 'cheerio'
import { createError } from 'h3'

interface PromotionScrapeRequest {
  url: string
  type?: 'flight' | 'hotel' | 'activity' | 'generic'
  timeout?: number
}

interface PromotionDeal {
  id?: string
  title: string
  description?: string
  originalPrice?: string
  discountedPrice?: string
  discount?: string
  currency?: string
  image?: string
  link?: string
  location?: string
  dates?: string
  category?: string
}

interface ScrapeResult {
  url: string
  type: string
  deals: PromotionDeal[]
  metadata?: {
    title?: string
    description?: string
    totalDeals?: number
  }
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event) as PromotionScrapeRequest

    if (!body.url) {
      throw createError({
        statusCode: 400,
        message: 'URL is required'
      })
    }

    const isProduction = process.env.NODE_ENV === 'production'

    // Launch browser
    const browser = await chromium.launch({
      headless: isProduction,
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
      await page.goto(body.url, {
        waitUntil: 'networkidle',
        timeout: body.timeout || 60000
      })

      // Wait for content to load
      await page.waitForTimeout(3000)

      // Get page content
      const content = await page.content()
      const $ = cheerio.load(content)

      // Extract deals based on URL type
      const deals = extractDeals($, body.url, body.type || 'generic')

      const result: ScrapeResult = {
        url: body.url,
        type: body.type || 'generic',
        deals,
        metadata: {
          title: $('title').text() || $('meta[property="og:title"]').attr('content') || '',
          description: $('meta[name="description"]').attr('content') || '',
          totalDeals: deals.length
        }
      }

      await browser.close()
      return result

    } catch (error: any) {
      await browser.close()
      throw error
    }
  } catch (error: any) {
    console.error('Trip.com scraping error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to scrape Trip.com promotions'
    })
  }
})

function extractDeals($: cheerio.CheerioAPI, url: string, type: string): PromotionDeal[] {
  const deals: PromotionDeal[] = []

  // Check if this is a sale/promotion page
  if (url.includes('/sale/') || url.includes('/partners/ad/')) {
    // Extract promotional deals
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
        // If we found deals, stop trying other selectors
        if (deals.length > 0) break
      }
    }
  }

  // Also try to extract from Trip.com specific structures
  if (type === 'flight' || type === 'hotel') {
    const specificDeals = extractTripSpecificDeals($, url, type)
    if (specificDeals.length > 0) {
      deals.push(...specificDeals)
    }
  }

  // If no deals found, try generic extraction
  if (deals.length === 0) {
    const genericDeals = extractGenericDeals($, url)
    if (genericDeals.length > 0) {
      deals.push(...genericDeals)
    }
  }

  return deals
}

function extractDealInfo($item: cheerio.Cheerio<any>, url: string): PromotionDeal {
  // Extract title
  const title = $item.find('h2, h3, h4, .title, [class*="title"], [class*="name"]').first().text().trim() ||
                $item.text().substring(0, 100).trim()

  // Extract price
  const priceElement = $item.find('.price, [class*="price"], .amount, [class*="amount"]').first()
  const price = priceElement.text().trim()
  
  // Extract original price
  const originalPrice = $item.find('.original-price, .old-price, [class*="original"], [class*="old"]').first().text().trim()
  
  // Extract discount
  const discount = $item.find('.discount, [class*="discount"], .sale, [class*="sale"]').first().text().trim()

  // Extract image
  const image = $item.find('img').first().attr('src') || 
                $item.find('img').first().attr('data-src') ||
                $item.find('[style*="background-image"]').first().attr('style')?.match(/url\(["']?(.+?)["']?\)/)?.[1]

  // Extract link
  const link = $item.find('a').first().attr('href')
  const fullLink = link ? (link.startsWith('http') ? link : `https://www.trip.com${link}`) : undefined

  // Extract location
  const location = $item.find('.location, [class*="location"], .city, [class*="city"]').first().text().trim()

  // Extract description
  const description = $item.find('.description, p, [class*="desc"]').first().text().trim()

  return {
    title,
    description,
    originalPrice: originalPrice || undefined,
    discountedPrice: price || undefined,
    discount: discount || undefined,
    image: image || undefined,
    link: fullLink,
    location: location || undefined
  }
}

function extractTripSpecificDeals($: cheerio.CheerioAPI, url: string, type: string): PromotionDeal[] {
  const deals: PromotionDeal[] = []

  // Trip.com specific structures
  const selectors = type === 'flight' 
    ? [
        'div[class*="flight"]',
        'div[data-type="flight"]',
        '.flight-item',
        '.route-item'
      ]
    : [
        'div[class*="hotel"]',
        'div[data-type="hotel"]',
        '.hotel-item',
        '.property-item'
      ]

  for (const selector of selectors) {
    const items = $(selector)
    if (items.length > 0) {
      items.each((_, element) => {
        const $item = $(element)
        const deal = extractDealInfo($item, url)
        deal.category = type
        if (deal.title) {
          deals.push(deal)
        }
      })
      if (deals.length > 0) break
    }
  }

  return deals
}

function extractGenericDeals($: cheerio.CheerioAPI, url: string): PromotionDeal[] {
  const deals: PromotionDeal[] = []

  // Try to find any structured deal-like content
  const genericSelectors = [
    'article',
    '.card',
    '.product',
    'div[class*="item"]'
  ]

  for (const selector of genericSelectors) {
    const items = $(selector).slice(0, 20) // Limit to first 20 items
    items.each((_, element) => {
      const $item = $(element)
      const deal = extractDealInfo($item, url)
      if (deal.title && deal.title.length > 5) { // Only add if meaningful title
        deals.push(deal)
      }
    })
    if (deals.length >= 10) break // Stop after finding 10 deals
  }

  return deals
}

