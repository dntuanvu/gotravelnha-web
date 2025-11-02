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
          v-if="event.image" 
          :src="event.image" 
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
            <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 sticky top-24">
              <h2 class="text-2xl font-bold text-gray-900 mb-6">Book Your Ticket</h2>
              
              <BookingRequestForm 
                :event-title="event.title" 
                :event-price="event.price || ''"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="bg-red-50 border border-red-200 rounded-2xl p-12 text-center">
      <svg class="w-16 h-16 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
      </svg>
      <h3 class="text-xl font-bold text-red-800 mb-2">Event Not Found</h3>
      <p class="text-red-600 mb-4">The requested attraction could not be found.</p>
      <NuxtLink 
        to="/attractionsg" 
        class="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold"
      >
        Browse All Attractions
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BookingRequestForm from '~/components/BookingRequestForm.vue'

const route = useRoute()
const loading = ref(true)
const event = ref(null)

onMounted(async () => {
  const slug = route.params.slug
  console.log(`🔍 Looking for event with ID: ${slug}`)
  
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
      allEvents = res.data || []
      console.log(`✅ API returned ${allEvents.length} events`)
    } catch (apiErr) {
      console.error('❌ API error, trying direct fetch:', apiErr)
      
      // Fallback: fetch directly from public URL
      try {
        console.log('📡 Trying direct fetch from /data/...')
        const publicData = await $fetch('/data/attractionsg-events.json')
        allEvents = publicData.events || []
        console.log(`✅ Direct fetch loaded ${allEvents.length} events`)
      } catch (fallbackErr) {
        console.error('❌ Error loading from public URL:', fallbackErr)
      }
    }
    
    console.log(`📊 Total events loaded: ${allEvents.length}`)
    console.log(`🔍 First 3 event IDs:`, allEvents.slice(0, 3).map(e => e.id))
    
    // Find the matching event by ID
    const foundEvent = allEvents.find(e => e.id === slug)
    
    if (foundEvent) {
      console.log(`✅ Found event: ${foundEvent.title}`)
      event.value = foundEvent
    } else {
      console.error(`❌ Event not found with ID: ${slug}`)
    }
  } catch (err) {
    console.error('❌ Error loading event:', err)
  } finally {
    loading.value = false
  }
})

// SEO
useHead({
  title: event.value ? `${event.value.title} | GoTravelNha` : 'Attraction Details',
  meta: [
    { name: 'description', content: event.value?.description || 'Book your Singapore attraction tickets' }
  ]
})
</script>
