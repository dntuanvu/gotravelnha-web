<template>
  <div class="space-y-8 pb-16">
    <!-- Hero Section for AttractionsSG -->
    <section class="max-w-6xl mx-auto px-4">
      <div class="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 text-white p-12 md:p-16 rounded-2xl shadow-soft overflow-hidden animate-slide-up relative">
        <!-- Decorative background elements -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
        <div class="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
        
        <div class="relative z-10">
          <div class="flex items-center justify-center mb-6">
            <div class="bg-yellow-400 rounded-full px-8 py-4 shadow-2xl">
              <div class="flex items-center justify-center gap-1">
                <span class="text-[#166534] font-black text-3xl md:text-4xl tracking-tight">SG</span>
                <span class="text-[#1e3a8a] font-black text-3xl md:text-4xl tracking-tight">ATTRACTIONS</span>
              </div>
            </div>
          </div>
          
          <h1 class="text-4xl md:text-5xl font-bold mb-4 text-center drop-shadow-lg">
            Singapore Attractions & Tickets
          </h1>
          <p class="text-lg md:text-xl text-center text-green-100 max-w-2xl mx-auto mb-8">
            Exclusive tickets to Singapore's top attractions and experiences
          </p>
          
          <!-- Feature highlights -->
          <div class="flex flex-wrap justify-center gap-3 mb-8">
            <div class="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-sm font-medium">Best Prices</span>
            </div>
            <div class="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-sm font-medium">Instant E-tickets</span>
            </div>
            <div class="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-sm font-medium">24/7 Support</span>
            </div>
          </div>

          <!-- CTA Button -->
          <div class="flex flex-wrap justify-center gap-4">
            <a
              href="#categories"
              class="group px-8 py-4 bg-white text-green-700 rounded-xl hover:bg-gray-100 font-bold transition-all transform hover:scale-105 shadow-xl flex items-center gap-2"
            >
              <span>🎫</span>
              Browse All Attractions
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Tickets Grid -->
    <section id="categories" class="max-w-6xl mx-auto px-4">
      <div class="mb-6">
        <h2 class="text-3xl font-bold text-gray-800 mb-2">🎫 All Attractions & Tickets</h2>
        <p class="text-gray-600">Browse all available Singapore attractions and experiences</p>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="n in 6" :key="n" class="bg-white rounded-2xl shadow-soft overflow-hidden animate-pulse">
          <div class="h-48 bg-gray-300"></div>
          <div class="p-5 space-y-3">
            <div class="h-4 bg-gray-300 rounded w-3/4"></div>
            <div class="h-4 bg-gray-300 rounded w-1/2"></div>
            <div class="h-10 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <svg class="w-16 h-16 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
        <h3 class="text-xl font-bold text-red-800 mb-2">Failed to Load Tickets</h3>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button 
          @click="loadTickets"
          class="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold"
        >
          Try Again
        </button>
      </div>

      <!-- Controls -->
      <div v-if="tickets.length > 0" class="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div class="flex-1">
          <label class="sr-only" for="search">Search attractions</label>
          <div class="relative">
            <input
              id="search"
              v-model="searchTerm"
              type="search"
              placeholder="Search by attraction name or location..."
              class="w-full px-4 py-3 pl-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            />
            <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 117.5-7.5 7.5 7.5 0 01-7.5 7.5z"></path>
            </svg>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row gap-3 flex-shrink-0">
          <div class="flex items-center gap-2">
            <label for="sort" class="text-sm font-medium text-gray-600">Sort by</label>
            <select
              id="sort"
              v-model="sortOption"
              class="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
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
      <div v-if="filteredTickets.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="ticket in filteredTickets" 
          :key="ticket.id || ticket.title" 
          class="bg-white rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 overflow-hidden group transform hover:-translate-y-1 flex flex-col cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
              alt="Ticket image" 
              class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
              @error="handleImageError"
            />
            <div v-else class="w-full h-48 bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center relative">
              <div class="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-500 opacity-20"></div>
              <div class="bg-yellow-400 rounded-full px-6 py-3 shadow-xl relative z-10">
                <div class="flex items-center justify-center gap-1">
                  <span class="text-[#166534] font-black text-xl tracking-tight">SG</span>
                  <span class="text-[#1e3a8a] font-black text-xl tracking-tight">ATTRACTIONS</span>
                </div>
              </div>
            </div>
            <div v-if="ticket.originalPrice" class="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              Special Deal
            </div>
          </div>
          
          <div class="p-5 flex flex-col flex-1">
            <h3 class="text-lg font-bold text-gray-800 mb-2 line-clamp-2 hover:text-green-600 transition-colors min-h-[3.5rem]">
              {{ ticket.title }}
            </h3>
            
            <p v-if="ticket.description" class="text-gray-600 text-sm mb-3 line-clamp-3 flex-grow">
              {{ ticket.description }}
            </p>

            <div v-if="ticket.location" class="flex items-center gap-1 mb-3 text-gray-600 text-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span class="truncate">{{ ticket.location }}</span>
            </div>

            <div class="flex items-baseline gap-2 mb-4">
              <span v-if="ticket.price" class="text-2xl font-bold text-green-600">{{ ticket.price }}</span>
              <span v-if="ticket.originalPrice" class="text-sm text-gray-500 line-through">{{ ticket.originalPrice }}</span>
            </div>
            
            <div v-if="ticket.lastUpdated" class="text-xs text-gray-500 mb-3">
              Updated {{ formatRelativeTime(ticket.lastUpdated) }}
            </div>
            
            <NuxtLink
              :to="`/attractionsg/${ticket.slug || ticket.id}`"
              class="inline-flex items-center justify-center w-full gap-2 bg-gradient-to-r from-green-600 to-emerald-700 text-white px-4 py-3 rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all duration-300 transform hover:scale-105 font-semibold shadow-md mt-auto"
              @click.stop
            >
              View Details
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- No Matches -->
      <div v-else-if="tickets.length > 0" class="bg-white border border-gray-200 rounded-2xl p-12 text-center space-y-4">
        <h3 class="text-xl font-bold text-gray-800">No attractions match your filters</h3>
        <p class="text-gray-600">Try adjusting your search keywords or filter selections.</p>
        <button
          @click="resetFilters"
          class="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-semibold"
        >
          Reset filters
        </button>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-dashed border-yellow-300 rounded-2xl p-12 text-center">
        <svg class="w-16 h-16 mx-auto text-yellow-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
        <h3 class="text-xl font-bold text-gray-700 mb-2">No Events Available Yet</h3>
        <p class="text-gray-600 mb-4">Start by crawling AttractionsSG data to populate events</p>
        <button
          @click="triggerCrawl"
          class="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:from-green-700 hover:to-emerald-800 font-semibold transition-all transform hover:scale-105 shadow-md flex items-center gap-2 mx-auto"
        >
          <span>🕷️</span>
          Crawl AttractionsSG Data
        </button>
      </div>
    </section>
  </div>
