<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">📊 Analytics Dashboard</h1>
        <p class="text-gray-600">Track and optimize your Trip.com affiliate performance</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="space-y-8">
        <div v-for="n in 3" :key="n" class="bg-white rounded-xl shadow p-8 animate-pulse">
          <div class="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div class="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>

      <!-- Dashboard Content -->
      <div v-else class="space-y-8">
        <!-- Overview Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-2">
              <span class="text-gray-600 text-sm font-medium">Total Clicks</span>
              <span class="text-blue-600 text-2xl">👆</span>
            </div>
            <p class="text-3xl font-bold text-gray-900">{{ dashboard.overview.totalClicks.toLocaleString() }}</p>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-2">
              <span class="text-gray-600 text-sm font-medium">CTR</span>
              <span class="text-green-600 text-2xl">📈</span>
            </div>
            <p class="text-3xl font-bold text-gray-900">{{ dashboard.overview.overallCTR }}</p>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-2">
              <span class="text-gray-600 text-sm font-medium">Conversions</span>
              <span class="text-purple-600 text-2xl">💰</span>
            </div>
            <p class="text-3xl font-bold text-gray-900">{{ dashboard.overview.totalConversions }}</p>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-2">
              <span class="text-gray-600 text-sm font-medium">Revenue</span>
              <span class="text-yellow-600 text-2xl">💵</span>
            </div>
            <p class="text-3xl font-bold text-gray-900">SGD {{ dashboard.overview.totalRevenue.toLocaleString() }}</p>
          </div>
        </div>

        <!-- Top Performing Campaigns -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900">🏆 Top Performing Campaigns</h2>
            <div class="flex gap-2">
              <button 
                @click="exportToCSV" 
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                📥 Export CSV
              </button>
              <button 
                @click="exportToJSON" 
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                📥 Export JSON
              </button>
            </div>
          </div>

          <div v-if="dashboard.topCampaigns.length === 0" class="text-center py-12">
            <p class="text-gray-500">No campaign data yet. Start using Trip.com deep links to see metrics.</p>
          </div>

          <div v-else class="space-y-4">
            <div 
              v-for="campaign in dashboard.topCampaigns" 
              :key="campaign.campaign.id"
              class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
            >
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-lg font-semibold text-gray-900">{{ campaign.campaign.name }}</h3>
                <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {{ campaign.campaign.active ? 'Active' : 'Inactive' }}
                </span>
              </div>
              
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div v-for="variant in campaign.variants" :key="variant.id" class="text-sm">
                  <div class="flex items-center gap-2 mb-1">
                    <div 
                      class="w-3 h-3 rounded-full" 
                      :style="{ backgroundColor: variant.metadata?.color || '#3B82F6' }"
                    ></div>
                    <span class="font-medium text-gray-700">{{ variant.name }}</span>
                  </div>
                  <div class="text-xs text-gray-600">
                    <div>CTR: {{ variant.ctr }}</div>
                    <div>Clicks: {{ variant.clicks }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Real-Time Monitoring -->
        <WatchUsage />

        <!-- Recommendations -->
        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-200 p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">💡 AI Recommendations</h2>
          
          <div v-if="recommendations.length === 0" class="text-center py-8">
            <p class="text-gray-600">✨ All campaigns performing well!</p>
          </div>

          <ul v-else class="space-y-3">
            <li 
              v-for="(rec, index) in recommendations" 
              :key="index"
              class="flex items-start gap-3 bg-white rounded-lg p-4 shadow-sm"
            >
              <span class="text-2xl flex-shrink-0">{{ getRecommendationIcon(rec) }}</span>
              <p class="text-gray-700">{{ rec }}</p>
            </li>
          </ul>
        </div>

        <!-- Conversion Breakdown -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">💰 Conversion Breakdown</h2>
          
          <div v-if="dashboard.conversions.totalConversions === 0" class="text-center py-12">
            <p class="text-gray-500">No conversions yet.</p>
          </div>

          <div v-else class="space-y-6">
            <div>
              <div class="flex justify-between items-center mb-2">
                <span class="text-gray-700">Total Revenue</span>
                <span class="text-2xl font-bold text-green-600">SGD {{ dashboard.conversions.totalValue.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-700">Average Order Value</span>
                <span class="text-xl font-semibold text-gray-900">SGD {{ dashboard.conversions.averageOrderValue }}</span>
              </div>
            </div>

            <!-- By Type -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="font-semibold text-gray-900 mb-3">By Product Type</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div 
                  v-for="(count, type) in dashboard.conversions.byType" 
                  :key="type"
                  class="bg-gray-50 rounded-lg p-4"
                >
                  <div class="text-sm text-gray-600 mb-1">{{ formatType(type) }}</div>
                  <div class="text-2xl font-bold text-gray-900">{{ count }}</div>
                </div>
              </div>
            </div>

            <!-- By Campaign -->
            <div class="border-t border-gray-200 pt-6">
              <h3 class="font-semibold text-gray-900 mb-3">By Campaign</h3>
              <div class="space-y-2">
                <div 
                  v-for="(stats, campaign) in dashboard.conversions.byCampaign" 
                  :key="campaign"
                  class="flex justify-between items-center bg-gray-50 rounded-lg p-3"
                >
                  <span class="text-sm text-gray-700">{{ campaign }}</span>
                  <div class="flex gap-4">
                    <span class="text-sm font-medium text-gray-900">{{ stats.count }} conversions</span>
                    <span class="text-sm font-bold text-green-600">SGD {{ stats.value.toLocaleString() }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Refresh Button -->
        <div class="text-center">
          <button 
            @click="refreshDashboard" 
            :disabled="loading"
            class="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-400 transition font-semibold"
          >
            🔄 Refresh Data
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTripAnalytics } from '~/composables/useTripAnalytics'
import WatchUsage from '~/components/WatchUsage.vue'

const { getDashboardData, getRecommendations, exportToCSV, exportToJSON } = useTripAnalytics()

const loading = ref(false)
const dashboard = ref(getDashboardData.value)
const recommendations = ref(getRecommendations())

const refreshDashboard = () => {
  loading.value = true
  setTimeout(() => {
    dashboard.value = getDashboardData.value
    recommendations.value = getRecommendations()
    loading.value = false
    console.log('✅ Dashboard refreshed')
  }, 500)
}

const getRecommendationIcon = (text: string) => {
  if (text.includes('⚠️')) return '⚠️'
  if (text.includes('📈')) return '📈'
  if (text.includes('🎯')) return '🎯'
  if (text.includes('💰')) return '💰'
  return '✅'
}

const formatType = (type: string): string => {
  const mapping: { [key: string]: string } = {
    'hotel_booking': '🏨 Hotels',
    'flight_booking': '✈️ Flights',
    'activity_booking': '🎯 Activities',
    'train_booking': '🚄 Trains',
    'car_booking': '🚗 Car Rental'
  }
  return mapping[type] || type
}

onMounted(() => {
  console.log('📊 Analytics dashboard loaded')
})
</script>

