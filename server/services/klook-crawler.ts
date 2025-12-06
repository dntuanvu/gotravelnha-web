import { chromium } from 'playwright'
import * as cheerio from 'cheerio'
import prisma from '~/server/utils/prisma'

const BASE_URL = 'https://www.klook.com'

export interface KlookCrawlRequest {
  type?: 'activities' | 'promos' | 'hotels' | 'all'
  categories?: string[]
  locations?: string[]
  maxItems?: number
  jobId?: string
}

export interface KlookActivity {
  title: string
  description?: string
  price?: number
  originalPrice?: number
  currency?: string
  image?: string
  link?: string
  location?: string
  rating?: number
  reviewCount?: number
  category?: string
  metadata?: Record<string, any>
}

export interface KlookPromoCode {
  promoCode: string
  promoCodeDescription?: string
  affiliateDescription?: string
  discountDescription?: string
  termsAndConditions?: string
  validUntil: Date
  redeemFrom?: Date
  redeemBefore?: Date
  applicablePlatforms?: string
  timeZone?: string
  applicableToResidentsOf?: string
  notApplicableToResidentsOf?: string
  metadata?: Record<string, any>
}

export interface KlookHotelDeal {
  hotelId: string
  hotelName: string
  dealCategory?: string
  starRating?: number
  originalPrice: number
  discountedPrice: number
  currency?: string
  savings?: number
  savingsPercent?: number
  affiliateLink: string
  metadata?: Record<string, any>
}

/**
 * Klook Background Crawler Service
 * Crawls activities, promo codes, and hotel deals
 */
export async function crawlKlook(request: KlookCrawlRequest = {}) {
  const {
    type = 'all',
    categories = [],
    locations = ['Singapore'],
    maxItems = 50,
    jobId
  } = request

  console.log('🕷️ Starting Klook crawl...')
  console.log(`   Config: type=${type}, categories=${categories.join(',')}, locations=${locations.join(',')}, maxItems=${maxItems}`)

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
    const results: {
      activities: KlookActivity[]
      promoCodes: KlookPromoCode[]
      hotels: KlookHotelDeal[]
    } = {
      activities: [],
      promoCodes: [],
      hotels: []
    }

    // Crawl based on type
    if (type === 'all' || type === 'activities') {
      console.log('📄 Crawling Klook activities...')
      try {
        const activities = await crawlKlookActivities(page, categories, locations, maxItems)
        results.activities = activities
        console.log(`✅ Found ${activities.length} activities`)
      } catch (error: any) {
        console.error('❌ Error crawling activities:', error.message)
      }
    }

    if (type === 'all' || type === 'promos') {
      console.log('📄 Crawling Klook promo codes...')
      try {
        const promos = await crawlKlookPromoCodes(page)
        results.promoCodes = promos
        console.log(`✅ Found ${promos.length} promo codes`)
      } catch (error: any) {
        console.error('❌ Error crawling promo codes:', error.message)
      }
    }

    if (type === 'all' || type === 'hotels') {
      console.log('📄 Crawling Klook hotel deals...')
      try {
        const hotels = await crawlKlookHotels(page, locations, maxItems)
        results.hotels = hotels
        console.log(`✅ Found ${hotels.length} hotel deals`)
      } catch (error: any) {
        console.error('❌ Error crawling hotels:', error.message)
      }
    }

    // Store data in database
    const stored = {
      activities: 0,
      promoCodes: 0,
      hotels: 0
    }

    if (results.activities.length > 0) {
      stored.activities = await storeKlookActivities(results.activities, jobId)
    }

    if (results.promoCodes.length > 0) {
      stored.promoCodes = await storeKlookPromoCodes(results.promoCodes, jobId)
    }

    if (results.hotels.length > 0) {
      stored.hotels = await storeKlookHotels(results.hotels, jobId)
    }

    const total = results.activities.length + results.promoCodes.length + results.hotels.length
    const totalStored = stored.activities + stored.promoCodes + stored.hotels

    console.log(`✅ Klook crawl complete: ${total} items extracted, ${totalStored} stored/updated`)

    return {
      success: true,
      total,
      stored: totalStored,
      breakdown: {
        activities: { found: results.activities.length, stored: stored.activities },
        promoCodes: { found: results.promoCodes.length, stored: stored.promoCodes },
        hotels: { found: results.hotels.length, stored: stored.hotels }
      },
      data: results
    }
  } catch (error: any) {
    console.error('❌ Klook crawl error:', error)
    throw error
  } finally {
    await browser.close()
  }
}

