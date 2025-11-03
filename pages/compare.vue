<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            🔍 Compare & Save
          </h1>
          <p class="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-4">
            Find the best deals across Trip.com, Klook, and Singapore Attractions
          </p>
          <div class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
            <span class="text-green-300">✅</span>
            <span class="text-sm font-semibold">Exclusive feature for registered users</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Search & Filters -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div class="flex flex-wrap gap-4 items-end">
          <!-- Search -->
          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Search Deals
            </label>
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="e.g., Singapore Hotel, Tokyo Flight..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @keyup.enter="searchDeals"
            />
          </div>

          <!-- Location -->
          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              v-model="searchLocation"
              type="text"
              placeholder="e.g., Singapore..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @keyup.enter="searchDeals"
            />
          </div>

          <!-- Category -->
          <div class="min-w-[150px]">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              v-model="searchCategory"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @change="searchDeals"
            >
              <option value="">All Categories</option>
              <option value="hotel">Hotels</option>
              <option value="flight">Flights</option>
              <option value="activity">Activities</option>
              <option value="train">Trains</option>
              <option value="car">Car Rentals</option>
              <option value="package">Packages</option>
            </select>
          </div>

          <!-- Search Button -->
          <button
            @click="searchDeals"
            :disabled="loading"
            class="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:bg-gray-400 transition-all transform hover:scale-105"
          >
            {{ loading ? '🔄 Searching...' : '🔍 Compare' }}
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div v-if="comparisons.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div class="bg-white rounded-xl shadow-lg p-6 text-center">
          <div class="text-3xl font-bold text-blue-600">{{ comparisons.length }}</div>
          <div class="text-gray-600 text-sm">Comparisons Found</div>
        </div>
        <div class="bg-white rounded-xl shadow-lg p-6 text-center">
          <div class="text-3xl font-bold text-green-600">{{ averageSavings }}%</div>
          <div class="text-gray-600 text-sm">Avg Savings</div>
        </div>
        <div class="bg-white rounded-xl shadow-lg p-6 text-center">
          <div class="text-3xl font-bold text-purple-600">{{ totalPlatforms }}</div>
          <div class="text-gray-600 text-sm">Platforms</div>
        </div>
      </div>
    </section>

    <!-- Results -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <!-- Loading -->
      <div v-if="loading" class="text-center py-16">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Finding best deals...</p>
      </div>

      <!-- No Results -->
      <div v-else-if="!loading && comparisons.length === 0" class="text-center py-16">
        <div class="text-6xl mb-4">🔍</div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">No Comparisons Found</h3>
        <p class="text-gray-600 mb-6">Try different search terms or filters</p>
        <button
          @click="clearSearch"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Clear Search
        </button>
      </div>

      <!-- Comparison Cards -->
      <div v-else class="space-y-6">
        <div
          v-for="comparison in comparisons"
          :key="comparison.id"
          class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
        >
          <!-- Header -->
          <div class="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-200">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ comparison.title }}</h3>
                <div class="flex items-center gap-4 text-sm text-gray-600">
                  <span v-if="comparison.location" class="flex items-center">
                    <span class="mr-1">📍</span>
                    {{ comparison.location }}
                  </span>
                  <span class="flex items-center capitalize">
                    <span class="mr-1">🏷️</span>
                    {{ comparison.category }}
                  </span>
                  <span class="flex items-center">
                    <span class="mr-1">🔗</span>
                    {{ comparison.platformCount }} platform{{ comparison.platformCount > 1 ? 's' : '' }}
                  </span>
                </div>
              </div>
              <div
                v-if="comparison.savings > 0"
                class="ml-4 px-4 py-2 bg-green-100 text-green-800 rounded-full font-bold text-lg"
              >
                Save {{ comparison.savings }}%
              </div>
            </div>
          </div>

          <!-- Deal Options -->
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="(deal, index) in comparison.deals"
                :key="index"
                :class="[
                  'border-2 rounded-lg p-4 transition-all',
                  deal.price === comparison.lowestPrice
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-blue-300'
                ]"
              >
                <!-- Best Price Badge -->
                <div
                  v-if="deal.price === comparison.lowestPrice"
                  class="mb-3"
                >
                  <span class="inline-block px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold">
                    🏆 Best Price
                  </span>
                </div>

                <!-- Platform -->
                <div class="flex items-center gap-2 mb-3">
                  <span class="text-2xl">{{ getPlatformIcon(deal.platform) }}</span>
                  <span class="font-semibold text-gray-900 capitalize">{{ deal.platform }}</span>
                </div>

                <!-- Price -->
                <div class="mb-4">
                  <div class="flex items-baseline gap-2">
                    <span class="text-3xl font-bold text-gray-900">
                      {{ getCurrencySymbol(comparison.currency) }}{{ formatPrice(deal.price) }}
                    </span>
                    <span
                      v-if="deal.originalPrice"
                      class="text-gray-400 line-through text-lg"
                    >
                      {{ getCurrencySymbol(comparison.currency) }}{{ formatPrice(deal.originalPrice) }}
                    </span>
                  </div>
                  <div
                    v-if="deal.discount"
                    class="text-sm text-green-600 font-semibold mt-1"
                  >
                    {{ deal.discount }}
                  </div>
                </div>

                <!-- Savings vs Lowest -->
                <div
                  v-if="deal.price !== comparison.lowestPrice"
                  class="mb-4 text-sm text-orange-600 font-semibold"
                >
                  +{{ getCurrencySymbol(comparison.currency) }}{{ formatPrice(deal.price - comparison.lowestPrice) }} more
                </div>

                <!-- CTA -->
                <a
                  :href="generateAffiliateLink(deal.affiliateLink)"
                  @click="trackClick('comparison_click', { platform: deal.platform, comparison: comparison.id })"
                  target="_blank"
                  rel="noopener noreferrer"
                  :class="[
                    'block w-full text-center px-4 py-3 rounded-lg font-semibold transition-all transform hover:scale-105',
                    deal.price === comparison.lowestPrice
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  ]"
                >
                  {{ deal.price === comparison.lowestPrice ? '🚀 Book Now (Best Price)' : 'View Deal →' }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTripDeeplink } from '~/composables/useTripDeeplink'
