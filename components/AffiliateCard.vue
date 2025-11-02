<template>
  <div 
    class="bg-white rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 p-6 text-center transform hover:-translate-y-1 group cursor-pointer border border-gray-100"
    :class="{ 'opacity-60': comingSoon }"
  >
    <div class="mb-4 animate-fade-in">
      <img v-if="img" :src="img" alt="" class="h-28 mx-auto object-contain transition-transform duration-300 group-hover:scale-110" />
      <div v-else class="h-28 w-full flex items-center justify-center rounded-xl">
        <slot name="custom-logo">
          <span class="text-6xl">🎫</span>
        </slot>
      </div>
    </div>
    
    <h3 v-if="title" class="text-xl font-bold mb-3 text-gray-800">{{ title }}</h3>
    <p class="text-gray-600 mb-6 text-sm leading-relaxed">{{ desc }}</p>

    <div v-if="comingSoon" class="text-sm text-orange-500 font-semibold mb-3 flex items-center justify-center gap-2">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      Coming Soon
    </div>

    <NuxtLink
      v-if="!comingSoon"
      :to="link"
      class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
    >
      Explore
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
      </svg>
    </NuxtLink>

    <button
      v-else
      class="inline-block px-6 py-3 bg-gray-200 text-gray-500 rounded-xl cursor-not-allowed font-semibold"
      disabled
    >
      Explore
    </button>
  </div>
</template>
  
<script setup>
  defineProps({
    title: String,
    link: String,
    img: String,
    desc: String,
    comingSoon: {
      type: Boolean,
      default: false
    }
  })
</script>