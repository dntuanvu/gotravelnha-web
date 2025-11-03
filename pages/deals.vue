<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            🔥 Best Travel Deals
          </h1>
          <p class="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Exclusive promotions from Trip.com, Klook, and Singapore Attractions
          </p>
        </div>
      </div>
    </section>

    <!-- Filters -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div class="flex flex-wrap gap-4 items-center">
          <label class="text-sm font-medium text-gray-700">Platform:</label>
          <select 
            v-model="filters.platform"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Platforms</option>
            <option value="trip">Trip.com</option>
            <option value="klook">Klook</option>
            <option value="attractionsg">Singapore Attractions</option>
          </select>

          <label class="text-sm font-medium text-gray-700 ml-4">Category:</label>
          <select 
            v-model="filters.category"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="hotel">Hotels</option>
            <option value="flight">Flights</option>
            <option value="activity">Activities</option>
            <option value="train">Trains</option>
            <option value="car">Car Rentals</option>
            <option value="package">Packages</option>
          </select>

          <label class="text-sm font-medium text-gray-700 ml-4">Sort:</label>
          <select 
            v-model="filters.sort"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="lowest">Lowest Price</option>
            <option value="highest">Highest Discount</option>
          </select>

          <button
            @click="refreshDeals"
            :disabled="loading"
            class="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {{ loading ? '🔄 Refreshing...' : '🔄 Refresh Deals' }}
          </button>
        </div>
      </div>

      <!-- Deal Type Tabs -->
      <div class="bg-white rounded-xl shadow-lg p-2 mb-8 flex gap-2">
        <button
          @click="activeTab = 'all'"
          :class="activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
          class="flex-1 px-6 py-3 rounded-lg font-semibold transition-all"
        >
          <span class="text-2xl">🔥</span> All Deals
        </button>
        <button
          @click="activeTab = 'promo'"
          :class="activeTab === 'promo' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
          class="flex-1 px-6 py-3 rounded-lg font-semibold transition-all"
        >
          <span class="text-2xl">🎫</span> Promo Codes
        </button>
        <button
          @click="activeTab = 'hotel'"
          :class="activeTab === 'hotel' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
          class="flex-1 px-6 py-3 rounded-lg font-semibold transition-all"
        >
          <span class="text-2xl">🏨</span> Hotel Deals
        </button>
      </div>

      <!-- Stats Bar -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-xl shadow-lg p-6 text-center">
          <div class="text-3xl font-bold text-blue-600">{{ totalDeals }}</div>
          <div class="text-gray-600 text-sm">Total Deals</div>
        </div>
        <div class="bg-white rounded-xl shadow-lg p-6 text-center">
          <div class="text-3xl font-bold text-green-600">{{ averageDiscount }}%</div>
          <div class="text-gray-600 text-sm">Avg Discount</div>
        </div>
        <div class="bg-white rounded-xl shadow-lg p-6 text-center">
          <div class="text-3xl font-bold text-purple-600">{{ platformsCount }}</div>
          <div class="text-gray-600 text-sm">Platforms</div>
        </div>
        <div class="bg-white rounded-xl shadow-lg p-6 text-center">
          <div class="text-3xl font-bold text-orange-600">{{ lastUpdated }}</div>
          <div class="text-gray-600 text-sm">Last Updated</div>
        </div>
      </div>
    </section>

    <!-- Deals Grid -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <!-- Loading State -->
      <div v-if="loading && !deals.length" class="text-center py-16">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Loading amazing deals...</p>
      </div>

      <!-- No Deals -->
      <div v-else-if="!filteredDeals.length && !loading" class="text-center py-16">
        <div class="text-6xl mb-4">🎒</div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">No Deals Found</h3>
        <p class="text-gray-600 mb-6">We couldn't find any deals matching your filters.</p>
        <button
          @click="clearFilters"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Clear Filters
        </button>
      </div>

      <!-- Deals Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="deal in paginatedDeals"
          :key="deal.id"
          class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
        >
          <!-- Deal Image -->
          <div class="relative h-48 bg-gray-200 overflow-hidden">
            <img
              v-if="deal.image"
              :src="deal.image"
              :alt="deal.title"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
            <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
              <span class="text-6xl">{{ deal.platform === 'klook' ? '🎯' : '✈️' }}</span>
            </div>
            
            <!-- Discount Badge -->
            <div v-if="deal.discountPercent" class="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-lg shadow-lg">
              -{{ deal.discountPercent }}%
            </div>

            <!-- Platform Badge -->
            <div class="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
              {{ getPlatformIcon(deal.platform || 'trip') }}
            </div>
          </div>

          <!-- Deal Info -->
          <div class="p-6">
            <!-- Badge/Tag -->
            <div class="mb-3 flex flex-wrap gap-2">
              <span v-if="deal.badge" class="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                {{ deal.badge }}
              </span>
              <span v-if="deal.promoCode" class="inline-block px-2 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded font-mono">
                🎫 {{ deal.promoCode }}
              </span>
            </div>

            <!-- Title -->
            <h3 class="font-bold text-lg mb-2 line-clamp-2 min-h-[3rem]">
              {{ deal.title || 'Special Deal' }}
            </h3>

            <!-- Location -->
            <p v-if="deal.location" class="text-gray-600 text-sm mb-3 flex items-center">
              <span class="mr-1">📍</span>
              {{ deal.location }}
            </p>

            <!-- Rating -->
            <div v-if="deal.rating" class="flex items-center gap-1 mb-3 text-yellow-500">
              <span>{{ deal.rating }}</span>
            </div>

            <!-- Description -->
            <p v-if="deal.description" class="text-gray-600 text-sm mb-4 line-clamp-2">
              {{ deal.description }}
            </p>

            <!-- Price -->
            <div class="mb-4">
              <div class="flex items-baseline gap-2">
                <span class="text-3xl font-bold text-blue-600">
                  {{ getCurrencySymbol(deal.currency || 'SGD') }}{{ formatPrice(deal.discountedPrice || deal.price) }}
                </span>
                <span
                  v-if="deal.originalPrice"
                  class="text-gray-400 line-through text-lg"
                >
                  {{ getCurrencySymbol(deal.currency || 'SGD') }}{{ formatPrice(deal.originalPrice) }}
                </span>
              </div>
              
              <!-- Valid Date -->
              <div v-if="deal.validDate" class="text-xs text-gray-500 mt-1">
                Valid: {{ deal.validDate }}
              </div>
            </div>

            <!-- CTA Button -->
            <a
              v-if="deal.affiliateLink && !deal.promoCode"
              :href="deal.affiliateLink"
              @click="trackClick('deal_view', deal)"
              target="_blank"
              rel="noopener noreferrer"
              class="block w-full text-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold transform hover:scale-105"
            >
              View Deal →
            </a>
            <button
              v-else
              @click="showDealDetails(deal)"
              class="w-full text-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold transform hover:scale-105"
            >
              View Details →
            </button>

            <!-- Metadata -->
            <div class="mt-3 flex justify-between text-xs text-gray-500">
              <span v-if="deal.category" class="capitalize">{{ deal.category }}</span>
              <span v-if="deal.createdAt">{{ formatDate(deal.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-12 flex justify-center items-center gap-2">
        <button
          @click="currentPage = Math.max(1, currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>

        <div class="flex gap-2">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="currentPage = page"
            :class="[
              'px-4 py-2 rounded-lg font-semibold transition-colors',
              page === currentPage
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>
        </div>

        <button
          @click="currentPage = Math.min(totalPages, currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>
    </section>

    <!-- Deal Details Modal -->
    <div
      v-if="selectedDeal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click="selectedDeal = null"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <span>{{ getPlatformIcon(selectedDeal.platform) }}</span>
            <span>Deal Details</span>
          </h3>
          <button
            @click="selectedDeal = null"
            class="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div class="space-y-6">
          <!-- Title & Discount -->
          <div>
            <div class="flex items-center gap-3 mb-3">
              <h4 class="text-2xl font-bold text-gray-900">{{ selectedDeal.title }}</h4>
              <span v-if="selectedDeal.discountPercent" class="px-3 py-1 bg-red-500 text-white rounded-full font-bold text-lg">
                -{{ selectedDeal.discountPercent }}%
              </span>
            </div>
            <div v-if="selectedDeal.promoCode" class="inline-block px-3 py-1 bg-orange-100 text-orange-800 rounded-lg font-mono font-semibold">
              🎫 Code: {{ selectedDeal.promoCode }}
            </div>
          </div>

          <!-- Description -->
          <div v-if="selectedDeal.description">
            <h5 class="font-semibold text-gray-900 mb-2">Description</h5>
            <p class="text-gray-700">{{ selectedDeal.description }}</p>
          </div>

          <!-- Terms & Conditions -->
          <div v-if="selectedDeal.termsAndConditions">
            <h5 class="font-semibold text-gray-900 mb-2">Terms & Conditions</h5>
            <div class="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
              <p class="text-sm text-gray-700 whitespace-pre-line">{{ selectedDeal.termsAndConditions }}</p>
            </div>
          </div>

          <!-- Validity -->
          <div>
            <h5 class="font-semibold text-gray-900 mb-2">Validity</h5>
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-blue-50 rounded-lg p-3">
                <div class="text-xs text-blue-600 font-medium">Valid Until</div>
                <div class="text-gray-900 font-semibold">{{ selectedDeal.validDate }}</div>
              </div>
              <div class="bg-green-50 rounded-lg p-3">
                <div class="text-xs text-green-600 font-medium">Status</div>
                <div class="text-gray-900 font-semibold">{{ new Date(selectedDeal.validUntil) > new Date() ? '🟢 Active' : '🔴 Expired' }}</div>
              </div>
            </div>
          </div>

          <!-- Eligibility -->
          <div v-if="selectedDeal.applicableTo || selectedDeal.notApplicableTo">
            <h5 class="font-semibold text-gray-900 mb-2">Eligibility</h5>
            <div class="space-y-2">
              <div v-if="selectedDeal.applicableTo" class="bg-green-50 rounded-lg p-3">
                <div class="text-xs text-green-600 font-medium mb-1">✅ Applicable To</div>
                <div class="text-sm text-gray-700">{{ selectedDeal.applicableTo }}</div>
              </div>
              <div v-if="selectedDeal.notApplicableTo" class="bg-red-50 rounded-lg p-3">
                <div class="text-xs text-red-600 font-medium mb-1">❌ Not Applicable To</div>
                <div class="text-sm text-gray-700">{{ selectedDeal.notApplicableTo }}</div>
              </div>
            </div>
          </div>

          <!-- CTA Buttons -->
          <div class="flex gap-3 pt-4 border-t">
            <button
              @click="selectedDeal = null"
              class="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              Close
            </button>
            <a
              v-if="selectedDeal.platform === 'klook'"
              href="https://www.klook.com"
              target="_blank"
              rel="noopener noreferrer"
              @click="copyPromoCode(selectedDeal.promoCode)"
              class="flex-1 px-4 py-3 bg-gradient-to-r from-orange-600 to-pink-600 text-white rounded-lg hover:from-orange-700 hover:to-pink-700 transition-all font-semibold text-center transform hover:scale-105"
            >
              🎯 Go to Klook
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTripDeeplink } from '~/composables/useTripDeeplink'
import { useActivityTracker } from '~/composables/useActivityTracker'

definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

const route = useRoute()

const { generateDeeplink } = useTripDeeplink()
const { trackClick } = useActivityTracker()

// State
const loading = ref(false)
const deals = ref<any[]>([])
const currentPage = ref(1)
const itemsPerPage = 12
const selectedDeal = ref<any>(null)
const activeTab = ref('all')

// Filters
const filters = ref({
  platform: 'all',
  category: 'all',
  sort: 'newest'
})

// Watch for tab changes and reset pagination
watch(activeTab, () => {
  currentPage.value = 1
})

// Load deals on mount
onMounted(async () => {
  // Set active tab from URL query param if provided
  const tabParam = route.query.tab as string
  if (tabParam && ['all', 'promo', 'hotel'].includes(tabParam)) {
    activeTab.value = tabParam
  }
  
  await loadDeals()
})

// Load deals from API
async function loadDeals() {
  loading.value = true
  try {
    // Load Trip.com deals
    const tripResponse: any = await $fetch('/api/admin/scraper/data', {
      params: {
        limit: 100 // Get more deals for filtering
      }
    })
    
    let allDeals: any[] = []
    
    if (tripResponse && tripResponse.success) {
      // Transform Trip.com deals to include platform field from job
      allDeals = tripResponse.data.map((deal: any) => ({
        ...deal,
        platform: deal.job?.platform || 'trip'
      })) || []
    }
    
    // Load Klook promo codes
    try {
      const klookResponse: any = await $fetch('/api/klook/promo-codes')
      
      if (klookResponse && klookResponse.success && klookResponse.data) {
        // Transform Klook promo codes to match deal structure
        const klookDeals = klookResponse.data.map((code: any) => ({
          id: code.id,
          platform: 'klook',
          title: code.promoCodeDescription || code.affiliateDescription,
          description: code.affiliateDescription,
          discountPercent: extractDiscountPercent(code.discountDescription),
          discount: code.discountDescription,
          promoCode: code.promoCode,
          validUntil: code.validUntil,
          validDate: formatValidDate(code.validUntil),
          termsAndConditions: code.termsAndConditions,
          applicableTo: code.applicableToResidentsOf,
          notApplicableTo: code.notApplicableToResidentsOf,
          // For promo codes, we'll use a generic Klook link with promo code
          affiliateLink: `https://www.klook.com?promo=${code.promoCode}`,
          category: 'promotion',
          createdAt: code.importedAt
        }))
        
        allDeals = [...allDeals, ...klookDeals]
      }
    } catch (klookError) {
      console.warn('Failed to load Klook promo codes:', klookError)
    }

    // Load Klook hotel deals
    try {
      const klookHotelsResponse: any = await $fetch('/api/klook/hotel-deals')
      
      if (klookHotelsResponse && klookHotelsResponse.success && klookHotelsResponse.data) {
        // Transform Klook hotel deals to match deal structure
        const klookHotelDeals = klookHotelsResponse.data.map((hotel: any) => ({
          id: hotel.id,
          platform: 'klook',
          title: hotel.hotelName,
          category: 'hotel',
          starRating: hotel.starRating,
          price: hotel.originalPrice.toString(),
          discountedPrice: hotel.discountedPrice.toString(),
          currency: hotel.currency,
          discountPercent: hotel.savingsPercent ? Math.round(parseFloat(hotel.savingsPercent.toString())) : '0',
          savings: hotel.savings.toString(),
          affiliateLink: hotel.affiliateLink,
          badge: hotel.dealCategory,
          createdAt: hotel.importedAt
        }))
        
        allDeals = [...allDeals, ...klookHotelDeals]
      }
    } catch (klookHotelsError) {
      console.warn('Failed to load Klook hotel deals:', klookHotelsError)
    }
    
    deals.value = allDeals
  } catch (error) {
    console.error('Failed to load deals:', error)
  } finally {
    loading.value = false
  }
}

// Helper function to extract discount percentage from text like "8% off"
function extractDiscountPercent(discountText: string): string {
  const match = discountText.match(/(\d+)%/)
  return match ? match[1] : '0'
}

// Helper function to format valid date
function formatValidDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

// Refresh deals
async function refreshDeals() {
  await loadDeals()
}

// Filter and sort deals
const filteredDeals = computed(() => {
  let result = [...deals.value]

  // Filter by tab (promo codes vs hotels)
  if (activeTab.value === 'promo') {
    result = result.filter(deal => deal.promoCode && deal.category !== 'hotel')
  } else if (activeTab.value === 'hotel') {
    result = result.filter(deal => deal.category === 'hotel' && !deal.promoCode)
  }

  // Filter by platform
  if (filters.value.platform !== 'all') {
    result = result.filter(deal => deal.platform === filters.value.platform)
  }

  // Filter by category (if not filtering by tab)
  if (filters.value.category !== 'all' && activeTab.value === 'all') {
    result = result.filter(deal => deal.category === filters.value.category)
  }

  // Sort
  if (filters.value.sort === 'newest') {
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } else if (filters.value.sort === 'lowest') {
    result.sort((a, b) => {
      const priceA = parseFloat(a.discountedPrice || a.price || '999999')
      const priceB = parseFloat(b.discountedPrice || b.price || '999999')
      return priceA - priceB
    })
  } else if (filters.value.sort === 'highest') {
    result.sort((a, b) => {
      const discA = parseFloat(a.discountPercent || '0')
      const discB = parseFloat(b.discountPercent || '0')
      return discB - discA
    })
  }

  return result
})

// Pagination
const totalPages = computed(() => Math.ceil(filteredDeals.value.length / itemsPerPage))

const visiblePages = computed(() => {
  const pages: number[] = []
  const total = totalPages.value
  const current = currentPage.value

  // Show first page, current page, last page, and pages around current
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
    if (current > 3) pages.push(-1) // Ellipsis

    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i)
    }

    if (current < total - 2) pages.push(-1) // Ellipsis
    pages.push(total)
  }

  return pages
})

