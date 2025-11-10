import { defineEventHandler, readBody } from 'h3'
import type { H3Event } from 'h3'
import { chromium } from 'playwright'
import * as cheerio from 'cheerio'
import { createError } from 'h3'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'
import prisma from '~/server/utils/prisma'

const db = prisma as any

interface CrawlRequest {
  fullCrawl?: boolean
  maxPages?: number
}

interface EventData {
  id: string
  title: string
  description?: string
  price?: string
  originalPrice?: string
  image?: string
  category?: string
  location?: string
  rating?: number
  link?: string
  validFrom?: string
  validTo?: string
  duration?: string
  ageRestriction?: string
  cancellation?: string
  lastUpdated: string
  gallery?: string[]
  options?: TicketOption[]
}

interface TicketOption {
  name?: string
  code?: string
  priceText?: string
  priceAmount?: number
  originalPriceText?: string
  originalPriceAmount?: number
  validity?: string
  details?: string
}

// In-memory cache for quick access
let eventsCache: EventData[] = []
let cacheTimestamp: number = 0

const CACHE_DURATION = 1000 * 60 * 60 * 6 // 6 hours
const DATA_DIR = join(process.cwd(), 'data')
const PUBLIC_DATA_DIR = join(process.cwd(), 'public', 'data')
const EVENTS_FILE = join(DATA_DIR, 'attractionsg-events.json')
const PUBLIC_EVENTS_FILE = join(PUBLIC_DATA_DIR, 'attractionsg-events.json')

function getRuntimeConfig(event?: H3Event) {
  try {
    // @ts-ignore - useRuntimeConfig is auto provided by Nitro at runtime
    if (typeof useRuntimeConfig === 'function') {
      // @ts-ignore
      return useRuntimeConfig(event)
    }
  } catch (error) {
    // ignore, we'll fall back to process.env
  }

  return {
    ATTRACTIONSG_EMAIL: process.env.ATTRACTIONSG_EMAIL,
    ATTRACTIONSG_PASSWORD: process.env.ATTRACTIONSG_PASSWORD,
    ATTRACTIONSG_BACKGROUND_SYNC: process.env.ATTRACTIONSG_BACKGROUND_SYNC,
    ATTRACTIONSG_SYNC_INTERVAL: process.env.ATTRACTIONSG_SYNC_INTERVAL,
    ATTRACTIONSG_CRAWLER_WEBHOOK: process.env.ATTRACTIONSG_CRAWLER_WEBHOOK,
    ATTRACTIONSG_CRAWLER_WEBHOOK_SECRET: process.env.ATTRACTIONSG_CRAWLER_WEBHOOK_SECRET
  }
}

export async function runAttractionsgCrawl(body: CrawlRequest = {}, event?: H3Event) {
  return executeCrawl(body, event)
}

