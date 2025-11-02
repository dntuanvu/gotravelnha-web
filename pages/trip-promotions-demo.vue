<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-6xl mx-auto px-4">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">🔍 Trip.com Promotion Scraper Demo</h1>
        <p class="text-gray-600">Extract and compare promotional deals from Trip.com</p>
      </div>

      <!-- Scraping Form -->
      <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Scrape Promotional Data</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Trip.com Promotion URL
            </label>
            <input
              v-model="scrapeUrl"
              type="text"
              placeholder="https://sg.trip.com/sale/w/4747/flightrebate.html"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              v-model="scrapeType"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="generic">Generic</option>
              <option value="flight">Flight</option>
              <option value="hotel">Hotel</option>
              <option value="activity">Activity</option>
            </select>
          </div>

          <button
            @click="handleScrape"
            :disabled="loading || !scrapeUrl"
            class="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold transition-colors"
          >
            {{ loading ? '🔄 Scraping...' : '🚀 Scrape Data' }}
          </button>
        </div>

        <!-- Error Display -->
        <div v-if="error" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-red-800 text-sm">❌ {{ error }}</p>
        </div>
      </div>

      <!-- Results -->
      <div v-if="scrapeResult" class="bg-white rounded-xl shadow-lg p-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">
            📊 Scraped Data ({{ scrapeResult.deals?.length || 0 }} deals found)
          </h2>
          <button
            @click="scrapeResult = null"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Clear
          </button>
        </div>

        <!-- Metadata -->
        <div v-if="scrapeResult.metadata" class="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 class="font-semibold text-gray-900 mb-2">Page Info</h3>
          <p class="text-sm text-gray-700"><strong>Title:</strong> {{ scrapeResult.metadata.title }}</p>
          <p class="text-sm text-gray-700"><strong>Description:</strong> {{ scrapeResult.metadata.description }}</p>
          <p class="text-sm text-gray-700"><strong>Total Deals:</strong> {{ scrapeResult.metadata.totalDeals }}</p>
        </div>

        <!-- Deals List -->
        <div v-if="scrapeResult.deals && scrapeResult.deals.length > 0" class="space-y-4">
          <div
            v-for="(deal, index) in scrapeResult.deals"
            :key="index"
            class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div class="flex gap-6">
              <!-- Image -->
              <div v-if="deal.image" class="flex-shrink-0">
                <img
                  :src="deal.image"
                  :alt="deal.title"
                  class="w-32 h-32 object-cover rounded-lg"
                  @error="handleImageError"
                />
              </div>

              <!-- Content -->
              <div class="flex-1">
                <h3 class="text-xl font-bold text-gray-900 mb-2">{{ deal.title }}</h3>
                
                <p v-if="deal.description" class="text-gray-600 text-sm mb-3">{{ deal.description }}</p>

                <div class="flex flex-wrap gap-4">
                  <div v-if="deal.discountedPrice" class="flex items-center gap-2">
                    <span class="text-2xl font-bold text-blue-600">{{ deal.discountedPrice }}</span>
                    <span v-if="deal.originalPrice" class="text-sm text-gray-400 line-through">{{ deal.originalPrice }}</span>
                  </div>

                  <div v-if="deal.discount" class="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                    {{ deal.discount }}
                  </div>

                  <div v-if="deal.location" class="flex items-center gap-1 text-gray-600 text-sm">
                    📍 {{ deal.location }}
                  </div>

                  <div v-if="deal.link" class="mt-2">
                    <a
                      :href="deal.link"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Deal →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Deals Found -->
        <div v-else class="text-center py-12">
          <p class="text-gray-500 text-lg">No deals found on this page</p>
          <p class="text-gray-400 text-sm mt-2">Try a different URL or check if the page has promotional content</p>
        </div>
      </div>

      <!-- Usage Examples -->
      <div class="bg-white rounded-xl shadow-lg p-8 mt-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">💡 Usage Examples</h2>
        
        <div class="space-y-4">
          <div class="border-l-4 border-blue-500 pl-4">
            <h3 class="font-semibold text-gray-900 mb-2">1. Scrape Promotional Deals</h3>
            <pre class="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto"><code>const { scrapePromotions } = useTripScraper()

const result = await scrapePromotions(
  'https://sg.trip.com/sale/w/4747/flightrebate.html',
  'flight'
)</code></pre>
          </div>

          <div class="border-l-4 border-green-500 pl-4">
            <h3 class="font-semibold text-gray-900 mb-2">2. Scrape Hotel Data</h3>
            <pre class="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto"><code>const { scrapeHotels } = useTripScraper()

const result = await scrapeHotels({
  cityId: '33',
  checkinDate: '2025-03-01',
  checkoutDate: '2025-03-05',
  pageIndex: 1,
  pageSize: 20
})</code></pre>
          </div>

          <div class="border-l-4 border-purple-500 pl-4">
            <h3 class="font-semibold text-gray-900 mb-2">3. Compare Multiple Promotions</h3>
            <pre class="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto"><code>const { scrapeMultiplePromotions } = useTripScraper()

const results = await scrapeMultiplePromotions([
  'https://www.trip.com/partners/ad/SB553583',
  'https://www.trip.com/partners/ad/DB552995'
], 'generic')</code></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTripScraper } from '~/composables/useTripScraper'

definePageMeta({
  layout: 'default'
})

const { loading, error, scrapePromotions } = useTripScraper()

const scrapeUrl = ref('')
const scrapeType = ref<'flight' | 'hotel' | 'activity' | 'generic'>('generic')
const scrapeResult = ref<any>(null)

const handleScrape = async () => {
  if (!scrapeUrl.value) return

  error.value = null
  const result = await scrapePromotions(scrapeUrl.value, scrapeType.value)
  
  if (result) {
    scrapeResult.value = result
  }
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}
</script>

