<template>
  <div class="space-y-6 mt-8">
    <h2 class="text-3xl font-bold text-gray-800 mb-2">🔥 Top Hotel Deals</h2>
    <p class="text-gray-600">Handpicked hotels with the best prices</p>
    
    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="n in 6" :key="n" class="bg-white rounded-2xl shadow-soft overflow-hidden animate-pulse">
        <div class="h-48 bg-gray-300"></div>
        <div class="p-4 space-y-3">
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
      <h3 class="text-xl font-bold text-red-800 mb-2">Failed to Load Hotels</h3>
      <p class="text-red-600 mb-4">{{ error }}</p>
      <button 
        @click="loadHotels"
        class="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold"
      >
        Try Again
      </button>
    </div>

    <!-- Hotels Grid -->
    <div v-else-if="hotels.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="hotel in hotels" 
        :key="hotel.hotelId" 
        class="bg-white rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 overflow-hidden group transform hover:-translate-y-1"
      >
        <div class="relative overflow-hidden">
          <img 
            :src="hotel.hotelBasicInfo.hotelImg" 
            alt="Hotel image" 
            class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110" 
          />
          <div class="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            Best Deal
          </div>
        </div>
        
        <div class="p-5">
          <h3 class="text-lg font-bold text-gray-800 mb-2 line-clamp-2 hover:text-primary-600 transition-colors">
            {{ hotel.hotelBasicInfo.hotelName }}
          </h3>
          
          <div class="flex items-center gap-1 mb-3">
            <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
            </svg>
            <span class="text-gray-600 text-sm">4.5 Rating</span>
          </div>
          
          <div class="flex items-baseline gap-2 mb-4">
            <span class="text-2xl font-bold text-primary-600">${{ hotel.lowRate }}</span>
            <span class="text-gray-500 text-sm">{{ hotel.currency }}</span>
          </div>
          
          <a
            :href="`https://www.trip.com/hotels/detail/?hotelId=${hotel.hotelBasicInfo.hotelId}&locale=en&curr=SGD&checkin=${checkin}&checkout=${checkout}`"
            target="_blank"
            class="inline-flex items-center justify-center w-full gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-3 rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 transform hover:scale-105 font-semibold shadow-md"
          >
            Book Now
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
      <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
      </svg>
      <h3 class="text-xl font-bold text-gray-700 mb-2">No Hotels Found</h3>
      <p class="text-gray-500">Try adjusting your search criteria</p>
    </div>
  </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue'

const hotels = ref([])
const loading = ref(true)
const error = ref(null)
const checkin = '2025-05-06'
const checkout = '2025-05-07'

const loadHotels = async () => {
  try {
    loading.value = true
    error.value = null
    
    const body = {
      cityId: 1376, // Johor Bahru
      checkinDate: checkin,
      checkoutDate: checkout,
      pageIndex: 1,
      pageSize: 6,
      currency: 'SGD'
    }

    const res = await $fetch('/api/trip/hotels', {
      method: 'POST',
      body
    })

    hotels.value = res.hotelList || []
  } catch (err) {
    error.value = 'Unable to fetch hotel data. Please try again later.'
    console.error('Error loading hotels:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadHotels()
})
</script>