async function executeCrawl(body: CrawlRequest, event?: H3Event) {
  // Load cache from disk or database if needed
  if (eventsCache.length === 0 || (Date.now() - cacheTimestamp) > CACHE_DURATION) {
    await loadCacheFromDisk()

    if (eventsCache.length === 0) {
      await loadCacheFromDatabase()
    }
  }

  // If cache is still valid and not full crawl requested, return cached data
  if (!body.fullCrawl && eventsCache.length > 0 && (Date.now() - cacheTimestamp) < CACHE_DURATION) {
    return {
      success: true,
      cached: true,
      total: eventsCache.length,
      timestamp: new Date(cacheTimestamp).toISOString()
    }
  }

  const config = getRuntimeConfig(event)
  const isServerless = process.env.VERCEL || process.env.NETLIFY

  if (isServerless) {
    const webhook = config.ATTRACTIONSG_CRAWLER_WEBHOOK || process.env.ATTRACTIONSG_CRAWLER_WEBHOOK

    if (webhook) {
      console.log('🌐 Serverless environment detected - delegating crawl to webhook')
      try {
        const fetch = await import('ofetch')
        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        }
        if (config.ATTRACTIONSG_CRAWLER_WEBHOOK_SECRET) {
          headers.Authorization = `Bearer ${config.ATTRACTIONSG_CRAWLER_WEBHOOK_SECRET}`
        }

        await fetch.$fetch(webhook, {
          method: 'POST',
          body: {
            fullCrawl: body.fullCrawl ?? false,
            maxPages: body.maxPages || 20
          },
          headers
        })
        console.log('✅ Delegated crawl webhook triggered')
      } catch (error) {
        console.error('❌ Failed to call crawler webhook:', error)
      }
    } else {
      console.log('🌐 Serverless environment detected - returning cached/database data only')
    }

    if (eventsCache.length === 0) {
      await loadCacheFromDatabase()
    }

    return {
      success: true,
      cached: true,
      total: eventsCache.length,
      timestamp: cacheTimestamp ? new Date(cacheTimestamp).toISOString() : new Date().toISOString(),
      message: webhook
        ? 'Delegated crawl to webhook. Ensure external worker runs the Playwright crawler.'
        : 'Playwright not available on serverless. Using cached/database data. Run crawler via GitHub Action, local job, or external worker to refresh.'
    }
  }

  // Perform fresh crawl (local/background)
  console.log('🕷️ Starting AttractionsSG crawl...')

  const email = config.ATTRACTIONSG_EMAIL || 'enjoytravelticket@gmail.com'
  const password = config.ATTRACTIONSG_PASSWORD || 'Truc1@3456101112'
  const maxPages = body.maxPages || 20

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
    console.log('🔐 Logging into AttractionsSG...')
    await page.goto('https://mobile.attractionsg.com/', {
      waitUntil: 'networkidle',
      timeout: 30000
    })

    await page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 10000 })
    await page.fill('input[type="email"], input[name="email"]', email)
    await page.fill('input[type="password"], input[name="password"]', password)
    await page.click('button[type="submit"], input[type="submit"]')
    await page.waitForTimeout(3000)
    console.log('✅ Successfully logged in')

    const allEvents: EventData[] = []

    console.log('📄 Crawling main page...')
    const mainContent = await page.content()
    const mainEvents = extractEvents(mainContent)
    allEvents.push(...mainEvents)
    console.log(`✅ Found ${mainEvents.length} events on main page`)

    const categories = ['attractions', 'tours', 'theater', 'museums', 'parks']

    for (const category of categories) {
      try {
        console.log(`📄 Crawling category: ${category}...`)
        const categoryUrl = `https://mobile.attractionsg.com/category/${category}`
        await page.goto(categoryUrl, {
          waitUntil: 'networkidle',
          timeout: 30000
        })
        await page.waitForTimeout(2000)

        const content = await page.content()
        const categoryEvents = extractEvents(content)
        allEvents.push(...categoryEvents)
        console.log(`✅ Found ${categoryEvents.length} events in ${category}`)
      } catch (err) {
        console.error(`⚠️ Error crawling category ${category}:`, err)
      }
    }

    if (body.fullCrawl) {
      const searchTerms = ['singapore', 'zoo', 'aquarium', 'museum', 'garden', 'sentosa', 'universal', 'flyer']

      for (const term of searchTerms) {
        try {
          console.log(`🔍 Searching for: ${term}...`)
          const searchUrl = `https://mobile.attractionsg.com/search?q=${encodeURIComponent(term)}`
          await page.goto(searchUrl, {
            waitUntil: 'networkidle',
            timeout: 30000
          })
          await page.waitForTimeout(2000)

          const content = await page.content()
          const searchEvents = extractEvents(content)
          allEvents.push(...searchEvents)
          console.log(`✅ Found ${searchEvents.length} events for "${term}"`)
        } catch (err) {
          console.error(`⚠️ Error searching for ${term}:`, err)
        }
      }
    }

    const uniqueEvents = deduplicateEvents(allEvents)

    console.log(`✅ Total unique events found: ${uniqueEvents.length}`)

    const maxDetailEvents = body.maxPages || 30
    const detailEnrichmentLimit = body.fullCrawl ? maxDetailEvents : Math.min(maxDetailEvents, 40)
    const enrichmentTargets = body.fullCrawl
      ? uniqueEvents.slice(0, detailEnrichmentLimit)
      : uniqueEvents.filter(shouldFetchDetails).slice(0, detailEnrichmentLimit)

    if (enrichmentTargets.length > 0) {
      console.log(`📋 Enriching ${enrichmentTargets.length} events with detailed data...`)
      await enrichEventsWithDetails(page, enrichmentTargets)
    }

    eventsCache = uniqueEvents

    cacheTimestamp = Date.now()

    await persistEventsToDatabase(eventsCache)
    await saveCacheToDisk(eventsCache)

    return {
      success: true,
      total: eventsCache.length,
      cached: false,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('❌ Error during AttractionsSG crawl:', error)
    throw error
  } finally {
    await browser.close()
  }
}

