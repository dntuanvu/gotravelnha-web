<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <!-- Reset Password Card -->
      <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <!-- Logo/Header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full mb-4">
            <span class="text-white text-2xl">🔑</span>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
          <p class="text-gray-600">Enter your new password below</p>
        </div>

        <!-- Success Message -->
        <div v-if="success" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div class="flex items-start gap-3">
            <span class="text-2xl">✅</span>
            <div>
              <p class="text-sm font-medium text-green-800 mb-1">Password Reset Successfully!</p>
              <p class="text-sm text-green-700">{{ success }}</p>
            </div>
          </div>
        </div>

        <!-- Form -->
        <form v-if="!success" @submit.prevent="handleResetPassword" class="space-y-6">
          <!-- New Password Field -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              v-model="newPassword"
              type="password"
              required
              minlength="8"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="••••••••"
            />
            <p class="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
          </div>

          <!-- Confirm Password Field -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              v-model="confirmPassword"
              type="password"
              required
              minlength="8"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="••••••••"
            />
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
            {{ loading ? 'Resetting...' : 'Reset Password' }}
          </button>
        </form>

        <!-- Back to Login -->
        <div class="mt-6 text-center">
          <NuxtLink v-if="success" to="/login" class="text-sm text-blue-600 hover:text-blue-800 font-medium">
            Continue to Sign In →
          </NuxtLink>
          <NuxtLink v-else to="/login" class="text-sm text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Sign In
          </NuxtLink>
        </div>

        <!-- Back to Site Link -->
        <div class="mt-4 text-center">
          <NuxtLink to="/" class="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            ← Back to GoTravelNha
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const router = useRouter()

const token = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const success = ref<string | null>(null)

onMounted(() => {
  // Get token from URL query
  const tokenParam = route.query.token
  if (tokenParam && typeof tokenParam === 'string') {
    token.value = tokenParam
  } else {
    error.value = 'Invalid or missing reset token. Please request a new password reset.'
  }
})

const handleResetPassword = async () => {
  loading.value = true
  error.value = null
  success.value = null

  // Validate passwords match
  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    loading.value = false
    return
  }

  try {
    await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: {
        token: token.value,
        password: newPassword.value
      }
    })
    
    success.value = 'Your password has been reset successfully. You can now sign in with your new password.'
    
    // Auto-redirect after 3 seconds
    setTimeout(() => {
      router.push('/login')
    }, 3000)
  } catch (err: any) {
    error.value = err.data?.message || 'Failed to reset password. The link may be invalid or expired.'
    console.error('Reset password error:', err)
  } finally {
    loading.value = false
  }
}
</script>

