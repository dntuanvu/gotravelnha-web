<template>
  <div class="min-h-screen bg-white">
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div class="text-center">
        <h1 class="text-3xl sm:text-4xl font-black text-slate-900">Deals Hub</h1>
        <p class="mt-2 text-slate-600">Pick a destination, then jump into tracked flights, hotels, and activities.</p>
      </div>

      <div v-if="destinationOptions.length > 0" class="flex flex-wrap items-center gap-2">
        <span class="text-sm font-semibold text-slate-700 mr-1">Destinations:</span>
        <button
          v-for="destination in destinationOptions"
          :key="destination"
          @click="selectDestination(destination)"
          :class="[
            'px-3 py-1.5 text-sm rounded-full border transition-colors',
            selectedDestination === destination
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          ]"
        >
          {{ formatDestination(destination) }}
        </button>
      </div>

      <div v-if="entityQuickLinks.length > 0" class="flex flex-wrap items-center gap-2">
        <span class="text-sm font-semibold text-slate-700 mr-1">Quick links:</span>
        <button
          v-for="entity in entityQuickLinks"
          :key="entity.entitySlug || entity.id"
          @click="selectEntity(entity.entitySlug)"
          class="px-3 py-1.5 text-sm rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 transition-colors"
        >
          {{ entity.title }}
        </button>
        <button
          v-if="selectedEntitySlug"
          @click="selectEntity(null)"
          class="px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Clear
        </button>
      </div>

      <div v-if="loading" class="py-12 text-center">
        <div class="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
      </div>

      <div v-else-if="visibleShortcuts.length === 0" class="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-500">
        No deals available for this destination yet.
      </div>

      <div v-else class="space-y-7">
        <section v-for="group in groupedShortcuts" :key="group.category">
          <h2 class="text-xl font-bold text-slate-900 mb-3">{{ group.title }}</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            <article
              v-for="item in group.items"
              :key="item.id"
              class="bg-white border border-slate-200 rounded-2xl p-5"
            >
              <div class="flex items-center justify-between mb-3">
                <span class="px-2 py-1 text-xs font-semibold bg-slate-100 text-slate-700 rounded-full">{{ item.providerLabel }}</span>
                <span class="text-xs text-slate-500">{{ formatDestination(item.destination) }}</span>
              </div>

              <h3 class="text-lg font-bold text-slate-900">{{ item.title }}</h3>
              <p class="mt-2 text-sm text-slate-600 min-h-[40px]">{{ publicDescription(item) }}</p>

              <button
                @click="openShortcut(item)"
                class="mt-4 w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold hover:from-emerald-700 hover:to-teal-700 transition-colors"
              >
                View Deal
              </button>
            </article>
          </div>
        </section>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface ShortcutItem {
  id: string
  provider: 'trip' | 'klook'
  providerLabel: string
  category: string
  destination: string
  title: string
  description: string
  link: string
  entitySlug?: string | null
  location?: string | null
}

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const shortcuts = ref<ShortcutItem[]>([])
const selectedDestination = ref('global')
const selectedEntitySlug = ref<string | null>(null)

const visibleShortcuts = computed(() => {
  return shortcuts.value.filter((item) => {
    if (selectedDestination.value !== 'all' && item.destination !== selectedDestination.value) return false
    if (selectedEntitySlug.value && item.entitySlug !== selectedEntitySlug.value) return false
    return true
  })
})

const groupedShortcuts = computed(() => {
  const categoryOrder = ['flight', 'hotel', 'activity']
  const byCategory = new Map<string, ShortcutItem[]>()
  for (const item of visibleShortcuts.value) {
    const key = item.category || 'other'
    if (!byCategory.has(key)) byCategory.set(key, [])
    byCategory.get(key)!.push(item)
  }

  const keys = Array.from(byCategory.keys()).sort((a, b) => {
    const ai = categoryOrder.indexOf(a)
    const bi = categoryOrder.indexOf(b)
    const aRank = ai === -1 ? 99 : ai
    const bRank = bi === -1 ? 99 : bi
    return aRank - bRank || a.localeCompare(b)
  })

  return keys.map((key) => ({
    category: key,
    title:
      key === 'flight'
        ? 'Flights'
        : key === 'hotel'
          ? 'Hotels'
          : key === 'activity'
            ? 'Activities'
            : formatCategory(key),
    items: byCategory.get(key) || []
  }))
})

