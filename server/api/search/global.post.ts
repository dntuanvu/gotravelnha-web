import { defineEventHandler, readBody, createError } from 'h3'
import prisma from '~/server/utils/prisma'

interface SearchRequest {
  query: string
  platforms?: string[] // ['trip', 'klook']
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

function normalizeProvider(platform: string): string {
  const value = String(platform || '').toLowerCase().trim()
  if (value === 'trip.com') return 'trip'
  return value
}

/**
 * POST /api/search/global
 * Unified search across Trip.com and Klook
 */
export default defineEventHandler(async (event) => {
  try {
    const body = (await readBody(event)) as SearchRequest
    const { query, platforms = ['trip', 'klook'], category, location, limit = 20, page = 1 } = body

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
    const safePage = Math.max(Number(page) || 1, 1)
    const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100)
    const offset = (safePage - 1) * safeLimit

    const normalizedPlatforms = (platforms || ['trip', 'klook']).map(normalizeProvider)

    const where: any = {
      isActive: true,
      provider: { in: [...new Set([...normalizedPlatforms, 'trip.com'])] },
      availabilityStatus: { in: ['available', 'stale'] },
      entity: {
        status: 'active'
      }
    }

    if (searchQuery) {
      where.OR = [
        {
          entity: {
            title: { contains: searchQuery, mode: 'insensitive' }
          }
        },
        {
          entity: {
            location: { contains: searchQuery, mode: 'insensitive' }
          }
        },
        {
          entity: {
            category: { contains: searchQuery, mode: 'insensitive' }
          }
        },
        {
          priceText: { contains: searchQuery, mode: 'insensitive' }
        }
      ]
    }

    if (category) {
      where.entity = {
        ...(where.entity || {}),
        category: { contains: category, mode: 'insensitive' }
      }
    }

    if (location) {
      where.entity = {
        ...(where.entity || {}),
        location: { contains: location, mode: 'insensitive' }
      }
    }

    const [offers, total, groupedProviders] = await Promise.all([
      prisma.affiliateOffer.findMany({
        where,
        include: {
          entity: true
        },
        skip: offset,
        take: safeLimit,
        orderBy: [{ score: 'desc' }, { updatedAt: 'desc' }]
      }),
      prisma.affiliateOffer.count({ where }),
      prisma.affiliateOffer.groupBy({
        by: ['provider'],
        where,
        _count: { provider: true }
      })
    ])

    const platformCounts: Record<string, number> = {}
    for (const grouped of groupedProviders) {
      platformCounts[grouped.provider] = grouped._count.provider
    }

    const results: SearchResult[] = offers.map((offer) => {
      const metadata = (offer.metadata || {}) as Record<string, any>
      const description =
        typeof metadata.description === 'string'
          ? metadata.description
          : typeof offer.priceText === 'string'
            ? offer.priceText
            : ''
      const ratingRaw = Number(metadata.rating)
      const discountRaw = metadata.discount ?? metadata.discountPercent ?? null

      return {
        id: offer.id,
        platform: normalizeProvider(offer.provider),
        platformLabel: getPlatformLabel(offer.provider),
        title: offer.entity?.title || 'Untitled Offer',
        description,
        price: offer.priceText || offer.priceAmount || undefined,
        priceAmount: offer.priceAmount || undefined,
        originalPrice: metadata.originalPrice ?? undefined,
        originalPriceAmount: Number(metadata.originalPrice) || undefined,
        currency: offer.currency || 'SGD',
        image: (metadata.image as string) || undefined,
        link: offer.baseUrl || offer.affiliateUrl || undefined,
        category: offer.entity?.category || undefined,
        location: offer.entity?.location || undefined,
        rating: Number.isFinite(ratingRaw) ? ratingRaw : undefined,
        discount: discountRaw || undefined,
        promoCode: (metadata.promoCode as string) || undefined,
        metadata,
        relevanceScore: calculateRelevance(searchQuery, offer.entity?.title || '', description)
      }
    })

    if (total === 0) {
      const fallbackSources = await prisma.scraperSource.findMany({
        where: {
          isActive: true,
          platform: {
            in: ['trip', 'trip.com', 'klook']
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 50
      })

      const sourceResults: SearchResult[] = fallbackSources
        .map((source) => {
          const provider = normalizeProvider(source.platform)
          const sourceType = String(source.sourceType || '').toLowerCase()
          const sourceUrl = source.url
          const lowerText = `${sourceUrl} ${sourceType} ${provider}`.toLowerCase()

          if (normalizedPlatforms.length > 0 && !normalizedPlatforms.includes(provider)) return null
          if (category && !lowerText.includes(category.toLowerCase())) return null
          if (location && !lowerText.includes(location.toLowerCase())) return null

          const matchesQuery =
            lowerText.includes(searchQuery.toLowerCase()) ||
            calculateRelevance(searchQuery, sourceUrl, sourceType) > 0
          if (!matchesQuery) return null

          const urlLower = sourceUrl.toLowerCase()
          const inferredCategory = urlLower.includes('/flights')
            ? 'flight'
            : (urlLower.includes('/hotels') || urlLower.includes('/hotel'))
              ? 'hotel'
              : sourceType.includes('flight')
                ? 'flight'
                : sourceType.includes('hotel')
                  ? 'hotel'
                  : provider === 'trip'
                    ? 'hotel'
                    : 'activity'

          const titlePrefix = provider === 'trip' ? 'Trip.com' : 'Klook'

          return {
            id: `source-${provider}-${Buffer.from(sourceUrl).toString('base64').slice(0, 12)}`,
            platform: provider,
            platformLabel: getPlatformLabel(provider),
            title: `${titlePrefix} ${inferredCategory.charAt(0).toUpperCase() + inferredCategory.slice(1)} Deals`,
            description: `Imported from source URL (${source.sourceType})`,
            link: sourceUrl,
            category: inferredCategory,
            metadata: {
              sourceType: source.sourceType,
              fallback: true
            },
            relevanceScore: calculateRelevance(searchQuery, sourceUrl, sourceType)
          } as SearchResult
        })
        .filter((item): item is SearchResult => Boolean(item))
        .slice(offset, offset + safeLimit)

      const fallbackPlatformCounts: Record<string, number> = {}
      for (const item of sourceResults) {
        fallbackPlatformCounts[item.platform] = (fallbackPlatformCounts[item.platform] || 0) + 1
      }

      return {
        success: true,
        data: sourceResults,
        total: sourceResults.length,
        platforms: fallbackPlatformCounts,
        pagination: {
          page: safePage,
          limit: safeLimit,
          totalPages: sourceResults.length > 0 ? 1 : 0
        },
        query: searchQuery,
        filters: {
          platforms,
          category,
          location
        }
      }
    }

    return {
      success: true,
      data: results,
      total,
      platforms: platformCounts,
      pagination: {
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit)
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

function getPlatformLabel(platform: string): string {
  const normalized = platform.toLowerCase()
  if (normalized === 'trip' || normalized === 'trip.com') return 'Trip.com'
  if (normalized === 'klook') return 'Klook'
  return platform
}

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

