<template>
  <NuxtLink
    v-if="!comingSoon"
    :to="link"
    class="block bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 sm:p-8 text-center transform hover:-translate-y-1 sm:hover:-translate-y-2 group cursor-pointer border border-slate-200/80 overflow-hidden relative touch-manipulation active:scale-[0.98]"
  >
    <!-- Decorative gradient overlay on hover -->
    <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-teal-500/0 to-sky-500/0 group-hover:from-emerald-500/5 group-hover:via-teal-500/5 group-hover:to-sky-500/5 transition-all duration-500"></div>
    
    <div class="relative z-10">
      <div class="mb-6 animate-fade-in">
        <div class="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 group-hover:from-emerald-50 group-hover:to-teal-50 transition-all duration-300 mb-4">
          <img v-if="img" :src="img" alt="" class="h-16 mx-auto object-contain transition-transform duration-300 group-hover:scale-110" />
          <div v-else class="flex items-center justify-center">
            <slot name="custom-logo">
              <span class="text-5xl group-hover:scale-110 transition-transform duration-300">🎫</span>
            </slot>
          </div>
        </div>
      </div>
      
      <h3 v-if="title" class="text-xl font-bold mb-3 text-slate-900 group-hover:text-emerald-700 transition-colors">{{ title }}</h3>
      <p class="text-slate-600 mb-6 text-sm leading-relaxed min-h-[3rem]">{{ desc }}</p>

      <div class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-xl group-hover:from-emerald-700 group-hover:to-teal-600 font-semibold transition-all duration-300 transform group-hover:scale-105 shadow-md group-hover:shadow-lg">
        Explore
        <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
        </svg>
      </div>
    </div>
  </NuxtLink>

  <div
    v-else
    class="bg-white rounded-3xl shadow-md p-8 text-center border border-slate-200/80 opacity-75 relative"
  >
    <div class="mb-6">
      <div class="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-slate-50 mb-4">
        <img v-if="img" :src="img" alt="" class="h-16 mx-auto object-contain opacity-60" />
        <div v-else class="flex items-center justify-center">
          <slot name="custom-logo">
            <span class="text-5xl opacity-60">🎫</span>
          </slot>
        </div>
      </div>
    </div>
    
    <h3 v-if="title" class="text-xl font-bold mb-3 text-slate-900">{{ title }}</h3>
    <p class="text-slate-600 mb-4 text-sm leading-relaxed">{{ desc }}</p>

    <div class="text-sm text-orange-600 font-semibold mb-4 flex items-center justify-center gap-2 bg-orange-50 px-4 py-2 rounded-xl">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      Coming Soon
    </div>

    <button
      class="inline-block px-6 py-3 bg-slate-200 text-slate-500 rounded-xl cursor-not-allowed font-semibold"
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