const destinationOptions = computed(() => {
  const values = Array.from(new Set(shortcuts.value.map((item) => item.destination).filter(Boolean)))
  return values.sort((a, b) => (a === 'global' ? -1 : b === 'global' ? 1 : a.localeCompare(b)))
})

const entityQuickLinks = computed(() => {
  const pool = shortcuts.value.filter((item) => item.destination === selectedDestination.value && item.entitySlug)
  const seen = new Set<string>()
  const deduped: ShortcutItem[] = []
  for (const item of pool) {
    const key = item.entitySlug || item.id
    if (seen.has(key)) continue
    seen.add(key)
    deduped.push(item)
  }
  return deduped.slice(0, 8)
})

function formatCategory(value: string): string {
  if (!value) return 'General'
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function formatDestination(value: string): string {
  if (!value || value === 'global') return 'Global'
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function publicDescription(item: ShortcutItem): string {
  const desc = String(item.description || '').trim()
  if (!desc || desc.toLowerCase().includes('imported from source url')) {
    return `Best ${formatCategory(item.category)} offers on ${item.providerLabel}.`
  }
  return desc
}

async function loadShortcuts() {
  loading.value = true
  try {
    const response: any = await $fetch('/api/affiliate/shortcuts')
    if (response?.success && Array.isArray(response.data)) {
      shortcuts.value = response.data
      hydrateSelectionFromQuery()
    }
  } catch (error) {
    console.error('Failed to load shortcuts:', error)
  } finally {
    loading.value = false
  }
}

function hydrateSelectionFromQuery() {
  const destination = String(route.query.destination || '').toLowerCase()
  const entity = String(route.query.entity || '')

  if (destination && destinationOptions.value.includes(destination)) {
    selectedDestination.value = destination
  } else if (destinationOptions.value.length > 0) {
    selectedDestination.value = destinationOptions.value[0]
  }

  if (entity) {
    const exists = shortcuts.value.some((item) => item.entitySlug === entity)
    selectedEntitySlug.value = exists ? entity : null
  } else {
    selectedEntitySlug.value = null
  }
}

function syncQuery() {
  const query: Record<string, string> = {}
  if (selectedDestination.value) query.destination = selectedDestination.value
  if (selectedEntitySlug.value) query.entity = selectedEntitySlug.value
  router.replace({ query })
}

function selectDestination(destination: string) {
  selectedDestination.value = destination
  selectedEntitySlug.value = null
  syncQuery()
}

function selectEntity(slug: string | null) {
  selectedEntitySlug.value = slug
  syncQuery()
}

async function openShortcut(item: ShortcutItem) {
  if (!item.link) return
  try {
    const sessionId = typeof window !== 'undefined'
      ? (localStorage.getItem('activity_session_id') || `hub-${Date.now().toString(36)}`)
      : 'anonymous'

    if (typeof window !== 'undefined' && !localStorage.getItem('activity_session_id')) {
      localStorage.setItem('activity_session_id', sessionId)
    }

    const response: any = await $fetch('/api/affiliate/click', {
      method: 'POST',
      body: {
        provider: item.provider,
        baseUrl: item.link,
        placementKey: 'deals_hub_shortcut',
        pagePath: '/search',
        sessionId,
        metadata: {
          category: item.category,
          destination: selectedDestination.value,
          entitySlug: item.entitySlug || null,
          title: item.title
        }
      }
    })

    const outbound = response?.outboundUrl || item.link
    window.open(outbound, '_blank', 'noopener,noreferrer')
  } catch (error) {
    console.error('Affiliate click tracking failed:', error)
    window.open(item.link, '_blank', 'noopener,noreferrer')
  }
}

onMounted(() => {
  loadShortcuts()
})

useHead({
  title: 'Deals Hub | GoVietHub',
  meta: [
    { name: 'description', content: 'Shortcut-first affiliate deals hub for Trip.com and Klook.' },
    { property: 'og:title', content: 'Deals Hub | GoVietHub' }
  ]
})
</script>