/**
 * Crawl Klook activities
 */
async function crawlKlookActivities(
  page: any,
  categories: string[],
  locations: string[],
  maxItems: number
): Promise<KlookActivity[]> {
  const activities: KlookActivity[] = []

  for (const location of locations) {
    try {
      // Navigate to activities page for location
      const url = `${BASE_URL}/search/?query=${encodeURIComponent(location)}`
      await page.goto(url, {
        waitUntil: 'networkidle',
        timeout: 60000
      })

      await page.waitForTimeout(3000)

      // Scroll to load more items
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight)
      })
      await page.waitForTimeout(2000)

      const content = await page.content()
      const $ = cheerio.load(content)

      // Extract activities
      const activitySelectors = [
        '.activity-item',
        '.product-card',
        '.klook-card',
        '[data-testid*="activity"]',
        '[class*="activity-card"]'
      ]

      for (const selector of activitySelectors) {
        const items = $(selector)
        if (items.length > 0) {
          items.slice(0, maxItems).each((_, element) => {
            const $item = $(element)
            const activity = extractActivityInfo($item)
            if (activity.title) {
              activities.push({
                ...activity,
                location,
                metadata: {
                  ...activity.metadata,
                  crawledAt: new Date().toISOString()
                }
              })
            }
          })
          break
        }
      }
    } catch (error: any) {
      console.error(`Error crawling activities for ${location}:`, error.message)
    }
  }

  return activities.slice(0, maxItems)
}

/**
 * Extract activity information from HTML element
 */
function extractActivityInfo($item: cheerio.Cheerio<any>): KlookActivity {
  const title = $item.find('h2, h3, .title, [class*="title"]').first().text().trim()

  const priceText = $item.find('.price, [class*="price"], .amount').first().text().trim()
  const priceMatch = priceText.match(/(\d+[,\.]?\d*)/)
  const price = priceMatch ? parseFloat(priceMatch[1].replace(',', '')) : undefined

  let image = $item.find('img').first().attr('src') || $item.find('img').first().attr('data-src')
  if (image && !image.startsWith('http')) {
    image = image.startsWith('//') ? `https:${image}` : `${BASE_URL}${image}`
  }

  let link = $item.find('a').first().attr('href')
  if (link && !link.startsWith('http')) {
    link = link.startsWith('//') ? `https:${link}` : `${BASE_URL}${link}`
  }

  const ratingText = $item.find('.rating, [class*="rating"], [class*="star"]').first().text().trim()
  const ratingMatch = ratingText.match(/(\d+\.?\d*)/)
  const rating = ratingMatch ? parseFloat(ratingMatch[1]) : undefined

  const reviewText = $item.find('.reviews, [class*="review"]').first().text().trim()
  const reviewMatch = reviewText.match(/(\d+)/)
  const reviewCount = reviewMatch ? parseInt(reviewMatch[1]) : undefined

  const description = $item.find('.description, p, [class*="desc"]').first().text().trim()

  return {
    title,
    description: description || undefined,
    price,
    currency: 'SGD', // Default, can be extracted if available
    image: image || undefined,
    link: link || undefined,
    rating,
    reviewCount,
    metadata: {}
  }
}

/**
 * Crawl Klook promo codes
 * Note: This may require affiliate portal access or manual export
 */
async function crawlKlookPromoCodes(page: any): Promise<KlookPromoCode[]> {
  const promoCodes: KlookPromoCode[] = []

  try {
    // Try to access promo codes page
    // Note: This might require affiliate portal login
    const url = `${BASE_URL}/promo/`
    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 60000
    })

    await page.waitForTimeout(3000)

    const content = await page.content()
    const $ = cheerio.load(content)

    // Extract promo codes
    const promoSelectors = [
      '.promo-code',
      '.promo-item',
      '[data-promo]',
      '[class*="promo"]'
    ]

    for (const selector of promoSelectors) {
      const items = $(selector)
      if (items.length > 0) {
        items.each((_, element) => {
          const $item = $(element)
          const promo = extractPromoCodeInfo($item)
          if (promo.promoCode) {
            promoCodes.push(promo)
          }
        })
        break
      }
    }

    // If no promos found via scraping, return empty
    // In production, this could:
    // 1. Use affiliate portal API
    // 2. Import from exported CSV
    // 3. Use webhook notifications
  } catch (error: any) {
    console.log('⚠️ Could not scrape promo codes (may require affiliate access):', error.message)
  }

  return promoCodes
}

