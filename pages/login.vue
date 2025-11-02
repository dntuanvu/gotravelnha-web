<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <!-- Login Card -->
      <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <!-- Logo/Header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full mb-4">
            <span class="text-white text-2xl">🔐</span>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p class="text-gray-600">Sign in to continue your journey</p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Username/Email Field -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Username or Email
            </label>
            <input
              v-model="loginForm.username"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="username or email@example.com"
            />
          </div>

          <!-- Password Field -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              v-model="loginForm.password"
              type="password"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="••••••••"
            />
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between">
            <label class="flex items-center">
              <input
                v-model="loginForm.rememberMe"
                type="checkbox"
                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-700">Remember me</span>
            </label>
            <NuxtLink to="/forgot-password" class="text-sm text-blue-600 hover:text-blue-800">
              Forgot password?
            </NuxtLink>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-800">{{ error }}</p>
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-400 font-semibold transition-all transform hover:scale-105 disabled:transform-none"
          >
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <!-- Divider -->
        <div class="my-6 flex items-center">
          <div class="flex-1 border-t border-gray-300"></div>
          <span class="px-4 text-sm text-gray-500">or</span>
          <div class="flex-1 border-t border-gray-300"></div>
        </div>

        <!-- Google Sign In -->
        <button
          @click="handleGoogleSignIn"
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
            {{ loadingGoogle ? 'Signing in...' : 'Sign in with Google' }}
          </span>
        </button>

        <!-- Register Link -->
        <div class="mt-6 text-center">
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
            ← Back to GoTravelNha
          </NuxtLink>
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

const loginForm = ref({
  username: '',
  password: '',
  rememberMe: false
})

const loading = ref(false)
const loadingGoogle = ref(false)
const error = ref<string | null>(null)

const handleGoogleSignIn = async () => {
  loadingGoogle.value = true
  error.value = null

  try {
    // Redirect to Google OAuth
    window.location.href = '/api/auth/google'
  } catch (err: any) {
    error.value = 'Failed to sign in with Google'
    console.error('Google sign-in error:', err)
    loadingGoogle.value = false
  }
}

// Check for OAuth success/error in URL params
const checkOAuthResult = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const success = urlParams.get('success')
  const userId = urlParams.get('userId')
  const errorParam = urlParams.get('error')

  if (errorParam) {
    error.value = decodeURIComponent(errorParam)
    // Clean up URL
    window.history.replaceState({}, '', '/login')
  } else if (success === 'true' && userId) {
    // Fetch user data and log them in
    loadUserAndRedirect(userId)
  }
}

const loadUserAndRedirect = async (userId: string) => {
  try {
    const response: any = await $fetch(`/api/users/${userId}`)
    if (response && response.user) {
      setUser(response.user)
      
      // Redirect based on role
      if (response.user.role === 'ADMIN') {
        router.push('/admin')
      } else {
        router.push('/user')
      }
    } else {
      error.value = 'Failed to complete login'
    }
  } catch (err) {
    error.value = 'Failed to complete login'
    console.error('Failed to load user:', err)
  }
}

const handleLogin = async () => {
  loading.value = true
  error.value = null

  try {
    // Call authentication API
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        username: loginForm.value.username,
        password: loginForm.value.password
      }
    })

    // Set user in auth state
    setUser(response.user)

    // Redirect based on role
    if (response.role === 'ADMIN') {
      router.push('/admin')
    } else {
      router.push('/user')
    }
  } catch (err: any) {
    error.value = err.data?.message || 'Invalid username or password'
    console.error('Login error:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  console.log('🔐 Unified login page loaded')
  checkOAuthResult()
})
</script>

