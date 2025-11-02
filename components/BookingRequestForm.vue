<template>
  <div class="space-y-4">
    <form @submit.prevent="submitBooking" class="space-y-4">
      <!-- Customer Name -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Your Name <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.name"
          type="text"
          required
          placeholder="Enter your full name"
          class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
        />
      </div>

      <!-- Number of Adults -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Number of Adults <span class="text-red-500">*</span>
        </label>
        <input
          v-model.number="form.adults"
          type="number"
          required
          min="1"
          placeholder="Enter number of adults"
          class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
        />
      </div>

      <!-- Number of Children -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Number of Children
        </label>
        <input
          v-model.number="form.children"
          type="number"
          min="0"
          placeholder="Enter number of children (if any)"
          class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
        />
      </div>

      <!-- Contact Email -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Contact Email <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.email"
          type="email"
          required
          placeholder="your@email.com"
          class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
        />
      </div>

      <!-- Contact Phone -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Contact Phone <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.phone"
          type="tel"
          required
          placeholder="+65 1234 5678"
          class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
        />
      </div>

      <!-- Additional Notes -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Additional Notes
        </label>
        <textarea
          v-model="form.notes"
          rows="3"
          placeholder="Any special requirements or requests..."
          class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
        ></textarea>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4">
        <p class="text-red-600 text-sm">{{ error }}</p>
      </div>

      <!-- Success Message -->
      <div v-if="success" class="bg-green-50 border border-green-200 rounded-xl p-4">
        <p class="text-green-600 text-sm font-semibold">✓ Booking request submitted successfully! We'll contact you shortly.</p>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="submitting"
        class="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:from-green-700 hover:to-emerald-800 font-bold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
      >
        <span v-if="submitting" class="flex items-center justify-center gap-2">
          <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Sending Request...
        </span>
        <span v-else>📧 Request Booking</span>
      </button>
    </form>

    <!-- Trust Badges -->
    <div class="pt-4 border-t border-gray-200 space-y-3">
      <div class="flex items-center gap-2 text-sm text-gray-600">
        <svg class="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
        </svg>
        <span>Secure & Confidential</span>
      </div>
      <div class="flex items-center gap-2 text-sm text-gray-600">
        <svg class="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>Response within 24 hours</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  eventTitle: {
    type: String,
    required: true
  },
  eventPrice: {
    type: String,
    default: ''
  }
})

const form = ref({
  name: '',
  email: '',
  phone: '',
  adults: 1,
  children: 0,
  notes: ''
})

const submitting = ref(false)
const error = ref(null)
const success = ref(false)

const submitBooking = async () => {
  try {
    submitting.value = true
    error.value = null
    success.value = false

    const response = await $fetch('/api/booking-request', {
      method: 'POST',
      body: {
        eventTitle: props.eventTitle,
        eventPrice: props.eventPrice,
        ...form.value
      }
    })

    if (response.success) {
      success.value = true
      form.value = {
        name: '',
        email: '',
        phone: '',
        adults: 1,
        children: 0,
        notes: ''
      }
    }
  } catch (err) {
    error.value = 'Failed to submit booking request. Please try again or contact us directly.'
    console.error('Booking error:', err)
  } finally {
    submitting.value = false
  }
}
</script>