export default defineEventHandler(async (event) => {
  try {
    const body = (await readBody(event)) as CrawlRequest
    return await executeCrawl(body, event)
  } catch (error: any) {
    console.error('Crawl error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to crawl AttractionsSG'
    })
  }
})

async function crawlEventDetails(page: any, event: EventData): Promise<EventData> {
  try {
    console.log(`🔍 Crawling details for: ${event.title}`)
    await page.goto(event.link!, {
      waitUntil: 'networkidle',
      timeout: 30000
    })
    await page.waitForTimeout(3000) // Wait longer for images to load
    
    const content = await page.content()
    const $ = cheerio.load(content)
    
    const galleryImages = extractGalleryImages($)
    if (galleryImages.length > 0) {
      console.log(`🖼️ Found ${galleryImages.length} image(s) for "${event.title}"`)
    }
    let detailImage = galleryImages.length > 0 ? galleryImages[0] : event.image
    const detailPrices = extractPriceInfo($, $('body'))
    const ticketOptions = extractTicketOptions($)
    if (ticketOptions.length > 0) {
      console.log(`🎟️ Found ${ticketOptions.length} ticket option(s) for "${event.title}"`)
    }
    
    // Try multiple description selectors
    const descSelectors = [
      '.description',
      '.detail-description',
      '.product-description',
      '[class*="description"]',
      '.content',
      '[class*="content"]',
      '.details',
      '[class*="details"]',
      'p[class*="desc"]',
      'p:not(:empty)'
    ]
    
    let description = event.description
    for (const selector of descSelectors) {
      const desc = $(selector).first()
      if (desc.length && desc.text().trim().length > 50) {
        description = desc.text().trim()
        break
      }
    }
    
    // Extract detailed information
    const detailPriceText = detailPrices.priceText || extractPrice($('body'))
    const detailOriginalText = detailPrices.originalPriceText || event.originalPrice

    const detailedEvent: EventData = {
      ...event,
      description: description,
      image: detailImage,
      price: detailPriceText || event.price,
      originalPrice: detailOriginalText || event.originalPrice,
      rating: extractRating($('body')) || event.rating,
      location: extractLocation($('body')) || event.location,
      duration: $('.duration, [class*="duration"]').first().text().trim(),
      ageRestriction: $('.age-restriction, [class*="age"]').first().text().trim(),
      cancellation: $('.cancellation, [class*="cancellation"]').first().text().trim(),
      validFrom: $('.valid-from, [class*="valid"]').first().text().trim(),
      validTo: $('.valid-to, [class*="valid-to"]').first().text().trim(),
      gallery: galleryImages.length > 0 ? galleryImages : event.gallery,
      options: ticketOptions.length > 0 ? ticketOptions : event.options
    }
    
    return detailedEvent
  } catch (error) {
    console.error('Error crawling event details:', error)
    return event
  }
}

