<template>
  <div class="space-y-4 sm:space-y-6 lg:space-y-8 pb-8 sm:pb-12 lg:pb-16 bg-white min-h-screen">
    <!-- Mobile Native Header (Mobile Only) -->
    <section class="lg:hidden max-w-7xl mx-auto px-3 sm:px-4 pt-3 sm:pt-4">
      <div class="mb-4">
        <h1 class="text-2xl font-bold text-slate-900 mb-1">
          SG Attractions
        </h1>
        <p class="text-base font-semibold text-slate-700">
          Exclusive Tickets & Experiences
        </p>
      </div>
    </section>

    <!-- Desktop Hero Section (Hidden on Mobile) -->
    <section class="hidden lg:block max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 lg:pt-1">
      <div class="bg-gradient-to-br from-emerald-600 via-teal-600 to-sky-700 text-white p-10 md:p-16 rounded-[40px] shadow-2xl overflow-hidden relative">
        <!-- Decorative background elements -->
        <div class="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full -ml-48 -mb-48 blur-3xl"></div>
        
        <div class="relative z-10">
          <div class="flex items-center justify-center mb-6">
            <div class="bg-yellow-400 rounded-full px-10 py-5 shadow-2xl">
              <div class="flex items-center justify-center gap-1">
                <span class="text-[#166534] font-black text-4xl md:text-5xl tracking-tight">SG</span>
                <span class="text-[#1e3a8a] font-black text-4xl md:text-5xl tracking-tight">ATTRACTIONS</span>
              </div>
            </div>
          </div>
          
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-black mb-4 text-center drop-shadow-2xl">
            Singapore Attractions & Tickets
          </h1>
          <p class="text-lg md:text-xl text-center text-emerald-100 max-w-2xl mx-auto mb-8 font-medium">
            Exclusive tickets to Singapore's top attractions and experiences
          </p>
          
          <!-- Feature highlights -->
          <div class="flex flex-wrap justify-center gap-3 mb-8">
            <div class="flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/30">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-sm font-semibold">Best Prices</span>
            </div>
            <div class="flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/30">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-sm font-semibold">Instant E-tickets</span>
            </div>
            <div class="flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/30">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-sm font-semibold">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tickets Grid -->
    <section id="categories" class="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8">
      <div class="mb-3 sm:mb-4 lg:mb-6">
        <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">
          <span class="sm:hidden">All Attractions</span>
          <span class="hidden sm:inline">All Attractions & Tickets</span>
        </h2>
        <p class="text-xs sm:text-sm lg:text-base text-slate-600">Browse all available Singapore attractions and experiences</p>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 sm:gap-4 lg:gap-6">
        <div v-for="n in 6" :key="n" class="bg-white rounded-none sm:rounded-2xl lg:rounded-3xl border-0 sm:border border-b sm:border-slate-200 border-slate-200 shadow-none sm:shadow-lg overflow-hidden animate-pulse">
          <div class="h-44 sm:h-48 lg:h-52 bg-slate-300"></div>
          <div class="p-3 sm:p-4 lg:p-5 space-y-3">
            <div class="h-4 bg-slate-300 rounded w-3/4"></div>
            <div class="h-4 bg-slate-300 rounded w-1/2"></div>
            <div class="h-10 sm:h-12 bg-slate-300 rounded-xl"></div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border-0 sm:border-2 border-red-200 rounded-none sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8 text-center">
        <svg class="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-red-500 mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
        <h3 class="text-lg sm:text-xl font-bold text-red-800 mb-2">Failed to Load Tickets</h3>
        <p class="text-sm sm:text-base text-red-600 mb-4 sm:mb-6">{{ error }}</p>
        <button 
          @click="loadTickets"
          class="px-5 sm:px-6 py-3 sm:py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 active:bg-red-800 transition-all font-semibold touch-manipulation shadow-lg hover:shadow-xl min-h-[44px]"
        >
          Try Again
        </button>
      </div>

      <!-- Controls -->
      <div v-if="tickets.length > 0" class="mb-4 sm:mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
        <div class="flex-1">
          <label class="sr-only" for="search">Search attractions</label>
          <div class="relative">
            <input
              id="search"
              v-model="searchTerm"
              type="search"
              placeholder="Search by attraction name or location..."
              class="w-full px-4 py-3 sm:py-3.5 pl-10 sm:pl-11 border-0 sm:border border-b-2 sm:border-b border-slate-200 sm:rounded-xl sm:rounded-2xl bg-transparent sm:bg-white focus:ring-0 sm:focus:ring-2 focus:border-b-emerald-500 sm:focus:border-emerald-500 sm:focus:ring-emerald-500 transition-all text-base sm:text-sm sm:text-base shadow-none sm:shadow-sm sm:hover:shadow-md touch-manipulation"
            />
            <svg class="w-5 h-5 text-slate-400 absolute left-3 sm:left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 117.5-7.5 7.5 7.5 0 01-7.5 7.5z"></path>
            </svg>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row gap-3 flex-shrink-0">
          <div class="flex items-center gap-2">
            <label for="sort" class="text-xs sm:text-sm font-semibold text-slate-700 whitespace-nowrap hidden sm:block">Sort by</label>
            <select
              id="sort"
              v-model="sortOption"
              class="w-full sm:w-auto px-3 sm:px-4 py-2.5 sm:py-2.5 border-0 sm:border border-b-2 sm:border-b border-slate-200 sm:rounded-xl bg-transparent sm:bg-white focus:ring-0 sm:focus:ring-2 focus:border-b-emerald-500 sm:focus:border-emerald-500 sm:focus:ring-emerald-500 text-base sm:text-sm sm:text-base font-medium shadow-none sm:shadow-sm sm:hover:shadow-md transition-all touch-manipulation"
              @change="loadTickets"
            >
              <option value="alpha">Name: A → Z</option>
              <option value="latest">Latest updates</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Tickets Grid -->
      <div v-if="filteredTickets.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 sm:gap-4 lg:gap-6" style="grid-auto-rows: 1fr;">
        <template v-for="(ticket, index) in displayedTickets" :key="ticket.id || ticket.title">
          <div class="flex flex-col h-full">
            <div 
              class="bg-white rounded-none sm:rounded-2xl lg:rounded-3xl border-0 sm:border sm:border-slate-200 shadow-none sm:shadow-xl lg:hover:shadow-2xl transition-all duration-300 overflow-hidden group active:bg-slate-50 sm:active:bg-white transform sm:hover:-translate-y-1 active:scale-[0.99] sm:active:scale-[0.98] flex flex-col cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 touch-manipulation h-full"
              role="button"
              tabindex="0"
              @click="handleCardClick(ticket)"
              @keydown.enter.prevent="handleCardClick(ticket)"
              @keydown.space.prevent="handleCardClick(ticket)"
            >
            <div class="relative overflow-hidden flex-shrink-0">
            <img 
              v-if="ticket.image"
              :src="ticket.image" 
              :alt="ticket.title" 
              class="w-full h-44 sm:h-48 lg:h-52 object-cover transition-transform duration-300 group-active:scale-105 sm:group-hover:scale-110"
              @error="handleImageError"
            />
            <div v-else class="w-full h-44 sm:h-48 lg:h-52 bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center relative">
              <div class="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-500 opacity-20"></div>
              <div class="bg-yellow-400 rounded-full px-4 sm:px-6 py-2 sm:py-3 shadow-xl relative z-10">
                <div class="flex items-center justify-center gap-1">
                  <span class="text-[#166534] font-black text-lg sm:text-xl tracking-tight">SG</span>
                  <span class="text-[#1e3a8a] font-black text-lg sm:text-xl tracking-tight">ATTRACTIONS</span>
                </div>
              </div>
            </div>
            <div v-if="ticket.originalPrice" class="absolute top-2 left-2 sm:top-3 sm:left-3">
              <span class="px-2 sm:px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg sm:rounded-full text-[10px] sm:text-xs font-bold shadow-sm">
                Deal
              </span>
            </div>
            <div v-if="ticket.isSelfBookable" class="absolute top-2 right-2 sm:top-3 sm:right-3">
              <span class="px-2 sm:px-2.5 py-1 bg-emerald-500 text-white rounded-lg sm:rounded-full text-[10px] sm:text-xs font-bold shadow-sm">
                Book Now
              </span>
            </div>
          </div>
          
          <div class="p-3 sm:p-4 lg:p-5 flex flex-col flex-1 min-h-0">
            <h3 class="text-base sm:text-lg font-bold text-slate-900 mb-1.5 sm:mb-2 line-clamp-2 group-active:text-emerald-600 sm:group-hover:text-emerald-600 transition-colors leading-tight min-h-[2.5rem] sm:min-h-[3rem]">
              {{ ticket.title }}
            </h3>
            
            <p v-if="ticket.description" class="text-slate-600 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-3 flex-shrink-0">
              {{ ticket.description }}
            </p>

            <div v-if="ticket.location" class="flex items-center gap-1.5 mb-2 sm:mb-3 text-[10px] sm:text-xs text-slate-500">
              <span class="text-[10px]">📍</span>
              <span class="truncate max-w-[200px] sm:max-w-none">{{ ticket.location }}</span>
            </div>

            <div class="flex items-baseline gap-2 mb-2 sm:mb-3">
              <span v-if="ticket.price" class="text-lg sm:text-xl lg:text-2xl font-bold text-emerald-600">{{ ticket.price }}</span>
              <span v-if="ticket.originalPrice" class="text-xs sm:text-sm text-slate-400 line-through">{{ ticket.originalPrice }}</span>
            </div>
            
            <div v-if="ticket.isSelfBookable" class="mb-2 sm:mb-3 inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] sm:text-xs font-semibold w-fit">
              <svg class="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Instant checkout</span>
            </div>
            
            <div v-if="ticket.lastUpdatedDate" class="text-[10px] sm:text-xs text-slate-500 mb-2 sm:mb-3 flex-shrink-0">
              Updated {{ formatRelativeTime(ticket.lastUpdatedDate) }}
            </div>
            
            <NuxtLink
              :to="`/attractionsg/${ticket.slug || ticket.id}`"
              class="inline-flex items-center justify-center w-full gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2.5 sm:py-3 rounded-xl hover:from-emerald-700 hover:to-teal-700 active:from-emerald-800 active:to-teal-800 transition-all duration-300 transform active:scale-95 sm:hover:scale-105 font-semibold shadow-md sm:shadow-lg sm:hover:shadow-xl mt-auto touch-manipulation min-h-[44px] sm:min-h-[48px] flex-shrink-0"
              @click.stop="rememberScrollPosition"
            >
              View Details
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </NuxtLink>
          </div>
          </div>
          <!-- Separator line - visible on mobile only -->
          <div v-if="index < displayedTickets.length - 1" class="h-px bg-slate-300 sm:hidden mt-4 mb-4"></div>
          </div>
        </template>
      </div>

      <div
        v-if="hasMoreTickets"
        ref="loadMoreTrigger"
        class="flex items-center justify-center py-6 sm:py-8 text-sm text-slate-500"
      >
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 animate-spin text-emerald-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading more attractions…</span>
        </div>
      </div>

      <!-- No Matches -->
      <div v-if="tickets.length > 0 && filteredTickets.length === 0 && searchTerm" class="bg-white border-0 sm:border-2 border-slate-200 rounded-none sm:rounded-2xl lg:rounded-3xl p-6 sm:p-12 text-center space-y-3 sm:space-y-4">
        <svg class="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <h3 class="text-lg sm:text-xl font-bold text-slate-900">No attractions match your filters</h3>
        <p class="text-sm sm:text-base text-slate-600">Try adjusting your search keywords or filter selections.</p>
        <button
          @click="resetFilters"
          class="px-5 sm:px-6 py-3 sm:py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 active:bg-emerald-800 transition-all font-semibold touch-manipulation shadow-lg hover:shadow-xl min-h-[44px]"
        >
          Reset filters
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="tickets.length === 0 && !loading" class="bg-gradient-to-br from-emerald-50 to-teal-50 border-0 sm:border-2 border-dashed border-emerald-300 rounded-none sm:rounded-2xl lg:rounded-3xl p-6 sm:p-12 text-center">
        <svg class="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-emerald-600 mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
        <h3 class="text-lg sm:text-xl font-bold text-slate-900 mb-2">No Events Available Yet</h3>
        <p class="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6">Start by crawling AttractionsSG data to populate events</p>
        <button
          @click="triggerCrawl"
          class="px-5 sm:px-6 py-3 sm:py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 active:from-emerald-800 active:to-teal-800 font-semibold transition-all transform active:scale-95 sm:hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto touch-manipulation min-h-[44px]"
        >
          <span>🕷️</span>
          <span>Crawl AttractionsSG Data</span>
        </button>
      </div>
    </section>
  </div>
