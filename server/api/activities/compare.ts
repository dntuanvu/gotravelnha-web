import { defineEventHandler, getQuery } from 'h3'
import prisma from '~/server/utils/prisma'
import { createError } from 'h3'
import { addKlookAffiliateTracking } from '~/server/utils/affiliate-tracking'
import { addTripAffiliateTracking } from '~/server/utils/affiliate-tracking'

/**
 * GET /api/activities/compare
 * Compare activities/events from Klook and Trip.com
 * Matches similar activities and shows price comparison with affiliate links
 * NOTE: Affiliate tracking is added here (transparent to users)
 */
export default defineEventHandler(async (event) => {
  if (event.node.req.method !== 'GET') {
    throw createError({
      statusCode: 405,
      message: 'Method not allowed'
    })
  }

  try {
    const query = getQuery(event)
    const location = query.location as string | undefined
    const category = query.category as string | undefined
    const keyword = query.keyword as string | undefined
    const limit = query.limit ? parseInt(query.limit as string) : 20
    const platform = query.platform as string | undefined // Optional: filter by platform

    // Fetch activities from both platforms
    const [klookActivities, tripActivities] = await Promise.all([
      // Fetch Klook activities
      prisma.klookActivity.findMany({
        where: {
          isActive: true,
          ...(location && {
            location: {
              contains: location,
              mode: 'insensitive'
            }
          }),
          ...(category && {
            category: {
              contains: category,
              mode: 'insensitive'
            }
          }),
          ...(keyword && {
            OR: [
              { title: { contains: keyword, mode: 'insensitive' } },
              { description: { contains: keyword, mode: 'insensitive' } }
            ]
          })
        },
        take: limit * 2, // Get more to allow for matching
        orderBy: {
          createdAt: 'desc'
        }
      }),
      // Fetch Trip.com activities (category = 'activity') from unified Event model
      prisma.event.findMany({
        where: {
          platform: 'trip',
          isActive: true,
          category: 'activity', // Only get activities, not hotels/flights
          ...(location && {
            location: {
              contains: location,
              mode: 'insensitive'
            }
          }),
          ...(keyword && {
            OR: [
              { title: { contains: keyword, mode: 'insensitive' } },
              { description: { contains: keyword, mode: 'insensitive' } }
            ]
          })
        },
        take: limit * 2, // Get more to allow for matching
        orderBy: {
          createdAt: 'desc'
        }
      })
    ])

    // Match activities from both platforms
    const matchedActivities = matchActivities(klookActivities, tripActivities)

    // Filter by platform if specified
    let filteredMatches = matchedActivities
    if (platform) {
      filteredMatches = matchedActivities.filter(match => {
        if (platform === 'klook') return match.klook !== null
        if (platform === 'trip') return match.trip !== null
        return true
      })
    }

    // Limit results and add affiliate tracking to links
    const comparisons = filteredMatches.slice(0, limit).map(match => ({
      id: match.id,
      title: match.title,
      description: match.description,
      location: match.location,
      category: match.category,
      image: match.image || match.klook?.image || match.trip?.image || null,
      
      // Platform-specific data with affiliate tracking added
      klook: match.klook ? {
        id: match.klook.id,
        title: match.klook.title,
        price: match.klook.price ? parseFloat(match.klook.price.toString()) : null,
        originalPrice: match.klook.originalPrice ? parseFloat(match.klook.originalPrice.toString()) : null,
        currency: match.klook.currency || 'SGD',
        // Add affiliate tracking to public URL when displaying to users
        link: match.klook.link ? addKlookAffiliateTracking(match.klook.link, undefined, 'gotravelnha-activity-compare') : null,
        rating: match.klook.rating ? parseFloat(match.klook.rating.toString()) : null,
        reviewCount: match.klook.reviewCount || null,
        image: match.klook.image || null
      } : null,
      
      trip: match.trip ? {
        id: match.trip.id,
        title: match.trip.title,
        price: match.trip.discountedPrice ? parseFloat(match.trip.discountedPrice.toString()) : (match.trip.priceAmount || null),
        originalPrice: match.trip.originalPriceAmount || null,
        currency: match.trip.currency || 'SGD',
        // Add affiliate tracking to public URL when displaying to users
        link: match.trip.link ? addTripAffiliateTracking(match.trip.link, undefined, undefined, 'gotravelnha-activity-compare') : null,
        discount: match.trip.discount || null,
        image: match.trip.image || null
      } : null,
      
      // Comparison metrics
      bestPrice: match.bestPrice,
      bestPlatform: match.bestPlatform,
      savings: match.savings,
      savingsPercent: match.savingsPercent
    }))

    return {
      success: true,
      data: comparisons,
      total: comparisons.length,
      stats: {
        klookOnly: matchedActivities.filter(m => m.klook && !m.trip).length,
        tripOnly: matchedActivities.filter(m => m.trip && !m.klook).length,
        matched: matchedActivities.filter(m => m.klook && m.trip).length
      }
    }
  } catch (error: any) {
    console.error('Error comparing activities:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to compare activities'
    })
  }
})

