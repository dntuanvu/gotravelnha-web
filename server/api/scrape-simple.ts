import { defineEventHandler, readBody, createError } from 'h3'
import * as cheerio from 'cheerio'

interface ScraperRequest {
  url: string
  selectors?: Record<string, string>
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

    // Simple fetch with Node.js
    const response = await fetch(body.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    })

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        message: `HTTP ${response.status}: ${response.statusText}`
      })
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // Default extraction
    const defaultData = {
      title: $('title').text() || $('meta[property="og:title"]').attr('content') || '',
      description: $('meta[name="description"]').attr('content') || 
                   $('meta[property="og:description"]').attr('content') || '',
      image: $('meta[property="og:image"]').attr('content') ||
             $('img').first().attr('src') || '',
      canonical: $('link[rel="canonical"]').attr('href') || body.url,
      keywords: $('meta[name="keywords"]').attr('content') || '',
    }

    // Custom selector extraction if provided
    const customData: Record<string, any> = {}
    if (body.selectors) {
      const entries = Object.keys(body.selectors).map(key => [key, body.selectors![key]])
      for (const [key, selector] of entries) {
        const elements = $(selector)
        if (elements.length > 0) {
          customData[key] = elements.length === 1 
            ? elements.text().trim() || elements.attr('href') || elements.attr('src')
            : elements.map((_, el) => $(el).text().trim()).get()
        }
      }
    }

    return {
      ...defaultData,
      ...customData,
      url: body.url
    }
  } catch (error: any) {
    console.error('Simple scraping error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to scrape the URL'
    })
  }
})
