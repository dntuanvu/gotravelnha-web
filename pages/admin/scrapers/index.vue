<template>
  <div class="bg-gray-100 min-h-full">
    <div class="px-4 sm:px-6 lg:px-8 py-5">
      <div class="mb-6 flex justify-end">
        <button
          @click="resetSourceForm(); showAddSourceModal = true"
          class="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
        >
          Add Affiliate Source URL
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p class="text-sm text-gray-600">Total Sources</p>
          <p class="text-2xl font-bold text-gray-900">{{ sources.length }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p class="text-sm text-gray-600">Active Sources</p>
          <p class="text-2xl font-bold text-gray-900">{{ activeSourceCount }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p class="text-sm text-gray-600">Crawler Status</p>
          <p class="text-2xl font-bold text-gray-900">Retired</p>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div>
          <div v-if="sources.length === 0" class="text-center py-8 text-gray-500">
            No affiliate source configured yet.
          </div>
          <div v-else class="space-y-3">
            <div v-for="source in sources" :key="source.url" class="border border-gray-200 rounded-lg p-3">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate" :title="source.url">{{ source.url }}</p>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ source.platform }} • {{ source.sourceType }} • {{ source.lastScrapedAt ? formatDate(source.lastScrapedAt) : 'Never verified' }}
                  </p>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    @click="startEditSource(source)"
                    class="px-3 py-1.5 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors whitespace-nowrap"
                  >
                    Edit
                  </button>
                  <button
                    @click="deleteSource(source.url)"
                    class="px-3 py-1.5 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200 transition-colors whitespace-nowrap"
                  >
                    Delete
                  </button>
                  <button
                    @click="toggleSource(source.url, !source.isActive)"
                    :class="[
                      'px-3 py-1.5 text-xs rounded transition-colors whitespace-nowrap',
                      source.isActive ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-green-100 text-green-700 hover:bg-green-200'
                    ]"
                  >
                    {{ source.isActive ? 'Disable' : 'Enable' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Deal Slot Manager</h3>
          <button
            @click="resetSlotForm"
            class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            New Slot
          </button>
        </div>

        <form @submit.prevent="saveSlot" class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
          <input v-model="slotForm.title" required placeholder="Card title (public)" class="px-3 py-2 border border-gray-300 rounded-lg" />
          <input v-model="slotForm.baseUrl" required type="url" placeholder="https://..." class="px-3 py-2 border border-gray-300 rounded-lg" />

          <select v-model="slotForm.provider" required class="px-3 py-2 border border-gray-300 rounded-lg">
            <option value="trip">Trip.com</option>
            <option value="klook">Klook</option>
          </select>
          <select v-model="slotForm.category" required class="px-3 py-2 border border-gray-300 rounded-lg">
            <option value="flight">Flight</option>
            <option value="hotel">Hotel</option>
            <option value="activity">Activity</option>
          </select>

          <input v-model="slotForm.destination" placeholder="destination (e.g. singapore, tokyo, global)" class="px-3 py-2 border border-gray-300 rounded-lg" />
          <input v-model.number="slotForm.priority" type="number" min="0" placeholder="priority" class="px-3 py-2 border border-gray-300 rounded-lg" />

          <input v-model="slotForm.description" placeholder="Public description (optional)" class="md:col-span-2 px-3 py-2 border border-gray-300 rounded-lg" />

          <label class="inline-flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" v-model="slotForm.isActive" class="w-4 h-4" />
            Active
          </label>

          <div class="md:col-span-2 flex gap-2">
            <button :disabled="slotSaving" type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60">
              {{ slotSaving ? 'Saving...' : (slotForm.id ? 'Update Slot' : 'Create Slot') }}
            </button>
            <button type="button" @click="resetSlotForm" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
              Clear
            </button>
          </div>
        </form>

        <div v-if="slots.length === 0" class="text-sm text-gray-500">No slots yet. Create one to control Deals Hub cards.</div>
        <div v-else class="space-y-2">
          <div v-for="slot in slots" :key="slot.id" class="border border-gray-200 rounded-lg p-3 flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="font-medium text-sm text-gray-900">{{ slot.title }}</p>
              <p class="text-xs text-gray-500 mt-1">
                {{ slot.provider }} • {{ slot.category }} • {{ slot.destination }} • priority {{ slot.priority }}
              </p>
              <p class="text-xs text-gray-500 truncate mt-1" :title="slot.baseUrl">{{ slot.baseUrl }}</p>
            </div>
            <button @click="editSlot(slot)" class="px-3 py-1.5 text-xs rounded bg-gray-100 hover:bg-gray-200">
              Edit
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="showAddSourceModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click="closeSourceModal"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full" @click.stop>
          <div class="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">{{ isEditingSource ? 'Edit Affiliate Source URL' : 'Add Affiliate Source URL' }}</h3>
            <button @click="showAddSourceModal = false" class="text-gray-400 hover:text-gray-600">x</button>
          </div>
          <div class="p-6">
            <form @submit.prevent="handleAddSource" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Platform *</label>
                <select
                  v-model="newSource.platform"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select platform...</option>
                  <option value="trip">Trip.com</option>
                  <option value="klook">Klook</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Public Affiliate URL *</label>
                <input
                  v-model="newSource.url"
                  type="url"
                  required
                  placeholder="https://www.klook.com/..."
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Source Type *</label>
                <select
                  v-model="newSource.sourceType"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select type...</option>
                  <option value="affiliate_link">Affiliate Link</option>
                  <option value="landing_page">Landing Page</option>
                  <option value="curated_offer">Curated Offer</option>
                </select>
              </div>
              <div class="flex gap-3 pt-2">
                <button
                  type="submit"
                  :disabled="loading"
                  class="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {{ loading ? (isEditingSource ? 'Saving...' : 'Adding...') : (isEditingSource ? 'Save Changes' : 'Add Source') }}
                </button>
                <button
                  type="button"
                  @click="closeSourceModal"
                  class="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const loading = ref(false)
const showAddSourceModal = ref(false)
const isEditingSource = ref(false)
const sources = ref<any[]>([])
const slots = ref<any[]>([])
const slotSaving = ref(false)

const newSource = ref({
  existingUrl: '',
  platform: '',
  url: '',
  sourceType: 'affiliate_link'
})

const slotForm = ref({
  id: '',
  title: '',
  provider: 'trip',
  category: 'hotel',
  destination: 'global',
  description: '',
  baseUrl: '',
  isActive: true,
  priority: 0
})

const activeSourceCount = computed(() => sources.value.filter((s: any) => s.isActive).length)

const loadSources = async () => {
  const response = await $fetch('/api/admin/scraper/sources') as any
  if (response?.success) {
    sources.value = response.data || []
  }
}

const loadSlots = async () => {
  const response = await $fetch('/api/admin/affiliate/slots') as any
  if (response?.success) {
    slots.value = response.data || []
  }
}

const handleAddSource = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/admin/scraper/sources', {
      method: 'POST',
      body: { ...newSource.value, isActive: true }
    }) as any

    if (response?.success) {
      resetSourceForm()
      showAddSourceModal.value = false
      await loadSources()
    }
  } finally {
    loading.value = false
  }
}

