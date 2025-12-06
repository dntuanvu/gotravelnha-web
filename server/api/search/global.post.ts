import { defineEventHandler, readBody } from 'h3'
import { createError } from 'h3'
import prisma from '~/server/utils/prisma'

// Type definitions
interface TripDeal {
  id: string
  title: string | null
  description: string | null
  discountedPrice: string | null
  originalPrice: string | null
  currency: string | null
  image: string | null
  affiliateLink: string | null
  sourceUrl: string | null
  category: string | null
  location: string | null
  discount: string | null
  discountPercent: string | null
  metadata: any
  job?: {
    platform: string | null
  }
}

interface SearchRequest {
  query: string
  platforms?: string[] // ['trip', 'klook', 'attractionsg']
  category?: string // 'hotel', 'flight', 'activity', 'attraction'
  location?: string
  limit?: number
  page?: number
}

interface SearchResult {
  id: string
  platform: string
  platformLabel: string
  title: string
  description?: string
  price?: string | number
  priceAmount?: number
  originalPrice?: string | number
  originalPriceAmount?: number
  currency?: string
  image?: string
  link?: string
  category?: string
  location?: string
  rating?: number
  discount?: string | number
  promoCode?: string
  metadata?: Record<string, any>
  relevanceScore?: number
}

/**
 * POST /api/search/global
 * Unified search across Trip.com, Klook, and SG Attractions
 */
