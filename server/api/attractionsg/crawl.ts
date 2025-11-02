import { defineEventHandler, readBody } from 'h3'
import { chromium } from 'playwright'
import * as cheerio from 'cheerio'
import { createError } from 'h3'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'

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
}

// In-memory cache for quick access
let eventsCache: EventData[] = []
let cacheTimestamp: number = 0

const CACHE_DURATION = 1000 * 60 * 60 * 6 // 6 hours
const DATA_DIR = join(process.cwd(), 'data')
const EVENTS_FILE = join(DATA_DIR, 'attractionsg-events.json')

export default defineEventHandler(async (event) => {
  try {
    const body = (await readBody(event)) as CrawlRequest
    
    // Load cache from disk if available
    if (eventsCache.length === 0 || (Date.now() - cacheTimestamp) > CACHE_DURATION) {
      await loadCacheFromDisk()
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

    // MVP: On Vercel, only return cached data (Playwright doesn't work on serverless)
    if (process.env.VERCEL || process.env.NETLIFY) {
      console.log('🌐 Running on serverless platform - returning cached data only')
      return {
        success: true,
        cached: true,
        total: eventsCache.length,
        timestamp: new Date(cacheTimestamp).toISOString(),
        message: 'Playwright not available on serverless. Using pre-populated data. Run crawler locally to update data.'
      }
    }

    // Perform fresh crawl (local development only)
    console.log('🕷️ Starting AttractionsSG crawl...')
    
    const config = useRuntimeConfig()
    const email = config.ATTRACTIONSG_EMAIL || 'enjoytravelticket@gmail.com'
    const password = config.ATTRACTIONSG_PASSWORD || 'Truc1@3456101112'
    
    const maxPages = body.maxPages || 20

    // Always run in headless mode for background operation
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
      // Login
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
      
      // Crawl main page
      console.log('📄 Crawling main page...')
      const mainContent = await page.content()
      const mainEvents = extractEvents(mainContent)
      allEvents.push(...mainEvents)
      console.log(`✅ Found ${mainEvents.length} events on main page`)

      // Crawl all categories
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

      // Crawl search pages if full crawl requested
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

      // Remove duplicates based on title and link
      const uniqueEvents = deduplicateEvents(allEvents)
      
      console.log(`✅ Total unique events found: ${uniqueEvents.length}`)

      // Crawl detailed information for each event if fullCrawl is requested
      if (body.fullCrawl) {
        console.log('📋 Crawling detailed information...')
        const detailedEvents = []
        const maxDetailEvents = body.maxPages || 30 // Default to 30 events for detailed crawl
        
        for (const event of uniqueEvents.slice(0, maxDetailEvents)) {
          if (event.link && event.link.startsWith('https://')) {
            try {
              const detailedEvent = await crawlEventDetails(page, event)
              detailedEvents.push(detailedEvent)
              console.log(`✅ Detailed info for: ${event.title}`)
              await page.waitForTimeout(1000) // Increased rate limiting for stability
            } catch (err) {
              console.error(`⚠️ Error crawling details for ${event.title}:`, err)
              detailedEvents.push(event) // Use original if detail crawl fails
            }
          } else {
            detailedEvents.push(event)
          }
        }
        
        // Merge detailed events with remaining events
        const remainingEvents = uniqueEvents.slice(maxDetailEvents)
        eventsCache = [...detailedEvents, ...remainingEvents]
      } else {
        eventsCache = uniqueEvents
      }
      
      cacheTimestamp = Date.now()

      // Save to disk
      await saveCacheToDisk(eventsCache)

      await browser.close()

      return {
        success: true,
        total: eventsCache.length,
        cached: false,
        timestamp: new Date().toISOString()
      }

    } catch (error: any) {
      await browser.close()
      throw error
    }
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
    
    // Try multiple image selectors
    const imgSelectors = [
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
      'img'
    ]
    
    let detailImage = event.image
    for (const selector of imgSelectors) {
      const img = $(selector).first()
      if (img.length) {
        const src = img.attr('src') || img.attr('data-src') || img.attr('data-lazy-src')
        if (src && !src.includes('placeholder') && !src.includes('logo') && !src.includes('icon')) {
          detailImage = normalizeUrl(src)
          console.log(`✅ Found image: ${detailImage}`)
          break
        }
      }
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
    const detailedEvent: EventData = {
      ...event,
      description: description,
      image: detailImage,
      price: extractPrice($('body')) || event.price,
      rating: extractRating($('body')) || event.rating,
      location: extractLocation($('body')) || event.location,
      duration: $('.duration, [class*="duration"]').first().text().trim(),
      ageRestriction: $('.age-restriction, [class*="age"]').first().text().trim(),
      cancellation: $('.cancellation, [class*="cancellation"]').first().text().trim(),
      validFrom: $('.valid-from, [class*="valid"]').first().text().trim(),
      validTo: $('.valid-to, [class*="valid-to"]').first().text().trim()
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

        const event: EventData = {
          id,
          title,
          description: $item.find('.description, p, [class*="desc"]').first().text().trim(),
          price: extractPrice($item),
          originalPrice: $item.find('.original-price, .old-price, [class*="original"]').first().text().trim(),
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

async function loadCacheFromDisk() {
  try {
    if (existsSync(EVENTS_FILE)) {
      const data = await readFile(EVENTS_FILE, 'utf-8')
      const parsed = JSON.parse(data)
      eventsCache = parsed.events || []
      cacheTimestamp = new Date(parsed.timestamp).getTime() || 0
      console.log(`✅ Loaded ${eventsCache.length} events from cache`)
    }
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
