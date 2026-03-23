<template>
  <div class="min-h-full bg-gray-50 pb-12">
    <div class="px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <div class="flex flex-col gap-2">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">🎯 Klook Events</h1>
            <p class="text-gray-600">Manage and view scraped Klook events and activities.</p>
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
                @click="bulkUpdateActive(true)"
                :disabled="saving"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Activate selected ({{ selectedCount }})
              </button>
              <button
                v-if="selectedCount > 0"
                @click="bulkUpdateActive(false)"
                :disabled="saving"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Deactivate selected ({{ selectedCount }})
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
              placeholder="Search by title or location…"
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            v-model="filters.sort"
            class="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
          >
            <option value="latest">Latest updated</option>
            <option value="alpha">Name A → Z</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
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
        <p class="text-sm text-gray-500">
          Configure crawl URLs from the 
          <NuxtLink to="/admin/scrapers" class="text-blue-600 hover:underline">Scraper Management Overview</NuxtLink> page.
        </p>
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
                    <p v-if="event.link" class="text-sm text-gray-500 break-all">
                      {{ event.link }}
                    </p>
                  </div>
                </div>
                <span
                  class="px-2 py-1 rounded-lg text-xs font-semibold self-start"
                  :class="event.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'"
                >
                  {{ event.isActive ? 'Active' : 'Inactive' }}
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
                <span v-if="event.rating" class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                  {{ event.rating }} / 5
                  <span v-if="event.reviewCount">({{ event.reviewCount }} reviews)</span>
                </span>
                <span class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Updated {{ formatRelative(event.updatedAt || event.createdAt) }}
                </span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-if="event.image" class="relative h-48 rounded-lg overflow-hidden">
                  <img :src="event.image" :alt="event.title" class="w-full h-full object-cover" />
                </div>
                <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600">Price</span>
                    <span class="text-sm text-gray-500 uppercase">{{ event.currency || 'SGD' }}</span>
                  </div>
                  <div class="flex items-baseline gap-2">
                    <p v-if="event.priceAmount || event.priceText" class="text-2xl font-semibold text-gray-900">
                      {{ formatCurrency(event.priceAmount || event.priceText) }}
                    </p>
                    <p v-else class="text-lg text-gray-400">N/A</p>
                    <p v-if="event.originalPriceAmount && event.originalPriceAmount !== event.priceAmount" class="text-sm text-gray-400 line-through">
                      {{ formatCurrency(event.originalPriceAmount) }}
                    </p>
                  </div>
                  <p v-if="event.link" class="text-xs text-gray-500 mt-2 break-all">
                    Original URL: {{ event.link }}
                  </p>
                  <p v-if="event.link" class="text-xs text-emerald-600 mt-1 break-all">
                    Affiliate URL: {{ getAffiliateLink(event.link) }}
                  </p>
                </div>
              </div>
            </div>
            <div class="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-gray-200 bg-gray-50 p-6 space-y-3">
              <div class="font-semibold text-gray-700">Status</div>
              <label class="flex items-center gap-2 text-sm text-gray-700">
                <input 
                  type="checkbox" 
                  v-model="event.isActive" 
                  @change="markDirty(event.id)" 
                />
                Active (visible to users)
              </label>

              <div class="pt-4 border-t border-gray-200 space-y-3">
                <button
                  v-if="event.link"
                  @click="openKlookPage(event)"
                  class="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition text-sm"
                >
                  View on Klook
                </button>
                <button
                  v-if="event.link"
                  @click="copyAffiliateLink(event)"
                  class="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition text-sm"
                >
                  Copy Affiliate Link
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
import { appendKlookAffiliateId } from '~/utils/affiliate-links'

const runtimeConfig = useRuntimeConfig()

definePageMeta({
  layout: 'admin',
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
  pageSize: 20,
  start: 0,
  end: 20
})

const events = ref<any[]>([])
const selectedIds = ref(new Set<string>())
const dirtyIds = ref(new Set<string>())

const filteredEvents = computed(() => {
  let filtered = [...events.value]

  // Search filter
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    filtered = filtered.filter((event) => {
      return (
        event.title?.toLowerCase().includes(search) ||
        event.location?.toLowerCase().includes(search) ||
        event.category?.toLowerCase().includes(search) ||
        event.description?.toLowerCase().includes(search)
      )
    })
  }

  // Status filter
  if (filters.value.status === 'active') {
    filtered = filtered.filter((e) => e.isActive === true)
  } else if (filters.value.status === 'inactive') {
    filtered = filtered.filter((e) => e.isActive === false)
  }

  // Sort
  const sorted = [...filtered]
  switch (filters.value.sort) {
    case 'alpha':
      sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
      break
    case 'priceAsc':
      sorted.sort((a, b) => {
        const priceA = Number(a.priceAmount || a.originalPriceAmount || 0)
        const priceB = Number(b.priceAmount || b.originalPriceAmount || 0)
        return priceA - priceB
      })
      break
    case 'priceDesc':
      sorted.sort((a, b) => {
        const priceA = Number(a.priceAmount || a.originalPriceAmount || 0)
        const priceB = Number(b.priceAmount || b.originalPriceAmount || 0)
        return priceB - priceA
      })
      break
    case 'latest':
    default:
      sorted.sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime()
        const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime()
        return dateB - dateA
      })
      break
  }

  return sorted
})

