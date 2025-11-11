<template>
  <div class="min-h-screen bg-gray-50 pb-12">
    <div class="max-w-7xl mx-auto px-4 pt-8 space-y-8">
      <div class="flex flex-col gap-2">
        <NuxtLink to="/admin" class="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2">
          <span>← Back to Admin Dashboard</span>
        </NuxtLink>
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">🎫 AttractionsSG Events</h1>
            <p class="text-gray-600">Review and adjust pricing before publishing to end-users.</p>
          </div>
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <div class="flex flex-col sm:flex-row gap-3">
            <button
              @click="loadEvents"
              :disabled="loading"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span v-if="loading" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              <span>{{ loading ? 'Refreshing…' : 'Refresh Events' }}</span>
            </button>
            <button
              @click="saveChanges"
              :disabled="saving || !hasChanges"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span v-if="saving" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              <span>{{ saving ? 'Saving…' : 'Save Changes' }}</span>
            </button>
          </div>
          <div class="flex flex-col sm:flex-row gap-3">
            <button
              @click="toggleSelectAll"
              :disabled="loading || filteredEvents.length === 0"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span v-if="isAllSelected">Clear selection</span>
              <span v-else>Select all ({{ filteredEvents.length }})</span>
            </button>
            <button
              v-if="selectedCount > 0"
              @click="bulkUpdatePublished(true)"
              :disabled="saving"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Publish selected ({{ selectedCount }})
            </button>
            <button
              v-if="selectedCount > 0"
              @click="bulkUpdatePublished(false)"
              :disabled="saving"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Unpublish selected ({{ selectedCount }})
            </button>
          </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="relative">
            <input
              v-model="filters.search"
              type="text"
              placeholder="Search by title or code…"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            />
            <div v-if="filters.search" class="absolute top-1/2 -translate-y-1/2 right-3 text-sm">
              <button @click="filters.search = ''" class="text-gray-400 hover:text-gray-600">Clear</button>
            </div>
          </div>

          <select
            v-model="filters.status"
            class="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
          >
            <option value="all">All statuses</option>
            <option value="draft">Draft (unpublished)</option>
            <option value="published">Published</option>
          </select>

          <select
            v-model="filters.sort"
            class="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
          >
            <option value="latest">Latest updated</option>
            <option value="alpha">Name A → Z</option>
            <option value="priceAsc">Markup Low → High</option>
            <option value="priceDesc">Markup High → Low</option>
          </select>
        </div>

        <div class="flex items-center gap-3 text-sm text-gray-600">
          <span>{{ filteredEvents.length }} events</span>
          <span v-if="hasChanges" class="text-emerald-600 font-semibold">• Unsaved changes</span>
          <span v-if="selectedCount > 0" class="text-indigo-600 font-semibold">• {{ selectedCount }} selected</span>
        </div>
      </div>

      <div
        v-if="filteredEvents.length === 0 && !loading"
        class="bg-white border border-gray-200 rounded-xl p-12 text-center space-y-4"
      >
        <h3 class="text-xl font-bold text-gray-800">No events match your filters</h3>
        <p class="text-gray-600">Adjust your search or check back after the next crawler run.</p>
      </div>

      <div class="space-y-6">
        <div
          v-for="event in paginatedEvents"
          :key="event.id"
          class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
        >
          <div class="grid grid-cols-1 lg:grid-cols-4">
            <div class="lg:col-span-3 p-6 space-y-4">
              <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div class="flex items-start gap-3">
                  <input
                    type="checkbox"
                    class="mt-1 h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    :checked="selectedIds.has(event.id)"
                    @change="toggleSelect(event.id, ($event.target as HTMLInputElement | null)?.checked)"
                  />
                  <div>
                    <h2 class="text-xl font-semibold text-gray-900">{{ event.title }}</h2>
                    <p class="text-sm text-gray-500">
                      {{ event.slug || event.id }}
                    </p>
                  </div>
                </div>
                <span
                  class="px-2 py-1 rounded-lg text-xs font-semibold self-start"
                  :class="event.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
                >
                  {{ event.isPublished ? 'Published' : 'Draft' }}
                </span>
              </div>

              <div v-if="event.description" class="text-sm text-gray-600 line-clamp-3">
                {{ event.description }}
              </div>

              <div class="flex flex-wrap gap-4 text-sm text-gray-500">
                <span v-if="event.location" class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  {{ event.location }}
                </span>
                <span v-if="event.category" class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg>
                  {{ event.category }}
                </span>
                <span class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Updated {{ formatRelative(event.updatedAt || event.lastSeenAt || event.createdAt) }}
                </span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600">Crawler Price</span>
                    <span class="text-sm text-gray-500 uppercase">RP price</span>
                  </div>
                  <p class="text-2xl font-semibold text-gray-900">{{ event.originalPriceText || 'N/A' }}</p>
                  <p v-if="event.priceText && event.priceText !== event.originalPriceText" class="text-sm text-emerald-600">
                    Crawler deal: {{ event.priceText }}
                  </p>
                </div>
                <div class="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                  <div class="flex items-center justify-between">
                    <label class="text-sm text-gray-600">Public Price (editable)</label>
                    <span class="text-xs text-gray-500">Displayed to customers</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-500">SGD</div>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      v-model.number="event.publicPrice"
                      @input="markDirty(event.id)"
                    />
                  </div>
                  <div class="text-xs text-gray-500">
                    Margin vs crawler: <span :class="marginClass(event)">{{ formatMargin(event) }}</span>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
                <textarea
                  rows="2"
                  v-model="event.notes"
                  @input="markDirty(event.id)"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Internal notes, promotional strategy or supplier details"
                ></textarea>
              </div>
            </div>
            <div class="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-gray-200 bg-gray-50 p-6 space-y-3">
              <div class="font-semibold text-gray-700">Ticket Options</div>
              <div v-if="event.options && event.options.length" class="space-y-3 text-sm">
                <div
                  v-for="option in event.options"
                  :key="option.code || option.name"
                  class="bg-white border border-gray-200 rounded-lg p-3 space-y-1"
                >
                  <div class="font-semibold text-gray-800">{{ option.name || 'Ticket option' }}</div>
                  <div class="text-xs text-gray-500">{{ option.code || 'No code' }}</div>
                  <div class="flex items-baseline gap-2 text-emerald-600 font-semibold">
                    {{ option.priceText || 'SGD ???' }}
                  </div>
                  <div v-if="option.validity" class="text-xs text-gray-500">{{ option.validity }}</div>
                </div>
              </div>
              <div v-else class="text-sm text-gray-500">
                No options detected. Customers will request via GoVietHub with general notes.
              </div>

              <div class="pt-4 border-t border-gray-200 space-y-3">
                <label class="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" v-model="event.isPublished" @change="togglePublishFlag(event)" />
                  Publish to SG Attractions page
                </label>
                <button
                  @click="openPublicPage(event)"
                  class="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition text-sm"
                >
                  View public page
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between pt-4">
        <div class="text-sm text-gray-500">
          Showing {{ pagination.start + 1 }} – {{ Math.min(pagination.end, filteredEvents.length) }} of
          {{ filteredEvents.length }}
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="prevPage"
            :disabled="pagination.page === 1"
            class="px-3 py-1 rounded-lg border border-gray-300 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Prev
          </button>
          <div class="text-sm text-gray-600">Page {{ pagination.page }} of {{ totalPages }}</div>
          <button
            @click="nextPage"
            :disabled="pagination.page === totalPages"
            class="px-3 py-1 rounded-lg border border-gray-300 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

