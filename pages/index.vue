<template>
  <div class="space-y-12 pb-16 animate-fade-in">
    <!-- Enhanced Hero Section -->
    <section class="max-w-7xl mx-auto px-4 pt-4">
      <div class="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 rounded-3xl shadow-2xl overflow-hidden border-2 border-indigo-500">
        <!-- Animated Background Elements -->
        <div class="absolute inset-0 opacity-20">
          <!-- Floating orbs with animation -->
          <div class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full -mr-48 -mt-48 blur-3xl animate-float"></div>
          <div class="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-300 to-red-400 rounded-full -ml-48 -mb-48 blur-3xl animate-float-delayed"></div>
          <div class="absolute top-1/3 left-1/4 w-72 h-72 bg-gradient-to-br from-cyan-300 to-blue-400 rounded-full blur-3xl animate-float"></div>
          <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-green-300 to-teal-400 rounded-full blur-3xl animate-float-delayed"></div>
        </div>

        <!-- Content -->
        <div class="relative z-10 px-6 py-10 md:px-12 md:py-16">
          <!-- Animated Badge -->
          <div class="flex justify-center mb-4 animate-fade-in">
            <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
              <span class="text-white/90 font-semibold text-xs md:text-sm">Your All-in-One Travel Platform</span>
            </div>
          </div>

          <!-- Headline with animations -->
          <div class="text-center mb-6 space-y-3">
            <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 leading-tight animate-slide-up">
              <span class="inline-block hover:scale-110 transition-transform duration-300">Go</span>
              <span class="inline-block hover:scale-110 transition-transform duration-300 delay-75">Viet</span>
              <span class="inline-block hover:scale-110 transition-transform duration-300 delay-150">Hub</span>
            </h1>
            
            <!-- Enhanced Tagline -->
            <p class="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white mb-4 font-bold max-w-3xl mx-auto leading-tight animate-slide-up-delayed drop-shadow-lg">
              Discover, Compare & Book
            </p>

            <!-- Enhanced Description -->
            <p class="text-base sm:text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-2 animate-fade-in-delayed">
              Compare deals across <span class="font-bold text-white">Trip.com</span>, <span class="font-bold text-white">Klook</span>, and <span class="font-bold text-white">Singapore Attractions</span>
            </p>
            <p class="text-sm md:text-base text-blue-200 max-w-3xl mx-auto italic animate-fade-in-delayed">
              formerly known as GoTravelNha
            </p>
          </div>

          <!-- Enhanced Quick Access Pills with better animations -->
          <div class="flex flex-wrap justify-center gap-3 mb-8 animate-slide-up-delayed">
            <NuxtLink to="/klook" class="group bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl hover:bg-white/20 transition-all cursor-pointer border-2 border-white/30 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 animate-bounce-slow">
              <div class="flex items-center gap-2">
                <KlookIcon :size="24" class="group-hover:scale-125 transition-transform duration-300" />
                <span class="text-white font-bold text-base md:text-lg">Klook</span>
                <span class="text-white/70 group-hover:translate-x-1 transition-transform duration-300 hidden sm:inline">→</span>
              </div>
            </NuxtLink>
            <a :href="flightLink" target="_blank" rel="noopener noreferrer" @click="() => trackClick('trip_link', { campaign: 'homepage-hero-flight', route: flightLink, option: 'external' })" class="group bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl hover:bg-white/20 transition-all cursor-pointer border-2 border-white/30 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 animate-bounce-slow-delayed">
              <div class="flex items-center gap-2">
                <span class="text-xl md:text-2xl group-hover:scale-125 transition-transform duration-300">✈️</span>
                <span class="text-white font-bold text-base md:text-lg">Flights</span>
                <span class="text-white/70 group-hover:translate-x-1 transition-transform duration-300 hidden sm:inline">→</span>
              </div>
            </a>
            <a :href="hotelLink" target="_blank" rel="noopener noreferrer" @click="() => trackClick('trip_link', { campaign: 'homepage-hero-hotel', route: hotelLink, option: 'external' })" class="group bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl hover:bg-white/20 transition-all cursor-pointer border-2 border-white/30 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 animate-bounce-slow-more">
              <div class="flex items-center gap-2">
                <span class="text-xl md:text-2xl group-hover:scale-125 transition-transform duration-300">🏨</span>
                <span class="text-white font-bold text-base md:text-lg">Hotels</span>
                <span class="text-white/70 group-hover:translate-x-1 transition-transform duration-300 hidden sm:inline">→</span>
              </div>
            </a>
            <NuxtLink to="/attractionsg" class="group bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl hover:bg-white/20 transition-all cursor-pointer border-2 border-white/30 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 animate-bounce-slow-more-delayed">
              <div class="flex items-center gap-2">
                <span class="text-xl md:text-2xl group-hover:scale-125 transition-transform duration-300">🎫</span>
                <span class="text-white font-bold text-xs md:text-base">SG Attractions</span>
                <span class="text-white/70 group-hover:translate-x-1 transition-transform duration-300 hidden sm:inline">→</span>
              </div>
            </NuxtLink>
          </div>

          <!-- Enhanced Trust Badges with icons -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto animate-fade-in">
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

    <!-- Platform Cards -->
    <section class="max-w-6xl mx-auto px-4">
      <div class="mb-8 text-center">
        <h2 class="text-3xl font-bold text-gray-800 mb-3">Choose Your Adventure</h2>
        <p class="text-gray-600 text-lg">
          Compare prices across top travel platforms
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-4xl mx-auto">
        <AffiliateCard
          link="/trip"
          img="https://storage.googleapis.com/travella_assets_images/trip-logo.png"
          desc="Great travel deals, flights, hotels."
        />
        <AffiliateCard
          link="/klook"
          img="https://storage.googleapis.com/travella_assets_images/klook-logo.png"
          desc="Tours, activities & experiences worldwide."
        />
        <AffiliateCard
          link="/attractionsg"
          desc="Singapore attractions & exclusive tickets."
        />
      </div>
    </section>

    <!-- Best Deals Section -->
    <section class="max-w-6xl mx-auto px-4">
      <div class="mb-8 text-center">
        <h2 class="text-3xl font-bold text-gray-800 mb-3">🔥 Best Travel Deals</h2>
        <p class="text-gray-600 text-lg">
          Handpicked offers you don't want to miss
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Top Deals Cards - Load dynamic data -->
        <NuxtLink to="/deals?tab=promo" class="group bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
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

        <NuxtLink to="/deals?tab=hotel" class="group bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
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

        <NuxtLink to="/compare" class="group bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
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
    <section class="max-w-6xl mx-auto px-4">
      <div class="bg-gradient-to-br from-primary-600 to-blue-700 rounded-2xl shadow-soft p-12 text-center text-white">
        <h2 class="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
        <p class="text-xl mb-8 text-blue-100">
          Get exclusive deals and save on your next trip
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <NuxtLink
            to="/klook"
            @click="() => trackClick('klook_link', { campaign: 'homepage-cta-activities', route: '/klook' })"
            class="px-8 py-4 bg-white text-primary-700 rounded-xl hover:bg-gray-100 font-bold transition-all transform hover:scale-105 shadow-lg"
          >
            <KlookIcon :size="20" class="inline-block mr-1.5" />
            Find Activities
          </NuxtLink>
          <a
            :href="flightLink"
            target="_blank"
            rel="noopener noreferrer"
            @click="() => trackClick('trip_link', { campaign: 'homepage-cta-flight-external', route: flightLink, option: 'external' })"
            class="px-8 py-4 bg-white text-primary-700 rounded-xl hover:bg-gray-100 font-bold transition-all transform hover:scale-105 shadow-lg"
          >
            ✈️ Book Flights
          </a>
          <a
            :href="hotelLink"
            target="_blank"
            rel="noopener noreferrer"
            @click="() => trackClick('trip_link', { campaign: 'homepage-cta-hotel-external', route: hotelLink, option: 'external' })"
            class="px-8 py-4 bg-white text-primary-700 rounded-xl hover:bg-gray-100 font-bold transition-all transform hover:scale-105 shadow-lg"
          >
            🏨 Book Hotels
          </a>
        </div>
      </div>
    </section>

    <!-- Newsletter Signup Section -->
    <section class="max-w-6xl mx-auto px-4">
      <NewsletterSignup source="homepage" />
    </section>
  </div>
</template>

<script setup>
import AffiliateCard from '~/components/AffiliateCard.vue'
import NewsletterSignup from '~/components/NewsletterSignup.vue'
import { useTripDeeplink } from '~/composables/useTripDeeplink'
import { useActivityTracker } from '~/composables/useActivityTracker'
import { useSEO } from '~/composables/useSEO'

const { generateDeeplink } = useTripDeeplink()
const { trackClick } = useActivityTracker()
const { setPageSEO } = useSEO()

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

// Generate deep links for homepage CTAs
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
</script>