export default defineEventHandler(async (event) => {
  try {
    const body = (await readBody(event)) as SearchRequest
    const { query, platforms = ['trip', 'klook', 'attractionsg'], category, location, limit = 20, page = 1 } = body

    if (!query || query.trim().length === 0) {
      return {
        success: true,
        data: [],
        total: 0,
        platforms: {},
        pagination: {
          page: 1,
          limit,
          totalPages: 0
        }
      }
    }

    const searchQuery = query.trim()
    const offset = (page - 1) * limit
    const results: SearchResult[] = []
    const platformCounts: Record<string, number> = {}

    // Search Trip.com deals
    if (platforms.includes('trip')) {
      try {
        const tripWhere: any = {
          isValid: true
        }

        if (searchQuery) {
          tripWhere.OR = [
            { title: { contains: searchQuery, mode: 'insensitive' } },
            { description: { contains: searchQuery, mode: 'insensitive' } },
            { location: { contains: searchQuery, mode: 'insensitive' } }
          ]
        }

        if (category) {
          tripWhere.category = category
        }

        if (location) {
          tripWhere.location = { contains: location, mode: 'insensitive' }
        }

        const tripDeals = await prisma.tripScrapedData.findMany({
          where: tripWhere,
          take: limit,
          skip: offset,
          orderBy: { createdAt: 'desc' },
          include: {
            job: {
              select: {
                platform: true
              }
            }
          }
        })

        const tripResults: SearchResult[] = tripDeals.map((deal) => {
          const price = parseFloat(deal.discountedPrice || deal.originalPrice || '0')
          const originalPrice = deal.originalPrice ? parseFloat(deal.originalPrice) : null
          
          return {
            id: `trip-${deal.id}`,
            platform: 'trip',
            platformLabel: 'Trip.com',
            title: deal.title || 'Untitled Deal',
            description: deal.description || '',
            price: deal.discountedPrice || deal.originalPrice || '',
            priceAmount: price || undefined,
            originalPrice: deal.originalPrice || '',
            originalPriceAmount: originalPrice || undefined,
            currency: deal.currency || 'SGD',
            image: deal.image || '',
            link: deal.affiliateLink || deal.sourceUrl || '',
            category: deal.category || 'general',
            location: deal.location || '',
            discount: deal.discount || deal.discountPercent || '',
            metadata: deal.metadata as Record<string, any> || {},
            relevanceScore: calculateRelevance(searchQuery, deal.title || '', deal.description || '')
          }
        })

        results.push(...tripResults)
        platformCounts.trip = await prisma.tripScrapedData.count({ where: tripWhere })
      } catch (error: any) {
        console.error('Error searching Trip.com:', error)
        platformCounts.trip = 0
      }
    }

    // Search Klook promo codes
    if (platforms.includes('klook')) {
      try {
        const klookPromoWhere: any = {
          isActive: true,
          validUntil: { gte: new Date() }
        }

        if (searchQuery) {
          klookPromoWhere.OR = [
            { promoCodeDescription: { contains: searchQuery, mode: 'insensitive' } },
            { affiliateDescription: { contains: searchQuery, mode: 'insensitive' } },
            { promoCode: { contains: searchQuery, mode: 'insensitive' } }
          ]
        }

        const klookPromos = await prisma.klookPromoCode.findMany({
          where: klookPromoWhere,
          take: Math.ceil(limit / 3), // Allocate portion to promos
          orderBy: { validUntil: 'desc' }
        })

        const klookPromoResults: SearchResult[] = klookPromos.map((promo) => ({
          id: `klook-promo-${promo.id}`,
          platform: 'klook',
          platformLabel: 'Klook',
          title: promo.promoCodeDescription || promo.affiliateDescription || `Klook Promo: ${promo.promoCode}`,
          description: promo.affiliateDescription || promo.promoCodeDescription || '',
          price: 0,
          currency: 'SGD',
          link: `https://www.klook.com?promo=${promo.promoCode}`,
          category: 'activity',
          promoCode: promo.promoCode,
          discount: promo.discountDescription || '',
          metadata: {
            redeemFrom: promo.redeemFrom,
            redeemBefore: promo.redeemBefore,
            validUntil: promo.validUntil
          },
          relevanceScore: calculateRelevance(searchQuery, promo.promoCodeDescription || '', promo.affiliateDescription || '')
        }))

        results.push(...klookPromoResults)

        // Search Klook hotel deals
        const klookHotelWhere: any = {
          isActive: true
        }

        if (searchQuery) {
          klookHotelWhere.OR = [
            { hotelName: { contains: searchQuery, mode: 'insensitive' } },
            { title: { contains: searchQuery, mode: 'insensitive' } },
            { description: { contains: searchQuery, mode: 'insensitive' } },
            { location: { contains: searchQuery, mode: 'insensitive' } }
          ]
        }

        if (location) {
          klookHotelWhere.location = { contains: location, mode: 'insensitive' }
        }

        const klookHotels = await prisma.klookHotelDeal.findMany({
          where: klookHotelWhere,
          take: Math.ceil(limit / 3),
          orderBy: { updatedAt: 'desc' }
        })

        const klookHotelResults: SearchResult[] = klookHotels.map((hotel) => ({
          id: `klook-hotel-${hotel.id}`,
          platform: 'klook',
          platformLabel: 'Klook',
          title: hotel.hotelName || hotel.title || 'Klook Hotel',
          description: hotel.description || '',
          price: hotel.price?.toString() || hotel.discountedPrice?.toString() || '',
          priceAmount: Number(hotel.price || hotel.discountedPrice) || undefined,
          originalPrice: hotel.originalPrice?.toString() || '',
          originalPriceAmount: Number(hotel.originalPrice) || undefined,
          currency: hotel.currency || 'SGD',
          link: hotel.affiliateLink || '',
          category: 'hotel',
          location: hotel.location || '',
          discount: hotel.discountPercent || '',
          metadata: {},
          relevanceScore: calculateRelevance(searchQuery, hotel.hotelName || hotel.title || '', hotel.description || '')
        }))

        results.push(...klookHotelResults)
        platformCounts.klook = (await prisma.klookPromoCode.count({ where: klookPromoWhere })) + 
                                (await prisma.klookHotelDeal.count({ where: klookHotelWhere }))
      } catch (error: any) {
        console.error('Error searching Klook:', error)
        platformCounts.klook = 0
      }
    }

    // Search SG Attractions
    if (platforms.includes('attractionsg')) {
      try {
        const attractionsWhere: any = {
          isActive: true,
          isPublished: true
        }

        if (searchQuery) {
          attractionsWhere.OR = [
            { title: { contains: searchQuery, mode: 'insensitive' } },
            { description: { contains: searchQuery, mode: 'insensitive' } },
            { category: { contains: searchQuery, mode: 'insensitive' } },
            { location: { contains: searchQuery, mode: 'insensitive' } }
          ]
        }

        if (category && category === 'attraction') {
          // Keep all attractions
        } else if (category) {
          // Skip if category doesn't match attractions
          attractionsWhere.category = { contains: category, mode: 'insensitive' }
        }

        if (location) {
          attractionsWhere.location = { contains: location, mode: 'insensitive' }
        }

        const attractionsEvents = await prisma.attractionsgEvent.findMany({
          where: attractionsWhere,
          take: Math.ceil(limit / 3),
          orderBy: { lastSeenAt: 'desc' }
        })

        const attractionsResults: SearchResult[] = attractionsEvents.map((event) => {
          const raw = event.raw as Record<string, any> | null
          // Use slug for the link, fallback to ID if slug doesn't exist
          const slug = event.slug || raw?.slug || event.id
          // Make sure we're using the slug in the link, not the UUID
          const detailLink = slug ? `/attractionsg/${slug}` : `/attractionsg/${event.id}`
          
          return {
            id: `attractionsg-${event.id}`,
            platform: 'attractionsg',
            platformLabel: 'SG Attractions',
            title: event.title,
            description: event.description || raw?.description || '',
            price: event.priceText || raw?.price || '',
            priceAmount: event.priceAmount ?? raw?.priceAmount ?? undefined,
            originalPrice: event.originalPriceText || raw?.originalPrice || '',
            originalPriceAmount: event.originalPriceAmount ?? raw?.originalPriceAmount ?? undefined,
            currency: 'SGD',
            image: event.image || raw?.image || '',
            link: event.link || raw?.link || detailLink,
            slug: slug, // Store slug separately for easier access
            category: 'attraction',
            location: event.location || raw?.location || '',
            rating: event.rating ?? (typeof raw?.rating === 'number' ? raw.rating : undefined),
            metadata: {
              duration: event.duration || raw?.duration,
              ageRestriction: event.ageRestriction || raw?.ageRestriction,
              isSelfBookable: event.isSelfBookable,
              slug: slug // Include in metadata too
            },
            relevanceScore: calculateRelevance(searchQuery, event.title, event.description || '')
          }
        })

        results.push(...attractionsResults)
        platformCounts.attractionsg = await prisma.attractionsgEvent.count({ where: attractionsWhere })
      } catch (error: any) {
        console.error('Error searching SG Attractions:', error)
        platformCounts.attractionsg = 0
      }
    }

    // Sort by relevance score (higher is better), then by price
    results.sort((a, b) => {
      const relevanceDiff = (b.relevanceScore || 0) - (a.relevanceScore || 0)
      if (Math.abs(relevanceDiff) > 0.1) {
        return relevanceDiff
      }
      // Secondary sort by price (cheaper first)
      const priceA = a.priceAmount || Infinity
      const priceB = b.priceAmount || Infinity
      return priceA - priceB
    })

    // Apply pagination to final results
    const paginatedResults = results.slice(offset, offset + limit)
    const total = results.length

    return {
      success: true,
      data: paginatedResults,
      total,
      platforms: platformCounts,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      query: searchQuery,
      filters: {
        platforms,
        category,
        location
      }
    }
  } catch (error: any) {
    console.error('Error in unified search:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to perform search'
    })
  }
})

/**
 * Calculate relevance score based on query matching
 */
function calculateRelevance(query: string, title: string, description: string): number {
  const queryLower = query.toLowerCase()
  const titleLower = title.toLowerCase()
  const descLower = description.toLowerCase()

  let score = 0

  // Exact title match
  if (titleLower === queryLower) {
    score += 100
  }
  // Title starts with query
  else if (titleLower.startsWith(queryLower)) {
    score += 80
  }
  // Title contains query
  else if (titleLower.includes(queryLower)) {
    score += 60
  }

  // Description contains query
  if (descLower.includes(queryLower)) {
    score += 20
  }

  // Word matching
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2)
  const titleWords = titleLower.split(/\s+/)
  const descWords = descLower.split(/\s+/)

  queryWords.forEach(word => {
    if (titleWords.includes(word)) score += 10
    if (descWords.includes(word)) score += 5
  })

  return score
}

