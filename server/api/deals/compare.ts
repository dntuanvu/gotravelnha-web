import { defineEventHandler, getQuery } from 'h3'
import prisma from '~/server/utils/prisma'
import { createError } from 'h3'

/**
 * GET /api/deals/compare
 * Compare deals across platforms by location, category, or keywords
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

    // Build where clause
    const where: any = {
      isValid: true
    }

    if (category) {
      where.category = category
    }

    if (location) {
      where.location = {
        contains: location,
        mode: 'insensitive'
      }
    }

    if (keyword) {
      where.OR = [
        { title: { contains: keyword, mode: 'insensitive' } },
        { description: { contains: keyword, mode: 'insensitive' } }
      ]
    }

    // Get deals from all platforms
    const deals = await prisma.tripScrapedData.findMany({
      where,
      take: limit * 3, // Get more to allow for grouping
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        job: {
          select: {
            platform: true
          }
        }
      }
    })

    // Group deals by similarity and platform
    const groupedDeals = groupSimilarDeals(deals)

    // Calculate savings for each group
    const comparisons = groupedDeals.map(group => ({
      id: group.id,
      title: group.title,
      category: group.category,
      location: group.location,
      platformCount: group.deals.length,
      lowestPrice: group.lowestPrice,
      highestPrice: group.highestPrice,
      savings: group.savings,
      currency: group.currency,
      deals: group.deals.map(deal => ({
        platform: deal.platform,
        price: deal.price,
        originalPrice: deal.originalPrice,
        discount: deal.discount,
        image: deal.image,
        affiliateLink: deal.affiliateLink,
        metadata: deal.metadata
      }))
    }))

    return {
      success: true,
      data: comparisons,
      total: comparisons.length
    }
  } catch (error: any) {
    console.error('Error comparing deals:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to compare deals'
    })
  }
})

/**
 * Group similar deals together for comparison
 */
function groupSimilarDeals(deals: any[]): any[] {
  const groups: any[] = []
  const processed = new Set<string>()

  for (const deal of deals) {
    if (processed.has(deal.id)) continue

    // Find similar deals
    const similar = deals.filter(other => 
      !processed.has(other.id) &&
      isSimilarDeal(deal, other)
    )

    // Add all similar deals to group
    for (const similarDeal of similar) {
      processed.add(similarDeal.id)
    }

    // Calculate group stats
    const allPrices = similar.map(d => parseFloat(d.discountedPrice || d.originalPrice || '999999'))
    const minPrice = Math.min(...allPrices)
    const maxPrice = Math.max(...allPrices)
    const savings = maxPrice > 0 ? ((maxPrice - minPrice) / maxPrice * 100).toFixed(1) : '0'

    groups.push({
      id: `group-${deal.id}`,
      title: deal.title,
      category: deal.category,
      location: deal.location,
      lowestPrice: minPrice,
      highestPrice: maxPrice,
      savings: parseFloat(savings),
      currency: deal.currency || 'SGD',
      deals: similar
    })
  }

  return groups
}

/**
 * Determine if two deals are similar enough to compare
 */
function isSimilarDeal(deal1: any, deal2: any): boolean {
  // Must be same category
  if (deal1.category !== deal2.category) return false

  // Check title similarity
  const similarity = calculateStringSimilarity(
    deal1.title.toLowerCase(),
    deal2.title.toLowerCase()
  )

  // Consider similar if >60% match
  return similarity > 0.6
}

/**
 * Calculate string similarity using Levenshtein-like algorithm
 */
function calculateStringSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1

  if (longer.length === 0) return 1.0

  const editDistance = levenshteinDistance(longer, shorter)
  return (longer.length - editDistance) / longer.length
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

