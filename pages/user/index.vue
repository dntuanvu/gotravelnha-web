<template>
  <div class="min-h-screen bg-gray-50 pb-12">
    <div class="max-w-7xl mx-auto px-4 pt-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">👤 My Account</h1>
        <p class="text-gray-600">Manage your bookings and preferences</p>
      </div>
      
      <!-- User Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-600 text-sm font-medium">Total Bookings</span>
            <span class="text-blue-600 text-2xl">🎫</span>
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ userStats.totalBookings }}</p>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-600 text-sm font-medium">Loyalty Points</span>
            <span class="text-yellow-600 text-2xl">⭐</span>
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ userStats.loyaltyPoints.toLocaleString() }}</p>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-600 text-sm font-medium">Saved Favorites</span>
            <span class="text-red-600 text-2xl">❤️</span>
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ userStats.savedFavorites }}</p>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-600 text-sm font-medium">Rewards Earned</span>
            <span class="text-green-600 text-2xl">🎁</span>
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ userStats.rewardsEarned }}</p>
        </div>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - Main Actions -->
        <div class="lg:col-span-2 space-y-6">
          <!-- My Bookings -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold text-gray-900">🎫 My Bookings</h2>
              <button class="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View All →
              </button>
            </div>
            <div class="space-y-4">
              <div
                v-for="booking in recentBookings"
                :key="booking.id"
                class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <span class="text-3xl">{{ booking.icon }}</span>
                <div class="flex-1">
                  <div class="font-semibold text-gray-900">{{ booking.title }}</div>
                  <div class="text-sm text-gray-600">{{ booking.description }}</div>
                  <div class="text-xs text-gray-500 mt-1">{{ booking.date }}</div>
                </div>
                <span :class="[
                  'px-3 py-1 rounded-full text-xs font-semibold',
                  booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                ]">
                  {{ booking.status }}
                </span>
              </div>
              <div v-if="recentBookings.length === 0" class="text-center py-8 text-gray-500">
                No bookings yet. Start exploring! 🚀
              </div>
            </div>
          </div>

          <!-- Favorite Deals -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold text-gray-900">❤️ Favorite Deals</h2>
              <button class="text-sm text-blue-600 hover:text-blue-800 font-medium">
                See More →
              </button>
            </div>
            <div v-if="favoriteDeals.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                v-for="deal in favoriteDeals"
                :key="deal.id"
                class="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
              >
                <div class="font-semibold text-gray-900 mb-1">{{ deal.title }}</div>
                <div class="text-sm text-gray-600 mb-2">{{ deal.description }}</div>
                <div class="flex items-center justify-between">
                  <span class="text-lg font-bold text-blue-600">{{ deal.price }}</span>
                  <button class="text-xs text-blue-600 hover:text-blue-800">
                    View →
                  </button>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8 text-gray-500">
              No favorites yet. Add deals you like! ⭐
            </div>
          </div>
        </div>

        <!-- Right Column - Profile & Actions -->
        <div class="space-y-6">
          <!-- Profile Card -->
          <div class="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                <span class="text-white text-2xl font-bold">{{ userProfile.avatar }}</span>
              </div>
              <div>
                <div class="font-bold text-lg">{{ userProfile.name }}</div>
                <div class="text-sm text-blue-100">{{ userProfile.email }}</div>
              </div>
            </div>
            <div class="pt-4 border-t border-blue-400">
              <div class="flex items-center justify-between text-sm">
                <span class="text-blue-100">Member Since</span>
                <span class="font-semibold">{{ userProfile.memberSince }}</span>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">⚡ Quick Actions</h2>
            <div class="space-y-2">
              <button
                @click="navigateToBookings"
                class="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-3"
              >
                <span class="text-xl">🎫</span>
                <span class="font-medium text-gray-900">View All Bookings</span>
              </button>
              <button
                @click="navigateToPoints"
                class="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-3"
              >
                <span class="text-xl">⭐</span>
                <span class="font-medium text-gray-900">Redeem Points</span>
              </button>
              <button
                @click="editProfile"
                class="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-3"
              >
                <span class="text-xl">⚙️</span>
                <span class="font-medium text-gray-900">Edit Profile</span>
              </button>
              <button
                @click="viewSettings"
                class="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-3"
              >
                <span class="text-xl">🔔</span>
                <span class="font-medium text-gray-900">Settings</span>
              </button>
            </div>
          </div>

          <!-- Loyalty Points -->
          <div class="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-sm border border-yellow-200 p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>⭐</span> Loyalty Points
            </h2>
            <div class="mb-4">
              <div class="text-4xl font-bold text-yellow-600 mb-2">
                {{ userStats.loyaltyPoints.toLocaleString() }}
              </div>
              <div class="text-sm text-gray-600">
                Available to redeem
              </div>
            </div>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-700">Points earned this month</span>
                <span class="font-semibold text-green-600">+250</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-700">Next reward at</span>
                <span class="font-semibold text-blue-600">500 pts</span>
              </div>
            </div>
            <button class="w-full mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-semibold">
              View Rewards Catalog →
            </button>
          </div>

          <!-- Referral Program -->
          <ReferralShare />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthState } from '~/composables/useAuthState'
import ReferralShare from '~/components/ReferralShare.vue'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const router = useRouter()
const { user } = useAuthState()

const userProfile = computed(() => {
  if (!user.value) {
    return {
      avatar: '👤',
      name: 'Guest User',
      email: 'user@example.com',
      memberSince: 'Jan 2025'
    }
  }
  
  // Format the user's name
  const fullName = user.value.firstName && user.value.lastName 
    ? `${user.value.firstName} ${user.value.lastName}` 
    : user.value.username
  
  // Format member since date
  const memberSince = user.value.createdAt 
    ? new Date(user.value.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Recently'
  
  // Get avatar initial
  const avatar = user.value.firstName 
    ? user.value.firstName.charAt(0).toUpperCase()
    : user.value.username.charAt(0).toUpperCase()
  
  return {
    avatar,
    name: fullName,
    email: user.value.email,
    memberSince
  }
})

const userStats = ref({
  totalBookings: 0,
  loyaltyPoints: 0,
  savedFavorites: 0,
  rewardsEarned: 0
})

const recentBookings = ref([])

const favoriteDeals = ref([])

const navigateToBookings = () => {
  alert('Bookings page coming soon!')
}

const navigateToPoints = () => {
  alert('Loyalty points page coming soon!')
}

const editProfile = () => {
  alert('Edit profile coming soon!')
}

const viewSettings = () => {
  alert('Settings page coming soon!')
}

onMounted(() => {
  console.log('👤 User portal loaded')
})
</script>

