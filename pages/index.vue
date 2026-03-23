<template>
  <div class="space-y-6 sm:space-y-12 pb-12 sm:pb-20 animate-fade-in bg-gradient-to-b from-white to-slate-50 min-h-screen">
    <!-- Mobile App Style Hero Section (Mobile Only) -->
    <section class="lg:hidden max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
      <!-- Mobile Native Header -->
      <div class="mb-6 sm:mb-8">
        <!-- Greeting -->
        <div class="mb-3 sm:mb-4">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
            Welcome to GoVietHub!
          </h1>
          <p class="text-lg sm:text-xl font-semibold text-slate-700">
            Where do you want to go?
          </p>
        </div>

        <!-- Category Filters (Platform Navigation) -->
        <div class="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          <button
            type="button"
            @click="openFunnelDeal('activity')"
            class="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm whitespace-nowrap transition-all touch-manipulation min-h-[48px] bg-white text-slate-700 shadow-md hover:shadow-lg hover:bg-slate-50 active:scale-95"
          >
            <KlookIcon :size="20" />
            <span>Klook</span>
          </button>
          <button
            type="button"
            @click="openFunnelDeal('flight')"
            class="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm whitespace-nowrap transition-all touch-manipulation min-h-[48px] bg-white text-slate-700 shadow-md hover:shadow-lg hover:bg-slate-50 active:scale-95"
          >
            <span class="text-lg">✈️</span>
            <span>Flights</span>
          </button>
          <button
            type="button"
            @click="openFunnelDeal('hotel')"
            class="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm whitespace-nowrap transition-all touch-manipulation min-h-[48px] bg-white text-slate-700 shadow-md hover:shadow-lg hover:bg-slate-50 active:scale-95"
          >
            <span class="text-lg">🏨</span>
            <span>Hotels</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Desktop Hero Section (Hidden on Mobile) -->
    <section class="hidden lg:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 lg:pt-1">
      <div class="relative bg-gradient-to-br from-emerald-600 via-teal-700 to-sky-800 rounded-[40px] shadow-2xl overflow-hidden border border-emerald-500/30">
        <!-- Animated Background Elements -->
        <div class="absolute inset-0 opacity-20">
          <!-- Floating orbs with animation -->
          <div class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full -mr-48 -mt-48 blur-3xl animate-float"></div>
          <div class="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-300 to-red-400 rounded-full -ml-48 -mb-48 blur-3xl animate-float-delayed"></div>
          <div class="absolute top-1/3 left-1/4 w-72 h-72 bg-gradient-to-br from-cyan-300 to-blue-400 rounded-full blur-3xl animate-float"></div>
          <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-green-300 to-teal-400 rounded-full blur-3xl animate-float-delayed"></div>
        </div>

        <!-- Content -->
        <div class="relative z-10 px-5 py-8 sm:px-6 sm:py-10 md:px-12 md:py-16">
          <!-- Animated Badge -->
          <div class="flex justify-center mb-4 sm:mb-5 animate-fade-in">
            <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/20">
              <span class="text-white/90 font-semibold text-xs sm:text-sm">Your All-in-One Travel Platform</span>
            </div>
          </div>

          <!-- Headline with animations -->
          <div class="text-center mb-6 sm:mb-8 space-y-3 sm:space-y-4">
            <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-4 sm:mb-6 leading-[1.1] animate-slide-up px-2">
              <span class="inline-block hover:scale-110 transition-transform duration-300 bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">Go</span>
              <span class="inline-block hover:scale-110 transition-transform duration-300 delay-75 bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">Viet</span>
              <span class="inline-block hover:scale-110 transition-transform duration-300 delay-150 bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">Hub</span>
            </h1>
            
            <!-- Enhanced Tagline -->
            <p class="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-white mb-4 sm:mb-6 font-black max-w-4xl mx-auto leading-tight animate-slide-up-delayed drop-shadow-2xl px-2">
              Discover, Compare & Book
            </p>

            <!-- Enhanced Description -->
            <p class="text-base sm:text-lg md:text-xl lg:text-2xl text-emerald-50 max-w-3xl mx-auto leading-relaxed mb-2 sm:mb-3 animate-fade-in-delayed font-medium px-3">
              Compare deals across <span class="font-bold text-white">Trip.com</span> and <span class="font-bold text-white">Klook</span>
            </p>
            <p class="text-xs sm:text-sm md:text-base text-emerald-100/80 max-w-3xl mx-auto italic animate-fade-in-delayed px-3">
              formerly known as GoTravelNha
            </p>
          </div>

          <!-- Enhanced Quick Access Pills with better animations -->
          <div class="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-10 animate-slide-up-delayed px-2">
            <button type="button" @click="openFunnelDeal('activity')" class="group bg-white/95 backdrop-blur-md px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl hover:bg-white active:scale-95 transition-all cursor-pointer border border-white/50 shadow-xl hover:shadow-2xl touch-manipulation w-full sm:w-auto min-h-[56px] flex items-center justify-center">
              <div class="flex items-center gap-2.5 sm:gap-3">
                <KlookIcon :size="22" class="sm:w-6 sm:h-6 group-hover:scale-110 transition-transform duration-300" />
                <span class="text-slate-900 font-bold text-base sm:text-lg">Klook</span>
                <svg class="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-600 transition-all duration-300 hidden sm:inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </div>
            </button>
            <button type="button" @click="openFunnelDeal('flight')" class="group bg-white/95 backdrop-blur-md px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl hover:bg-white active:scale-95 transition-all cursor-pointer border border-white/50 shadow-xl hover:shadow-2xl touch-manipulation w-full sm:w-auto min-h-[56px] flex items-center justify-center">
              <div class="flex items-center gap-2.5 sm:gap-3">
                <span class="text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-300">✈️</span>
                <span class="text-slate-900 font-bold text-base sm:text-lg">Flights</span>
                <svg class="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-600 transition-all duration-300 hidden sm:inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </div>
            </button>
            <button type="button" @click="openFunnelDeal('hotel')" class="group bg-white/95 backdrop-blur-md px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl hover:bg-white active:scale-95 transition-all cursor-pointer border border-white/50 shadow-xl hover:shadow-2xl touch-manipulation w-full sm:w-auto min-h-[56px] flex items-center justify-center">
              <div class="flex items-center gap-2.5 sm:gap-3">
                <span class="text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-300">🏨</span>
                <span class="text-slate-900 font-bold text-base sm:text-lg">Hotels</span>
                <svg class="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-600 transition-all duration-300 hidden sm:inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </div>
            </button>
          </div>

          <!-- Enhanced Trust Badges with icons -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto animate-fade-in px-2">
            <div class="flex flex-col items-center gap-2 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all group">
              <div class="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <span class="text-white font-bold text-sm md:text-base">Secure & Safe</span>
            </div>
            <div class="flex flex-col items-center gap-2 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all group">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <span class="text-white font-bold text-sm md:text-base">Best Prices</span>
            </div>
            <div class="flex flex-col items-center gap-2 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all group">
              <div class="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <span class="text-white font-bold text-sm md:text-base">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Deals Hub Funnel -->
    <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 md:p-10">
        <div class="text-center mb-6">
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900">Plan Fast With Deals Hub</h2>
          <p class="text-slate-600 mt-2">Start from your intent and jump straight to tracked partner offers.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            type="button"
            @click="openFunnelDeal('flight')"
            class="group rounded-2xl border border-slate-200 p-5 hover:border-emerald-300 hover:bg-emerald-50/40 transition-colors"
          >
            <div class="text-3xl mb-3">✈️</div>
            <h3 class="text-lg font-bold text-slate-900">Flights</h3>
            <p class="text-sm text-slate-600 mt-1">Compare airline booking entry points quickly.</p>
          </button>
          <button
            type="button"
            @click="openFunnelDeal('hotel')"
            class="group rounded-2xl border border-slate-200 p-5 hover:border-emerald-300 hover:bg-emerald-50/40 transition-colors"
          >
            <div class="text-3xl mb-3">🏨</div>
            <h3 class="text-lg font-bold text-slate-900">Hotels</h3>
            <p class="text-sm text-slate-600 mt-1">Open the best hotel booking routes in one click.</p>
          </button>
          <button
            type="button"
            @click="openFunnelDeal('activity')"
            class="group rounded-2xl border border-slate-200 p-5 hover:border-emerald-300 hover:bg-emerald-50/40 transition-colors"
          >
            <div class="mb-3 flex justify-center">
              <KlookIcon :size="30" />
            </div>
            <h3 class="text-lg font-bold text-slate-900">Activities</h3>
            <p class="text-sm text-slate-600 mt-1">Discover tours and attraction offers faster.</p>
          </button>
        </div>
      </div>
    </section>

    <!-- Platform Cards -->
    <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8 sm:mb-12 text-center px-2">
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-3 sm:mb-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">Choose Your Adventure</h2>
        <p class="text-slate-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto px-2">
          Compare prices across top travel platforms and find the best deals for your next journey
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
        <AffiliateCard
          link="/trip"
          img="/trip-logo.png"
          desc="Great travel deals, flights, hotels."
        />
        <AffiliateCard
          link="/klook"
          img="/klook-logo.png"
          desc="Tours, activities & experiences worldwide."
        />
      </div>
    </section>

    <!-- Best Deals Section -->
    <section v-if="showPromoSection" class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-12 text-center">
        <div class="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 px-4 py-2 rounded-full mb-4">
          <span class="text-2xl">🔥</span>
          <span class="text-sm font-bold text-orange-700 uppercase tracking-wide">Hot Deals</span>
        </div>
        <h2 class="text-4xl md:text-5xl font-black text-slate-900 mb-4">Best Travel Deals</h2>
        <p class="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto">
          Handpicked offers you don't want to miss
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Top Deals Cards - Load dynamic data -->
        <NuxtLink
          v-if="showBestDealsNav"
          to="/deals?tab=promo"
          class="group bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2"
        >
          <div class="aspect-video bg-gradient-to-br from-orange-400 to-pink-500 relative overflow-hidden">
            <div class="absolute inset-0 flex items-center justify-center">
              <KlookIcon :size="64" />
            </div>
            <div class="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm">
              Up to 8% OFF
            </div>
          </div>
          <div class="p-6 text-white">
            <h3 class="text-xl font-bold mb-2 group-hover:text-yellow-200 transition-colors">Klook Promo Codes</h3>
            <p class="text-orange-100 mb-4">Exclusive discount codes for your next adventure</p>
            <div class="flex items-center justify-between">
              <span class="text-sm text-orange-200">View All Deals →</span>
              <span class="text-2xl group-hover:translate-x-2 transition-transform">✨</span>
            </div>
          </div>
        </NuxtLink>

        <NuxtLink
          v-if="showBestDealsNav"
          to="/deals?tab=hotel"
          class="group bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2"
        >
          <div class="aspect-video bg-gradient-to-br from-blue-400 to-cyan-500 relative overflow-hidden">
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-6xl">🏨</span>
            </div>
            <div class="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full font-bold text-sm">
              Big Sale
            </div>
          </div>
          <div class="p-6 text-white">
            <h3 class="text-xl font-bold mb-2 group-hover:text-blue-100 transition-colors">Premium Hotels</h3>
            <p class="text-blue-100 mb-4">Stay at luxury hotels for less</p>
            <div class="flex items-center justify-between">
              <span class="text-sm text-blue-200">View All Deals →</span>
              <span class="text-2xl group-hover:translate-x-2 transition-transform">✨</span>
            </div>
          </div>
        </NuxtLink>

        <NuxtLink
          v-if="showCompareNav"
          to="/compare"
          class="group bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2"
        >
          <div class="aspect-video bg-gradient-to-br from-purple-400 to-indigo-500 relative overflow-hidden">
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-6xl">💎</span>
            </div>
            <div class="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full font-bold text-sm">
              Smart Compare
            </div>
          </div>
          <div class="p-6 text-white">
            <h3 class="text-xl font-bold mb-2 group-hover:text-purple-100 transition-colors">Price Comparison</h3>
            <p class="text-purple-100 mb-4">Find the best prices across platforms</p>
            <div class="flex items-center justify-between">
              <span class="text-sm text-purple-200">Compare Now →</span>
              <span class="text-2xl group-hover:translate-x-2 transition-transform">✨</span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-sky-600 rounded-2xl sm:rounded-3xl shadow-2xl p-8 sm:p-12 md:p-16 text-center text-white overflow-hidden">
        <!-- Decorative elements -->
        <div class="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-white/10 rounded-full -mr-32 sm:-mr-48 -mt-32 sm:-mt-48 blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-white/10 rounded-full -ml-32 sm:-ml-48 -mb-32 sm:-mb-48 blur-3xl"></div>
        
        <div class="relative z-10">
          <h2 class="text-3xl sm:text-4xl md:text-5xl font-black mb-3 sm:mb-4 px-2">Ready to Start Your Journey?</h2>
          <p class="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-10 text-emerald-50 max-w-2xl mx-auto px-3">
            Get exclusive deals and save on your next trip
          </p>
          <div class="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 px-2">
            <button
              type="button"
              @click="openFunnelDeal('activity')"
              class="px-6 sm:px-8 py-4 bg-white text-emerald-700 rounded-xl hover:bg-emerald-50 active:bg-emerald-100 font-bold transition-all transform hover:scale-105 active:scale-95 hover:-translate-y-1 shadow-xl flex items-center justify-center gap-2 touch-manipulation min-h-[56px] w-full sm:w-auto"
            >
              <KlookIcon :size="20" />
              Find Activities
            </button>
            <button
              type="button"
              @click="openFunnelDeal('flight')"
              class="px-6 sm:px-8 py-4 bg-white text-emerald-700 rounded-xl hover:bg-emerald-50 active:bg-emerald-100 font-bold transition-all transform hover:scale-105 active:scale-95 hover:-translate-y-1 shadow-xl flex items-center justify-center gap-2 touch-manipulation min-h-[56px] w-full sm:w-auto"
            >
              <span class="text-xl">✈️</span>
              Book Flights
            </button>
            <button
              type="button"
              @click="openFunnelDeal('hotel')"
              class="px-6 sm:px-8 py-4 bg-white text-emerald-700 rounded-xl hover:bg-emerald-50 active:bg-emerald-100 font-bold transition-all transform hover:scale-105 active:scale-95 hover:-translate-y-1 shadow-xl flex items-center justify-center gap-2 touch-manipulation min-h-[56px] w-full sm:w-auto"
            >
              <span class="text-xl">🏨</span>
              Book Hotels
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter Signup Section -->
    <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <NewsletterSignup source="homepage" />
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AffiliateCard from '~/components/AffiliateCard.vue'
import NewsletterSignup from '~/components/NewsletterSignup.vue'
import { useTripDeeplink } from '~/composables/useTripDeeplink'
import { useActivityTracker } from '~/composables/useActivityTracker'
import { useSEO } from '~/composables/useSEO'

