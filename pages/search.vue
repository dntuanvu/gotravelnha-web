<template>
  <div class="min-h-screen bg-white">
    <!-- Mobile Header (Mobile Only) -->
    <section class="lg:hidden max-w-7xl mx-auto px-3 sm:px-4 pt-3 sm:pt-4 mb-4">
      <div class="mb-4">
        <h1 class="text-2xl font-bold text-slate-900 mb-1">
          Search Travel Deals
        </h1>
        <p class="text-sm text-slate-600">
          Compare prices across all platforms
        </p>
      </div>
    </section>

    <!-- Desktop Hero Section (Hidden on Mobile) -->
    <section class="hidden lg:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-8 mb-8">
      <div class="text-center">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 mb-6">
          <svg class="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-4">
          Search All Travel Platforms
        </h1>
        <p class="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto">
          Search once, compare prices across Trip.com, Klook, and Singapore Attractions
        </p>
      </div>
    </section>

    <!-- Search Bar -->
    <section class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 mb-4 sm:mb-6">
      <!-- Mobile: Native style without card -->
      <div class="lg:hidden">
        <form @submit.prevent="performSearch" class="space-y-4">
          <!-- Main Search Input -->
          <div class="relative">
            <input
              v-model="searchQuery"
              type="search"
              placeholder="Search hotels, flights, activities..."
              class="w-full px-4 py-3.5 pl-12 pr-24 text-base border-0 border-b-2 border-slate-200 bg-transparent text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-0 outline-none transition-all touch-manipulation"
            />
            <svg
              class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <button
              type="submit"
              :disabled="loading || !searchQuery.trim()"
              class="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 touch-manipulation min-h-[44px] whitespace-nowrap"
            >
              {{ loading ? '...' : 'Search' }}
            </button>
          </div>

          <!-- Mobile Filters - Collapsible -->
          <div class="space-y-3">
            <button
              type="button"
              @click="showMobileFilters = !showMobileFilters"
              class="w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-50 rounded-xl touch-manipulation"
            >
              <span>Filters</span>
              <svg 
                class="w-5 h-5 transition-transform"
                :class="{ 'rotate-180': showMobileFilters }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Filters Content -->
            <Transition
              enter-active-class="transition-all duration-200 ease-out"
              enter-from-class="opacity-0 max-h-0"
              enter-to-class="opacity-100 max-h-96"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100 max-h-96"
              leave-to-class="opacity-0 max-h-0"
            >
              <div v-if="showMobileFilters" class="space-y-3 pb-2">
                <!-- Location -->
                <div>
                  <label class="block text-xs font-semibold text-slate-600 mb-1.5">Location</label>
                  <input
                    v-model="filters.location"
                    type="text"
                    placeholder="e.g., Singapore"
                    class="w-full px-4 py-2.5 text-base border-0 border-b border-slate-200 bg-transparent focus:border-emerald-500 focus:ring-0 outline-none touch-manipulation"
                    @keyup.enter="performSearch"
                  />
                </div>

                <!-- Category -->
                <div>
                  <label class="block text-xs font-semibold text-slate-600 mb-1.5">Category</label>
                  <select
                    v-model="filters.category"
                    class="w-full px-4 py-2.5 text-base border-0 border-b border-slate-200 bg-transparent focus:border-emerald-500 focus:ring-0 outline-none touch-manipulation"
                  >
                    <option value="">All Categories</option>
                    <option value="hotel">Hotels</option>
                    <option value="flight">Flights</option>
                    <option value="activity">Activities</option>
                    <option value="attraction">Attractions</option>
                  </select>
                </div>

                <!-- Platforms -->
                <div>
                  <label class="block text-xs font-semibold text-slate-600 mb-2">Platforms</label>
                  <div class="flex gap-3">
                    <label class="flex items-center gap-2 cursor-pointer touch-manipulation flex-1">
                      <input
                        v-model="filters.platforms"
                        type="checkbox"
                        value="trip"
                        class="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <span class="text-sm font-medium text-slate-700">Trip</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer touch-manipulation flex-1">
                      <input
                        v-model="filters.platforms"
                        type="checkbox"
                        value="klook"
                        class="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <span class="text-sm font-medium text-slate-700">Klook</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer touch-manipulation flex-1">
                      <input
                        v-model="filters.platforms"
                        type="checkbox"
                        value="attractionsg"
                        class="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <span class="text-sm font-medium text-slate-700">SG</span>
                    </label>
                  </div>
                </div>

                <!-- Clear Filters -->
                <button
                  v-if="hasActiveFilters"
                  @click="clearFilters"
                  type="button"
                  class="w-full px-4 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors touch-manipulation min-h-[44px]"
                >
                  Clear All Filters
                </button>
              </div>
            </Transition>
          </div>
        </form>
      </div>

      <!-- Desktop: Card style -->
      <div class="hidden lg:block bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6">
        <form @submit.prevent="performSearch" class="space-y-4">
          <!-- Main Search Input -->
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search for hotels, flights, activities, attractions..."
              class="w-full px-6 py-4 pl-14 text-lg border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
            />
            <svg
              class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <button
              type="submit"
              :disabled="loading || !searchQuery.trim()"
              class="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              {{ loading ? 'Searching...' : 'Search' }}
            </button>
          </div>

          <!-- Filters Row -->
          <div class="flex flex-wrap gap-4 items-end">
            <!-- Location Filter -->
            <div class="flex-1 min-w-[200px]">
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Location
              </label>
              <input
                v-model="filters.location"
                type="text"
                placeholder="e.g., Singapore"
                class="w-full px-4 py-2.5 text-base border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                @keyup.enter="performSearch"
              />
            </div>

            <!-- Category Filter -->
            <div class="min-w-[160px]">
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Category
              </label>
              <select
                v-model="filters.category"
                class="w-full px-4 py-2.5 text-base border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
              >
                <option value="">All Categories</option>
                <option value="hotel">Hotels</option>
                <option value="flight">Flights</option>
                <option value="activity">Activities</option>
                <option value="attraction">Attractions</option>
              </select>
            </div>

            <!-- Platform Filters -->
            <div class="min-w-[200px]">
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Platforms
              </label>
              <div class="flex gap-3">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    v-model="filters.platforms"
                    type="checkbox"
                    value="trip"
                    class="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span class="text-sm text-slate-700">Trip</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    v-model="filters.platforms"
                    type="checkbox"
                    value="klook"
                    class="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span class="text-sm text-slate-700">Klook</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    v-model="filters.platforms"
                    type="checkbox"
                    value="attractionsg"
                    class="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span class="text-sm text-slate-700">SG</span>
                </label>
              </div>
            </div>

            <!-- Clear Filters -->
            <button
              v-if="hasActiveFilters"
              @click="clearFilters"
              type="button"
              class="px-4 py-2.5 text-sm text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </section>

    <!-- Results Stats -->
    <section v-if="hasSearched && !loading" class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 mb-3 sm:mb-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="text-xs sm:text-sm text-slate-600">
          <span class="font-bold text-slate-900">{{ results.total }}</span> result{{ results.total !== 1 ? 's' : '' }}
          <span v-if="searchQuery" class="ml-1">for "<span class="font-semibold text-slate-900">{{ searchQuery }}</span>"</span>
        </div>
        <div v-if="results.platforms && Object.keys(results.platforms).length > 0" class="flex gap-2 sm:gap-3 text-xs">
          <span v-for="(count, platform) in results.platforms" :key="platform" class="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-lg">
            <span class="font-semibold text-slate-700">{{ getPlatformLabel(platform) }}:</span>
            <span class="text-slate-600">{{ count }}</span>
          </span>
        </div>
      </div>
    </section>

    <!-- Loading State -->
    <section v-if="loading" class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-12 sm:py-16">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
        <p class="text-slate-600 text-base sm:text-lg">Searching across all platforms...</p>
      </div>
    </section>

    <!-- No Results -->
    <section v-else-if="hasSearched && results.data.length === 0" class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-12 sm:py-16">
      <div class="text-center bg-white sm:rounded-3xl sm:shadow-lg sm:p-12 p-6">
        <div class="text-6xl mb-4">🔍</div>
        <h3 class="text-xl sm:text-3xl font-bold text-slate-900 mb-2">No Results Found</h3>
        <p class="text-sm sm:text-base text-slate-600 mb-6 max-w-md mx-auto">
          Try different search terms or adjust your filters
        </p>
        <button
          @click="clearFilters"
          class="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-semibold touch-manipulation min-h-[44px]"
        >
          Clear All Filters
        </button>
      </div>
    </section>

    <!-- Results Grid -->
    <section v-else-if="hasSearched && results.data.length > 0" class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pb-8 sm:pb-12">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        <div
          v-for="item in results.data"
          :key="item.id"
          class="bg-white rounded-none sm:rounded-2xl border-0 sm:border border-b sm:border-slate-200 border-slate-200 overflow-hidden group cursor-pointer touch-manipulation active:bg-slate-50 sm:active:bg-white sm:hover:shadow-xl transition-all"
          @click="handleItemClick(item)"
        >
          <!-- Image -->
          <div class="relative h-44 sm:h-52 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
            <img
              v-if="item.image"
              :src="item.image"
              :alt="item.title"
              class="w-full h-full object-cover group-active:scale-105 sm:group-hover:scale-105 transition-transform duration-300"
              @error="(e) => { (e.target as HTMLImageElement).style.display = 'none' }"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <span class="text-4xl sm:text-5xl">{{ getPlatformIcon(item.platform) }}</span>
            </div>
            <!-- Platform Badge -->
            <div class="absolute top-2 left-2 sm:top-3 sm:left-3">
              <span class="px-2 sm:px-2.5 py-1 bg-white/95 backdrop-blur-sm rounded-lg sm:rounded-full text-[10px] sm:text-xs font-semibold text-slate-900 shadow-sm">
                {{ item.platformLabel }}
              </span>
            </div>
            <!-- Promo Code Badge -->
            <div v-if="item.promoCode" class="absolute top-2 right-2 sm:top-3 sm:right-3">
              <span class="px-2 sm:px-2.5 py-1 bg-emerald-500 text-white rounded-lg sm:rounded-full text-[10px] sm:text-xs font-bold shadow-sm">
                CODE
              </span>
            </div>
            <!-- Discount Badge -->
            <div v-if="item.discount && !item.promoCode" class="absolute top-2 right-2 sm:top-3 sm:right-3">
              <span class="px-2 sm:px-2.5 py-1 bg-orange-500 text-white rounded-lg sm:rounded-full text-[10px] sm:text-xs font-bold shadow-sm">
                {{ item.discount }}% OFF
              </span>
            </div>
          </div>

          <!-- Content -->
          <div class="p-3 sm:p-4 lg:p-5">
            <h3 class="text-base sm:text-lg font-bold text-slate-900 mb-1.5 sm:mb-2 line-clamp-2 group-active:text-emerald-600 sm:group-hover:text-emerald-600 transition-colors leading-tight">
              {{ item.title }}
            </h3>
            <p v-if="item.description" class="text-xs sm:text-sm text-slate-600 mb-2 sm:mb-3 line-clamp-2 hidden sm:block">
              {{ item.description }}
            </p>

            <!-- Location & Category -->
            <div class="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 text-[10px] sm:text-xs text-slate-500">
              <span v-if="item.location" class="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 bg-slate-50 rounded-full">
                <span class="text-[10px]">📍</span>
                <span class="truncate max-w-[120px]">{{ item.location }}</span>
              </span>
              <span v-if="item.category" class="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 bg-slate-50 rounded-full">
                <span class="text-[10px]">🏷️</span>
                <span>{{ formatCategory(item.category) }}</span>
              </span>
              <span v-if="item.rating" class="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 bg-slate-50 rounded-full">
                <span class="text-[10px]">⭐</span>
                <span>{{ item.rating }}</span>
              </span>
            </div>

            <!-- Price -->
            <div class="flex items-center justify-between mb-2 sm:mb-3">
              <div>
                <div v-if="item.priceAmount || item.price" class="flex items-baseline gap-1.5 sm:gap-2">
                  <span class="text-lg sm:text-xl lg:text-2xl font-bold text-emerald-600">
                    {{ formatPrice(item.priceAmount || item.price, item.currency) }}
                  </span>
                  <span v-if="item.originalPriceAmount && item.originalPriceAmount > (item.priceAmount || 0)" class="text-xs sm:text-sm text-slate-400 line-through">
                    {{ formatPrice(item.originalPriceAmount, item.currency) }}
                  </span>
                </div>
                <div v-else class="text-xs sm:text-sm text-slate-500">Price varies</div>
              </div>
            </div>

            <!-- Promo Code Display -->
            <div v-if="item.promoCode" class="mb-2 sm:mb-3 p-2 sm:p-2.5 bg-emerald-50 rounded-lg sm:rounded-xl border border-emerald-200">
              <div class="flex items-center justify-between gap-2">
                <span class="text-[10px] sm:text-xs text-emerald-700 font-medium">Promo Code:</span>
                <code class="text-[10px] sm:text-xs font-mono font-bold text-emerald-700 bg-white px-2 py-1 rounded border border-emerald-200">
                  {{ item.promoCode }}
                </code>
              </div>
            </div>

            <!-- CTA Button -->
            <button
              @click.stop="handleItemClick(item)"
              class="w-full px-4 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all active:scale-95 touch-manipulation text-sm sm:text-base min-h-[44px] sm:min-h-[48px] shadow-md sm:shadow-lg"
            >
              {{ item.platform === 'attractionsg' ? 'View Details' : 'View Deal' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="results.pagination && results.pagination.totalPages > 1" class="mt-6 sm:mt-8 flex justify-center gap-2">
        <button
          @click="changePage(results.pagination.page - 1)"
          :disabled="results.pagination.page <= 1"
          class="px-4 sm:px-5 py-2.5 sm:py-2 border border-slate-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors touch-manipulation min-h-[44px] font-medium text-sm sm:text-base"
        >
          Previous
        </button>
        <span class="px-4 sm:px-5 py-2.5 text-slate-600 text-sm sm:text-base flex items-center">
          Page {{ results.pagination.page }} of {{ results.pagination.totalPages }}
        </span>
        <button
          @click="changePage(results.pagination.page + 1)"
          :disabled="results.pagination.page >= results.pagination.totalPages"
          class="px-4 sm:px-5 py-2.5 sm:py-2 border border-slate-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors touch-manipulation min-h-[44px] font-medium text-sm sm:text-base"
        >
          Next
        </button>
      </div>
    </section>

    <!-- Initial State -->
    <section v-if="!hasSearched && !loading" class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12 lg:py-16">
      <div class="text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 mb-4 sm:mb-6">
          <svg class="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 class="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-2 sm:mb-3">Start Your Search</h3>
        <p class="text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto mb-4 sm:mb-6 px-2">
          Search across Trip.com, Klook, and Singapore Attractions all in one place. Find the best deals faster!
        </p>
        <div class="flex flex-wrap justify-center gap-2 sm:gap-3 px-2">
          <button
            @click="setQuickSearch('Singapore Hotels')"
            class="px-4 sm:px-5 py-2.5 sm:py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-xs sm:text-sm font-medium touch-manipulation min-h-[44px] active:scale-95"
          >
            🏨 Singapore Hotels
          </button>
          <button
            @click="setQuickSearch('Tokyo Activities')"
            class="px-4 sm:px-5 py-2.5 sm:py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-xs sm:text-sm font-medium touch-manipulation min-h-[44px] active:scale-95"
          >
            🎯 Tokyo Activities
          </button>
          <button
            @click="setQuickSearch('Bangkok Flights')"
            class="px-4 sm:px-5 py-2.5 sm:py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-xs sm:text-sm font-medium touch-manipulation min-h-[44px] active:scale-95"
          >
            ✈️ Bangkok Flights
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const searchQuery = ref('')
const loading = ref(false)
const hasSearched = ref(false)
const showMobileFilters = ref(false)
const filters = ref({
  location: '',
  category: '',
  platforms: ['trip', 'klook', 'attractionsg'] as string[]
})

const results = ref<{
  data: any[]
  total: number
  platforms: Record<string, number>
  pagination: {
    page: number
    limit: number
    totalPages: number
  }
  query?: string
  filters?: any
}>({
  data: [],
  total: 0,
  platforms: {},
  pagination: {
    page: 1,
    limit: 20,
    totalPages: 0
  }
})

// Check URL query params on mount
onMounted(() => {
  const queryParam = route.query.q as string
  const locationParam = route.query.location as string
  const categoryParam = route.query.category as string
  const platformsParam = route.query.platforms as string | string[]

  if (queryParam) {
    searchQuery.value = queryParam
  }
  if (locationParam) {
    filters.value.location = locationParam
  }
  if (categoryParam) {
    filters.value.category = categoryParam
  }
  if (platformsParam) {
    filters.value.platforms = Array.isArray(platformsParam) ? platformsParam : [platformsParam]
  }

  // Auto-search if query param exists
  if (queryParam) {
    performSearch()
  }
})

const hasActiveFilters = computed(() => {
  return filters.value.location || filters.value.category || filters.value.platforms.length < 3
})

async function performSearch() {
  if (!searchQuery.value.trim()) return

  loading.value = true
  hasSearched.value = true
  showMobileFilters.value = false // Close mobile filters after search

  try {
    const response = await $fetch('/api/search/global', {
      method: 'POST',
      body: {
        query: searchQuery.value.trim(),
        platforms: filters.value.platforms.length > 0 ? filters.value.platforms : ['trip', 'klook', 'attractionsg'],
        category: filters.value.category || undefined,
        location: filters.value.location || undefined,
        limit: 20,
        page: results.value.pagination.page
      }
    })

    if (response && response.success) {
      results.value = response
      
      // Update URL
      const queryParams: any = { q: searchQuery.value }
      if (filters.value.location) queryParams.location = filters.value.location
      if (filters.value.category) queryParams.category = filters.value.category
      if (filters.value.platforms.length < 3) queryParams.platforms = filters.value.platforms

      router.replace({ query: queryParams })
    }
  } catch (error: any) {
    console.error('Search error:', error)
    // Handle error - maybe show toast notification
  } finally {
    loading.value = false
  }
}

function clearFilters() {
  filters.value = {
    location: '',
    category: '',
    platforms: ['trip', 'klook', 'attractionsg']
  }
  searchQuery.value = ''
  hasSearched.value = false
  showMobileFilters.value = false
  results.value = {
    data: [],
    total: 0,
    platforms: {},
    pagination: {
      page: 1,
      limit: 20,
      totalPages: 0
    }
  }
  router.replace({ query: {} })
}

function changePage(page: number) {
  results.value.pagination.page = page
  performSearch()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function handleItemClick(item: any) {
  if (item.platform === 'attractionsg') {
    // Navigate to SG Attractions detail page using slug
    // Prefer slug from metadata or link, fallback to extracting from link or using ID
    const slug = item.metadata?.slug || item.slug || (item.link ? item.link.split('/').pop() : null) || item.id.replace('attractionsg-', '')
    
    // Build navigation path with referrer info to preserve search context
    let navigationPath = ''
    if (item.link && item.link.startsWith('/attractionsg/')) {
      navigationPath = item.link
    } else {
      navigationPath = `/attractionsg/${slug}`
    }
    
    // Add query params to preserve search context for back navigation
    const searchParams = new URLSearchParams()
    searchParams.set('from', 'search')
    if (searchQuery.value) searchParams.set('searchQuery', searchQuery.value)
    if (filters.value.location) searchParams.set('searchLocation', filters.value.location)
    if (filters.value.category) searchParams.set('searchCategory', filters.value.category)
    if (filters.value.platforms.length > 0) {
      filters.value.platforms.forEach(p => searchParams.append('searchPlatforms', p))
    }
    
    router.push(`${navigationPath}?${searchParams.toString()}`)
  } else {
    // Open external link
    if (item.link) {
      window.open(item.link, '_blank', 'noopener,noreferrer')
    }
  }
}

function setQuickSearch(query: string) {
  searchQuery.value = query
  performSearch()
}

function getPlatformIcon(platform: string): string {
  const icons: Record<string, string> = {
    trip: '✈️',
    klook: '🎯',
    attractionsg: '🎫'
  }
  return icons[platform] || '📦'
}

function getPlatformLabel(platform: string): string {
  const labels: Record<string, string> = {
    trip: 'Trip.com',
    klook: 'Klook',
    attractionsg: 'SG Attractions'
  }
  return labels[platform] || platform
}

function formatCategory(category: string): string {
  return category.charAt(0).toUpperCase() + category.slice(1)
}

function formatPrice(price: string | number | undefined, currency = 'SGD'): string {
  if (!price) return 'Free'
  const num = typeof price === 'string' ? parseFloat(price) : price
  if (isNaN(num)) return String(price)
  
  const currencySymbols: Record<string, string> = {
    SGD: 'S$',
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CNY: '¥'
  }
  
  const symbol = currencySymbols[currency] || currency
  return `${symbol}${num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

// SEO
useHead({
  title: 'Unified Travel Search - Compare Prices Across All Platforms | GoVietHub',
  meta: [
    { name: 'description', content: 'Search once and compare prices across Trip.com, Klook, and Singapore Attractions. Find the best travel deals faster.' },
    { property: 'og:title', content: 'Unified Travel Search | GoVietHub' },
    { property: 'og:description', content: 'Search across all travel platforms in one place' }
  ]
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth transitions for mobile filter collapse */
.overflow-hidden {
  overflow: hidden;
}
</style>