</template>
  
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, onUnmounted, nextTick, computed, watch, watchEffect } from 'vue'
import { useActivityTracker } from '~/composables/useActivityTracker'

const { startTracking, trackPageView } = useActivityTracker()

interface AttractionEvent {
  id?: string
  slug?: string
  title: string
  description?: string
  location?: string
  price?: string
  priceAmount?: number | null
  resellerPriceAmount?: number | null
  originalPrice?: string
  image?: string
  lastUpdated?: string
  priceAmount?: number | null
  originalPriceAmount?: number | null
  isPublished?: boolean
  [key: string]: any
}

type NormalizedAttraction = AttractionEvent & {
  priceAmount: number | null
  lastUpdatedDate: Date | null
}

const tickets = ref<AttractionEvent[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

interface ScrollState {
  position: number
  shouldRestore: boolean
  visibleCount: number
}

const scrollState = useState<ScrollState>('attractionsg-scroll', () => ({
  position: 0,
  shouldRestore: false,
  visibleCount: 0
}))

const pendingScrollRestore = ref(false)
const targetScrollPosition = ref(0)
const observer = ref<IntersectionObserver | null>(null)
const loadMoreTrigger = ref<HTMLElement | null>(null)

const ITEMS_PER_BATCH = 24
const visibleCount = ref(ITEMS_PER_BATCH)

const sortOption = ref('alpha')
const searchTerm = ref('')

const requestURL = useRequestURL()
const baseUrl = computed(() => `${requestURL.protocol}//${requestURL.host}`)
const listingTitle = 'Singapore Attractions & Tickets | GoVietHub'
const listingDescription = 'Browse exclusive Singapore Attractions tickets, passes, and experiences curated by GoVietHub. Compare deals, find promo codes, and plan your adventure.'
const listingImage = computed(() => `${baseUrl.value}/sg-attractions-logo.svg`)

useHead(() => ({
  title: listingTitle,
  meta: [
    { name: 'description', content: listingDescription },
    { property: 'og:title', content: listingTitle },
    { property: 'og:description', content: listingDescription },
    { property: 'og:image', content: listingImage.value },
    { property: 'og:url', content: `${baseUrl.value}/attractionsg` },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'GoVietHub' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: listingTitle },
    { name: 'twitter:description', content: listingDescription },
    { name: 'twitter:image', content: listingImage.value }
  ],
  link: [
    { rel: 'canonical', href: `${baseUrl.value}/attractionsg` }
  ]
}))