/**
 * Match activities from Klook and Trip.com
 */
function matchActivities(
  klookActivities: any[],
  tripActivities: any[]
): any[] {
  const matches: any[] = []
  const matchedKlookIds = new Set<string>()
  const matchedTripIds = new Set<string>()

  // First, try to match activities that exist on both platforms
  for (const klook of klookActivities) {
    if (matchedKlookIds.has(klook.id)) continue

    // Find best matching Trip.com activity
    let bestMatch: any = null
    let bestSimilarity = 0

    for (const trip of tripActivities) {
      if (matchedTripIds.has(trip.id)) continue

      const similarity = calculateActivitySimilarity(klook, trip)
      if (similarity > bestSimilarity && similarity > 0.6) {
        bestSimilarity = similarity
        bestMatch = trip
      }
    }

    if (bestMatch) {
      // Found a match
      matchedKlookIds.add(klook.id)
      matchedTripIds.add(bestMatch.id)

      const klookPrice = klook.priceAmount || (klook.price ? parseFloat(klook.price.toString()) : null)
      const tripPrice = bestMatch.discountedPrice 
        ? parseFloat(bestMatch.discountedPrice.toString()) 
        : (bestMatch.priceAmount || bestMatch.originalPriceAmount || null)

      const prices = [klookPrice, tripPrice].filter(p => p !== null) as number[]
      const bestPrice = prices.length > 0 ? Math.min(...prices) : null
      const highestPrice = prices.length > 0 ? Math.max(...prices) : null
      const savings = bestPrice && highestPrice ? highestPrice - bestPrice : 0
      const savingsPercent = bestPrice && highestPrice ? ((savings / highestPrice) * 100) : 0

      let bestPlatform: 'klook' | 'trip' | null = null
      if (klookPrice !== null && tripPrice !== null) {
        bestPlatform = klookPrice <= tripPrice ? 'klook' : 'trip'
      } else if (klookPrice !== null) {
        bestPlatform = 'klook'
      } else if (tripPrice !== null) {
        bestPlatform = 'trip'
      }

      matches.push({
        id: `match-${klook.id}-${bestMatch.id}`,
        title: klook.title || bestMatch.title,
        description: klook.description || bestMatch.description || null,
        location: klook.location || bestMatch.location || null,
        category: klook.category || bestMatch.category || 'activity',
        image: klook.image || bestMatch.image || null,
        klook,
        trip: bestMatch,
        bestPrice,
        bestPlatform,
        savings,
        savingsPercent: Math.round(savingsPercent * 10) / 10
      })
    } else {
      // Klook activity without match - add as single platform
      matchedKlookIds.add(klook.id)
      const klookPrice = klook.priceAmount || (klook.price ? parseFloat(klook.price.toString()) : null)
      matches.push({
        id: `klook-only-${klook.id}`,
        title: klook.title,
        description: klook.description || null,
        location: klook.location || null,
        category: klook.category || 'activity',
        image: klook.image || null,
        klook,
        trip: null,
        bestPrice: klookPrice,
        bestPlatform: 'klook' as const,
        savings: 0,
        savingsPercent: 0
      })
    }
  }

  // Add remaining Trip.com activities that weren't matched
  for (const trip of tripActivities) {
    if (matchedTripIds.has(trip.id)) continue
    
    matchedTripIds.add(trip.id)
    const tripPrice = trip.discountedPrice 
      ? parseFloat(trip.discountedPrice.toString()) 
      : (trip.priceAmount || trip.originalPriceAmount || null)

    matches.push({
      id: `trip-only-${trip.id}`,
      title: trip.title,
      description: trip.description || null,
      location: trip.location || null,
      category: trip.category || 'activity',
      image: trip.image || null,
      klook: null,
      trip,
      bestPrice: tripPrice,
      bestPlatform: 'trip' as const,
      savings: 0,
      savingsPercent: 0
    })
  }

  // Sort by best price (lowest first) or by savings percent
  matches.sort((a, b) => {
    if (a.klook && a.trip && !(b.klook && b.trip)) return -1
    if (!(a.klook && a.trip) && b.klook && b.trip) return 1
    if (a.savingsPercent > b.savingsPercent) return -1
    if (a.savingsPercent < b.savingsPercent) return 1
    if (a.bestPrice && b.bestPrice) {
      return a.bestPrice - b.bestPrice
    }
    return 0
  })

  return matches
}

