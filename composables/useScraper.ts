import { ref } from 'vue'

interface ScraperOptions {
  url: string
  method?: 'GET' | 'POST'
  headers?: Record<string, string>
  body?: any
  timeout?: number
}

interface ScrapedData {
  title?: string
  description?: string
  price?: string
  image?: string
  [key: string]: any
}

export const useScraper = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const scrapeUrl = async (options: ScraperOptions): Promise<ScrapedData | null> => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch('/api/scraper', {
        method: 'POST',
        body: {
          url: options.url,
          method: options.method || 'GET',
          headers: options.headers || {},
          body: options.body,
          timeout: options.timeout || 30000
        }
      })

      return response as ScrapedData
    } catch (err: unknown) {
      const errorObj = err as any
      error.value = errorObj.message || 'Failed to scrape data'
      console.error('Scraping error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const scrapeMultiple = async (urls: string[]): Promise<ScrapedData[]> => {
    loading.value = true
    error.value = null

    try {
      const results = await Promise.all(
        urls.map(url => scrapeUrl({ url }))
      )

      return results.filter((result): result is ScrapedData => result !== null)
    } catch (err: unknown) {
      const errorObj = err as any
      error.value = errorObj.message || 'Failed to scrape multiple URLs'
      console.error('Batch scraping error:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    scrapeUrl,
    scrapeMultiple
  }
}
