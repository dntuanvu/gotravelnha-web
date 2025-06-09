<template>
    <div class="space-y-6 mt-8">
      <h2 class="text-2xl font-bold">Top Hotel Deals</h2>
      <div v-if="loading">Loading hotels...</div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <div v-for="hotel in hotels" :key="hotel.hotelId" class="bg-white p-4 rounded shadow">
          <img :src="hotel.hotelBasicInfo.hotelImg" alt="Hotel image" class="w-full h-48 object-cover mb-2 rounded" />
          <h3 class="text-lg font-semibold">{{ hotel.hotelBasicInfo.hotelName }}</h3>
          
          <p class="text-blue-600 font-semibold mt-1">From {{ hotel.lowRate }} {{ hotel.currency }}</p>
          <a
            :href="`https://www.trip.com/hotels/detail/?hotelId=${hotel.hotelBasicInfo.hotelId}&locale=en&curr=SGD&checkin=${checkin}&checkout=${checkout}`"
            target="_blank"
            class="inline-block mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Book Now
          </a>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const hotels = ref([])
  const loading = ref(true)
  const checkin = '2025-05-06'
  const checkout = '2025-05-07'
  
  onMounted(async () => {
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
    loading.value = false
  })
  </script>