import { createHash } from 'crypto'
import { createError, defineEventHandler } from 'h3'
import prisma from '~/server/utils/prisma'

function normalizeProvider(platform: string): 'trip' | 'klook' | null {
  const value = String(platform || '').toLowerCase().trim()
  if (value === 'trip' || value === 'trip.com') return 'trip'
  if (value === 'klook') return 'klook'
  return null
}

function inferCategory(url: string, sourceType: string, provider: 'trip' | 'klook'): string {
  const value = `${url} ${sourceType}`.toLowerCase()
  if (value.includes('flight')) return 'flight'
  if (value.includes('hotel')) return 'hotel'
  if (value.includes('attraction') || value.includes('tour') || value.includes('activity')) return 'activity'
  return provider === 'trip' ? 'hotel' : 'activity'
}

function inferTitle(provider: 'trip' | 'klook', category: string): string {
  const providerLabel = provider === 'trip' ? 'Trip.com' : 'Klook'
  const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1)
  return `${providerLabel} ${categoryLabel} Deals`
}

function buildStableSlug(provider: 'trip' | 'klook', category: string, sourceUrl: string): string {
  const hash = createHash('sha1').update(sourceUrl).digest('hex').slice(0, 10)
  return `${provider}-${category}-${hash}`
}

export default defineEventHandler(async () => {
  try {
    const sources = await prisma.scraperSource.findMany({
      where: {
        isActive: true,
        platform: {
          in: ['trip', 'trip.com', 'klook']
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    if (sources.length === 0) {
      return {
        success: true,
        message: 'No active Trip/Klook source URLs found.',
        summary: {
          sourcesProcessed: 0,
          entitiesCreated: 0,
          entitiesUpdated: 0,
          offersCreated: 0,
          offersUpdated: 0
        }
      }
    }

    let entitiesCreated = 0
    let entitiesUpdated = 0
    let offersCreated = 0
    let offersUpdated = 0
    const now = new Date()
    const imported: Array<{ sourceUrl: string; provider: string; entityId: string; offerId: string }> = []

    for (const source of sources) {
      const provider = normalizeProvider(source.platform)
      if (!provider) continue

      const category = inferCategory(source.url, source.sourceType, provider)
      const title = inferTitle(provider, category)
      const slug = buildStableSlug(provider, category, source.url)

      const entity = await prisma.affiliateEntity.upsert({
        where: { slug },
        create: {
          slug,
          title,
          category,
          status: 'active',
          metadata: {
            sourceType: source.sourceType,
            sourceUrl: source.url,
            importedFrom: 'scraper_sources'
          }
        },
        update: {
          title,
          category,
          status: 'active',
          metadata: {
            sourceType: source.sourceType,
            sourceUrl: source.url,
            importedFrom: 'scraper_sources'
          }
        }
      })

      const existingOffer = await prisma.affiliateOffer.findFirst({
        where: {
          entityId: entity.id,
          provider,
          baseUrl: source.url
        },
        select: { id: true }
      })

      const offer = existingOffer
        ? await prisma.affiliateOffer.update({
            where: { id: existingOffer.id },
            data: {
              affiliateUrl: source.url,
              isActive: true,
              availabilityStatus: 'available',
              lastVerifiedAt: now,
              metadata: {
                sourceType: source.sourceType,
                importedFrom: 'scraper_sources',
                importedAt: now.toISOString()
              }
            }
          })
        : await prisma.affiliateOffer.create({
            data: {
              entityId: entity.id,
              provider,
              baseUrl: source.url,
              affiliateUrl: source.url,
              isActive: true,
              availabilityStatus: 'available',
              lastVerifiedAt: now,
              priceText: null,
              currency: 'SGD',
              metadata: {
                sourceType: source.sourceType,
                importedFrom: 'scraper_sources',
                importedAt: now.toISOString()
              }
            }
          })

      if (existingOffer) offersUpdated += 1
      else offersCreated += 1

      if (entity.createdAt.getTime() === entity.updatedAt.getTime()) entitiesCreated += 1
      else entitiesUpdated += 1

      imported.push({
        sourceUrl: source.url,
        provider,
        entityId: entity.id,
        offerId: offer.id
      })
    }

    return {
      success: true,
      message: 'Affiliate entities/offers imported from active source URLs.',
      summary: {
        sourcesProcessed: sources.length,
        entitiesCreated,
        entitiesUpdated,
        offersCreated,
        offersUpdated
      },
      data: imported
    }
  } catch (error: any) {
    console.error('Failed to import affiliate sources:', error)
    throw createError({
      statusCode: 500,
      message: error?.message || 'Failed to import affiliate sources'
    })
  }
})
