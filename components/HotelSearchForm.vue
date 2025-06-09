<template>
    <form @submit.prevent="searchHotels" class="space-y-4">
      <div>
        <label>City ID</label>
        <input v-model.number="cityId" type="number" class="input" placeholder="e.g. 1376 (Johor Bahru)" required />
      </div>
      <div class="flex gap-4">
        <div>
          <label>Check-in</label>
          <input v-model="checkin" type="date" class="input" required />
        </div>
        <div>
          <label>Check-out</label>
          <input v-model="checkout" type="date" class="input" required />
        </div>
      </div>
      <div class="flex gap-4">
        <div>
          <label>Min Price</label>
          <input v-model.number="minPrice" type="number" class="input" placeholder="e.g. 50" />
        </div>
        <div>
          <label>Max Price</label>
          <input v-model.number="maxPrice" type="number" class="input" placeholder="e.g. 300" />
        </div>
      </div>
      <button type="submit" class="btn">Search Hotels</button>
    </form>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const cityId = ref(1376)
  const checkin = ref('2025-05-05')
  const checkout = ref('2025-05-06')
  const minPrice = ref()
  const maxPrice = ref()
  const router = useRouter()
  
  const searchHotels = () => {
    router.push({
      path: '/trip/results',
      query: {
        cityId: cityId.value,
        checkin: checkin.value,
        checkout: checkout.value,
        min: minPrice.value,
        max: maxPrice.value
      }
    })
  }
  </script>
  
  <style scoped>
  .input {
    @apply w-full border border-gray-300 rounded px-3 py-2 shadow-sm;
  }
  .btn {
    @apply bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700;
  }
  </style>