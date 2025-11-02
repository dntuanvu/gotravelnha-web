<template>
  <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-200 p-6">
    <h3 class="text-lg font-bold text-gray-900 mb-4">⚡ Real-Time Monitoring</h3>
    <div class="space-y-3">
      <div v-for="metric in liveMetrics" :key="metric.name" class="flex justify-between items-center">
        <span class="text-gray-700">{{ metric.name }}</span>
        <span class="font-bold text-gray-900">{{ metric.value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useTripAnalytics } from '~/composables/useTripAnalytics'

const { getDashboardData } = useTripAnalytics()
const liveMetrics = ref([
  { name: 'Active Sessions', value: '0' },
  { name: 'Clicks (1h)', value: '0' },
  { name: 'CTR', value: '0%' }
])

let refreshInterval: NodeJS.Timeout | null = null

const updateMetrics = () => {
  const dashboard = getDashboardData.value
  liveMetrics.value = [
    { name: 'Active Sessions', value: 'N/A' },
    { name: 'Clicks (1h)', value: dashboard.overview.totalClicks.toString() },
    { name: 'CTR', value: dashboard.overview.overallCTR }
  ]
}

onMounted(() => {
  updateMetrics()
  // Refresh every 30 seconds
  refreshInterval = setInterval(updateMetrics, 30000)
})

onBeforeUnmount(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>