definePageMeta({
  layout: 'default',
  middleware: 'admin'
})

const loading = ref(false)
const saving = ref(false)
const hasChanges = computed(() => dirtyIds.value.size > 0)

const FETCH_LIMIT = 500

const filters = ref({
  search: '',
  status: 'all',
  sort: 'latest'
})

const pagination = ref({
  page: 1,
  pageSize: 10,
  start: 0,
  end: 10
})

const dirtyIds = ref<Set<string>>(new Set())
const originalMap = ref<Map<string, any>>(new Map())
const selectedIds = ref<Set<string>>(new Set())

const events = ref<any[]>([])

const toNumber = (value: any): number | null => {
  if (value === null || value === undefined) return null
  const num = Number(value)
  return Number.isFinite(num) ? num : null
}

const formatRelative = (date?: Date | string | null) => {
  if (!date) return 'never'
  const d = typeof date === 'string' ? new Date(date) : date
  if (!(d instanceof Date) || Number.isNaN(d.getTime())) {
    return 'unknown'
  }
  const diff = Date.now() - d.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hr${hours > 1 ? 's' : ''} ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`
  return d.toLocaleDateString()
}

const marginClass = (event: any) => {
  const margin = computeMargin(event)
  if (margin > 0) return 'text-emerald-600'
  if (margin < 0) return 'text-red-500'
  return 'text-gray-500'
}

const formatMargin = (event: any) => {
  const margin = computeMargin(event)
  if (isNaN(margin)) return 'N/A'
  const abs = Math.abs(margin).toFixed(2)
  return margin >= 0 ? `+SGD${abs}` : `-SGD${abs}`
}

const computeMargin = (event: any) => {
  const crawler = event.priceAmount ?? event.originalPriceAmount
  if (!crawler || !event.publicPrice) return NaN
  return event.publicPrice - crawler
}

const loadEvents = async () => {
  try {
    loading.value = true
    const res = await $fetch<{ data?: any[] }>('/api/admin/attractionsg', {
      method: 'GET',
      query: {
        page: 1,
        limit: FETCH_LIMIT,
        search: filters.value.search,
        status: filters.value.status,
        sort: filters.value.sort
      }
    })

    const rawEvents: any[] = Array.isArray(res?.data) ? res.data : []
    events.value = rawEvents.map((event: any) => {
      const priceAmount = toNumber(event.priceAmount)
      const originalPriceAmount = toNumber(event.originalPriceAmount)
      const publicPrice =
        event.publicPrice !== undefined && event.publicPrice !== null
          ? toNumber(event.publicPrice)
          : null
      const basePrice = publicPrice ?? priceAmount ?? originalPriceAmount ?? null

      return {
        ...event,
        priceAmount,
        originalPriceAmount,
        publicPrice: basePrice,
        notes: event.notes || '',
        publishedAt: event.publishedAt || null
      }
    })
    originalMap.value = new Map(
      events.value.map((event) => [
        event.id,
        {
          publicPrice: event.publicPrice,
          isPublished: event.isPublished,
          notes: event.notes,
          publishedAt: event.publishedAt
        }
      ])
    )
    dirtyIds.value.clear()
    pruneSelection()
    resetPagination()
  } catch (error) {
    console.error('Failed to load events:', error)
  } finally {
    loading.value = false
  }
}

const saveChanges = async () => {
  if (dirtyIds.value.size === 0) return
  try {
    saving.value = true
    const payload = events.value
      .filter((event) => dirtyIds.value.has(event.id))
      .map((event) => ({
        id: event.id,
        publicPrice: event.publicPrice,
        isPublished: event.isPublished,
        notes: event.notes,
        publishedAt: event.isPublished ? (event.publishedAt || new Date()) : null
      }))

    await $fetch('/api/admin/attractionsg', {
      method: 'POST',
      body: payload
    })

    dirtyIds.value.clear()
    selectedIds.value.clear()
    await loadEvents()
  } catch (error) {
    console.error('Failed to save changes:', error)
  } finally {
    saving.value = false
  }
}

const openPublicPage = (event: any) => {
  if (event.url) {
    window.open(event.url, '_blank')
  } else {
    console.warn('No public URL available for this event:', event.id)
  }
}

const markDirty = (id: string) => {
  dirtyIds.value.add(id)
}

const toggleSelect = (id: string, checked?: boolean) => {
  const next = new Set(selectedIds.value)
  const shouldSelect = checked ?? !next.has(id)
  if (shouldSelect) {
    next.add(id)
  } else {
    next.delete(id)
  }
  selectedIds.value = next
}

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedIds.value = new Set()
    return
  }
  selectedIds.value = new Set(filteredEvents.value.map((event) => event.id))
}

const togglePublishFlag = (event: any) => {
  if (!event) return
  event.isPublished = !!event.isPublished
  event.publishedAt = event.isPublished ? event.publishedAt || new Date().toISOString() : null
  markDirty(event.id)
}

const prevPage = () => {
  pagination.value.page--
}

const nextPage = () => {
  pagination.value.page++
}

const totalPages = computed(() => {
  return Math.ceil(filteredEvents.value.length / pagination.value.pageSize)
})

const selectedCount = computed(() => selectedIds.value.size)

const isAllSelected = computed(() => {
  if (filteredEvents.value.length === 0) return false
  return filteredEvents.value.every((event) => selectedIds.value.has(event.id))
})

const paginatedEvents = computed(() => {
  const start = (pagination.value.page - 1) * pagination.value.pageSize
  const end = start + pagination.value.pageSize
  pagination.value.start = start
  pagination.value.end = end
  return filteredEvents.value.slice(start, end)
})

onMounted(() => {
  loadEvents()
})

const resetPagination = () => {
  pagination.value.page = 1
  pagination.value.start = 0
  pagination.value.end = pagination.value.pageSize
}

function pruneSelection() {
  const validIds = new Set(events.value.map((event) => event.id))
  selectedIds.value = new Set([...selectedIds.value].filter((id) => validIds.has(id)))
}

const filteredEvents = computed(() => {
  let list = events.value

  if (filters.value.search) {
    const q = filters.value.search.toLowerCase()
    list = list.filter((event) =>
      event.title?.toLowerCase().includes(q) ||
      event.slug?.toLowerCase().includes(q) ||
      event.location?.toLowerCase().includes(q) ||
      event.description?.toLowerCase().includes(q) ||
      event.notes?.toLowerCase().includes(q)
    )
  }

  if (filters.value.status !== 'all') {
    const published = filters.value.status === 'published'
    list = list.filter((event) => !!event.isPublished === published)
  }

  if (filters.value.sort === 'latest') {
    list.sort((a, b) => {
      const getDate = (event: any) => event.updatedAt || event.lastSeenAt || event.createdAt || 0
      return new Date(getDate(b)).getTime() - new Date(getDate(a)).getTime()
    })
  } else if (filters.value.sort === 'alpha') {
    list.sort((a, b) => a.title.localeCompare(b.title))
  } else if (filters.value.sort === 'priceAsc') {
    list.sort((a, b) => (a.publicPrice ?? 0) - (b.publicPrice ?? 0))
  } else if (filters.value.sort === 'priceDesc') {
    list.sort((a, b) => (b.publicPrice ?? 0) - (a.publicPrice ?? 0))
  }

  if (list.length > 0) {
    pagination.value.start = (pagination.value.page - 1) * pagination.value.pageSize
    pagination.value.end = pagination.value.start + pagination.value.pageSize
  } else {
    pagination.value.start = 0
    pagination.value.end = pagination.value.pageSize
  }
  return list
})

watch(
  () => [filters.value.search, filters.value.status, filters.value.sort, events.value.length],
  () => {
    resetPagination()
    pruneSelection()
  }
)

watch(
  () => pagination.value.page,
  (page, prev) => {
    if (page < 1) {
      pagination.value.page = 1
      return
    }
    const pages = totalPages.value || 1
    if (page > pages) {
      pagination.value.page = pages
      return
    }
  }
)

const bulkUpdatePublished = async (published: boolean) => {
  if (selectedIds.value.size === 0) return
  events.value.forEach((event) => {
    if (selectedIds.value.has(event.id)) {
      if (event.isPublished !== published) {
        event.isPublished = published
        event.publishedAt = published ? new Date().toISOString() : null
        markDirty(event.id)
      }
    }
  })
  await saveChanges()
}

</script>