const { generateDeeplink } = useTripDeeplink()
const { trackClick } = useActivityTracker()
const { setPageSEO } = useSEO()
const runtimeConfig = useRuntimeConfig()

const isFeatureEnabled = (value) => {
  if (value === undefined || value === null) return true
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    return !['false', '0', 'off', 'no'].includes(normalized)
  }
  return Boolean(value)
}

const showBestDealsNav = computed(() => isFeatureEnabled(runtimeConfig.public?.enableBestDealsNav))
const showCompareNav = computed(() => isFeatureEnabled(runtimeConfig.public?.enableCompareNav))
const showPromoSection = computed(() => showBestDealsNav.value || showCompareNav.value)
const funnelShortcuts = ref([])

// Flight and hotel links for mobile navigation (same as desktop hero)
const flightLink = generateDeeplink({
  type: 'flight',
  params: {
    campaign: 'homepage-hero-flight'
  }
})

const hotelLink = generateDeeplink({
  type: 'hotel',
  params: {
    campaign: 'homepage-hero-hotel'
  }
})

const findShortcutByCategory = (category) => {
  return funnelShortcuts.value.find((item) => item.category === category)
}

const loadFunnelShortcuts = async () => {
  try {
    const response = await $fetch('/api/affiliate/shortcuts')
    if (response?.success && Array.isArray(response.data)) {
      funnelShortcuts.value = response.data
    }
  } catch (error) {
    console.error('Failed to load homepage funnel shortcuts:', error)
  }
}

