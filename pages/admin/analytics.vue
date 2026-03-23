<template>
  <div class="min-h-full bg-gray-50 pb-12">
    <div class="px-4 sm:px-6 lg:px-8 py-5 space-y-8">
      <div class="flex flex-wrap gap-3 items-center justify-end">
        <div class="flex flex-wrap gap-3 items-center">
          <label class="flex items-center gap-2 text-sm text-gray-700">
            <span>Window</span>
            <select
              v-model.number="windowMinutes"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option :value="15">15 mins</option>
              <option :value="30">30 mins</option>
              <option :value="60">1 hour</option>
              <option :value="180">3 hours</option>
              <option :value="1440">24 hours</option>
            </select>
          </label>

          <label class="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              v-model="autoRefresh"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            Auto refresh (15s)
          </label>

          <button
            @click="fetchAnalytics"
            :disabled="loading"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            <span>{{ loading ? 'Refreshing…' : 'Refresh now' }}</span>
          </button>
        </div>
      </div>

      <div v-if="error" class="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
        {{ error }}
      </div>

      <div v-if="analytics" class="space-y-8">
        <div v-if="affiliate" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-gray-900">💸 Affiliate Performance</h2>
            <span class="text-xs text-gray-500">Last {{ affiliate.totals.windowMinutes }} mins</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-4 rounded-lg bg-indigo-50 border border-indigo-100">
              <div class="text-sm text-indigo-700">Total clicks</div>
              <div class="text-2xl font-bold text-indigo-900">{{ affiliate.totals.totalClicks }}</div>
            </div>
            <div class="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
              <div class="text-sm text-emerald-700">Window clicks</div>
              <div class="text-2xl font-bold text-emerald-900">{{ affiliate.totals.windowClicks }}</div>
            </div>
            <div class="p-4 rounded-lg bg-amber-50 border border-amber-100">
              <div class="text-sm text-amber-700">Top provider</div>
              <div class="text-2xl font-bold text-amber-900">
                {{ affiliate.topProviders[0]?.provider || '—' }}
              </div>
            </div>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Top providers</h3>
              <ul class="space-y-2 text-sm">
                <li v-for="item in affiliate.topProviders" :key="item.provider" class="flex justify-between bg-gray-50 rounded px-3 py-2">
                  <span>{{ item.provider }}</span>
                  <span class="font-medium text-gray-700">{{ item.count }}</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Top placements</h3>
              <ul class="space-y-2 text-sm">
                <li v-for="item in affiliate.topPlacements" :key="item.placementKey || 'unknown'" class="flex justify-between bg-gray-50 rounded px-3 py-2">
                  <span>{{ item.placementKey || 'unknown' }}</span>
                  <span class="font-medium text-gray-700">{{ item.count }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-2">
              <span class="text-gray-600 text-sm font-medium">Total events</span>
              <span class="text-blue-600 text-2xl">📈</span>
            </div>
            <p class="text-3xl font-bold text-gray-900">{{ analytics.totals.totalActivities.toLocaleString() }}</p>
            <p class="text-xs text-gray-500 mt-1">All-time tracked interactions</p>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-2">
              <span class="text-gray-600 text-sm font-medium">Unique sessions</span>
              <span class="text-purple-600 text-2xl">🪪</span>
            </div>
            <p class="text-3xl font-bold text-gray-900">{{ analytics.totals.uniqueSessions.toLocaleString() }}</p>
            <p class="text-xs text-gray-500 mt-1">Distinct session IDs recorded</p>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-2">
              <span class="text-gray-600 text-sm font-medium">Active sessions</span>
              <span class="text-green-600 text-2xl">🟢</span>
            </div>
            <p class="text-3xl font-bold text-gray-900">{{ analytics.totals.activeSessions.toLocaleString() }}</p>
            <p class="text-xs text-gray-500 mt-1">Within last {{ analytics.totals.windowMinutes }} mins</p>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-2">
              <span class="text-gray-600 text-sm font-medium">Avg events / min</span>
              <span class="text-amber-600 text-2xl">⏱️</span>
            </div>
            <p class="text-3xl font-bold text-gray-900">{{ averagePerMinute }}</p>
            <p class="text-xs text-gray-500 mt-1">Based on current window</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold text-gray-900">🔥 Top pages</h2>
              <span class="text-xs text-gray-500">Last {{ analytics.totals.windowMinutes }} mins</span>
            </div>
            <div v-if="analytics.topPages.length === 0" class="text-gray-500 text-sm">No activity recorded yet.</div>
            <ul v-else class="space-y-3">
              <li
                v-for="page in analytics.topPages"
                :key="page.page"
                class="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
              >
                <span class="text-sm font-medium text-gray-700 truncate">{{ page.page }}</span>
                <span class="text-sm text-gray-500">{{ page.count }} events</span>
              </li>
            </ul>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold text-gray-900">⚙️ Top actions</h2>
              <span class="text-xs text-gray-500">Last {{ analytics.totals.windowMinutes }} mins</span>
            </div>
            <div v-if="analytics.topActions.length === 0" class="text-gray-500 text-sm">No activity recorded yet.</div>
            <ul v-else class="space-y-3">
              <li
                v-for="action in analytics.topActions"
                :key="action.action"
                class="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
              >
                <span class="text-sm font-medium text-gray-700 truncate">{{ action.action }}</span>
                <span class="text-sm text-gray-500">{{ action.count }} events</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-gray-900">⏱️ Events timeline</h2>
            <span class="text-xs text-gray-500">Minute-by-minute volume</span>
          </div>
          <div v-if="analytics.timeline.length === 0" class="text-gray-500 text-sm">No events in the selected window.</div>
          <div v-else class="grid gap-2 text-sm">
            <div
              v-for="entry in analytics.timeline"
              :key="entry.time"
              class="flex items-center gap-3"
            >
              <div class="w-32 text-gray-600 font-medium">{{ formatTimelineLabel(entry.time) }}</div>
              <div class="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  class="h-full bg-blue-500 rounded-full transition-all"
                  :style="{ width: computeTimelineBar(entry.count) }"
                ></div>
              </div>
              <span class="text-gray-600 w-12 text-right">{{ entry.count }}</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-gray-900">📝 Recent activity</h2>
            <span class="text-xs text-gray-500">Latest {{ analytics.recent.length }} events</span>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 text-sm">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                  <th class="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Page</th>
                  <th class="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                  <th class="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Session</th>
                  <th class="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Details</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="event in analytics.recent" :key="event.id" class="hover:bg-gray-50">
                  <td class="px-4 py-2 text-gray-600">{{ formatRelative(event.timestamp) }}</td>
                  <td class="px-4 py-2 font-medium text-gray-900">{{ event.page }}</td>
                  <td class="px-4 py-2 text-gray-700">{{ event.action }}</td>
                  <td class="px-4 py-2 text-gray-500">{{ shortenSession(event.sessionId) }}</td>
                  <td class="px-4 py-2 text-gray-500 hidden lg:table-cell">
                    <div class="max-w-sm truncate" :title="describeData(event)">
                      {{ describeData(event) }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div v-else class="bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center text-gray-500">
        <p>No analytics data yet. The tracker will populate once users interact with the site.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

interface AnalyticsResponse {
  totals: {
    totalActivities: number
    uniqueSessions: number
    activeSessions: number
    windowMinutes: number
  }
  topPages: Array<{ page: string; count: number }>
  topActions: Array<{ action: string; count: number }>
  timeline: Array<{ time: string; count: number }>
  recent: Array<{
    id: string
    sessionId: string
    page: string
    action: string
    timestamp: string
    userAgent?: string | null
    viewportWidth?: number | null
    viewportHeight?: number | null
    data?: any
  }>
}

interface AffiliateAnalyticsResponse {
  totals: {
    totalClicks: number
    windowClicks: number
    windowMinutes: number
  }
  topProviders: Array<{ provider: string; count: number }>
  topPlacements: Array<{ placementKey: string | null; count: number }>
  topPages: Array<{ pagePath: string | null; count: number }>
}

const analytics = ref<AnalyticsResponse | null>(null)
const affiliate = ref<AffiliateAnalyticsResponse | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const windowMinutes = ref(60)
const autoRefresh = ref(true)
const refreshLimit = ref(100)
let timer: ReturnType<typeof setInterval> | null = null

const fetchAnalytics = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await $fetch<{ success: boolean; data: AnalyticsResponse }>('/api/admin/analytics/activities', {
      query: {
        limit: refreshLimit.value,
        window: windowMinutes.value
      }
    })
    if (response.success) {
      analytics.value = response.data
    }

    const affiliateResponse = await $fetch<{ success: boolean; data: AffiliateAnalyticsResponse }>('/api/admin/analytics/affiliate', {
      query: {
        window: windowMinutes.value
      }
    })
    if (affiliateResponse.success) {
      affiliate.value = affiliateResponse.data
    }
  } catch (err: any) {
    console.error('Failed to load analytics:', err)
    error.value = err?.data?.message || err?.message || 'Failed to load analytics data.'
  } finally {
    loading.value = false
  }
}