/**
 * Calculate similarity between two activities
 */
function calculateActivitySimilarity(klook: any, trip: any): number {
  let score = 0
  let maxScore = 0

  // Title similarity (weight: 50%)
  if (klook.title && trip.title) {
    const titleSimilarity = calculateStringSimilarity(
      klook.title.toLowerCase(),
      trip.title.toLowerCase()
    )
    score += titleSimilarity * 0.5
    maxScore += 0.5
  }

  // Location similarity (weight: 20%)
  if (klook.location && trip.location) {
    const locationSimilarity = calculateStringSimilarity(
      klook.location.toLowerCase(),
      trip.location.toLowerCase()
    )
    score += locationSimilarity * 0.2
    maxScore += 0.2
  }

  // Category similarity (weight: 15%)
  if (klook.category && trip.category) {
    if (klook.category.toLowerCase() === trip.category.toLowerCase()) {
      score += 0.15
    } else {
      const catSimilarity = calculateStringSimilarity(
        klook.category.toLowerCase(),
        trip.category.toLowerCase()
      )
      score += catSimilarity * 0.15
    }
    maxScore += 0.15
  }

  // Price similarity (weight: 15%) - if prices are close, likely the same activity
  const klookPrice = klook.priceAmount || (klook.price ? parseFloat(klook.price.toString()) : null)
  const tripPrice = trip.discountedPrice 
    ? parseFloat(trip.discountedPrice.toString()) 
    : (trip.priceAmount || trip.originalPriceAmount || null)
  
  if (klookPrice && tripPrice) {
    
    const priceDiff = Math.abs(klookPrice - tripPrice)
    const avgPrice = (klookPrice + tripPrice) / 2
    const priceSimilarity = avgPrice > 0 ? Math.max(0, 1 - (priceDiff / avgPrice)) : 0
    
    score += priceSimilarity * 0.15
    maxScore += 0.15
  }

  // Normalize score
  return maxScore > 0 ? score / maxScore : 0
}

/**
 * Calculate string similarity using Levenshtein-like algorithm
 */
function calculateStringSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1

  if (longer.length === 0) return 1.0

  // Check for common words/substrings
  const longerWords = longer.split(/\s+/)
  const shorterWords = shorter.split(/\s+/)
  let commonWords = 0
  shorterWords.forEach(word => {
    if (longerWords.some(lw => lw.includes(word) || word.includes(lw))) {
      commonWords++
    }
  })
  const wordSimilarity = shorterWords.length > 0 ? commonWords / shorterWords.length : 0

  // Use edit distance
  const editDistance = levenshteinDistance(longer, shorter)
  const charSimilarity = (longer.length - editDistance) / longer.length

  // Combine both metrics
  return (wordSimilarity * 0.6 + charSimilarity * 0.4)
}

/**
 * Calculate Levenshtein distance
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = []

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }

  return matrix[str2.length][str1.length]
}