function extractEvents(html: string): EventData[] {
  const $ = cheerio.load(html)
  const events: EventData[] = []

  // Try multiple selectors
  const selectors = [
    'div.ticket-item',
    'div.product-item',
    'article.ticket',
    'div.card',
    'div[class*="ticket"]',
    'div[class*="product"]',
    'div.item',
    'li.ticket',
    'li.product'
  ]

  for (const selector of selectors) {
    const items = $(selector)
    
    if (items.length > 0) {
      console.log(`📦 Found ${items.length} items with selector: ${selector}`)
      
      items.each((_, element) => {
        const $item = $(element)
        
        const rawTitle = $item.find('h2, h3, h4, .title, [class*="title"], a').first().text().trim()
        
        if (!rawTitle) return // Skip if no title
        
        // Clean title - remove price and extra info that might be in the title
        const title = rawTitle.split('\n')[0].trim()
        
        // Generate unique ID from title and link
        const link = $item.find('a').first().attr('href') || ''
        const id = generateEventId(title, link)
        
        // Extract and fix image URL - try multiple attributes and sources
        const imgTag = $item.find('img').first()
        const rawImage = imgTag.attr('src') || 
                        imgTag.attr('data-src') ||
                        imgTag.attr('data-lazy-src') ||
                        imgTag.attr('data-original') ||
                        imgTag.attr('srcset')?.split(',')[0]?.trim().split(' ')[0]
        const image = normalizeUrl(rawImage)
        
        if (image && !image.includes('undefined')) {
          console.log(`🖼️ Found image for "${title}": ${image}`)
        }
        
        // Fix link URL
        const normalizedLink = normalizeUrl(link)

        const priceInfo = extractPriceInfo($, $item)
        const priceText = priceInfo.priceText || extractPrice($item)
        const originalText = priceInfo.originalPriceText || $item.find('.original-price, .old-price, [class*="original"]').first().text().trim()
        const event: EventData = {
          id,
          title,
          description: $item.find('.description, p, [class*="desc"]').first().text().trim(),
          price: priceText || undefined,
          originalPrice: originalText || undefined,
          image,
          category: extractCategory($item),
          location: extractLocation($item),
          rating: extractRating($item),
          link: normalizedLink,
          lastUpdated: new Date().toISOString()
        }

        events.push(event)
      })
      
      if (events.length > 0) break
    }
  }

  return events
}

function deduplicateEvents(events: EventData[]): EventData[] {
  const seen = new Set<string>()
  const unique: EventData[] = []
  
  for (const event of events) {
    const key = `${event.title.toLowerCase()}-${event.link}`
    if (!seen.has(key)) {
      seen.add(key)
      unique.push(event)
    }
  }
  
  return unique
}

function generateEventId(title: string, link: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  
  const linkHash = link.length > 0 ? link.split('/').pop()?.split('?')[0] : ''
  
  return `${slug}-${linkHash || Date.now().toString().slice(-6)}`
}

interface PriceInfo {
  priceText?: string
  priceAmount?: number
  originalPriceText?: string
  originalPriceAmount?: number
}

function extractPriceInfo($: cheerio.CheerioAPI, $context: cheerio.Cheerio<any>): PriceInfo {
  const priceCandidates: PriceInfo[] = []
  const originalCandidates: PriceInfo[] = []
  const seen = new Set<string>()

  $context.find('*').each((_, element) => {
    const text = $(element).text().trim().replace(/\s+/g, ' ')
    if (!text || text.length > 80) return
    if (seen.has(text)) return
    if (!/(\$|SGD|S\$)/i.test(text)) return
    if (/credit|top up|total/i.test(text)) return

    const amountMatch = text.match(/(?:SGD|S\$|\$)\s*([0-9][0-9.,]*)/)
    if (!amountMatch) return

    const amount = parseFloat(amountMatch[1].replace(/,/g, ''))
    if (isNaN(amount)) return

    seen.add(text)

    const candidate: PriceInfo = {
      priceText: text,
      priceAmount: amount
    }

    const tag = (((element as any).tagName || (element as any).name) || '').toLowerCase()
    const className = ($(element).attr('class') || '').toLowerCase()

    if (
      /RP|UP|ORIGINAL|RETAIL|WAS/i.test(text) ||
      tag === 'del' ||
      tag === 's' ||
      className.includes('strike') ||
      className.includes('line-through')
    ) {
      originalCandidates.push({
        originalPriceText: text,
        originalPriceAmount: amount
      })
    } else {
      priceCandidates.push(candidate)
    }
  })

  const pickLowest = (candidates: PriceInfo[]) =>
    candidates.slice().sort((a, b) => (a.priceAmount ?? Infinity) - (b.priceAmount ?? Infinity))[0]

  const pickHighest = (candidates: PriceInfo[]) =>
    candidates.slice().sort((a, b) => (b.originalPriceAmount ?? -Infinity) - (a.originalPriceAmount ?? -Infinity))[0]

  const priceCandidate = pickLowest(priceCandidates)
  const originalCandidate =
    originalCandidates.length > 0
      ? pickHighest(originalCandidates)
      : priceCandidates.length > 1
        ? pickHighest(priceCandidates.map(c => ({ originalPriceText: c.priceText, originalPriceAmount: c.priceAmount })))
        : undefined

  return {
    priceText: priceCandidate?.priceText,
    priceAmount: priceCandidate?.priceAmount,
    originalPriceText: originalCandidate?.originalPriceText,
    originalPriceAmount: originalCandidate?.originalPriceAmount
  }
}