const API_PAGE_LIMIT = 100

const loadTickets = async () => {
  try {
    loading.value = true
    error.value = null

    console.log('📡 loadTickets: Fetching AttractionsSG events...')
    const aggregated: AttractionEvent[] = []
    let page = 1
    let totalPages = 1

    do {
      const res = await $fetch<{
        data?: AttractionEvent[]
        pagination?: { page: number; limit: number; totalPages: number; total: number }
      }>('/api/attractionsg/events', {
        method: 'POST',
        body: {
          page,
          limit: API_PAGE_LIMIT,
          sortBy:
            sortOption.value === 'priceAsc' || sortOption.value === 'priceDesc'
              ? 'price'
              : sortOption.value === 'alpha'
                ? 'title'
                : 'date',
          sortOrder: sortOption.value === 'priceAsc' || sortOption.value === 'alpha' ? 'asc' : 'desc'
        }
      })

      const batch = filterPublished(res.data || [])
      aggregated.push(...batch)

      totalPages = res.pagination?.totalPages ?? totalPages
      console.log(`📄 loadTickets: page ${page}/${totalPages} -> ${batch.length} records`)

      page += 1
    } while (page <= totalPages)

    tickets.value = aggregated
    console.log(`📊 loadTickets: Loaded ${tickets.value.length} published tickets`)

  } catch (err) {
    console.error('❌ loadTickets: API error:', err)
    error.value = 'Unable to fetch tickets. Please try again later.'
    
  } finally {
    loading.value = false
  }
}

