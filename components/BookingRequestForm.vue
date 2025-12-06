<template>
  <div class="space-y-5">
    <!-- Selected Package Summary -->
    <div
      v-if="selectedOptionSummary"
      class="relative overflow-hidden rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/90 to-teal-50/50 p-5 shadow-sm shadow-emerald-500/10 backdrop-blur-sm"
    >
      <div class="flex items-start gap-3">
        <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-semibold uppercase tracking-wide text-emerald-700 mb-1.5">Selected Package</p>
          <p class="text-sm font-medium text-slate-800 leading-relaxed">{{ selectedOptionSummary }}</p>
        </div>
      </div>
    </div>

    <form @submit.prevent="submitBooking" class="space-y-5">
      <!-- Customer Name -->
      <div>
        <label class="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          Your Name <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.name"
          type="text"
          required
          placeholder="Enter your full name"
          class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-medium text-slate-900 placeholder:text-slate-400 transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 focus:outline-none"
        />
      </div>

      <!-- Guest Count -->
      <div class="grid grid-cols-2 gap-4">
        <label class="flex flex-col gap-2">
          <span class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            Adults
          </span>
          <input
            v-model.number="form.adults"
            type="number"
            min="0"
            step="1"
            class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-medium text-slate-900 transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 focus:outline-none"
          />
        </label>
        <label class="flex flex-col gap-2">
          <span class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
            Children
          </span>
          <input
            v-model.number="form.children"
            type="number"
            min="0"
            step="1"
            class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-medium text-slate-900 transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 focus:outline-none"
          />
        </label>
      </div>

      <!-- Contact Email -->
      <div>
        <label class="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
          Contact Email <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.email"
          type="email"
          required
          placeholder="your@email.com"
          class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-medium text-slate-900 placeholder:text-slate-400 transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 focus:outline-none"
        />
      </div>

      <!-- Contact Phone -->
      <div>
        <label class="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
          </svg>
          Contact Phone <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.phone"
          type="tel"
          required
          placeholder="+65 1234 5678"
          class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-medium text-slate-900 placeholder:text-slate-400 transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 focus:outline-none"
        />
      </div>

      <!-- Additional Notes -->
      <div>
        <label class="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
          Additional Notes
        </label>
        <textarea
          v-model="form.notes"
          rows="4"
          placeholder="Any special requirements or requests..."
          class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-medium text-slate-900 placeholder:text-slate-400 transition-all resize-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 focus:outline-none"
        ></textarea>
      </div>

      <!-- Error Message -->
      <div
        v-if="error"
        class="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/90 p-4 text-sm text-red-700 shadow-sm"
      >
        <svg class="h-5 w-5 flex-shrink-0 mt-0.5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p class="flex-1 font-medium">{{ error }}</p>
      </div>

      <!-- Success Message -->
      <div
        v-if="success"
        class="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/90 p-4 text-sm text-emerald-700 shadow-sm"
      >
        <svg class="h-5 w-5 flex-shrink-0 mt-0.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div class="flex-1">
          <p class="font-semibold mb-1">Booking request submitted successfully!</p>
          <p class="text-emerald-600/80">We'll contact you shortly via email or phone.</p>
        </div>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="submitting"
        class="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-6 py-4 sm:py-4 font-bold text-white shadow-[0_12px_24px_-12px_rgba(16,185,129,0.55)] transition-all hover:-translate-y-0.5 active:scale-95 active:translate-y-0 hover:from-emerald-600 hover:to-teal-600 hover:shadow-[0_16px_32px_-12px_rgba(16,185,129,0.65)] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:transform-none disabled:shadow-sm touch-manipulation min-h-[52px] sm:min-h-[56px]"
      >
        <span v-if="submitting" class="flex items-center justify-center gap-2.5">
          <svg class="h-5 w-5 animate-spin" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Sending Request...
        </span>
        <span v-else class="flex items-center justify-center gap-2.5">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
          Request Booking
        </span>
      </button>
    </form>

    <!-- Trust Badges -->
    <div class="space-y-3 rounded-2xl border border-slate-200/70 bg-white/70 p-5 shadow-sm shadow-emerald-500/5">
      <div class="flex items-center gap-3 text-sm">
        <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
        </div>
        <div>
          <p class="font-semibold text-slate-900">Secure & Confidential</p>
          <p class="text-xs text-slate-500">Your information is protected</p>
        </div>
      </div>
      <div class="flex items-center gap-3 text-sm">
        <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div>
          <p class="font-semibold text-slate-900">Quick Response</p>
          <p class="text-xs text-slate-500">We'll get back to you within 24 hours</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  eventTitle: {
    type: String,
    required: true
  },
  eventPrice: {
    type: String,
    default: ''
  },
  selectedOption: {
    type: Object,
    default: null
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
const lastPrefilledNotes = ref('')

const buildSummary = (option, fallbackAdults = form.value.adults, fallbackChildren = form.value.children) => {
  const adultsFallback = Number.isFinite(fallbackAdults) ? Math.max(0, Number(fallbackAdults)) : null
  const childrenFallback = Number.isFinite(fallbackChildren) ? Math.max(0, Number(fallbackChildren)) : null

  if (!option) {
    const parts = [
      props.eventTitle ? `General request for ${String(props.eventTitle)}` : 'General attraction request'
    ]

    if (adultsFallback !== null || childrenFallback !== null) {
      const guestParts = []
      if (adultsFallback !== null && adultsFallback > 0) {
        guestParts.push(`${adultsFallback} adult${adultsFallback === 1 ? '' : 's'}`)
      }
      if (childrenFallback !== null && childrenFallback > 0) {
        guestParts.push(`${childrenFallback} child${childrenFallback === 1 ? '' : 'ren'}`)
      }
      if (guestParts.length > 0) {
        parts.push(`Guests: ${guestParts.join(' + ')}`)
      }
    }

    if (props.eventPrice) {
      parts.push(`Price: ${props.eventPrice}`)
    }

    return parts.filter(Boolean).join(' • ')
  }
  const parts = []
  if (option.name) parts.push(option.name)
  const optionReference = option.slug || option.code
  if (optionReference) {
    parts.push(`Code: ${optionReference}`)
  }
  if (option.priceText) parts.push(`Price: ${option.priceText}`)
  if (option.originalPriceText && option.originalPriceText !== option.priceText) {
    parts.push(`Retail: ${option.originalPriceText}`)
  }
  if (option.validity) parts.push(option.validity)
  
  const adultsFromOption = Number.isFinite(option.adultCount) ? Math.max(0, Number(option.adultCount)) : null
  const childrenFromOption = Number.isFinite(option.childCount) ? Math.max(0, Number(option.childCount)) : null
  const hasAdultInput = typeof adultsFallback === 'number' && !Number.isNaN(adultsFallback)
  const hasChildInput = typeof childrenFallback === 'number' && !Number.isNaN(childrenFallback)
  const adults = hasAdultInput ? Math.max(0, adultsFallback) : adultsFromOption
  const children = hasChildInput ? Math.max(0, childrenFallback) : childrenFromOption
  if (adults !== null || children !== null) {
    const guestParts = []
    if (adults !== null && adults > 0) guestParts.push(`${adults} adult${adults === 1 ? '' : 's'}`)
    if (children !== null && children > 0) guestParts.push(`${children} child${children === 1 ? '' : 'ren'}`)
    if (guestParts.length) parts.push(`Guests: ${guestParts.join(' + ')}`)
  }
  if (option.totalPriceText) {
    parts.push(`Cart Total: ${option.totalPriceText}`)
  }
  return parts.join(' • ')
}

const selectedOptionSummary = computed(() =>
  buildSummary(props.selectedOption, form.value.adults, form.value.children)
)

watch(
  () => props.selectedOption,
  (option) => {
    const summary = option ? selectedOptionSummary.value : buildSummary(null, form.value.adults, form.value.children)
    if (option?.adultCount !== undefined) {
      form.value.adults = Math.max(1, Number(option.adultCount) || 1)
    }
    if (option?.childCount !== undefined) {
      form.value.children = Math.max(0, Number(option.childCount) || 0)
    }
    if (!form.value.notes || form.value.notes === lastPrefilledNotes.value || !option) {
      form.value.notes = summary
      lastPrefilledNotes.value = summary
    }
  },
  { immediate: true }
)

watch(
  () => [form.value.adults, form.value.children],
  () => {
    const summary = props.selectedOption
      ? selectedOptionSummary.value
      : buildSummary(null, form.value.adults, form.value.children)
    if (!form.value.notes || form.value.notes === lastPrefilledNotes.value) {
      form.value.notes = summary
      lastPrefilledNotes.value = summary
    }
  }
)

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
