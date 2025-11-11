<template>
  <div class="max-w-6xl mx-auto py-12 space-y-8">
    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-2xl shadow-soft p-12">
      <div class="animate-pulse space-y-6">
        <div class="h-64 bg-gray-300 rounded-2xl"></div>
        <div class="h-8 bg-gray-300 rounded w-3/4"></div>
        <div class="h-4 bg-gray-300 rounded w-1/2"></div>
        <div class="h-24 bg-gray-300 rounded"></div>
      </div>
    </div>

    <!-- Event Detail -->
    <div v-else-if="event" class="bg-white rounded-2xl shadow-soft overflow-hidden">
      <!-- Hero Image -->
      <div class="relative h-96 overflow-hidden bg-gradient-to-br from-yellow-50 to-yellow-100">
        <img 
          v-if="activeImage" 
          :src="activeImage" 
          :alt="event.title"
          class="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full flex items-center justify-center relative">
          <div class="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-500 opacity-20"></div>
          <div class="bg-yellow-400 rounded-full px-12 py-6 shadow-2xl relative z-10">
            <div class="flex items-center justify-center gap-1">
              <span class="text-[#166534] font-black text-4xl tracking-tight">SG</span>
              <span class="text-[#1e3a8a] font-black text-4xl tracking-tight">ATTRACTIONS</span>
            </div>
          </div>
        </div>
        <div class="absolute top-4 left-4">
          <NuxtLink 
            to="/attractionsg" 
            class="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white transition-all font-semibold shadow-lg"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Attractions
          </NuxtLink>
        </div>
      </div>

      <!-- Gallery Thumbnails -->
      <div v-if="galleryImages.length > 1" class="px-8 md:px-12 pt-6">
        <div class="flex gap-4 overflow-x-auto pb-2">
          <button
            v-for="(image, index) in galleryImages"
            :key="image"
            @click="setActiveImage(index)"
            class="relative w-24 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2"
            :class="index === activeImageIndex ? 'border-green-500' : 'border-transparent hover:border-green-300'"
          >
            <img :src="image" :alt="`${event.title} photo ${index + 1}`" class="w-full h-full object-cover" />
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-8 md:p-12">
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Main Content -->
          <div class="flex-1 space-y-6">
            <div>
              <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ event.title }}</h1>
              
              <div v-if="event.price || event.originalPrice" class="flex items-baseline gap-3 mb-4">
                <span v-if="event.price" class="text-4xl font-bold text-green-600">{{ event.price }}</span>
                <span v-if="event.originalPrice" class="text-2xl text-gray-500 line-through">{{ event.originalPrice }}</span>
              </div>

              <div v-if="event.rating" class="flex items-center gap-2 mb-4">
                <svg class="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                </svg>
                <span class="text-gray-700 font-semibold">{{ event.rating }} / 5.0</span>
              </div>
            </div>

            <div v-if="event.description" class="prose max-w-none">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">About</h2>
              <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ event.description }}</p>
            </div>

            <div
              v-if="copyMessage"
              class="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-2"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{{ copyMessage }}</span>
            </div>

            <!-- Ticket Options -->
            <div v-if="hasOptions" class="space-y-4 pt-8 border-t border-gray-200">
              <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 class="text-2xl font-bold text-gray-900">Available Ticket Options</h2>
                  <p class="text-gray-600 text-sm">
                    Compare packages, promo codes and validity before you book.
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-1 gap-4">
                <div
                  v-for="option in ticketOptions"
                  :key="option.code || option.name"
                  class="border border-gray-200 rounded-2xl p-6 shadow-sm hover:border-emerald-300 transition-colors bg-white/60"
                >
                  <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div class="space-y-2">
                      <h3 class="text-xl font-semibold text-gray-900">
                        {{ option.name || 'Ticket Option' }}
                      </h3>
                      <div class="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                        <span v-if="option.code" class="px-2 py-1 bg-emerald-100 text-emerald-700 font-mono rounded-lg">
                          {{ option.code }}
                        </span>
                        <span v-if="option.validity">{{ option.validity }}</span>
                        <span v-if="option.details" class="text-gray-500">{{ option.details }}</span>
                      </div>
                    </div>
                    <div class="text-right">
                      <div v-if="option.priceText" class="text-3xl font-bold text-emerald-600">
                        {{ option.priceText }}
                      </div>
                      <div
                        v-if="option.originalPriceText && option.originalPriceText !== option.priceText"
                        class="text-gray-400 line-through text-sm"
                      >
                        {{ option.originalPriceText }}
                      </div>
                      <div
                        v-if="savingsText(option)"
                        class="text-sm font-semibold text-emerald-600"
                      >
                        {{ savingsText(option) }}
                      </div>
                    </div>
                  </div>

                  <div class="flex flex-wrap gap-3 mt-4">
                    <button
                      v-if="option.code"
                      @click="copyCode(option.code)"
                      class="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:border-gray-400 transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16h8a2 2 0 002-2V7a2 2 0 00-2-2h-5l-3 3v6a2 2 0 002 2z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 16v2a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2h1" />
                      </svg>
                      Copy Code
                    </button>
                    <button
                      @click="handleRequestOption(option)"
                      class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold hover:from-emerald-700 hover:to-teal-700 transition-transform hover:-translate-y-0.5 shadow-sm"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 1.57-3 3.5S10.343 15 12 15s3-1.57 3-3.5S13.657 8 12 8z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.5 11.5c0 7-7.5 9.5-7.5 9.5s-7.5-2.5-7.5-9.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      Request via GoVietHub
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="mt-4">
              <button
                @click="handleRequestWithoutOption"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold hover:from-emerald-700 hover:to-teal-700 transition-transform hover:-translate-y-0.5 shadow-sm"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 1.57-3 3.5S10.343 15 12 15s3-1.57 3-3.5S13.657 8 12 8z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.5 11.5c0 7-7.5 9.5-7.5 9.5s-7.5-2.5-7.5-9.5a7.5 7.5 0 1115 0z" />
                </svg>
                Request via GoVietHub
              </button>
            </div>

            <!-- Additional Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-200">
              <div v-if="event.location" class="flex items-start gap-3">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-1">Location</h3>
                  <p class="text-gray-600">{{ event.location }}</p>
                </div>
              </div>

              <div v-if="event.duration" class="flex items-start gap-3">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-1">Duration</h3>
                  <p class="text-gray-600">{{ event.duration }}</p>
                </div>
              </div>

              <div v-if="event.ageRestriction" class="flex items-start gap-3">
                <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-1">Age Restriction</h3>
                  <p class="text-gray-600">{{ event.ageRestriction }}</p>
                </div>
              </div>

              <div v-if="event.cancellation" class="flex items-start gap-3">
                <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-1">Cancellation</h3>
                  <p class="text-gray-600">{{ event.cancellation }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Booking Sidebar -->
          <div class="lg:w-96">
            <div
              class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 sticky top-24"
              ref="bookingFormRef"
            >
              <h2 class="text-2xl font-bold text-gray-900 mb-6">Book Your Ticket</h2>
              
              <BookingRequestForm 
                :event-title="event.title" 
                :event-price="event.price || ''"
                :selected-option="selectedOption"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="bg-white border border-gray-200 rounded-2xl p-12 text-center space-y-4">
      <div class="flex justify-center">
        <div class="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center">
          <span class="text-3xl">🔍</span>
        </div>
      </div>
      <h3 class="text-2xl font-bold text-gray-900">
        {{ notFound ? 'This attraction is unavailable' : 'Event not found' }}
      </h3>
      <p class="text-gray-600 max-w-lg mx-auto">
        {{ notFound
          ? 'This experience has been unpublished or is temporarily unavailable. Please browse our other Singapore attractions.'
          : 'The requested attraction could not be found. It may have expired or the link is incorrect.'
        }}
      </p>
      <NuxtLink 
        to="/attractionsg" 
        class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-colors font-semibold"
      >
        Browse All Attractions
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue'
import BookingRequestForm from '~/components/BookingRequestForm.vue'

const route = useRoute()
const loading = ref(true)
const event = ref(null)
const notFound = ref(false)
const selectedOption = ref(null)
const bookingFormRef = ref(null)
const copyMessage = ref('')
let copyTimeout = null

const requestURL = useRequestURL()
const baseUrl = computed(() => `${requestURL.protocol}//${requestURL.host}`)

const initialSlugParam = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug
const currentSlug = ref(initialSlugParam)

const ticketOptions = computed(() => {
  const options = event.value?.options || event.value?.raw?.options || []
  return Array.isArray(options) ? options : []
})

const galleryImages = computed(() => {
  const images = [
    event.value?.image,
    ...(Array.isArray(event.value?.gallery) ? event.value.gallery : [])
  ].filter((value, index, self) => value && self.indexOf(value) === index)
  return images
})

const activeImageIndex = ref(0)

const activeImage = computed(() => galleryImages.value[activeImageIndex.value] || null)

const setActiveImage = (index) => {
  activeImageIndex.value = index
}

const hasOptions = computed(() => ticketOptions.value.length > 0)

const savingsText = (option) => {
  if (!option?.originalPriceAmount || !option?.priceAmount) return ''
  const diff = option.originalPriceAmount - option.priceAmount
  if (diff <= 0) return ''
  return `Save ${formatCurrency(diff)}`
}

const formatCurrency = (amount) => {
  if (typeof amount !== 'number' || Number.isNaN(amount)) return ''
  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency: 'SGD'
  }).format(amount)
}