function extractPrice($item: cheerio.Cheerio<any>): string | undefined {
  const patterns = [
    '.price',
    '[class*="price"]',
    '.amount',
    '[class*="amount"]',
    'span:contains("$")',
    'span:contains("SGD")',
    'span:contains("S$")'
  ]

  for (const pattern of patterns) {
    const priceElement = $item.find(pattern).first()
    const priceText = priceElement.text().trim()
    
    if (priceText && /[\$\d]/.test(priceText)) {
      return priceText
    }
  }

  return undefined
}

function extractCategory($item: cheerio.Cheerio<any>): string | undefined {
  const categoryElement = $item.find('.category, [class*="category"], .tag').first()
  return categoryElement.text().trim() || undefined
}

function extractLocation($item: cheerio.Cheerio<any>): string | undefined {
  const locationElement = $item.find('.location, [class*="location"], .venue').first()
  return locationElement.text().trim() || undefined
}

function extractRating($item: cheerio.Cheerio<any>): number | undefined {
  const ratingText = $item.find('.rating, [class*="rating"]').first().text().trim()
  const rating = parseFloat(ratingText)
  return isNaN(rating) ? undefined : rating
}

function shouldFetchDetails(event: EventData): boolean {
  if (!event.link || !event.link.startsWith('https://')) return false
  if (!event.image) return true

  const priceAmount = parsePriceAmount(event.price)
  const originalAmount = parsePriceAmount(event.originalPrice)
  if (!event.originalPrice || !originalAmount || !priceAmount || priceAmount === originalAmount) {
    return true
  }

  const lower = event.image.toLowerCase()
  const badIndicators = ['placeholder', 'default', 'no-image', 'missing', 'blank']
  return badIndicators.some(indicator => lower.includes(indicator))
}

async function enrichEventsWithDetails(page: any, events: EventData[]) {
  for (const event of events) {
    try {
      const detailed = await crawlEventDetails(page, event)
      mergeEventData(event, detailed)
      console.log(`✅ Enriched event: ${event.title}`)
      await page.waitForTimeout(800)
    } catch (error) {
      console.error(`⚠️ Failed to enrich event ${event.title}:`, error)
    }
  }
}

function mergeEventData(target: EventData, source: EventData) {
  target.description = source.description || target.description
  target.price = source.price || target.price
  target.originalPrice = source.originalPrice || target.originalPrice
  target.image = source.image || target.image
  target.category = source.category || target.category
  target.location = source.location || target.location
  target.rating = source.rating ?? target.rating
  target.duration = source.duration || target.duration
  target.ageRestriction = source.ageRestriction || target.ageRestriction
  target.cancellation = source.cancellation || target.cancellation
  target.validFrom = source.validFrom || target.validFrom
  target.validTo = source.validTo || target.validTo
  target.gallery = source.gallery || target.gallery
  target.lastUpdated = source.lastUpdated || target.lastUpdated
  target.options = source.options || target.options
}