const handleCardClick = (ticket: AttractionEvent | null) => {
  if (!ticket) return
  const slug = ticket.slug || ticket.id
  if (!slug) return
  rememberScrollPosition()
  navigateTo(`/attractionsg/${slug}`)
}

const handleImageError = (evt: Event) => {
  const target = evt.target as HTMLImageElement | null
  if (target) {
    target.style.display = 'none'
  }
}

const filterPublished = (items: AttractionEvent[]) => {
  return (items || []).filter((item) => item && item.isPublished === true)
}

const normalizedTickets = computed<NormalizedAttraction[]>(() => {
  return tickets.value.map((ticket) => {
    const priceAmount =
      typeof ticket.priceAmount === 'number'
        ? ticket.priceAmount
        : parseFloat(String(ticket.price ?? '').replace(/[^0-9.]/g, '')) || null
    const lastUpdatedDate = ticket.lastUpdated ? new Date(ticket.lastUpdated) : null
    return {
      ...ticket,
      priceAmount,
      lastUpdatedDate
    }
  })
})

const sortedTickets = computed<NormalizedAttraction[]>(() => {
  const items = [...normalizedTickets.value]
  switch (sortOption.value) {
    case 'priceAsc':
      return items.sort((a, b) => (a.priceAmount ?? Infinity) - (b.priceAmount ?? Infinity))
    case 'priceDesc':
      return items.sort((a, b) => (b.priceAmount ?? -Infinity) - (a.priceAmount ?? -Infinity))
    case 'latest':
      return items.sort((a, b) => {
        const aTime = a.lastUpdatedDate ? a.lastUpdatedDate.getTime() : 0
        const bTime = b.lastUpdatedDate ? b.lastUpdatedDate.getTime() : 0
        return bTime - aTime
      })
    case 'alpha':
    default:
      return items.sort((a, b) => a.title.localeCompare(b.title))
  }
})