const filterPublished = (items) => {
  return (items || []).filter((item) => item && item.isPublished === true)
}

const handleRequestOption = (option) => {
  selectedOption.value = option
  nextTick(() => {
    if (bookingFormRef.value?.scrollIntoView) {
      bookingFormRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
}

const handleRequestWithoutOption = () => {
  selectedOption.value = null
  nextTick(() => {
    if (bookingFormRef.value?.scrollIntoView) {
      bookingFormRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
}

const copyCode = async (code) => {
  if (!code) return
  try {
    await navigator.clipboard.writeText(code)
    copyMessage.value = `Copied ${code} to clipboard`
  } catch (err) {
    console.error('Clipboard error:', err)
    copyMessage.value = 'Copy failed, please copy manually.'
  } finally {
    if (copyTimeout) clearTimeout(copyTimeout)
    copyTimeout = setTimeout(() => {
      copyMessage.value = ''
    }, 4000)
  }
}

const resolveImageUrl = (image?: string | null) => {
  if (!image) return `${baseUrl.value}/sg-attractions-logo.svg`
  if (image.startsWith('//')) return `https:${image}`
  if (/^https?:\/\//i.test(image)) return image
  return `${baseUrl.value}${image.startsWith('/') ? image : `/${image}`}`
}

const shareImage = computed(() => resolveImageUrl(activeImage.value || event.value?.image))
const pageTitle = computed(() =>
  event.value ? `${event.value.title} | Singapore Attractions Deals | GoVietHub` : 'Attraction Details | GoVietHub'
)
const pageDescription = computed(() =>
  event.value?.description || 'Book Singapore attractions with exclusive deals from GoVietHub.'
)
const canonicalUrl = computed(() =>
  `${baseUrl.value}/attractionsg/${event.value?.slug || event.value?.id || currentSlug.value || ''}`
)

onMounted(async () => {
  console.log(`🔍 Looking for event with slug/ID: ${currentSlug.value}`)
  notFound.value = false
  
  try {
    // Fetch all events (slug already contains the ID)
    let allEvents = []
    
    try {
      console.log('📡 Trying API endpoint...')
      const res = await $fetch('/api/attractionsg/events', {
        method: 'POST',
        body: {
          limit: 1000 // Get all events to find by ID
        }
      })
      console.log('📊 Detail page API response:', res)
      allEvents = filterPublished(res.data || [])
      console.log(`✅ API returned ${allEvents.length} events`)
    } catch (apiErr) {
      console.error('❌ API error, trying direct fetch:', apiErr)
    }
    
    console.log(`📊 Total events loaded: ${allEvents.length}`)
    console.log(`🔍 First 3 event IDs:`, allEvents.slice(0, 3).map(e => e.id))
    
    // Find the matching event by ID
    const foundEvent = allEvents.find(e => e.slug === currentSlug.value || e.id === currentSlug.value)
    
    if (foundEvent) {
      console.log(`✅ Found event: ${foundEvent.title}`)
      event.value = foundEvent
      notFound.value = false
      currentSlug.value = foundEvent.slug || foundEvent.id || currentSlug.value
      if (foundEvent.slug && foundEvent.slug !== initialSlugParam) {
        console.log(`🔄 Updating slug in URL to canonical slug: ${foundEvent.slug}`)
        navigateTo(`/attractionsg/${foundEvent.slug}`, { replace: true })
      }
    } else {
      console.error(`❌ Event not found or unpublished with slug/ID: ${currentSlug.value}`)
      notFound.value = true
    }
  } catch (err) {
    console.error('❌ Error loading event:', err)
  } finally {
    loading.value = false
  }
})

watch(
  () => event.value,
  (value) => {
    if (!value) {
      selectedOption.value = null
      activeImageIndex.value = 0
    } else {
      activeImageIndex.value = 0
    }
  }
)

watch(
  galleryImages,
  (images) => {
  if (!Array.isArray(images) || images.length === 0) {
    activeImageIndex.value = 0
    return
  }
  if (activeImageIndex.value >= images.length) {
    activeImageIndex.value = 0
  }
  },
  { immediate: true }
)

// SEO
useHead(() => ({
  title: pageTitle.value,
  meta: [
    { name: 'description', content: pageDescription.value },
    { property: 'og:title', content: pageTitle.value },
    { property: 'og:description', content: pageDescription.value },
    { property: 'og:image', content: shareImage.value },
    { property: 'og:url', content: canonicalUrl.value },
    { property: 'og:type', content: 'article' },
    { property: 'og:site_name', content: 'GoVietHub' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: pageTitle.value },
    { name: 'twitter:description', content: pageDescription.value },
    { name: 'twitter:image', content: shareImage.value }
  ],
  link: [
    { rel: 'canonical', href: canonicalUrl.value }
  ]
}))

onUnmounted(() => {
  if (copyTimeout) clearTimeout(copyTimeout)
})
</script>
