<template>
  <div class="space-y-8 pb-16">
    <!-- Hero Section for Klook -->
    <section class="max-w-6xl mx-auto px-4">
      <div class="bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 text-white p-12 md:p-16 rounded-2xl shadow-soft overflow-hidden animate-slide-up relative">
        <!-- Decorative background elements -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
        <div class="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
        
        <div class="relative z-10">
          <div class="flex items-center justify-center mb-6">
            <img 
              src="https://storage.googleapis.com/travella_assets_images/klook-logo.png" 
              alt="Klook" 
              class="h-16 w-auto bg-white p-3 rounded-xl shadow-lg"
            />
          </div>
          
          <h1 class="text-4xl md:text-5xl font-bold mb-4 text-center drop-shadow-lg">
            🎯 Discover Amazing Experiences
          </h1>
          <p class="text-lg md:text-xl text-center text-orange-100 max-w-2xl mx-auto mb-8">
            Book tours, activities, and unique experiences with instant confirmation
          </p>
          
          <!-- Feature highlights -->
          <div class="flex flex-wrap justify-center gap-3">
            <div class="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
              <span class="text-sm font-medium">Verified</span>
            </div>
            <div class="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              <span class="text-sm font-medium">Instant Confirmation</span>
            </div>
            <div class="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span class="text-sm font-medium">Best Deals</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Category Pills -->
    <section class="max-w-6xl mx-auto px-4">
      <div class="mb-6">
        <h2 class="text-3xl font-bold text-gray-800 mb-2">🎨 Explore by Category</h2>
        <p class="text-gray-600">Find the perfect activity for your trip</p>
      </div>
      
      <div class="flex flex-wrap gap-3 mb-8">
        <button
          v-for="category in categories"
          :key="category.name"
          @click="scrollToWidget(category)"
          class="group px-6 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all transform hover:-translate-y-1 shadow-soft"
        >
          <div class="flex items-center gap-3">
            <span class="text-2xl">{{ category.icon }}</span>
            <span class="font-semibold text-gray-700 group-hover:text-primary-700">{{ category.name }}</span>
          </div>
        </button>
      </div>
    </section>

    <!-- Klook Widget -->
    <section id="klook-widget" class="max-w-6xl mx-auto px-4">
      <div class="bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
        <div class="text-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-2">Search Activities</h2>
          <p class="text-gray-600">
            Find tours, tickets, and experiences worldwide
          </p>
        </div>
        <div class="bg-gray-50 p-6 rounded-xl">
          <ins class="klk-aff-widget" data-wid="89020" data-height="400px" data-adid="1045566" data-lang="" data-prod="search_vertical" data-currency="">
            <a href="//www.klook.com/?aid=">Klook.com</a>
          </ins>
        </div>
      </div>
    </section>

  </div>
</template>
  
<script setup>
import { useActivityTracker } from '~/composables/useActivityTracker'
import { onMounted } from 'vue'
  
const { startTracking, trackPageView, trackClick } = useActivityTracker()

const categories = [
  { name: 'Attractions', icon: '🏰' },
  { name: 'Tours', icon: '🚶' },
  { name: 'Theme Parks', icon: '🎢' },
  { name: 'Transportation', icon: '🚌' },
  { name: 'Food & Drink', icon: '🍜' },
  { name: 'Culture & Classes', icon: '🎨' }
]

const scrollToWidget = (category) => {
  trackClick('category', { name: category.name })
  
  // Smooth scroll to widget
  const widgetElement = document.getElementById('klook-widget')
  if (widgetElement) {
    widgetElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

onMounted(() => {
  startTracking()
  trackPageView('/klook', { platform: 'klook' })
  
  const script = document.createElement('script');
  script.src = 'https://affiliate.klook.com/widget/fetch-iframe-init.js';
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);
});
</script>