import { useActivityTracker } from '~/composables/useActivityTracker'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const { generateDeeplink } = useTripDeeplink()
const { trackClick } = useActivityTracker()

// State
const loading = ref(false)
const comparisons = ref<any[]>([])
const searchKeyword = ref('')
const searchLocation = ref('')
const searchCategory = ref('')

// Load on mount
onMounted(() => {
  loadComparisons()
})

// Load comparisons
async function loadComparisons() {
  loading.value = true
  try {
    const params: any = {
      limit: 20
    }
    
    if (searchKeyword.value) params.keyword = searchKeyword.value
    if (searchLocation.value) params.location = searchLocation.value
    if (searchCategory.value) params.category = searchCategory.value

    const response: any = await $fetch('/api/deals/compare', { params })
    
    if (response && response.success) {
      comparisons.value = response.data || []
    }
  } catch (error) {
    console.error('Failed to load comparisons:', error)
    comparisons.value = []
  } finally {
    loading.value = false
  }
}

// Search deals
async function searchDeals() {
  await loadComparisons()
}

// Clear search
function clearSearch() {
  searchKeyword.value = ''
  searchLocation.value = ''
  searchCategory.value = ''
  loadComparisons()
}

// Stats
const averageSavings = computed(() => {
  if (!comparisons.value.length) return 0
  const total = comparisons.value.reduce((sum, c) => sum + (c.savings || 0), 0)
  return Math.round(total / comparisons.value.length)
})

const totalPlatforms = computed(() => {
  const platforms = new Set()
  comparisons.value.forEach(c => {
    c.deals.forEach((d: any) => platforms.add(d.platform))
  })
  return platforms.size
})

// Helpers
function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    SGD: 'S$', USD: '$', EUR: '€', GBP: '£', JPY: '¥', CNY: '¥',
    VND: '₫', MYR: 'RM', THB: '฿', IDR: 'Rp'
  }
  return symbols[currency] || currency
}

function formatPrice(price: string | number): string {
  if (!price) return '0'
  const num = typeof price === 'string' ? parseFloat(price) : price
  return num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

function getPlatformIcon(platform: string): string {
  const icons: Record<string, string> = {
    trip: '🏨',
    klook: '🎯',
    attractionsg: '🎢'
  }
  return icons[platform] || '🌐'
}

function generateAffiliateLink(tripUrl?: string): string {
  if (!tripUrl) {
    return generateDeeplink({ type: 'generic', params: {} })
  }

  try {
    const url = new URL(tripUrl)
    const config = useRuntimeConfig()
    
    if (!url.searchParams.has('Allianceid') && config.public.tripAllianceId) {
      url.searchParams.set('Allianceid', config.public.tripAllianceId)
    }
    if (!url.searchParams.has('SID') && config.public.tripSID) {
      url.searchParams.set('SID', config.public.tripSID)
    }
    
    return url.toString()
  } catch {
    return tripUrl
  }
}
</script>

