<template>
  <div class="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 md:p-8 border-2 border-blue-200">
    <div class="text-center mb-6">
      <div class="text-5xl mb-4">📧</div>
      <h3 class="text-2xl font-bold text-gray-900 mb-2">Stay Updated with Best Deals</h3>
      <p class="text-gray-600">Get weekly travel deals, exclusive offers, and price drop alerts delivered to your inbox</p>
    </div>

    <form @submit.prevent="handleSubscribe" class="space-y-4">
      <div class="flex flex-col sm:flex-row gap-3">
        <input
          v-model="email"
          type="email"
          required
          placeholder="Enter your email address"
          class="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          :disabled="loading"
        />
        <button
          type="submit"
          :disabled="loading || !email"
          class="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? '⏳ Subscribing...' : '🚀 Subscribe' }}
        </button>
      </div>

      <div v-if="success" class="p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
        {{ success }}
      </div>

      <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
        {{ error }}
      </div>

      <p class="text-xs text-gray-500 text-center">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useActivityTracker } from '~/composables/useActivityTracker'

const { trackClick } = useActivityTracker()

const props = defineProps<{
  source?: string
}>()

const email = ref('')
const loading = ref(false)
const success = ref<string | null>(null)
const error = ref<string | null>(null)

const handleSubscribe = async () => {
  loading.value = true
  success.value = null
  error.value = null

  try {
    const response = await $fetch('/api/newsletter/subscribe', {
      method: 'POST',
      body: {
        email: email.value,
        source: props.source || 'newsletter_component'
      }
    }) as any

    if (response.success) {
      success.value = response.message || 'Successfully subscribed!'
      email.value = ''
      trackClick('newsletter', { action: 'subscribe', source: props.source })
    } else {
      error.value = response.error || 'Failed to subscribe. Please try again.'
    }
  } catch (err: any) {
    error.value = err.data?.error || 'Failed to subscribe. Please try again.'
    console.error('Newsletter subscription error:', err)
  } finally {
    loading.value = false
  }
}
</script>