const paginatedEvents = computed(() => {
  const start = (pagination.value.page - 1) * pagination.value.pageSize
  const end = start + pagination.value.pageSize
  pagination.value.start = start
  pagination.value.end = end
  return filteredEvents.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredEvents.value.length / pagination.value.pageSize))

const selectedCount = computed(() => selectedIds.value.size)

const isAllSelected = computed(() => {
  return filteredEvents.value.length > 0 && filteredEvents.value.every((e) => selectedIds.value.has(e.id))
})

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

const formatCurrency = (value: number | string | null | undefined) => {
  if (value === null || value === undefined) return 'N/A'
  const numValue = typeof value === 'string' ? parseFloat(value) : Number(value)
  if (Number.isNaN(numValue)) return 'N/A'
  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency: 'SGD'
  }).format(numValue)
}

const getAffiliateLink = (url: string | null | undefined): string => {
  if (!url) return ''
  // Append Klook affiliate ID when displaying to users
  const affiliateId = runtimeConfig.public?.KLOOK_AD_ID || runtimeConfig.public?.KLOOK_AFFILIATE_ID
  return appendKlookAffiliateId(url, affiliateId)
}

const markDirty = (id: string) => {
  dirtyIds.value.add(id)
}

const toggleSelect = (id: string, checked: boolean) => {
  if (checked) {
    selectedIds.value.add(id)
  } else {
    selectedIds.value.delete(id)
  }
}

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedIds.value.clear()
  } else {
    filteredEvents.value.forEach((e) => selectedIds.value.add(e.id))
  }
}

const loadEvents = async () => {
  try {
    loading.value = true
    const res = await $fetch<{ data?: any[] }>('/api/admin/klook', {
      method: 'GET',
      query: {
        page: 1,
        limit: FETCH_LIMIT,
        search: filters.value.search,
        status: filters.value.status,
        sort: filters.value.sort
      }
    })

    events.value = Array.isArray(res?.data) ? res.data : []
    dirtyIds.value.clear()
  } catch (error: any) {
    console.error('Failed to load Klook events:', error)
    alert('Failed to load events: ' + (error.message || 'Unknown error'))
  } finally {
    loading.value = false
  }
}

const saveChanges = async () => {
  if (dirtyIds.value.size === 0) return

  try {
    saving.value = true
    const updates = events.value
      .filter((e) => dirtyIds.value.has(e.id))
      .map((e) => ({
        id: e.id,
        isActive: e.isActive
        // TODO: After migration to unified Event model, add more fields
      }))

    await $fetch('/api/admin/klook', {
      method: 'POST',
      body: updates
    })

    dirtyIds.value.clear()
    await loadEvents()
  } catch (error: any) {
    console.error('Failed to save changes:', error)
    alert('Failed to save: ' + (error.message || 'Unknown error'))
  } finally {
    saving.value = false
  }
}

const bulkUpdateActive = async (active: boolean) => {
  if (selectedIds.value.size === 0) return
  events.value.forEach((event) => {
    if (selectedIds.value.has(event.id)) {
      event.isActive = active
      markDirty(event.id)
    }
  })
  await saveChanges()
}

const openKlookPage = (event: any) => {
  if (event.link) {
    window.open(getAffiliateLink(event.link), '_blank', 'noopener,noreferrer')
  }
}

const copyAffiliateLink = async (event: any) => {
  if (event.link) {
    const affiliateLink = getAffiliateLink(event.link)
    try {
      await navigator.clipboard.writeText(affiliateLink)
      alert('Affiliate link copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy:', error)
      alert('Failed to copy link. Please copy manually: ' + affiliateLink)
    }
  }
}

const prevPage = () => {
  pagination.value.page--
}

const nextPage = () => {
  pagination.value.page++
}

watch(
  () => pagination.value.page,
  (page) => {
    if (page < 1) {
      pagination.value.page = 1
      return
    }
    const pages = totalPages.value || 1
    if (page > pages) {
      pagination.value.page = pages
    }
  }
)

onMounted(() => {
  loadEvents()
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