</template>
  
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, computed } from 'vue'
import { useActivityTracker } from '~/composables/useActivityTracker'

const { startTracking, trackPageView } = useActivityTracker()

const tickets = ref([])
const loading = ref(false)
const error = ref(null)

// Store scroll position when navigating away
let savedScrollPosition = 0

const sortOption = ref('alpha')
const searchTerm = ref('')

const loadTickets = async () => {
  try {
    loading.value = true
    error.value = null
    
    console.log('📡 loadTickets: Trying API endpoint...')
    const res = await $fetch('/api/attractionsg/events', {
      method: 'POST',
      body: {
        page: 1,
        limit: 50,
        sortBy: sortOption.value === 'priceAsc' || sortOption.value === 'priceDesc' ? 'price' : sortOption.value === 'alpha' ? 'title' : 'date',
        sortOrder: sortOption.value === 'priceAsc' || sortOption.value === 'alpha' ? 'asc' : 'desc'
      }
    })

    console.log('📊 loadTickets: API response:', res)
    tickets.value = res.data || []
    console.log(`📊 loadTickets: API returned ${tickets.value.length} tickets`)
    
    // Fallback: If no data, try direct fetch from public URL
    if (tickets.value.length === 0) {
      console.log('⚠️ loadTickets: API returned no data, trying direct fetch...')
      try {
        const publicData = await $fetch('/data/attractionsg-events.json')
        console.log('📊 loadTickets: Direct fetch response:', publicData)
        tickets.value = publicData.events || []
        console.log(`✅ loadTickets: Loaded ${tickets.value.length} events from public URL`)
      } catch (fallbackErr) {
        console.error('❌ loadTickets: Error loading from public URL:', fallbackErr)
      }
    }
  } catch (err) {
    console.error('❌ loadTickets: API error:', err)
    error.value = 'Unable to fetch tickets. Please try again later.'
    
    // Last resort: try direct fetch
    try {
      console.log('⚠️ loadTickets: API failed, trying direct fetch as last resort...')
      const publicData = await $fetch('/data/attractionsg-events.json')
      console.log('📊 loadTickets: Last resort response:', publicData)
      tickets.value = publicData.events || []
      console.log(`✅ loadTickets: Loaded ${tickets.value.length} events from public URL`)
      error.value = null // Clear error if successful
    } catch (fallbackErr) {
      console.error('❌ loadTickets: Error loading from public URL:', fallbackErr)
    }
  } finally {
    loading.value = false
  }
}