/**
 * Extract promo code information
 */
function extractPromoCodeInfo($item: cheerio.Cheerio<any>): KlookPromoCode {
  const promoCode = $item.find('.code, [class*="code"]').first().text().trim().toUpperCase()
  const description = $item.find('.description, [class*="desc"]').first().text().trim()
  const discount = $item.find('.discount, [class*="discount"]').first().text().trim()

  // Default valid until (30 days from now)
  const validUntil = new Date()
  validUntil.setDate(validUntil.getDate() + 30)

  return {
    promoCode: promoCode || `PROMO-${Date.now()}`,
    promoCodeDescription: description || undefined,
    discountDescription: discount || undefined,
    validUntil,
    timeZone: 'Asia/Singapore',
    metadata: {}
  }
}

/**
 * Crawl Klook hotel deals
 */
async function crawlKlookHotels(
  page: any,
  locations: string[],
  maxItems: number
): Promise<KlookHotelDeal[]> {
  const hotels: KlookHotelDeal[] = []

  for (const location of locations) {
    try {
      const url = `${BASE_URL}/hotels/?city=${encodeURIComponent(location)}`
      await page.goto(url, {
        waitUntil: 'networkidle',
        timeout: 60000
      })

      await page.waitForTimeout(3000)

      const content = await page.content()
      const $ = cheerio.load(content)

      // Extract hotel deals
      const hotelSelectors = [
        '.hotel-card',
        '.property-card',
        '[data-testid*="hotel"]',
        '[class*="hotel-card"]'
      ]

      for (const selector of hotelSelectors) {
        const items = $(selector)
        if (items.length > 0) {
          items.slice(0, maxItems).each((_, element) => {
            const $item = $(element)
            const hotel = extractHotelInfo($item, location)
            if (hotel.hotelName) {
              hotels.push(hotel)
            }
          })
          break
        }
      }
    } catch (error: any) {
      console.error(`Error crawling hotels for ${location}:`, error.message)
    }
  }

  return hotels.slice(0, maxItems)
}

/**
 * Extract hotel deal information
 */