function extractGalleryImages($: cheerio.CheerioAPI): string[] {
  const selectors = [
    '.main-image img',
    '.product-image img',
    '.hero-image img',
    '.detail-image img',
    '.banner-image img',
    'img[class*="main"]',
    'img[class*="hero"]',
    'img[class*="detail"]',
    'img[class*="banner"]',
    '.image-gallery img',
    '.slider img',
    'picture img',
    'img'
  ]

  const images = new Set<string>()

  for (const selector of selectors) {
    $(selector).each((_, element) => {
      const img = $(element)
      const src =
        img.attr('src') ||
        img.attr('data-src') ||
        img.attr('data-lazy-src') ||
        img.attr('data-original') ||
        img.attr('data-lazy')

      if (src && !src.includes('placeholder') && !src.includes('logo') && !src.includes('icon')) {
        const normalized = normalizeUrl(src)
        if (normalized) {
          images.add(normalized)
        }
      }
    })

    if (images.size > 0) {
      break
    }
  }

  return Array.from(images)
}

function extractTicketOptions($: cheerio.CheerioAPI): TicketOption[] {
  const options: TicketOption[] = []

  $('.tickets-wrapper .row').each((_, row) => {
    const $row = $(row)
    const infoCol = $row.children().first()
    const priceCol = $row.children().eq(1)
    const actionCol = $row.children().eq(2)

    const name = infoCol.find('b').first().text().trim()
    const code = infoCol.find('i').first().text().trim()
    const originalPriceText = infoCol.find('span').first().text().trim()
    const validityText = infoCol.find('div').filter((_, el) => $(el).text().toLowerCase().includes('valid')).first().text().trim()

    const priceText = priceCol.text().trim()

    const details = (() => {
      const clone = infoCol.clone()
      clone.find('b, i, span, div').remove()
      return clone.text().trim().replace(/\s+/g, ' ')
    })()

    if (!name && !priceText) {
      return
    }

    const option: TicketOption = {
      name: name || undefined,
      code: code || undefined,
      priceText: priceText || undefined,
      priceAmount: parsePriceAmount(priceText),
      originalPriceText: originalPriceText || undefined,
      originalPriceAmount: parsePriceAmount(originalPriceText),
      validity: validityText || undefined,
      details: details || undefined
    }

    if (actionCol && actionCol.text().trim()) {
      option.details = [option.details, actionCol.text().trim().replace(/\s+/g, ' ')].filter(Boolean).join(' ')
    }

    options.push(option)
  })

  return options
}

async function persistEventsToDatabase(events: EventData[]) {
  if (!events.length) return

  try {
    const now = new Date()
    const seenIds = Array.from(new Set(events.map(event => event.id)))

    await db.attractionsgEvent.updateMany({
      where: {
        NOT: {
          id: {
            in: seenIds
          }
        }
      },
      data: {
        isActive: false
      }
    })

    for (const event of events) {
      try {
        const priceAmount = parsePriceAmount(event.price)
        const originalPriceAmount = parsePriceAmount(event.originalPrice)

        await db.attractionsgEvent.upsert({
          where: { id: event.id },
          update: {
            title: event.title,
            slug: event.id,
            description: event.description,
            priceText: event.price,
            priceAmount: priceAmount ?? null,
            originalPriceText: event.originalPrice,
            originalPriceAmount: originalPriceAmount ?? null,
            image: event.image,
            category: event.category,
            location: event.location,
            rating: typeof event.rating === 'number' ? event.rating : null,
            link: event.link,
            duration: event.duration,
            ageRestriction: event.ageRestriction,
            cancellation: event.cancellation,
            validFrom: event.validFrom,
            validTo: event.validTo,
            lastSeenAt: now,
            isActive: true,
            raw: event
          },
          create: {
            id: event.id,
            title: event.title,
            slug: event.id,
            description: event.description,
            priceText: event.price,
            priceAmount: priceAmount ?? null,
            originalPriceText: event.originalPrice,
            originalPriceAmount: originalPriceAmount ?? null,
            image: event.image,
            category: event.category,
            location: event.location,
            rating: typeof event.rating === 'number' ? event.rating : null,
            link: event.link,
            duration: event.duration,
            ageRestriction: event.ageRestriction,
            cancellation: event.cancellation,
            validFrom: event.validFrom,
            validTo: event.validTo,
            lastSeenAt: now,
            isActive: true,
            raw: event
          }
        })
      } catch (error) {
        console.error(`⚠️ Failed to upsert AttractionsSG event ${event.id}:`, error)
      }
    }

    console.log(`💾 Persisted ${events.length} AttractionsSG events to PostgreSQL`)
  } catch (error) {
    console.error('⚠️ Error persisting AttractionsSG events to database:', error)
  }
}

