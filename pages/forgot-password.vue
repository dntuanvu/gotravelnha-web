<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <!-- Forgot Password Card -->
      <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <!-- Logo/Header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center mb-4">
            <Logo :size="'64'" />
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
          <p class="text-gray-600">Enter your email to receive reset instructions</p>
        </div>

        <!-- Success Message -->
        <div v-if="success" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div class="flex items-start gap-3">
            <span class="text-2xl">✅</span>
            <div>
              <p class="text-sm font-medium text-green-800 mb-1">Email Sent!</p>
              <p class="text-sm text-green-700">{{ success }}</p>
            </div>
          </div>
        </div>

        <!-- Form (hidden after success) -->
        <form v-if="!success" @submit.prevent="handleForgotPassword" class="space-y-6">
          <!-- Email Field -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              v-model="email"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="your.email@example.com"
            />
            <p class="mt-2 text-xs text-gray-500">
              We'll send you a link to reset your password
            </p>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-800">{{ error }}</p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-400 font-semibold transition-all transform hover:scale-105 disabled:transform-none"
          >
            {{ loading ? 'Sending...' : 'Send Reset Link' }}
          </button>
        </form>

        <!-- Back to Login -->
        <div class="mt-6 text-center">
          <NuxtLink to="/login" class="text-sm text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Sign In
          </NuxtLink>
        </div>

        <!-- Register Link -->
        <div class="mt-4 text-center">
          <p class="text-sm text-gray-600">
            Don't have an account?
            <NuxtLink to="/register" class="text-blue-600 hover:text-blue-800 font-medium">
              Sign Up Free
            </NuxtLink>
          </p>
        </div>

        <!-- Back to Site Link -->
        <div class="mt-4 text-center">
          <NuxtLink to="/" class="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            ← Back to GoVietHub
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Logo from '~/components/Logo.vue'

definePageMeta({
  layout: 'auth'
})

const email = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const success = ref<string | null>(null)

const handleForgotPassword = async () => {
  loading.value = true
  error.value = null
  success.value = null

  try {
    await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: { email: email.value }
    })
    
    success.value = `Password reset instructions have been sent to ${email.value}. Please check your email and follow the instructions to reset your password.`
  } catch (err: any) {
    // Still show success message to prevent email enumeration
    success.value = 'If an account exists with this email, reset instructions have been sent. Please check your inbox.'
    console.error('Forgot password error:', err)
  } finally {
    loading.value = false
  }
}
</script>