const paginatedDeals = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredDeals.value.slice(start, end)
})

// Stats
const totalDeals = computed(() => filteredDeals.value.length)

const averageDiscount = computed(() => {
  const withDiscount = filteredDeals.value.filter(d => d.discountPercent)
  if (!withDiscount.length) return 0
  
  const total = withDiscount.reduce((sum, d) => sum + parseFloat(d.discountPercent || '0'), 0)
  return Math.round(total / withDiscount.length)
})

const platformsCount = computed(() => {
  return new Set(filteredDeals.value.map(d => d.platform)).size
})

const lastUpdated = computed(() => {
  if (!deals.value.length) return 'Never'
  
  const latest = deals.value.reduce((latest, deal) => {
    const dealTime = new Date(deal.createdAt).getTime()
    return dealTime > new Date(latest.createdAt).getTime() ? deal : latest
  }, deals.value[0])
  
  const now = new Date()
  const updated = new Date(latest.createdAt)
  const diffMinutes = Math.floor((now.getTime() - updated.getTime()) / 60000)
  
  if (diffMinutes < 1) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`
  return `${Math.floor(diffMinutes / 1440)}d ago`
})

// Helper functions
function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    SGD: 'S$',
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CNY: '¥',
    VND: '₫',
    MYR: 'RM',
    THB: '฿',
    IDR: 'Rp'
  }
  return symbols[currency] || currency
}

function formatPrice(price: string | number): string {
  if (!price) return '0'
  const num = typeof price === 'string' ? parseFloat(price) : price
  return num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function getPlatformIcon(platform: string): string {
  const icons: Record<string, string> = {
    trip: '🏨 Trip.com',
    klook: '🎯 Klook',
    attractionsg: '🎢 SG Attractions'
  }
  return icons[platform] || '🌐 Platform'
}

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
  if (img.parentElement) {
    img.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500"><span class="text-6xl">✈️</span></div>'
  }
}

function clearFilters() {
  filters.value = {
    platform: 'all',
    category: 'all',
    sort: 'newest'
  }
  currentPage.value = 1
}

function generateAffiliateLink(tripUrl?: string): string {
  if (!tripUrl) {
    // Generate generic affiliate link
    return generateDeeplink({
      type: 'generic',
      params: {}
    })
  }

  // Parse existing URL and add affiliate params
  try {
    const url = new URL(tripUrl)
    const config = useRuntimeConfig()
    
    // Add affiliate parameters if not present
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

function showDealDetails(deal: any) {
  selectedDeal.value = deal
  trackClick('deal_details_modal', deal)
}

async function copyPromoCode(promoCode: string) {
  try {
    await navigator.clipboard.writeText(promoCode)
    alert(`Promo code "${promoCode}" copied to clipboard! 🎉`)
  } catch (err) {
    console.error('Failed to copy:', err)
    // Fallback: select text
    const textArea = document.createElement('textarea')
    textArea.value = promoCode
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    alert(`Promo code "${promoCode}" copied! 🎉`)
  }
}
</script>