function extractHotelInfo($item: cheerio.Cheerio<any>, location: string): KlookHotelDeal {
  const hotelName = $item.find('h2, h3, .name, [class*="name"]').first().text().trim()
  const hotelId = $item.attr('data-hotel-id') || `klook-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  const priceText = $item.find('.price, [class*="price"]').first().text().trim()
  const priceMatch = priceText.match(/(\d+[,\.]?\d*)/)
  const discountedPrice = priceMatch ? parseFloat(priceMatch[1].replace(',', '')) : 0

  const originalPriceText = $item.find('.original-price, [class*="original"]').first().text().trim()
  const originalPriceMatch = originalPriceText.match(/(\d+[,\.]?\d*)/)
  const originalPrice = originalPriceMatch ? parseFloat(originalPriceMatch[1].replace(',', '')) : discountedPrice

  const savings = originalPrice - discountedPrice
  const savingsPercent = originalPrice > 0 ? (savings / originalPrice) * 100 : 0

  let affiliateLink = $item.find('a').first().attr('href')
  if (affiliateLink && !affiliateLink.startsWith('http')) {
    affiliateLink = affiliateLink.startsWith('//') ? `https:${affiliateLink}` : `${BASE_URL}${affiliateLink}`
  }

  const starRatingText = $item.find('.stars, [class*="star"]').first().text().trim()
  const starMatch = starRatingText.match(/(\d+)/)
  const starRating = starMatch ? parseInt(starMatch[1]) : undefined

  return {
    hotelId,
    hotelName,
    originalPrice,
    discountedPrice,
    currency: 'SGD',
    savings,
    savingsPercent,
    starRating,
    affiliateLink: affiliateLink || `${BASE_URL}/hotels/`,
    metadata: {
      location,
      crawledAt: new Date().toISOString()
    }
  }
}

/**
 * Store activities in database
 * Note: We don't have a KlookActivity model, so we'll log for now
 */
async function storeKlookActivities(activities: KlookActivity[], jobId?: string): Promise<number> {
  // Since we don't have a KlookActivity table yet, we'll just log
  // In the future, we could create a table or store as metadata
  console.log(`   Storing ${activities.length} activities (activity storage not yet implemented)`)
  return 0
}

/**
 * Store promo codes in database
 */
async function storeKlookPromoCodes(promoCodes: KlookPromoCode[], jobId?: string): Promise<number> {
  let storedCount = 0

  for (const promo of promoCodes) {
    try {
      // Check if promo code already exists
      const existing = await prisma.klookPromoCode.findUnique({
        where: { promoCode: promo.promoCode }
      })

      if (existing) {
        // Update existing
        await prisma.klookPromoCode.update({
          where: { promoCode: promo.promoCode },
          data: {
            promoCodeDescription: promo.promoCodeDescription || existing.promoCodeDescription,
            affiliateDescription: promo.affiliateDescription || existing.affiliateDescription,
            discountDescription: promo.discountDescription || existing.discountDescription,
            termsAndConditions: promo.termsAndConditions || existing.termsAndConditions,
            validUntil: promo.validUntil,
            redeemFrom: promo.redeemFrom || existing.redeemFrom,
            redeemBefore: promo.redeemBefore || existing.redeemBefore,
            applicablePlatforms: promo.applicablePlatforms || existing.applicablePlatforms,
            timeZone: promo.timeZone || existing.timeZone,
            isActive: promo.validUntil > new Date()
          }
        })
      } else {
        // Create new
        await prisma.klookPromoCode.create({
          data: {
            promoCode: promo.promoCode,
            promoCodeDescription: promo.promoCodeDescription || '',
            affiliateDescription: promo.affiliateDescription || '',
            discountDescription: promo.discountDescription || '',
            termsAndConditions: promo.termsAndConditions || '',
            validUntil: promo.validUntil,
            redeemFrom: promo.redeemFrom || promo.validUntil,
            redeemBefore: promo.redeemBefore || promo.validUntil,
            applicablePlatforms: promo.applicablePlatforms || 'All platforms',
            timeZone: promo.timeZone || 'Asia/Singapore',
            isActive: promo.validUntil > new Date()
          }
        })
      }

      storedCount++
    } catch (error: any) {
      console.error(`Error storing promo code "${promo.promoCode}":`, error.message)
    }
  }

  return storedCount
}

/**
 * Store hotel deals in database
 */
async function storeKlookHotels(hotels: KlookHotelDeal[], jobId?: string): Promise<number> {
  let storedCount = 0

  for (const hotel of hotels) {
    try {
      // Check if hotel already exists
      const existing = await prisma.klookHotelDeal.findUnique({
        where: { hotelId: hotel.hotelId }
      })

      if (existing) {
        // Update existing
        await prisma.klookHotelDeal.update({
          where: { hotelId: hotel.hotelId },
          data: {
            hotelName: hotel.hotelName,
            dealCategory: hotel.dealCategory || existing.dealCategory,
            starRating: hotel.starRating || existing.starRating,
            originalPrice: hotel.originalPrice,
            discountedPrice: hotel.discountedPrice,
            currency: hotel.currency || existing.currency,
            savings: hotel.savings,
            savingsPercent: hotel.savingsPercent,
            affiliateLink: hotel.affiliateLink,
            isActive: true
          }
        })
      } else {
        // Create new
        await prisma.klookHotelDeal.create({
          data: {
            hotelId: hotel.hotelId,
            hotelName: hotel.hotelName,
            dealCategory: hotel.dealCategory || 'General',
            starRating: hotel.starRating,
            originalPrice: hotel.originalPrice,
            discountedPrice: hotel.discountedPrice,
            currency: hotel.currency || 'SGD',
            savings: hotel.savings,
            savingsPercent: hotel.savingsPercent,
            affiliateLink: hotel.affiliateLink,
            isActive: true
          }
        })
      }

      storedCount++
    } catch (error: any) {
      console.error(`Error storing hotel "${hotel.hotelName}":`, error.message)
    }
  }

  return storedCount
}

