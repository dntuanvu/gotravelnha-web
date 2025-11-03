<template>
  <div class="min-h-screen bg-gray-50 pb-12">
    <div class="max-w-7xl mx-auto px-4 pt-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">🔐 Admin Portal</h1>
        <p class="text-gray-600">Manage events, analytics, and scraping</p>
      </div>
      
      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-600 text-sm font-medium">Total Events</span>
            <span class="text-blue-600 text-2xl">🎫</span>
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ stats.totalEvents.toLocaleString() }}</p>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-600 text-sm font-medium">Active Users</span>
            <span class="text-green-600 text-2xl">👥</span>
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ stats.activeUsers.toLocaleString() }}</p>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-600 text-sm font-medium">Revenue</span>
            <span class="text-yellow-600 text-2xl">💰</span>
          </div>
          <p class="text-3xl font-bold text-gray-900">SGD {{ stats.revenue.toLocaleString() }}</p>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-600 text-sm font-medium">Last Scrape</span>
            <span class="text-purple-600 text-2xl">🤖</span>
          </div>
          <p class="text-sm font-medium text-gray-900">{{ stats.lastScrape }}</p>
        </div>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - Main Actions -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Quick Actions -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">⚡ Quick Actions</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <NuxtLink
                to="/admin/users"
                class="flex items-center gap-3 p-4 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors group"
              >
                <span class="text-2xl">👥</span>
                <div>
                  <div class="font-semibold text-gray-900 group-hover:text-indigo-600">Manage Users</div>
                  <div class="text-sm text-gray-600">Create and manage users</div>
                </div>
              </NuxtLink>

              <NuxtLink
                to="/analytics"
                class="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors group"
              >
                <span class="text-2xl">📊</span>
                <div>
                  <div class="font-semibold text-gray-900 group-hover:text-blue-600">View Analytics</div>
                  <div class="text-sm text-gray-600">Campaign performance</div>
                </div>
              </NuxtLink>

              <button
                @click="viewEvents"
                class="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-left group"
              >
                <span class="text-2xl">🎫</span>
                <div>
                  <div class="font-semibold text-gray-900 group-hover:text-green-600">View Events</div>
                  <div class="text-sm text-gray-600">AttractionsSG data</div>
                </div>
              </button>

              <NuxtLink
                to="/admin/scrapers"
                class="flex items-center gap-3 p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors group"
              >
                <span class="text-2xl">🤖</span>
                <div>
                  <div class="font-semibold text-gray-900 group-hover:text-purple-600">Manage Scrapers</div>
                  <div class="text-sm text-gray-600">Configure crawlers</div>
                </div>
              </NuxtLink>

              <NuxtLink
                to="/trip-promotions-demo"
                class="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors group"
              >
                <span class="text-2xl">🔍</span>
                <div>
                  <div class="font-semibold text-gray-900 group-hover:text-orange-600">Scraper Demo</div>
                  <div class="text-sm text-gray-600">Test Trip.com scraper</div>
                </div>
              </NuxtLink>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">📋 Recent Activity</h2>
            <div class="space-y-4">
              <div
                v-for="activity in recentActivity"
                :key="activity.id"
                class="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
              >
                <span class="text-2xl">{{ activity.icon }}</span>
                <div class="flex-1">
                  <div class="font-semibold text-gray-900">{{ activity.title }}</div>
                  <div class="text-sm text-gray-600">{{ activity.description }}</div>
                  <div class="text-xs text-gray-500 mt-1">{{ activity.time }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Info & Stats -->
        <div class="space-y-6">
          <!-- System Status -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">⚙️ System Status</h2>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-gray-700">Web Server</span>
                <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                  ✅ Online
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-700">Database</span>
                <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                  ✅ Connected
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-700">Scraper Service</span>
                <span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                  ⚠️ Pending
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-700">Email Service</span>
                <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                  ✅ Active
                </span>
              </div>
            </div>
          </div>

          <!-- Platform Status -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">🌐 Platform Status</h2>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-gray-700 flex items-center gap-2">
                  🏨 Trip.com
                </span>
                <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                  Active
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-700 flex items-center gap-2">
                  🎯 Klook
                </span>
                <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                  Active
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-700 flex items-center gap-2">
                  🎫 AttractionsSG
                </span>
                <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                  Static Data
                </span>
              </div>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-200 p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">🔗 Quick Links</h2>
            <div class="space-y-2">
              <a href="/admin/users" class="block text-blue-600 hover:text-blue-800 font-medium">User Management</a>
              <a href="/analytics" class="block text-blue-600 hover:text-blue-800 font-medium">Analytics Dashboard</a>
              <a href="/trip" class="block text-blue-600 hover:text-blue-800 font-medium">Trip.com Page</a>
              <a href="/klook" class="block text-blue-600 hover:text-blue-800 font-medium">Klook Page</a>
              <a href="/attractionsg" class="block text-blue-600 hover:text-blue-800 font-medium">AttractionsSG Page</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
  layout: 'default',
  middleware: 'admin'
})

const router = useRouter()

// Mock stats - replace with real data later
const stats = ref({
  totalEvents: 320,
  activeUsers: 128,
  revenue: 45230,
  lastScrape: '2 hours ago'
})

const recentActivity = ref([
  {
    id: 1,
    icon: '🎫',
    title: 'Events Updated',
    description: 'AttractionsSG data refreshed',
    time: '2 hours ago'
  },
  {
    id: 2,
    icon: '📊',
    title: 'Analytics Report',
    description: 'Monthly report generated',
    time: '5 hours ago'
  },
  {
    id: 3,
    icon: '✅',
    title: 'Campaign Added',
    description: 'Summer Sale promotion active',
    time: '1 day ago'
  }
])

const viewEvents = () => {
  router.push('/attractionsg')
}


onMounted(() => {
  console.log('🔐 Admin dashboard loaded')
})
</script>
