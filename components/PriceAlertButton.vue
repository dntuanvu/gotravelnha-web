<template>
  <button
    @click="handleCreateAlert"
    :disabled="loading || !isAuthenticated"
    :class="[
      'px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1',
      props.class
    ]"
  >
    <span>{{ loading ? '⏳' : '🔔' }}</span>
    <span class="hidden sm:inline">{{ loading ? 'Creating...' : 'Alert' }}</span>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthState } from '~/composables/useAuthState'
import { usePriceAlert } from '~/composables/usePriceAlert'

const props = withDefaults(defineProps<{
  platform: string
  productType: string
  productId: string
  productName: string
  currentPrice?: number
  originalUrl: string
  class?: string
}>(), {
  class: ''
})

const { user, isAuthenticated } = useAuthState()
const { createAlert } = usePriceAlert()

const loading = ref(false)

const handleCreateAlert = async () => {
  if (!isAuthenticated.value || !user.value) {
    alert('Please log in to set price alerts')
    return
  }

  loading.value = true

  try {
    const response = await createAlert({
      userId: user.value.id,
      platform: props.platform,
      productType: props.productType,
      productId: props.productId,
      productName: props.productName,
      currentPrice: props.currentPrice,
      originalUrl: props.originalUrl
    })

    if (response.success) {
      alert(response.message || 'Price alert created!')
    } else {
      alert(response.error || 'Failed to create alert')
    }
  } catch (error: any) {
    alert(error.data?.error || 'Failed to create alert')
  } finally {
    loading.value = false
  }
}
</script>

