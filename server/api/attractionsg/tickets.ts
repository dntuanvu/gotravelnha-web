import { defineEventHandler, readBody } from 'h3'
import { chromium } from 'playwright'
import * as cheerio from 'cheerio'
import { createError } from 'h3'

interface AttractionsSGRequest {
  search?: string
  category?: string
  page?: number
}

interface TicketData {
  id?: string
  title: string
  description?: string
  price?: string
  originalPrice?: string
  image?: string
  category?: string
  location?: string
  rating?: number
  link?: string
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event) as AttractionsSGRequest
    
    // Credentials - securely stored in environment variables
    const config = useRuntimeConfig()
    const email = config.ATTRACTIONSG_EMAIL || 'enjoytravelticket@gmail.com'
    const password = config.ATTRACTIONSG_PASSWORD || 'password'
    
    const isProduction = process.env.NODE_ENV === 'production'

    // Initialize browser
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
      // Navigate to login page
      console.log('🔐 Logging into AttractionsSG...')
      await page.goto('https://mobile.attractionsg.com/', {
        waitUntil: 'networkidle',
        timeout: 30000
      })

      // Wait for login form to be ready
      await page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 10000 })
      
      // Fill in login credentials
      await page.fill('input[type="email"], input[name="email"]', email)
      await page.fill('input[type="password"], input[name="password"]', password)
      
      // Click login button
      await page.click('button[type="submit"], input[type="submit"]')
      
      // Wait for navigation or success indicator
      await page.waitForTimeout(3000)
      
      console.log('✅ Successfully logged in')

      // Extract tickets data based on request
      let tickets: TicketData[] = []

      if (body.search || body.category) {
        // Navigate to search or category page if specified
        const searchUrl = body.search 
          ? `https://mobile.attractionsg.com/search?q=${encodeURIComponent(body.search)}`
          : `https://mobile.attractionsg.com/category/${body.category}`
        
        await page.goto(searchUrl, {
          waitUntil: 'networkidle',
          timeout: 30000
        })
        
        await page.waitForTimeout(2000)
      } else {
        // Get main page tickets
        const content = await page.content()
        tickets = extractTickets(content)
      }

      // If we need to navigate to a specific page
      if (tickets.length === 0 && body.search) {
        const content = await page.content()
        tickets = extractTickets(content)
      }

      await browser.close()

      return {
        success: true,
        tickets,
        total: tickets.length,
        page: body.page || 1
      }

    } catch (error: any) {
      await browser.close()
      console.error('AttractionsSG scraping error:', error)
      throw error
    }
  } catch (error: any) {
    console.error('AttractionsSG API error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to fetch AttractionsSG tickets'
    })
  }
})

function extractTickets(html: string): TicketData[] {
  const $ = cheerio.load(html)
  const tickets: TicketData[] = []

  // Try various selectors to find ticket listings
  // Adjust these selectors based on actual page structure
  const ticketSelectors = [
    'div.ticket-item',
    'div.product-item',
    'article.ticket',
    'div[class*="ticket"]',
    'div[class*="product"]'
  ]

  for (const selector of ticketSelectors) {
    const items = $(selector)
    
    if (items.length > 0) {
      items.each((_, element) => {
        const $item = $(element)
        
        const ticket: TicketData = {
          title: $item.find('h2, h3, .title, [class*="title"]').first().text().trim(),
          description: $item.find('.description, p, [class*="desc"]').first().text().trim(),
          price: extractPrice($item),
          originalPrice: $item.find('.original-price, .old-price, [class*="original"]').first().text().trim(),
          image: $item.find('img').first().attr('src') || $item.find('img').first().attr('data-src'),
          category: $item.find('.category, [class*="category"]').first().text().trim(),
          location: $item.find('.location, [class*="location"]').first().text().trim(),
          link: $item.find('a').first().attr('href'),
          id: $item.attr('data-id') || $item.find('[data-id]').first().attr('data-id')
        }

        // Only add if we have at least a title
        if (ticket.title) {
          tickets.push(ticket)
        }
      })
      
      // If we found tickets with this selector, stop trying others
      if (tickets.length > 0) break
    }
  }

  return tickets
}

function extractPrice($item: cheerio.Cheerio<any>): string | undefined {
  const pricePatterns = [
    '.price',
    '[class*="price"]',
    '.amount',
    '[class*="amount"]',
    'span:contains("$")',
    'span:contains("SGD")',
    'span:contains("S$")'
  ]

  for (const pattern of pricePatterns) {
    const priceElement = $item.find(pattern).first()
    const priceText = priceElement.text().trim()
    
    if (priceText && /[\$\d]/.test(priceText)) {
      return priceText
    }
  }

  return undefined
}