const openFunnelDeal = async (category) => {
  const shortcut = findShortcutByCategory(category)
  const fallbackUrl = category === 'flight' ? flightLink : category === 'hotel' ? hotelLink : '/klook'
  const baseUrl = shortcut?.link || fallbackUrl
  const provider = shortcut?.provider || (category === 'activity' ? 'klook' : 'trip')

  trackClick('deals_hub_link', {
    campaign: `homepage-funnel-${category}`,
    route: baseUrl,
    intent: category
  })

  try {
    const sessionId = typeof window !== 'undefined'
      ? (localStorage.getItem('activity_session_id') || `home-${Date.now().toString(36)}`)
      : 'anonymous'

    if (typeof window !== 'undefined' && !localStorage.getItem('activity_session_id')) {
      localStorage.setItem('activity_session_id', sessionId)
    }

    const response = await $fetch('/api/affiliate/click', {
      method: 'POST',
      body: {
        provider,
        baseUrl,
        placementKey: `homepage_funnel_${category}`,
        pagePath: '/',
        sessionId,
        metadata: {
          category,
          title: shortcut?.title || `${category} funnel card`
        }
      }
    })

    const outboundUrl = response?.outboundUrl || baseUrl
    if (typeof window !== 'undefined') {
      window.open(outboundUrl, '_blank', 'noopener,noreferrer')
    }
  } catch (error) {
    console.error('Homepage funnel click tracking failed:', error)
    if (typeof window !== 'undefined') {
      window.open(baseUrl, '_blank', 'noopener,noreferrer')
    }
  }
}

onMounted(() => {
  loadFunnelShortcuts()
})

// Set SEO for homepage
setPageSEO({
  title: 'GoVietHub - Discover, Compare & Book Travel Deals',
  description: 'Compare and book the best travel deals across Trip.com, Klook, and Singapore Attractions. Save on flights, hotels, activities, and attractions. Your all-in-one travel platform.',
  keywords: 'travel deals, compare travel prices, trip.com deals, klook deals, vietnam travel, singapore attractions, hotel bookings, flight bookings',
  url: 'https://gotravelnha.com',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'GoVietHub',
    url: 'https://gotravelnha.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://gotravelnha.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  }
})
</script>