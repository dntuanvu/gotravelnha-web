import { ref } from 'vue'

/**
 * Trip.com Promotion Scraper
 * 
 * Scrapes promotional deal data from Trip.com pages for comparison and data collection
 */

export interface TripPromotionDeal {
  id?: string
  title: string
  description?: string
  originalPrice?: string
  discountedPrice?: string
  discount?: string
  currency?: string
  image?: string
  link?: string
  location?: string
  dates?: string
  category?: string
}

export interface TripScrapeResult {
  url: string
  type: string
  deals: TripPromotionDeal[]
  metadata?: {
    title?: string
    description?: string
    totalDeals?: number
  }
}

export const useTripScraper = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Scrape promotional deals from a Trip.com URL
   * 
   * @param url The Trip.com promotion/sale URL to scrape
   * @param type Optional: Type of promotion (flight, hotel, activity, generic)
   * @param timeout Optional: Request timeout in milliseconds (default: 60000)
   * @returns Scraped promotional data
   */
  const scrapePromotions = async (
    url: string,
    type?: 'flight' | 'hotel' | 'activity' | 'generic',
    timeout?: number
  ): Promise<TripScrapeResult | null> => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<TripScrapeResult>('/api/trip/scrape-promotions', {
        method: 'POST',
        body: {
          url,
          type,
          timeout: timeout || 60000
        }
      })

      return response
    } catch (err: unknown) {
      const errorObj = err as any
      error.value = errorObj.message || 'Failed to scrape Trip.com promotions'
      console.error('Trip.com scraping error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Scrape multiple promotion URLs
   * 
   * @param urls Array of URLs to scrape
   * @param type Optional: Type of promotion
   * @returns Array of scrape results
   */
  const scrapeMultiplePromotions = async (
    urls: string[],
    type?: 'flight' | 'hotel' | 'activity' | 'generic'
  ): Promise<TripScrapeResult[]> => {
    loading.value = true
    error.value = null

    try {
      const results = await Promise.all(
        urls.map(url => scrapePromotions(url, type))
      )

      return results.filter((result): result is TripScrapeResult => result !== null)
    } catch (err: unknown) {
      const errorObj = err as any
      error.value = errorObj.message || 'Failed to scrape multiple Trip.com promotions'
      console.error('Batch scraping error:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * Get deals from Trip.com hotel search results
   * This uses the existing hotel API endpoint
   */
  const scrapeHotels = async (params: {
    cityId: string
    checkinDate: string
    checkoutDate: string
    pageIndex?: number
    pageSize?: number
  }) => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch('/api/trip/hotels', {
        method: 'POST',
        body: params
      })

      return response
    } catch (err: unknown) {
      const errorObj = err as any
      error.value = errorObj.message || 'Failed to fetch hotel data'
      console.error('Hotel scraping error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    scrapePromotions,
    scrapeMultiplePromotions,
    scrapeHotels
  }
}

