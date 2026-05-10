<template>
  <div class="min-h-full bg-gray-50 pb-12">
    <div class="px-4 sm:px-6 lg:px-8 py-5 space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Affiliate Performance Dashboard</h2>
          <p class="text-sm text-gray-600">Top placements, CTR proxy, provider split, and device mix.</p>
        </div>
        <div class="flex items-center gap-3">
          <label class="flex items-center gap-2 text-sm text-gray-700">
            <span>Window</span>
            <select
              v-model.number="windowMinutes"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option :value="60">1 hour</option>
              <option :value="1440">24 hours</option>
              <option :value="10080">7 days</option>
              <option :value="43200">30 days</option>
            </select>
          </label>
          <button
            @click="fetchDashboard"
            :disabled="loading"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            <span>{{ loading ? 'Refreshing…' : 'Refresh' }}</span>
          </button>
        </div>
      </div>

      <div v-if="error" class="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
        {{ error }}
      </div>

      <template v-if="dashboard">
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div class="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
            <div class="text-sm text-gray-600">Total clicks (all time)</div>
            <div class="text-2xl font-bold text-gray-900 mt-1">{{ dashboard.totals.totalClicks.toLocaleString() }}</div>
          </div>
          <div class="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
            <div class="text-sm text-gray-600">Clicks (window)</div>
            <div class="text-2xl font-bold text-blue-700 mt-1">{{ dashboard.totals.windowClicks.toLocaleString() }}</div>
          </div>
          <div class="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
            <div class="text-sm text-gray-600">Unique click sessions</div>
            <div class="text-2xl font-bold text-emerald-700 mt-1">{{ dashboard.totals.uniqueSessions.toLocaleString() }}</div>
          </div>
          <div class="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
            <div class="text-sm text-gray-600">Avg clicks / session</div>
            <div class="text-2xl font-bold text-purple-700 mt-1">{{ clicksPerSession }}</div>
          </div>
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Provider Split</h3>
            <div v-if="dashboard.providerSplit.length === 0" class="text-sm text-gray-500">No provider data yet.</div>
            <ul v-else class="space-y-3">
              <li
                v-for="provider in dashboard.providerSplit"
                :key="provider.provider"
                class="rounded-lg bg-gray-50 border border-gray-100 p-3"
              >
                <div class="flex items-center justify-between text-sm mb-2">
                  <span class="font-semibold text-gray-800 uppercase">{{ provider.provider }}</span>
                  <span class="text-gray-700">{{ provider.clicks }} clicks ({{ provider.percentage }}%)</span>
                </div>
                <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div class="h-full bg-blue-500 rounded-full" :style="{ width: `${provider.percentage}%` }"></div>
                </div>
              </li>
            </ul>
          </div>

          <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Mobile vs Desktop</h3>
            <ul class="space-y-3">
              <li
                v-for="device in dashboard.mobileVsDesktop"
                :key="device.device"
                class="rounded-lg bg-gray-50 border border-gray-100 p-3"
              >
                <div class="flex items-center justify-between text-sm mb-2">
                  <span class="font-semibold text-gray-800 capitalize">{{ device.device }}</span>
                  <span class="text-gray-700">{{ device.clicks }} clicks ({{ device.percentage }}%)</span>
                </div>
                <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div class="h-full bg-emerald-500 rounded-full" :style="{ width: `${device.percentage}%` }"></div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-900">Top Placements</h3>
            <span class="text-xs text-gray-500">CTR proxy = placement unique sessions / all click sessions</span>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 text-sm">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Placement</th>
                  <th class="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Clicks</th>
                  <th class="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Unique Sessions</th>
                  <th class="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">CTR Proxy</th>
                  <th class="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Sample Pages</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="placement in dashboard.topPlacements" :key="placement.placementKey" class="hover:bg-gray-50">
                  <td class="px-4 py-3 font-medium text-gray-900">{{ placement.placementKey }}</td>
                  <td class="px-4 py-3 text-gray-700">{{ placement.clicks }}</td>
                  <td class="px-4 py-3 text-gray-700">{{ placement.uniqueSessions }}</td>
                  <td class="px-4 py-3">
                    <span class="px-2 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {{ placement.ctrProxy }}%
                    </span>
                  </td>
                  <td class="px-4 py-3 text-gray-600">
                    {{ placement.samplePages?.length ? placement.samplePages.join(', ') : '—' }}
                  </td>
                </tr>
                <tr v-if="dashboard.topPlacements.length === 0">
                  <td colspan="5" class="px-4 py-6 text-center text-gray-500">No placement data in this window.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>

      <div v-else-if="!loading" class="bg-white border border-dashed border-gray-300 rounded-xl p-10 text-center text-gray-500">
        No affiliate click data yet. Once clicks happen, this dashboard will populate.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

interface DashboardResponse {
  totals: {
    totalClicks: number
    windowClicks: number
    uniqueSessions: number
    windowMinutes: number
  }
  providerSplit: Array<{ provider: string; clicks: number; percentage: number }>
  mobileVsDesktop: Array<{ device: string; clicks: number; percentage: number }>
  topPlacements: Array<{
    placementKey: string
    clicks: number
    uniqueSessions: number
    ctrProxy: number
    samplePages: string[]
  }>
}

const dashboard = ref<DashboardResponse | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const windowMinutes = ref(10080)

const clicksPerSession = computed(() => {
  if (!dashboard.value) return '0.00'
  const sessions = dashboard.value.totals.uniqueSessions || 1
  return (dashboard.value.totals.windowClicks / sessions).toFixed(2)
})

const fetchDashboard = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await $fetch<{ success: boolean; data: DashboardResponse }>('/api/admin/analytics/affiliate-performance', {
      query: { window: windowMinutes.value }
    })
    if (response.success) {
      dashboard.value = response.data
    }
  } catch (err: any) {
    console.error('Failed to load affiliate dashboard:', err)
    error.value = err?.data?.message || err?.message || 'Failed to load affiliate dashboard.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDashboard()
})

watch(windowMinutes, () => {
  fetchDashboard()
})
</script>