const filteredTickets = computed<NormalizedAttraction[]>(() => {
  return sortedTickets.value.filter((ticket) => {
    const matchSearch = !searchTerm.value ||
      ticket.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      (ticket.location && ticket.location.toLowerCase().includes(searchTerm.value.toLowerCase()))
    return matchSearch
  })
})

const displayedTickets = computed<NormalizedAttraction[]>(() => {
  return filteredTickets.value.slice(0, visibleCount.value)
})

const hasMoreTickets = computed(() => visibleCount.value < filteredTickets.value.length)

const formatRelativeTime = (date: Date | null) => {
  if (!date) return ''
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hr${hours > 1 ? 's' : ''} ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`
  return date.toLocaleDateString()
}

const resetFilters = () => {
  searchTerm.value = ''
  sortOption.value = 'alpha'
  loadTickets()
}

const rememberScrollPosition = () => {
  if (typeof window === 'undefined') return
  scrollState.value.position = window.scrollY
  scrollState.value.shouldRestore = true
  scrollState.value.visibleCount = visibleCount.value
}

const loadMoreTickets = () => {
  if (!hasMoreTickets.value) return
  visibleCount.value = Math.min(visibleCount.value + ITEMS_PER_BATCH, filteredTickets.value.length)
}

const triggerCrawl = async () => {
  try {
    loading.value = true
    error.value = null
    
    console.log('🕷️ Triggering background crawl...')
    
    // Trigger crawl in background (it runs headless, returns immediately)
    $fetch('/api/attractionsg/crawl', {
      method: 'POST',
      body: {
        fullCrawl: true,
        maxPages: 30 // Crawl detailed info for first 30 events for faster response
      }
    }).catch(err => {
      console.error('Crawl error (non-blocking):', err)
    })
    
    console.log('✅ Crawl initiated, checking for data...')
    
    // Poll for data to be available
    let attempts = 0
    const maxAttempts = 300 // 5 minutes max (detailed crawl with images can take time)
    
    const checkData = setInterval(async () => {
      attempts++
      
      try {
        const res = await $fetch<{ data: AttractionEvent[] }>('/api/attractionsg/events', {
          method: 'POST',
          body: {
            limit: 1
          }
        })
        
        if (res.data && res.data.length > 0) {
          clearInterval(checkData)
          console.log('✅ Data available, reloading...')
          await loadTickets()
        } else if (attempts >= maxAttempts) {
          clearInterval(checkData)
          error.value = 'Crawl taking longer than expected. Please try refreshing the page in a few minutes.'
          loading.value = false
        } else if (attempts % 10 === 0) {
          // Show progress every 10 attempts
          console.log(`⏳ Still crawling... (${attempts}s elapsed)`)
        }
      } catch (err) {
        console.error('Error checking data:', err)
      }
    }, 1000) // Check every second
    
  } catch (err) {
    error.value = 'Failed to initiate crawl. Please try again later.'
    console.error('Error triggering crawl:', err)
    loading.value = false
  }
}

onMounted(() => {
  startTracking()
  trackPageView('/attractionsg', { platform: 'attractionsg' })

  if (scrollState.value.shouldRestore && scrollState.value.position > 0) {
    pendingScrollRestore.value = true
    targetScrollPosition.value = scrollState.value.position
    visibleCount.value = Math.max(
      Math.min(scrollState.value.visibleCount || ITEMS_PER_BATCH, filteredTickets.value.length || ITEMS_PER_BATCH),
      ITEMS_PER_BATCH
    )
  } else {
    visibleCount.value = ITEMS_PER_BATCH
  }

  // Auto-load tickets on mount
  loadTickets()

  if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
    observer.value = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            loadMoreTickets()
          }
        }
      },
      {
        rootMargin: '0px 0px 320px 0px',
        threshold: 0
      }
    )
  }
})

onBeforeUnmount(() => {
  rememberScrollPosition()
})

onUnmounted(() => {
  observer.value?.disconnect()
  observer.value = null
})

watch(
  filteredTickets,
  (items) => {
    if (!items) return
    if (!pendingScrollRestore.value) {
      visibleCount.value = Math.min(ITEMS_PER_BATCH, items.length)
    } else if (scrollState.value.visibleCount) {
      visibleCount.value = Math.min(
        Math.max(scrollState.value.visibleCount, visibleCount.value, ITEMS_PER_BATCH),
        items.length
      )
    }
    if (!pendingScrollRestore.value) return
    if (items.length === 0) return

    nextTick(() => {
      window.scrollTo({
        top: Math.max(0, targetScrollPosition.value),
        behavior: 'auto'
      })
      pendingScrollRestore.value = false
      targetScrollPosition.value = 0
      scrollState.value.position = 0
      scrollState.value.shouldRestore = false
      scrollState.value.visibleCount = 0
    })
  },
  { immediate: true }
)

watchEffect(() => {
  if (!observer.value) return
  observer.value.disconnect()
  if (loadMoreTrigger.value && hasMoreTickets.value) {
    observer.value.observe(loadMoreTrigger.value)
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

