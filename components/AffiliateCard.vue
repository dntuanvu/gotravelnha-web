<template>
  <div class="bg-white rounded-xl shadow p-6 text-center">
    <img :src="img" alt="" class="h-24 mx-auto object-contain" />
    <h3 class="text-lg font-semibold mb-2">{{ title }}</h3>
    <p class="text-gray-600 mb-4">{{ desc }}</p>

    <div v-if="comingSoon" class="text-sm text-orange-500 font-semibold mb-2">Coming Soon</div>

    <NuxtLink
      v-if="!comingSoon"
      :to="link"
      class="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Explore
    </NuxtLink>

    <button
      v-else
      class="inline-block px-4 py-2 bg-gray-300 text-gray-600 rounded cursor-not-allowed"
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