import { defineEventHandler, readBody } from 'h3'
import { createError } from 'h3'
import { getEventsCache, getCacheTimestamp } from './crawl'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'

interface EventsRequest {
  search?: string
  category?: string
  page?: number
  limit?: number
  sortBy?: 'title' | 'price' | 'rating' | 'date'
  sortOrder?: 'asc' | 'desc'
}

const DATA_DIR = join(process.cwd(), 'data')
const EVENTS_FILE = join(DATA_DIR, 'attractionsg-events.json')

export default defineEventHandler(async (event) => {
  try {
    const body = (await readBody(event)) as EventsRequest
    const page = body.page || 1
    const limit = body.limit || 20
    const offset = (page - 1) * limit

    // Load events from cache or disk
    let events = getEventsCache()
    
    if (events.length === 0) {
      // Try to load from disk cache
      if (existsSync(EVENTS_FILE)) {
        try {
          const data = await readFile(EVENTS_FILE, 'utf-8')
          const parsed = JSON.parse(data)
          events = parsed.events || []
        } catch (error) {
          console.error('Error loading events from disk:', error)
        }
      }
    }

    // Apply filters
    let filteredEvents = [...events]

    // Search filter
    if (body.search) {
      const searchLower = body.search.toLowerCase()
      filteredEvents = filteredEvents.filter(event => 
        event.title.toLowerCase().includes(searchLower) ||
        event.description?.toLowerCase().includes(searchLower) ||
        event.location?.toLowerCase().includes(searchLower) ||
        event.category?.toLowerCase().includes(searchLower)
      )
    }

    // Category filter
    if (body.category) {
      const categoryLower = body.category.toLowerCase()
      filteredEvents = filteredEvents.filter(event =>
        event.category?.toLowerCase() === categoryLower
      )
    }

    // Sorting
    if (body.sortBy) {
      filteredEvents.sort((a, b) => {
        let aVal: any = a[body.sortBy || 'title']
        let bVal: any = b[body.sortBy || 'title']

        // Handle price sorting (extract numeric value)
        if (body.sortBy === 'price') {
          aVal = extractNumericPrice(a.price || '0')
          bVal = extractNumericPrice(b.price || '0')
        }

        // Handle rating sorting
        if (body.sortBy === 'rating') {
          aVal = a.rating || 0
          bVal = b.rating || 0
        }

        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase()
          bVal = bVal?.toLowerCase() || ''
        }

        const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0
        return body.sortOrder === 'desc' ? -comparison : comparison
      })
    }

    // Pagination
    const total = filteredEvents.length
    const paginatedEvents = filteredEvents.slice(offset, offset + limit)

    return {
      success: true,
      data: paginatedEvents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      filters: {
        search: body.search,
        category: body.category
      },
      cached: true,
      timestamp: new Date(getCacheTimestamp()).toISOString()
    }

  } catch (error: any) {
    console.error('Events API error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to fetch events'
    })
  }
})

function extractNumericPrice(priceString: string): number {
  const match = priceString.match(/[\d,]+\.?\d*/)
  if (match) {
    return parseFloat(match[0].replace(/,/g, ''))
  }
  return 0
}