const toggleSource = async (url: string, isActive: boolean) => {
  await $fetch('/api/admin/scraper/sources', {
    method: 'POST',
    body: { url, isActive }
  })
  await loadSources()
}

const deleteSource = async (url: string) => {
  const confirmed = typeof window !== 'undefined'
    ? window.confirm('Delete this affiliate source URL? This action cannot be undone.')
    : false
  if (!confirmed) return

  await $fetch('/api/admin/scraper/sources', {
    method: 'DELETE',
    body: { url }
  })
  await loadSources()
}

const resetSourceForm = () => {
  isEditingSource.value = false
  newSource.value = {
    existingUrl: '',
    platform: '',
    url: '',
    sourceType: 'affiliate_link'
  }
}

const closeSourceModal = () => {
  showAddSourceModal.value = false
  resetSourceForm()
}

const startEditSource = (source: any) => {
  isEditingSource.value = true
  newSource.value = {
    existingUrl: source.url,
    platform: source.platform || '',
    url: source.url || '',
    sourceType: source.sourceType || 'affiliate_link'
  }
  showAddSourceModal.value = true
}

const resetSlotForm = () => {
  slotForm.value = {
    id: '',
    title: '',
    provider: 'trip',
    category: 'hotel',
    destination: 'global',
    description: '',
    baseUrl: '',
    isActive: true,
    priority: 0
  }
}

const editSlot = (slot: any) => {
  slotForm.value = {
    id: slot.id,
    title: slot.title || '',
    provider: slot.provider || 'trip',
    category: slot.category || 'hotel',
    destination: slot.destination || 'global',
    description: slot.description || '',
    baseUrl: slot.baseUrl || '',
    isActive: slot.isActive !== false,
    priority: Number(slot.priority || 0) || 0
  }
}

const saveSlot = async () => {
  slotSaving.value = true
  try {
    const response = await $fetch('/api/admin/affiliate/slots', {
      method: 'POST',
      body: { ...slotForm.value }
    }) as any
    if (response?.success) {
      await loadSlots()
      resetSlotForm()
    }
  } finally {
    slotSaving.value = false
  }
}

const formatDate = (date: string) => new Date(date).toLocaleString()

onMounted(async () => {
  await Promise.all([loadSources(), loadSlots()])
})
</script>
