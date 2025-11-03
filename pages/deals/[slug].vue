<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <!-- Loading State -->
    <div v-if="loading" class="max-w-4xl mx-auto px-4 py-16">
      <div class="text-center">
        <div class="animate-spin text-blue-600 text-4xl mb-4">⏳</div>
        <p class="text-gray-600">Loading deal...</p>
      </div>
    </div>

    <!-- Deal Not Found -->
    <div v-else-if="!deal" class="max-w-4xl mx-auto px-4 py-16">
      <div class="bg-white rounded-2xl shadow-lg p-12 text-center">
        <div class="text-6xl mb-4">😔</div>
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Deal Not Found</h1>
        <p class="text-gray-600 mb-8">This deal may have expired or been removed.</p>
        <NuxtLink
          to="/deals"
          class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          View All Deals →
        </NuxtLink>
      </div>
    </div>

    <!-- Deal Details -->
    <div v-else class="max-w-4xl mx-auto px-4 py-8">
      <!-- Back Button -->
      <NuxtLink
        to="/deals"
        class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 font-medium"
      >
        ← Back to All Deals
      </NuxtLink>

      <!-- Deal Card -->
      <div class="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 mb-8">
        <!-- Share Button - Top Right Corner -->
        <button
          @click="handleShareClick"
          class="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-blue-600 transition-colors duration-200 flex items-center justify-center shadow-lg"
          title="Share Deal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>

        <!-- Hero Image -->
        <div
          v-if="deal.imageUrl"
          class="relative h-64 md:h-96 bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden"
        >
          <img
            :src="deal.imageUrl"
            :alt="deal.title"
            class="w-full h-full object-cover"
            @error="handleImageError"
          />
          <div class="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
            -{{ deal.discountPercent || deal.discount || 0 }}%
          </div>
          <div class="absolute top-16 left-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-semibold flex items-center gap-1.5">
            <KlookIcon v-if="deal.platform === 'klook'" :size="16" />
            <span>{{ deal.platform === 'klook' ? 'Klook' : getPlatformIcon(deal.platform || 'trip') }}</span>
          </div>
        </div>

        <!-- Deal Content -->
        <div class="p-6 md:p-8">
          <!-- Badges -->
          <div class="mb-4 flex flex-wrap gap-2">
            <span v-if="deal.badge" class="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-lg">
              {{ deal.badge }}
            </span>
            <span v-if="deal.promoCode" class="inline-block px-3 py-1 bg-orange-100 text-orange-800 text-sm font-semibold rounded-lg font-mono">
              🎫 {{ deal.promoCode }}
            </span>
            <span v-if="deal.category" class="inline-block px-3 py-1 bg-gray-100 text-gray-800 text-sm font-semibold rounded-lg capitalize">
              {{ deal.category }}
            </span>
          </div>

          <!-- Title -->
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {{ deal.title || 'Special Deal' }}
          </h1>

          <!-- Location -->
          <p v-if="deal.location" class="text-gray-600 text-lg mb-4 flex items-center gap-2">
            <span>📍</span>
            {{ deal.location }}
          </p>

          <!-- Rating -->
          <div v-if="deal.rating" class="flex items-center gap-2 mb-6 text-yellow-500 text-lg">
            <span>⭐</span>
            <span class="font-semibold text-gray-900">{{ deal.rating }}</span>
          </div>

          <!-- Price -->
          <div class="mb-6 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
            <div class="flex items-baseline gap-4">
              <div>
                <div class="text-sm text-gray-600 mb-1">Price</div>
                <div class="flex items-baseline gap-3">
                  <span class="text-4xl font-bold text-blue-600">
                    {{ getCurrencySymbol(deal.currency || 'SGD') }}{{ formatPrice(deal.discountedPrice || deal.price) }}
                  </span>
                  <span
                    v-if="deal.originalPrice"
                    class="text-2xl text-gray-400 line-through"
                  >
                    {{ getCurrencySymbol(deal.currency || 'SGD') }}{{ formatPrice(deal.originalPrice) }}
                  </span>
                </div>
              </div>
              <div v-if="deal.discountPercent || deal.discount" class="ml-auto">
                <div class="text-3xl font-bold text-red-600">
                  {{ deal.discountPercent || deal.discount }}% OFF
                </div>
              </div>
            </div>
            <div v-if="deal.validDate" class="mt-4 text-sm text-gray-600">
              Valid until: {{ deal.validDate }}
            </div>
          </div>

          <!-- Description -->
          <div v-if="deal.description" class="mb-8">
            <h2 class="text-xl font-bold text-gray-900 mb-3">About This Deal</h2>
            <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ deal.description }}</p>
          </div>

          <!-- Promo Code Details -->
          <div v-if="deal.promoCode" class="mb-8 p-6 bg-orange-50 border-2 border-orange-200 rounded-xl">
            <h3 class="text-lg font-bold text-gray-900 mb-3">🎫 How to Use Promo Code</h3>
            <div class="space-y-3">
              <div class="flex items-start gap-3">
                <span class="font-bold text-orange-600">1.</span>
                <p class="text-gray-700">Visit <a :href="deal.affiliateLink || 'https://www.klook.com'" target="_blank" class="text-blue-600 hover:underline font-semibold">Klook.com</a></p>
              </div>
              <div class="flex items-start gap-3">
                <span class="font-bold text-orange-600">2.</span>
                <p class="text-gray-700">Browse and select your desired activity or hotel</p>
              </div>
              <div class="flex items-start gap-3">
                <span class="font-bold text-orange-600">3.</span>
                <p class="text-gray-700">During checkout, enter the promo code:</p>
              </div>
              <div class="mt-4">
                <div class="bg-white border-2 border-orange-300 rounded-lg p-4">
                  <div class="flex items-center justify-between">
                    <code class="text-2xl font-bold text-orange-700 font-mono">{{ deal.promoCode }}</code>
                    <button
                      @click="copyPromoCode(deal.promoCode)"
                      class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
                    >
                      {{ copied ? '✓ Copied!' : '📋 Copy' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-4">
            <!-- CTA Button -->
            <div>
              <a
                v-if="deal.affiliateLink && !deal.promoCode"
                :href="deal.affiliateLink"
                @click="trackClick('deal_view', deal)"
                target="_blank"
                rel="noopener noreferrer"
                class="block w-full text-center px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-bold text-lg transform hover:scale-105 shadow-lg"
              >
                View Deal on {{ deal.platform === 'klook' ? 'Klook' : deal.platform === 'trip' ? 'Trip.com' : 'Partner Site' }} →
              </a>
              <button
                v-else-if="deal.affiliateLink && deal.promoCode"
                @click="handleKlookRedirect(deal)"
                class="w-full text-center px-6 py-4 bg-gradient-to-r from-orange-600 to-pink-600 text-white rounded-xl hover:from-orange-700 hover:to-pink-700 transition-all duration-300 font-bold text-lg transform hover:scale-105 shadow-lg"
              >
                Visit Klook & Use Promo Code →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Social Share Modal -->
  <div
    v-if="showSocialShare"
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    @click="showSocialShare = false"
  >
    <div
      class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
      @click.stop
    >
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold text-gray-900">Share Deal</h3>
        <button
          @click="showSocialShare = false"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <span class="text-2xl">&times;</span>
        </button>
      </div>
      <SocialShare
        v-if="deal"
        :title="deal.title"
        :description="deal.description || `Save ${deal.discountPercent || deal.discount || 0}% on ${deal.title}`"
        :url="shareUrl"
        :deal-id="deal.id"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useActivityTracker } from '~/composables/useActivityTracker'
import SocialShare from '~/components/SocialShare.vue'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const route = useRoute()
const { trackClick } = useActivityTracker()

if (process.client) {
  console.log('🎬 [slug].vue script setup executed! Route:', route.path, 'Params:', route.params, 'Full route:', route)
  console.log('🎬 Window location:', window.location.href)
  console.log('🎬 Document ready state:', document.readyState)
}

const loading = ref(true)
const deal = ref<any>(null)
const copied = ref(false)
const showSocialShare = ref(false)

const shareUrl = computed(() => {
  if (typeof window === 'undefined') return ''
  return window.location.href
})

// Generate slug from title/description (same as deals page)
const generateSlug = (text: string): string => {
  return text
    ?.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'deal'
}

// Extract short ID from slug (format: title-slug-{shortId})
// Example: "save-on-your-1st-hotel-booking-db33107104e3" -> "db33107104e3"
const extractShortId = (slug: string): string | null => {
  // Short ID is 12 hex characters at the end
  const shortIdMatch = slug.match(/-([a-f0-9]{12})$/i)
  if (shortIdMatch) {
    return shortIdMatch[1]
  }
  
  // Fallback: try to extract last 12 hex chars
  const parts = slug.split('-')
  const lastPart = parts[parts.length - 1]
  if (lastPart && /^[a-f0-9]{8,12}$/i.test(lastPart)) {
    return lastPart.substring(lastPart.length - 12)
  }
  
  return null
}

const loadDeal = async () => {
  loading.value = true
  try {
    const slug = route.params.slug as string
    console.log('📄 Detail page - Loading deal with slug:', slug)
    
    // Extract short ID from slug
    const shortId = extractShortId(slug)
    console.log('📄 Extracted short ID:', shortId)
    
    if (!shortId) {
      console.warn('⚠️ No short ID found in slug, trying slug-only matching...')
    }

    // Load all deals and find the one matching this ID
    // Since we don't have a direct API for single deal, we'll search in all deals
    console.log('📥 Loading all deals from APIs...')
    const [tripResponse, klookPromosResponse, klookHotelsResponse] = await Promise.all([
      $fetch('/api/admin/scraper/data').catch(() => ({ success: false, data: [] })),
      $fetch('/api/klook/promo-codes').catch(() => ({ success: false, data: [] })),
      $fetch('/api/klook/hotel-deals').catch(() => ({ success: false, data: [] }))
    ])
    
    console.log('✅ APIs loaded:', {
      trip: tripResponse.success ? tripResponse.data?.length : 0,
      promos: klookPromosResponse.success ? klookPromosResponse.data?.length : 0,
      hotels: klookHotelsResponse.success ? klookHotelsResponse.data?.length : 0
    })

    let allDeals: any[] = []

    // Combine all deals
    if (tripResponse.success && tripResponse.data) {
      allDeals = [...allDeals, ...(tripResponse.data.map((d: any) => ({
        ...d,
        platform: 'trip',
        id: d.id || `trip-${d.sourceUrl?.split('/').pop() || Date.now()}`,
        affiliateLink: generateAffiliateLink(d.sourceUrl)
      })))]
    }

    if (klookPromosResponse.success && klookPromosResponse.data) {
      allDeals = [...allDeals, ...(klookPromosResponse.data.map((code: any) => ({
        id: `klook-promo-${code.id}`,
        platform: 'klook',
        title: code.promoCodeDescription || code.affiliateDescription,
        description: code.affiliateDescription,
        promoCode: code.promoCode,
        discount: code.discountPercent,
        category: 'activity',
        affiliateLink: `https://www.klook.com?promo=${code.promoCode}`,
        currency: 'SGD',
        price: 0,
        createdAt: code.createdAt
      })))]
    }

    if (klookHotelsResponse.success && klookHotelsResponse.data) {
      allDeals = [...allDeals, ...(klookHotelsResponse.data.map((hotel: any) => ({
        id: `klook-hotel-${hotel.id}`,
        platform: 'klook',
        title: hotel.hotelName || hotel.title,
        description: hotel.description,
        location: hotel.location,
        discount: hotel.discountPercent,
        category: 'hotel',
        affiliateLink: hotel.affiliateLink,
        originalPrice: Number(hotel.originalPrice) || 0,
        price: Number(hotel.price) || 0,
        discountedPrice: Number(hotel.discountedPrice) || 0,
        currency: hotel.currency || 'SGD',
        createdAt: hotel.createdAt
      })))]
    }

    // Find deal by matching short ID first (most reliable)
    console.log('🔍 Searching for deal with short ID:', shortId, 'Total deals loaded:', allDeals.length)
    
    let foundDeal: any = null
    
    if (shortId) {
      // Strategy 1: Match by short ID (most reliable)
      foundDeal = allDeals.find(d => {
        const dId = String(d.id || '')
        
        // Extract short ID from deal's full ID
        const uuidMatch = dId.match(/([a-f0-9]{8})-([a-f0-9]{4})-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i)
        if (uuidMatch) {
          const dShortId = `${uuidMatch[1]}${uuidMatch[2]}`
          if (dShortId === shortId) {
            console.log('✅ Short ID match found:', dShortId, 'for deal:', d.title)
            return true
          }
        }
        
        // Also check if short ID is in the full ID
        if (dId.includes(shortId)) {
          console.log('✅ Short ID contained in full ID:', dId, 'for deal:', d.title)
          return true
        }
        
        return false
      })
    }
    
    // Strategy 2: Fallback to slug matching if short ID not found
    if (!foundDeal) {
      console.log('⚠️ Short ID match failed, trying slug matching...')
      const titleSlug = slug.replace(/-[a-f0-9]{12}$/i, '') // Remove short ID from slug
      
      foundDeal = allDeals.find(d => {
        const dealTitleSlug = generateSlug(d.title || '')
        const dealDescSlug = generateSlug(d.description || '')
        
        if (dealTitleSlug === titleSlug || dealDescSlug === titleSlug) {
          console.log('✅ Slug match found:', titleSlug, 'for deal:', d.title)
          return true
        }
        
        return false
      })
    }
    
    if (!foundDeal) {
      console.error('❌ Deal not found!')
      console.error('Searched slug:', slug, 'Short ID:', shortId)
      console.error('Sample deals:', allDeals.slice(0, 3).map(d => ({
        id: d.id,
        title: d.title?.substring(0, 50)
      })))
    } else {
      console.log('✅ Deal found!', foundDeal.title, 'ID:', foundDeal.id)
    }

    if (foundDeal) {
      deal.value = foundDeal
      // Set SEO
      useHead({
        title: `${foundDeal.title} | GoVietHub Deals`,
        meta: [
          { name: 'description', content: foundDeal.description || `Save ${foundDeal.discountPercent || foundDeal.discount || 0}% on ${foundDeal.title}` },
          { property: 'og:title', content: foundDeal.title },
          { property: 'og:description', content: foundDeal.description || '' },
          { property: 'og:image', content: foundDeal.imageUrl || '' }
        ]
      })
    }
  } catch (error) {
    console.error('Error loading deal:', error)
  } finally {
    loading.value = false
  }
}

const generateAffiliateLink = (tripUrl?: string): string => {
  if (!tripUrl) return ''
  try {
    const url = new URL(tripUrl)
    const config = useRuntimeConfig()
    if (config.public.TRIP_ALLIANCE_ID && !url.searchParams.has('Allianceid')) {
      url.searchParams.set('Allianceid', config.public.TRIP_ALLIANCE_ID)
    }
    if (config.public.TRIP_SID && !url.searchParams.has('SID')) {
      url.searchParams.set('SID', config.public.TRIP_SID)
    }
    return url.toString()
  } catch {
    return tripUrl
  }
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(price)
}

const getCurrencySymbol = (currency: string): string => {
  const symbols: Record<string, string> = {
    SGD: 'S$',
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    VND: '₫'
  }
  return symbols[currency] || currency
}

const getPlatformIcon = (platform: string): string => {
  const icons: Record<string, string> = {
    trip: '🏨 Trip.com',
    klook: 'Klook',
    attractionsg: '🎢 SG Attractions'
  }
  return icons[platform] || '🌐 Platform'
}

const copyPromoCode = async (promoCode: string) => {
  try {
    await navigator.clipboard.writeText(promoCode)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
    trackClick('copy_promo_code', { promoCode })
  } catch (error) {
    console.error('Failed to copy:', error)
  }
}

const handleKlookRedirect = (deal: any) => {
  trackClick('klook_redirect', { dealId: deal.id, promoCode: deal.promoCode })
  window.open(deal.affiliateLink || 'https://www.klook.com', '_blank')
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  if (img.parentElement) {
    img.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500"><span class="text-6xl">✈️</span></div>'
  }
}

const handleShareClick = () => {
  showSocialShare.value = true
  if (deal.value) {
    trackClick('social_share_modal', { dealId: deal.value.id })
  }
}

// Watch for route changes (in case of client-side navigation)
watch(() => route.params.slug, (newSlug, oldSlug) => {
  console.log('🔄 Route slug changed from', oldSlug, 'to', newSlug)
  if (newSlug && newSlug !== oldSlug) {
    console.log('🔄 Loading deal for new slug:', newSlug)
    loadDeal()
  }
})

onMounted(() => {
  console.log('🎯 [slug].vue onMounted called!')
  console.log('🎯 Route path:', route.path)
  console.log('🎯 Route params:', route.params)
  console.log('🎯 Route name:', route.name)
  console.log('🎯 Route matched:', route.matched)
  
  const slug = route.params.slug as string
  if (slug) {
    console.log('🎯 Loading deal for slug:', slug)
    loadDeal()
  } else {
    console.error('❌ No slug param found in route!')
  }
})
</script>