async function loadCacheFromDatabase() {
  try {
    const records = await db.attractionsgEvent.findMany({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' },
      take: 500 // reasonable upper bound for cache
    })

    if (records.length > 0) {
      eventsCache = records.map(mapDbEventToEventData)
      cacheTimestamp = Date.now()
      console.log(`✅ Loaded ${records.length} events from database cache`)
    }
  } catch (error) {
    console.error('⚠️ Error loading AttractionsSG events from database:', error)
  }
}

function mapDbEventToEventData(record: any): EventData {
  const raw = record.raw as EventData | undefined

  return {
    id: record.id,
    title: record.title,
    description: record.description ?? raw?.description,
    price: record.priceText ?? raw?.price,
    originalPrice: record.originalPriceText ?? raw?.originalPrice,
    image: record.image ?? raw?.image,
    category: record.category ?? raw?.category,
    location: record.location ?? raw?.location,
    rating: typeof record.rating === 'number' ? record.rating : raw?.rating,
    link: record.link ?? raw?.link,
    validFrom: record.validFrom ?? raw?.validFrom,
    validTo: record.validTo ?? raw?.validTo,
    duration: record.duration ?? raw?.duration,
    ageRestriction: record.ageRestriction ?? raw?.ageRestriction,
    cancellation: record.cancellation ?? raw?.cancellation,
    lastUpdated: record.updatedAt.toISOString(),
    gallery: raw?.gallery,
    options: (raw?.options as TicketOption[] | undefined) ?? undefined
  }
}

function parsePriceAmount(price?: string): number | undefined {
  if (!price) return undefined
  const numericMatch = price.replace(/[^0-9.,]/g, '').replace(/,/g, '')
  if (!numericMatch) return undefined
  const parsed = parseFloat(numericMatch)
  return isNaN(parsed) ? undefined : parsed
}

async function loadCacheFromDisk() {
  try {
    // Try public/data first (for deployment), then data/ (for local)
    const filesToTry = [
      { path: PUBLIC_EVENTS_FILE, name: 'public/data/attractionsg-events.json' },
      { path: EVENTS_FILE, name: 'data/attractionsg-events.json' }
    ]
    
    for (const fileInfo of filesToTry) {
      if (existsSync(fileInfo.path)) {
        const data = await readFile(fileInfo.path, 'utf-8')
        const parsed = JSON.parse(data)
        eventsCache = parsed.events || []
        cacheTimestamp = new Date(parsed.timestamp).getTime() || 0
        console.log(`✅ Loaded ${eventsCache.length} events from ${fileInfo.name}`)
        return
      }
    }
    
    console.log('⚠️ No cache file found in public/data/ or data/')
  } catch (error) {
    console.error('⚠️ Error loading cache from disk:', error)
  }
}

async function saveCacheToDisk(events: EventData[]) {
  try {
    if (!existsSync(DATA_DIR)) {
      await mkdir(DATA_DIR, { recursive: true })
    }
    
    const data = {
      events,
      timestamp: new Date().toISOString(),
      total: events.length
    }
    
    await writeFile(EVENTS_FILE, JSON.stringify(data, null, 2), 'utf-8')
    console.log(`✅ Saved ${events.length} events to disk cache`)
  } catch (error) {
    console.error('⚠️ Error saving cache to disk:', error)
  }
}

// Export cache getter for other APIs
export function getEventsCache(): EventData[] {
  return eventsCache
}

export function getCacheTimestamp(): number {
  return cacheTimestamp
}

function normalizeUrl(url?: string): string | undefined {
  if (!url) return undefined

  if (url.startsWith('data:')) {
    return url
  }

  if (url.startsWith('//')) {
    return `https:${url}`
  }
  
  // Already absolute URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // Add base URL for relative paths
  if (url.startsWith('/')) {
    return `https://mobile.attractionsg.com${url}`
  }
  
  // Add base URL for relative paths without leading slash
  return `https://mobile.attractionsg.com/${url}`
}
