import { defineEventHandler, readBody } from 'h3'
import { chromium } from 'playwright'
import * as cheerio from 'cheerio'
import { createError } from 'h3'

interface ScraperRequest {
  url: string
  method?: 'GET' | 'POST'
  headers?: Record<string, string>
  body?: any
  timeout?: number
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event) as ScraperRequest

    if (!body.url) {
      throw createError({
        statusCode: 400,
        message: 'URL is required'
      })
    }

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
      // Navigate to the URL with timeout
      await page.goto(body.url, {
        waitUntil: 'networkidle',
        timeout: body.timeout || 30000
      })

      // Wait for page to be fully loaded
      await page.waitForTimeout(2000)

      // Get page content
      const content = await page.content()
      const $ = cheerio.load(content)

      // Extract common meta data
      const scrapedData = {
        title: $('title').text() || $('meta[property="og:title"]').attr('content') || '',
        description: $('meta[name="description"]').attr('content') || 
                     $('meta[property="og:description"]').attr('content') || '',
        image: $('meta[property="og:image"]').attr('content') ||
               $('img').first().attr('src') || '',
        url: body.url,
        canonicalUrl: $('link[rel="canonical"]').attr('href') || body.url,
        
        // Try to extract price (various formats)
        price: extractPrice($),
        
        // Additional metadata
        keywords: $('meta[name="keywords"]').attr('content') || '',
        author: $('meta[name="author"]').attr('content') || '',
        
        // Extract all images
        images: $('img').map((_, el) => $(el).attr('src')).get().filter(Boolean).slice(0, 10),
        
        // Extract links
        links: $('a').map((_, el) => ({
          text: $(el).text().trim(),
          href: $(el).attr('href')
        })).get().filter(link => link.text && link.href).slice(0, 20),
        
        // Full HTML (for debugging, optional)
        html: isProduction ? undefined : content.substring(0, 5000)
      }

      await browser.close()

      return scrapedData
    } catch (error: any) {
      await browser.close()
      throw error
    }
  } catch (error: any) {
    console.error('Scraping error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to scrape the URL'
    })
  }
})

function extractPrice($: cheerio.CheerioAPI): string | null {
  // Try various price patterns
  const pricePatterns = [
    $('meta[property="product:price:amount"]').attr('content'),
    $('meta[property="og:price:amount"]').attr('content'),
    $('[itemprop="price"]').text() || $('[itemprop="price"]').attr('content'),
    $('.price').first().text(),
    $('[class*="price"]').first().text(),
    $('[id*="price"]').first().text(),
  ]

  for (const price of pricePatterns) {
    if (price) {
      // Clean up price string
      const cleanPrice = price.trim().replace(/[^\d.,]/g, '')
      if (cleanPrice) {
        return price.trim()
      }
    }
  }

  return null
}
