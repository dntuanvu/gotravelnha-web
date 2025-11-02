<template>
  <div class="space-y-12 pb-16 animate-fade-in">
    <!-- Hero Section -->
    <section class="max-w-6xl mx-auto px-4 pt-8">
      <div class="relative bg-white rounded-3xl shadow-soft overflow-hidden border border-gray-100">
        <!-- Decorative Background Elements -->
        <div class="absolute inset-0 opacity-50">
          <div class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full -mr-48 -mt-48 blur-3xl"></div>
          <div class="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-100 to-pink-200 rounded-full -ml-48 -mb-48 blur-3xl"></div>
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full blur-3xl"></div>
        </div>

        <!-- Content -->
        <div class="relative z-10 px-8 py-20 md:px-16 md:py-28 text-center">
          <!-- Headline -->
          <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 leading-tight">
            GoTravelNha
          </h1>
          
          <!-- Tagline -->
          <p class="text-xl sm:text-2xl md:text-3xl text-gray-700 mb-8 font-bold max-w-3xl mx-auto leading-relaxed">
            Your Travel Companion
          </p>

          <!-- Description -->
          <p class="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Book your perfect trip with the best travel platforms — all in one place.
          </p>

          <!-- Feature Pills -->
          <div class="flex flex-wrap justify-center gap-4">
            <NuxtLink to="/trip" class="group bg-gradient-to-br from-blue-50 to-blue-100 px-6 py-3 rounded-full hover:from-blue-100 hover:to-blue-200 transition-all cursor-pointer border-2 border-blue-200 shadow-md hover:shadow-lg transform hover:-translate-y-1">
              <div class="flex items-center gap-2">
                <span class="text-2xl">✈️</span>
                <span class="text-blue-700 font-bold text-sm sm:text-base">Flights</span>
              </div>
            </NuxtLink>
            <NuxtLink to="/trip" class="group bg-gradient-to-br from-indigo-50 to-indigo-100 px-6 py-3 rounded-full hover:from-indigo-100 hover:to-indigo-200 transition-all cursor-pointer border-2 border-indigo-200 shadow-md hover:shadow-lg transform hover:-translate-y-1">
              <div class="flex items-center gap-2">
                <span class="text-2xl">🏨</span>
                <span class="text-indigo-700 font-bold text-sm sm:text-base">Hotels</span>
              </div>
            </NuxtLink>
            <NuxtLink to="/klook" class="group bg-gradient-to-br from-purple-50 to-purple-100 px-6 py-3 rounded-full hover:from-purple-100 hover:to-purple-200 transition-all cursor-pointer border-2 border-purple-200 shadow-md hover:shadow-lg transform hover:-translate-y-1">
              <div class="flex items-center gap-2">
                <span class="text-2xl">🎯</span>
                <span class="text-purple-700 font-bold text-sm sm:text-base">Activities</span>
              </div>
            </NuxtLink>
            <NuxtLink to="/trip" class="group bg-gradient-to-br from-pink-50 to-pink-100 px-6 py-3 rounded-full hover:from-pink-100 hover:to-pink-200 transition-all cursor-pointer border-2 border-pink-200 shadow-md hover:shadow-lg transform hover:-translate-y-1">
              <div class="flex items-center gap-2">
                <span class="text-2xl">🎁</span>
                <span class="text-pink-700 font-bold text-sm sm:text-base">Best Deals</span>
              </div>
            </NuxtLink>
          </div>

          <!-- Trust Badges -->
          <div class="flex flex-wrap justify-center gap-8 mt-12">
            <div class="flex items-center gap-2">
              <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <span class="text-gray-700 font-semibold">Secure Booking</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <span class="text-gray-700 font-semibold">Best Prices</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <span class="text-gray-700 font-semibold">24/7 Support</span>
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
          img=""
          desc="Singapore attractions & exclusive tickets."
        >
          <template #custom-logo>
            <div class="bg-yellow-400 rounded-full px-8 py-3 shadow-lg">
              <div class="flex items-center justify-center gap-1">
                <span class="text-[#166534] font-black text-2xl tracking-tight">SG</span>
                <span class="text-[#1e3a8a] font-black text-2xl tracking-tight">ATTRACTIONS</span>
              </div>
            </div>
          </template>
        </AffiliateCard>
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
            to="/trip"
            class="px-8 py-4 bg-white text-primary-700 rounded-xl hover:bg-gray-100 font-bold transition-all transform hover:scale-105 shadow-lg"
          >
            🏨 Book Hotels
          </NuxtLink>
          <NuxtLink
            to="/klook"
            class="px-8 py-4 bg-white text-primary-700 rounded-xl hover:bg-gray-100 font-bold transition-all transform hover:scale-105 shadow-lg"
          >
            🎯 Find Activities
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import AffiliateCard from '~/components/AffiliateCard.vue'
import SmartAffiliateLink from '~/components/SmartAffiliateLink.vue'
</script>