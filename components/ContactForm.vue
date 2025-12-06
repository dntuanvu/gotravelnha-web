<template>
    <form @submit.prevent="submitForm" class="space-y-5 sm:space-y-6 max-w-2xl mx-auto bg-white p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200/80">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 mb-4">
          <svg class="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-slate-900 mb-2">Get in Touch</h2>
        <p class="text-slate-600">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
      </div>
  
      <div>
        <label for="name" class="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          Your Name <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.name"
          id="name"
          type="text"
          required
          placeholder="Enter your full name"
          class="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-medium text-slate-900 placeholder:text-slate-400 transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 focus:outline-none"
        />
      </div>
  
      <div>
        <label for="email" class="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
          Email Address <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.email"
          id="email"
          type="email"
          required
          placeholder="your@email.com"
          class="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-medium text-slate-900 placeholder:text-slate-400 transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 focus:outline-none"
        />
      </div>
  
      <div>
        <label for="message" class="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
          Message <span class="text-red-500">*</span>
        </label>
        <textarea
          v-model="form.message"
          id="message"
          rows="6"
          required
          placeholder="Tell us how we can help you..."
          class="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-medium text-slate-900 placeholder:text-slate-400 transition-all resize-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 focus:outline-none"
        ></textarea>
      </div>
  
      <div>
        <button
          type="submit"
          :disabled="submitting"
          class="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
        >
          <span v-if="submitting" class="flex items-center justify-center gap-2.5">
            <svg class="h-5 w-5 animate-spin" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending...
          </span>
          <span v-else class="flex items-center justify-center gap-2.5">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
            Send Message
          </span>
        </button>
      </div>
  
      <div v-if="status" class="rounded-xl border p-4 text-center" :class="status.includes('✅') ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'">
        <p class="font-semibold">{{ status }}</p>
      </div>
    </form>
</template>
  
<script setup>
  import { ref } from 'vue'
  
  const form = ref({
    name: '',
    email: '',
    message: ''
  })
  
  const status = ref('')
  const submitting = ref(false)
  
  const submitForm = async () => {
    try {
      submitting.value = true
      status.value = ''
      await $fetch('/api/contact', {
        method: 'POST',
        body: form.value
      })
      status.value = '✅ Your message has been sent! We\'ll get back to you soon.'
      form.value = { name: '', email: '', message: '' }
    } catch (e) {
      status.value = '❌ Failed to send message. Please try again later.'
    } finally {
      submitting.value = false
    }
  }
  </script>