const handleCardClick = (ticket: any) => {
  if (!ticket) return
  const slug = ticket.slug || ticket.id
  if (!slug) return
  navigateTo(`/attractionsg/${slug}`)
}

const handleImageError = (event) => {
  event.target.style.display = 'none'
}

const normalizedTickets = computed(() => {
  return tickets.value.map(ticket => {
    const priceAmount = typeof ticket.priceAmount === 'number'
      ? ticket.priceAmount
      : parseFloat(String(ticket.price || '').replace(/[^0-9.]/g, '')) || null
    const lastUpdated = ticket.lastUpdated ? new Date(ticket.lastUpdated) : null
    return {
      ...ticket,
      priceAmount,
      lastUpdated
    }
  })
})

const sortedTickets = computed(() => {
  const items = [...normalizedTickets.value]
  switch (sortOption.value) {
    case 'priceAsc':
      return items.sort((a, b) => (a.priceAmount ?? Infinity) - (b.priceAmount ?? Infinity))
    case 'priceDesc':
      return items.sort((a, b) => (b.priceAmount ?? -Infinity) - (a.priceAmount ?? -Infinity))
    case 'latest':
      return items.sort((a, b) => {
        const aTime = a.lastUpdated ? a.lastUpdated.getTime() : 0
        const bTime = b.lastUpdated ? b.lastUpdated.getTime() : 0
        return bTime - aTime
      })
    case 'alpha':
    default:
      return items.sort((a, b) => a.title.localeCompare(b.title))
  }
})

const filteredTickets = computed(() => {
  return sortedTickets.value.filter(ticket => {
    const matchSearch = !searchTerm.value ||
      ticket.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      (ticket.location && ticket.location.toLowerCase().includes(searchTerm.value.toLowerCase()))
    return matchSearch
  })
})

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
        const res = await $fetch('/api/attractionsg/events', {
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
  
  // Restore scroll position if available
  if (savedScrollPosition > 0) {
    nextTick(() => {
      window.scrollTo({ top: savedScrollPosition, behavior: 'instant' })
    })
  }
  
  // Auto-load tickets on mount
  loadTickets()
})

onBeforeUnmount(() => {
  // Save scroll position when navigating away
  savedScrollPosition = window.scrollY
})

// Also save on page visibility change or before unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('attractionsg_scroll', window.scrollY.toString())
  })
  
  // Try to restore from sessionStorage on mount
  const saved = sessionStorage.getItem('attractionsg_scroll')
  if (saved) {
    savedScrollPosition = parseInt(saved, 10)
    sessionStorage.removeItem('attractionsg_scroll')
  }
}
</script>
