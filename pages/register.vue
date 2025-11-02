<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 py-12">
    <div class="max-w-md w-full">
      <!-- Sign Up Card -->
      <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <!-- Logo/Header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full mb-4">
            <span class="text-white text-2xl">✈️</span>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p class="text-gray-600">Start your travel journey with us</p>
        </div>

        <!-- Registration Form -->
        <form @submit.prevent="handleRegister" class="space-y-5">
          <!-- First Name Field -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              v-model="registerForm.firstName"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="John"
            />
          </div>

          <!-- Last Name Field -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              v-model="registerForm.lastName"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Doe"
            />
          </div>

          <!-- Username Field -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              v-model="registerForm.username"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="johndoe"
            />
          </div>

          <!-- Email Field -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              v-model="registerForm.email"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="john@example.com"
            />
          </div>

          <!-- Password Field -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              v-model="registerForm.password"
              type="password"
              required
              minlength="8"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="••••••••"
            />
            <p class="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
          </div>

          <!-- Terms & Conditions -->
          <div class="flex items-start">
            <input
              v-model="registerForm.agreedToTerms"
              type="checkbox"
              required
              class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label class="ml-2 text-sm text-gray-700">
              I agree to the
              <a href="#" class="text-blue-600 hover:text-blue-800">Terms of Service</a>
              and
              <a href="#" class="text-blue-600 hover:text-blue-800">Privacy Policy</a>
            </label>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-800">{{ error }}</p>
          </div>

          <!-- Success Message -->
          <div v-if="success" class="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p class="text-sm text-green-800">{{ success }}</p>
          </div>

          <!-- Register Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-400 font-semibold transition-all transform hover:scale-105 disabled:transform-none"
          >
            {{ loading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </form>

        <!-- Divider -->
        <div class="my-6 flex items-center">
          <div class="flex-1 border-t border-gray-300"></div>
          <span class="px-4 text-sm text-gray-500">or</span>
          <div class="flex-1 border-t border-gray-300"></div>
        </div>

        <!-- Google Sign Up -->
        <button
          @click="handleGoogleSignUp"
          :disabled="loadingGoogle"
          class="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span class="font-medium text-gray-700">
            {{ loadingGoogle ? 'Creating Account...' : 'Sign up with Google' }}
          </span>
        </button>

        <!-- Login Link -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Already have an account?
            <NuxtLink to="/login" class="text-blue-600 hover:text-blue-800 font-medium">
              Sign In
            </NuxtLink>
          </p>
        </div>

        <!-- Back to Site Link -->
        <div class="mt-4 text-center">
          <NuxtLink to="/" class="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            ← Back to GoTravelNha
          </NuxtLink>
        </div>
      </div>

      <!-- Benefits Banner -->
      <div class="mt-6 bg-white rounded-xl shadow-lg p-6 border border-blue-200">
        <h3 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span>✨</span> Join GoTravelNha and Get
        </h3>
        <div class="space-y-2 text-sm text-gray-700">
          <div class="flex items-center gap-2">
            <span>✅</span>
            <span>Access to exclusive deals and promotions</span>
          </div>
          <div class="flex items-center gap-2">
            <span>✅</span>
            <span>Earn loyalty points with every booking</span>
          </div>
          <div class="flex items-center gap-2">
            <span>✅</span>
            <span>Track your bookings in one place</span>
          </div>
          <div class="flex items-center gap-2">
            <span>✅</span>
            <span>Price drop alerts on favorite destinations</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthState } from '~/composables/useAuthState'

definePageMeta({
  layout: 'default'
})

const router = useRouter()
const { setUser } = useAuthState()

const registerForm = ref({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  agreedToTerms: false
})

const loading = ref(false)
const loadingGoogle = ref(false)
const error = ref<string | null>(null)
const success = ref<string | null>(null)

const handleGoogleSignUp = async () => {
  loadingGoogle.value = true
  error.value = null
  success.value = null

  try {
    // Redirect to Google OAuth (same endpoint as sign-in)
    window.location.href = '/api/auth/google?redirect=' + encodeURIComponent('/user')
  } catch (err: any) {
    error.value = 'Failed to sign up with Google'
    console.error('Google sign-up error:', err)
    loadingGoogle.value = false
  }
}

const handleRegister = async () => {
  loading.value = true
  error.value = null
  success.value = null

  try {
    // Call registration API
    const response = await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        firstName: registerForm.value.firstName,
        lastName: registerForm.value.lastName,
        username: registerForm.value.username,
        email: registerForm.value.email,
        password: registerForm.value.password
      }
    })

    // Set user in auth state
    setUser(response.user)
    
    success.value = 'Account created successfully! Redirecting...'
    
    // Redirect after 2 seconds
    setTimeout(() => {
      router.push('/user')
    }, 2000)
  } catch (err: any) {
    error.value = err.data?.message || 'Registration failed. Please try again.'
    console.error('Registration error:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  console.log('👤 Registration page loaded')
})
</script>

