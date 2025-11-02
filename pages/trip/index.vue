<template>
  <div class="space-y-8 pb-16">
    <!-- Hero Section for Trip.com -->
    <section class="max-w-6xl mx-auto px-4">
      <div class="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white p-12 md:p-16 rounded-2xl shadow-soft overflow-hidden animate-slide-up relative">
        <!-- Decorative background elements -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
        <div class="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
        
        <div class="relative z-10">
          <div class="flex items-center justify-center mb-6">
            <h2 class="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
              Trip.com
            </h2>
          </div>
          
          <h1 class="text-4xl md:text-5xl font-bold mb-4 text-center drop-shadow-lg">
            🏨 Discover Amazing Hotels
          </h1>
          <p class="text-lg md:text-xl text-center text-blue-100 max-w-2xl mx-auto mb-8">
            Search and book from millions of hotels worldwide with exclusive deals
          </p>
          
          <!-- Feature highlights -->
          <div class="flex flex-wrap justify-center gap-3">
            <div class="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-sm font-medium">Best Price</span>
            </div>
            <div class="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-sm font-medium">Instant Booking</span>
            </div>
            <div class="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-sm font-medium">Free Cancellation</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  
    <!-- Search Box -->
    <section class="max-w-6xl mx-auto px-4">
      <div class="bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
        <ResponsiveTripSearchBox />
      </div>
    </section>
  
    <!-- Banners -->
    <section class="max-w-6xl mx-auto px-4 space-y-4">
      <StaticBanner />
      <DynamicBanner />
    </section>

    <!-- Popular Deals -->
    <section class="max-w-6xl mx-auto px-4">
      <PopularDeals />
    </section>
  </div>
</template>
  
<script setup>
import PopularDeals from '~/components/PopularDeals.vue'
import StaticBanner from '~/components/StaticBanner.vue'
import DynamicBanner from '~/components/DynamicBanner.vue'
import ResponsiveTripSearchBox from '~/components/ResponsiveTripSearchBox.vue'
import { useActivityTracker } from '~/composables/useActivityTracker'
import { onMounted } from 'vue'

const { startTracking, trackPageView } = useActivityTracker()

onMounted(() => {
  startTracking()
  trackPageView('/trip', { platform: 'trip' })
})
</script>