const startAutoRefresh = () => {
  stopAutoRefresh()
  if (autoRefresh.value) {
    timer = setInterval(fetchAnalytics, 15_000)
  }
}

const stopAutoRefresh = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

const averagePerMinute = computed(() => {
  if (!analytics.value || analytics.value.timeline.length === 0) return '0'
  const total = analytics.value.timeline.reduce((sum, entry) => sum + entry.count, 0)
  const minutes = analytics.value.totals.windowMinutes || 1
  return (total / minutes).toFixed(1)
})

const computeTimelineBar = (count: number) => {
  if (!analytics.value || analytics.value.timeline.length === 0) return '0%'
  const max = Math.max(...analytics.value.timeline.map((entry) => entry.count))
  if (max === 0) return '0%'
  return `${Math.max(6, (count / max) * 100)}%`
}

const formatTimelineLabel = (isoMinute: string) => {
  const date = new Date(isoMinute)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const formatRelative = (timestamp: string) => {
  const date = new Date(timestamp)
  const diff = Date.now() - date.getTime()
  if (diff < 60_000) return 'Just now'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} min ago`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} hr ago`
  return date.toLocaleString()
}

const describeData = (event: AnalyticsResponse['recent'][number]) => {
  const parts: string[] = []
  if (event.viewportWidth && event.viewportHeight) {
    parts.push(`${event.viewportWidth}×${event.viewportHeight}`)
  }
  if (event.userAgent) {
    parts.push(event.userAgent.slice(0, 80))
  }
  if (event.data) {
    try {
      const summary = JSON.stringify(event.data)
      parts.push(summary.length > 120 ? `${summary.slice(0, 117)}…` : summary)
    } catch (err) {
      console.error('Error stringifying activity data:', err)
    }
  }
  return parts.join(' • ') || '—'
}

const shortenSession = (sessionId: string) => {
  if (!sessionId) return '—'
  return sessionId.length > 10 ? `${sessionId.slice(0, 4)}…${sessionId.slice(-4)}` : sessionId
}

onMounted(async () => {
  await fetchAnalytics()
  startAutoRefresh()
})

onBeforeUnmount(() => {
  stopAutoRefresh()
})

watch(windowMinutes, () => {
  fetchAnalytics()
})

watch(autoRefresh, () => {
  startAutoRefresh()
})
</script>

