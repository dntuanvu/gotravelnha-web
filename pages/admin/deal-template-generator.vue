<template>
  <div class="min-h-full bg-gray-50 pb-12">
    <div class="px-4 sm:px-6 lg:px-8 py-5 space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Deal Template Generator</h2>
        <p class="text-sm text-gray-600">Generate a ready-to-paste block for `DEAL_PAGE_TEMPLATES`.</p>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
          <h3 class="text-lg font-bold text-gray-900">Template Inputs</h3>

          <div class="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-2">
            <div class="flex items-center justify-between">
              <h4 class="text-sm font-bold text-slate-900">DB Templates</h4>
              <button @click="loadDbTemplates" class="text-xs px-2 py-1 rounded bg-slate-200 hover:bg-slate-300">Refresh</button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
              <input
                v-model="dbSearch"
                type="text"
                placeholder="Search by slug/title/destination"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
              <button @click="loadDbTemplates" class="px-3 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-800 text-sm">
                Search
              </button>
            </div>
            <div class="overflow-x-auto border border-slate-200 rounded-lg bg-white">
              <table class="min-w-full text-xs">
                <thead class="bg-slate-100 text-slate-600">
                  <tr>
                    <th class="px-3 py-2 text-left">Slug</th>
                    <th class="px-3 py-2 text-left">Title</th>
                    <th class="px-3 py-2 text-left">Provider</th>
                    <th class="px-3 py-2 text-left">Updated</th>
                    <th class="px-3 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in dbTemplates" :key="item.id" class="border-t border-slate-100">
                    <td class="px-3 py-2 font-medium">{{ item.slug }}</td>
                    <td class="px-3 py-2">{{ item.title }}</td>
                    <td class="px-3 py-2 uppercase">{{ item.primaryProvider }}</td>
                    <td class="px-3 py-2">{{ formatShortDate(item.updatedAt) }}</td>
                    <td class="px-3 py-2">
                      <button @click="loadTemplate(item)" class="text-blue-600 hover:text-blue-700 font-semibold">Load</button>
                    </td>
                  </tr>
                  <tr v-if="dbTemplates.length === 0">
                    <td colspan="5" class="px-3 py-3 text-slate-500">No templates found.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="flex items-center justify-between text-xs text-slate-600">
              <span>Page {{ dbPage }} / {{ dbTotalPages }}</span>
              <div class="flex gap-2">
                <button @click="prevDbPage" :disabled="dbPage <= 1" class="px-2 py-1 rounded border border-slate-300 disabled:opacity-50">Prev</button>
                <button @click="nextDbPage" :disabled="dbPage >= dbTotalPages" class="px-2 py-1 rounded border border-slate-300 disabled:opacity-50">Next</button>
              </div>
            </div>
          </div>

          <div class="rounded-lg border border-blue-200 bg-blue-50 p-3 space-y-2">
            <h4 class="text-sm font-bold text-blue-900">Trip.com Affiliate Mapping</h4>
            <p class="text-xs text-blue-800">
              Paste your generated Trip affiliate deeplink here, then apply mapping to auto-fill Trip-first fields.
            </p>
            <input
              v-model="tripAffiliateInput"
              type="text"
              placeholder="https://www.trip.com/...Allianceid=...&SID=..."
              class="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm"
            />
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                v-model="klookFallbackInput"
                type="text"
                placeholder="Optional Klook comparison URL"
                class="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm"
              />
              <button
                @click="applyTripMapping"
                class="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm font-semibold"
              >
                Apply Trip Mapping
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label class="text-sm">
              <span class="block text-gray-700 mb-1">Title</span>
              <input v-model="form.title" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </label>
            <label class="text-sm">
              <span class="block text-gray-700 mb-1">Slug</span>
              <input v-model="form.slug" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </label>
          </div>

          <label class="text-sm block">
            <span class="block text-gray-700 mb-1">Description</span>
            <textarea v-model="form.description" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-lg"></textarea>
          </label>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label class="text-sm">
              <span class="block text-gray-700 mb-1">Destination</span>
              <input v-model="form.destination" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </label>
            <label class="text-sm">
              <span class="block text-gray-700 mb-1">Badge</span>
              <input v-model="form.badge" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </label>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label class="text-sm">
              <span class="block text-gray-700 mb-1">Category</span>
              <select v-model="form.category" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option value="activity">activity</option>
                <option value="hotel">hotel</option>
                <option value="flight">flight</option>
              </select>
            </label>
            <label class="text-sm">
              <span class="block text-gray-700 mb-1">Primary Provider</span>
              <select v-model="form.primaryProvider" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option value="klook">klook</option>
                <option value="trip">trip</option>
              </select>
            </label>
          </div>

          <label class="text-sm block">
            <span class="block text-gray-700 mb-1">Hero Image URL</span>
            <div class="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
              <input v-model="form.heroImage" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              <button
                @click="fetchHeroImageFromPrimaryUrl"
                class="px-3 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 text-sm font-semibold"
              >
                Auto Fetch
              </button>
            </div>
            <div class="mt-1 text-xs text-slate-500">
              Source: {{ form.heroImageSource || 'manual' }}<span v-if="form.heroImageFetchedAt"> • fetched {{ formatShortDate(form.heroImageFetchedAt) }}</span>
            </div>
          </label>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label class="text-sm">
              <span class="block text-gray-700 mb-1">Primary CTA Label</span>
              <input v-model="form.primaryCtaLabel" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </label>
            <label class="text-sm">
              <span class="block text-gray-700 mb-1">Placement Key</span>
              <input v-model="form.placementKey" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </label>
          </div>

          <label class="text-sm block">
            <span class="block text-gray-700 mb-1">Primary Base URL</span>
            <input v-model="form.primaryBaseUrl" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </label>

          <label class="text-sm block">
            <span class="block text-gray-700 mb-1">Summary Bullets (1 per line)</span>
            <textarea v-model="summaryInput" rows="4" class="w-full px-3 py-2 border border-gray-300 rounded-lg"></textarea>
          </label>

          <label class="text-sm block">
            <span class="block text-gray-700 mb-1">Tips (1 per line)</span>
            <textarea v-model="tipsInput" rows="4" class="w-full px-3 py-2 border border-gray-300 rounded-lg"></textarea>
          </label>
        </div>

        <div class="space-y-4">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-lg font-bold text-gray-900">Comparison Cards</h3>
              <button @click="addComparisonRow" class="px-3 py-1.5 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                + Add Row
              </button>
            </div>

            <div class="space-y-4">
              <div v-for="(row, idx) in comparisons" :key="idx" class="rounded-lg border border-gray-200 p-3 space-y-2">
                <div class="flex justify-between items-center">
                  <div class="text-sm font-semibold text-gray-700">Row {{ idx + 1 }}</div>
                  <button
                    v-if="comparisons.length > 1"
                    @click="removeComparisonRow(idx)"
                    class="text-xs text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <select v-model="row.provider" class="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option value="klook">klook</option>
                    <option value="trip">trip</option>
                  </select>
                  <input v-model="row.label" type="text" placeholder="Label" class="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <input v-model="row.priceNote" type="text" placeholder="Price note" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                <input v-model="row.highlight" type="text" placeholder="Highlight" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                <input v-model="row.baseUrl" type="text" placeholder="Base URL" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-lg font-bold text-gray-900">Generated Block</h3>
              <div class="flex items-center gap-2">
                <button @click="saveTemplate" class="px-3 py-1.5 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">
                  {{ editingTemplateId ? 'Update DB' : 'Save to DB' }}
                </button>
                <button @click="copyOutput" class="px-3 py-1.5 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">
                  {{ copied ? 'Copied' : 'Copy' }}
                </button>
              </div>
            </div>
            <textarea readonly :value="generatedBlock" rows="22" class="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-xs"></textarea>
            <p class="text-xs text-gray-500 mt-2">
              This block is optional for backup. Primary source is now the database.
            </p>
            <p v-if="saveMessage" class="text-xs mt-2" :class="saveMessageType === 'success' ? 'text-emerald-700' : 'text-red-600'">
              {{ saveMessage }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { DealPageTemplate } from '~/types/deal-template'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const slugify = (value: string) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const quote = (value: string) => `'${String(value || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`

const form = ref({
  title: 'New High Intent Deal Page',
  slug: '',
  description: 'Compare top affiliate booking options with clear CTA and weekly-updated tips.',
  destination: 'Singapore',
  heroImage: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1600&q=80',
    heroImageSource: 'manual' as 'manual' | 'og',
    heroImageFetchedAt: null as string | null,
  badge: 'High Intent',
  category: 'activity' as 'activity' | 'hotel' | 'flight',
  lastUpdatedLabel: 'Updated weekly',
  primaryProvider: 'klook' as 'klook' | 'trip',
  primaryCtaLabel: 'Check Live Price',
  primaryBaseUrl: 'https://www.klook.com/',
  placementKey: ''
})
const tripAffiliateInput = ref('')
const klookFallbackInput = ref('https://www.klook.com/')

const summaryInput = ref('Strong search intent for this destination.\nClear booking decision in one page.\nOptimized for mobile CTA clicks.')
const tipsInput = ref('Re-check prices before sharing.\nPrioritize weekday inventory updates.\nKeep social CTA and page CTA aligned.')
const copied = ref(false)
const editingTemplateId = ref<string | null>(null)
const dbTemplates = ref<any[]>([])
const dbSearch = ref('')
const dbPage = ref(1)
const dbTotalPages = ref(1)
const dbLimit = 8
const saveMessage = ref('')
const saveMessageType = ref<'success' | 'error'>('success')

const comparisons = ref([
  {
    provider: 'klook' as 'klook' | 'trip',
    label: 'Klook',
    priceNote: 'Best for activities and promo bundles',
    highlight: 'High conversion for experience-first travelers',
    baseUrl: 'https://www.klook.com/'
  },
  {
    provider: 'trip' as 'klook' | 'trip',
    label: 'Trip.com',
    priceNote: 'Great alternative for package-oriented users',
    highlight: 'Strong cross-sell with hotels/flights',
    baseUrl: 'https://www.trip.com/'
  }
])

watch(
  () => form.value.title,
  (title) => {
    if (!form.value.slug) {
      form.value.slug = slugify(title)
    }
    if (!form.value.placementKey) {
      form.value.placementKey = `deal_template_${slugify(title).slice(0, 24)}_primary`
    }
  },
  { immediate: true }
)

const parsedSummaryBullets = computed(() =>
  summaryInput.value.split('\n').map((item) => item.trim()).filter(Boolean)
)
const parsedTips = computed(() =>
  tipsInput.value.split('\n').map((item) => item.trim()).filter(Boolean)
)

const generatedBlock = computed(() => {
  const summary = parsedSummaryBullets.value.map((item) => `      ${quote(item)}`).join(',\n')
  const tips = parsedTips.value.map((item) => `      ${quote(item)}`).join(',\n')
  const comparison = comparisons.value
    .map(
      (row) => `      {
        provider: ${quote(row.provider)},
        label: ${quote(row.label)},
        priceNote: ${quote(row.priceNote)},
        highlight: ${quote(row.highlight)},
        baseUrl: ${quote(row.baseUrl)}
      }`
    )
    .join(',\n')

  return `{
    slug: ${quote(form.value.slug || slugify(form.value.title))},
    title: ${quote(form.value.title)},
    description: ${quote(form.value.description)},
    destination: ${quote(form.value.destination)},
    heroImage: ${quote(form.value.heroImage)},
    badge: ${quote(form.value.badge)},
    category: ${quote(form.value.category)},
    lastUpdatedLabel: ${quote(form.value.lastUpdatedLabel)},
    primaryProvider: ${quote(form.value.primaryProvider)},
    primaryCtaLabel: ${quote(form.value.primaryCtaLabel)},
    primaryBaseUrl: ${quote(form.value.primaryBaseUrl)},
    placementKey: ${quote(form.value.placementKey || `deal_template_${slugify(form.value.title).slice(0, 24)}_primary`)},
    summaryBullets: [
${summary}
    ],
    tips: [
${tips}
    ],
    comparison: [
${comparison}
    ]
  }`
})

const addComparisonRow = () => {
  comparisons.value.push({
    provider: 'klook',
    label: '',
    priceNote: '',
    highlight: '',
    baseUrl: ''
  })
}

const removeComparisonRow = (index: number) => {
  comparisons.value.splice(index, 1)
}

const copyOutput = async () => {
  try {
    await navigator.clipboard.writeText(generatedBlock.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 1500)
  } catch (error) {
    console.error('Failed to copy generated block:', error)
  }
}

const applyTripMapping = () => {
  const tripUrl = tripAffiliateInput.value.trim()
  if (!tripUrl) return

  form.value.primaryProvider = 'trip'
  form.value.primaryBaseUrl = tripUrl
  form.value.primaryCtaLabel = form.value.primaryCtaLabel || 'Check Live Rate on Trip.com'
  if (!form.value.placementKey) {
    form.value.placementKey = `deal_template_${slugify(form.value.title).slice(0, 24)}_trip_primary`
  }

  comparisons.value = [
    {
      provider: 'trip',
      label: 'Trip.com',
      priceNote: 'Direct deeplink from your Trip affiliate account',
      highlight: 'Primary booking path for this page',
      baseUrl: tripUrl
    },
    {
      provider: 'klook',
      label: 'Klook',
      priceNote: 'Alternative experience-focused option',
      highlight: 'Useful secondary comparison provider',
      baseUrl: klookFallbackInput.value.trim() || 'https://www.klook.com/'
    }
  ]
}

const buildPayload = (): DealPageTemplate => ({
  slug: form.value.slug || slugify(form.value.title),
  title: form.value.title,
  description: form.value.description,
  destination: form.value.destination,
  heroImage: form.value.heroImage,
  heroImageSource: form.value.heroImageSource || 'manual',
  heroImageFetchedAt: form.value.heroImageFetchedAt || null,
  badge: form.value.badge,
  category: form.value.category,
  lastUpdatedLabel: form.value.lastUpdatedLabel,
  primaryProvider: form.value.primaryProvider,
  primaryCtaLabel: form.value.primaryCtaLabel,
  primaryBaseUrl: form.value.primaryBaseUrl,
  placementKey: form.value.placementKey || `deal_template_${slugify(form.value.title).slice(0, 24)}_primary`,
  summaryBullets: parsedSummaryBullets.value,
  tips: parsedTips.value,
  comparison: comparisons.value
})

const saveTemplate = async () => {
  saveMessage.value = ''
  try {
    const payload = buildPayload()
    const endpoint = editingTemplateId.value
      ? `/api/admin/deal-templates/${editingTemplateId.value}`
      : '/api/admin/deal-templates'
    const method = editingTemplateId.value ? 'PUT' : 'POST'
    const response: any = await $fetch(endpoint, {
      method,
      body: payload
    })

    if (!response?.success) {
      throw new Error(response?.error || 'Save failed')
    }

    saveMessageType.value = 'success'
    saveMessage.value = editingTemplateId.value ? 'Template updated in DB.' : 'Template saved to DB.'
    if (!editingTemplateId.value) {
      editingTemplateId.value = response?.data?.id || null
    }
    await loadDbTemplates()
  } catch (error: any) {
    saveMessageType.value = 'error'
    saveMessage.value = error?.message || 'Failed to save template'
  }
}

const hydrateFormFromTemplate = (item: any) => {
  editingTemplateId.value = item.id
  form.value = {
    title: item.title || '',
    slug: item.slug || '',
    description: item.description || '',
    destination: item.destination || '',
    heroImage: item.heroImage || '',
    heroImageSource: item.heroImageSource || 'manual',
    heroImageFetchedAt: item.heroImageFetchedAt || null,
    badge: item.badge || '',
    category: item.category || 'activity',
    lastUpdatedLabel: item.lastUpdatedLabel || 'Updated weekly',
    primaryProvider: item.primaryProvider || 'klook',
    primaryCtaLabel: item.primaryCtaLabel || 'Check Live Price',
    primaryBaseUrl: item.primaryBaseUrl || '',
    placementKey: item.placementKey || ''
  }
  summaryInput.value = Array.isArray(item.summaryBullets) ? item.summaryBullets.join('\n') : ''
  tipsInput.value = Array.isArray(item.tips) ? item.tips.join('\n') : ''
  comparisons.value = Array.isArray(item.comparison) && item.comparison.length
    ? item.comparison
    : comparisons.value
}

const loadDbTemplates = async () => {
  try {
    const response: any = await $fetch('/api/admin/deal-templates', {
      params: {
        search: dbSearch.value || undefined,
        page: dbPage.value,
        limit: dbLimit
      }
    })
    dbTemplates.value = response?.success ? (response.data || []) : []
    dbTotalPages.value = response?.pagination?.totalPages || 1
  } catch (error) {
    console.error('Failed to load DB templates:', error)
  }
}

const loadTemplate = (selected: any) => {
  hydrateFormFromTemplate(selected)
  saveMessageType.value = 'success'
  saveMessage.value = `Loaded template: ${selected.slug}`
}

const prevDbPage = async () => {
  if (dbPage.value <= 1) return
  dbPage.value -= 1
  await loadDbTemplates()
}

const nextDbPage = async () => {
  if (dbPage.value >= dbTotalPages.value) return
  dbPage.value += 1
  await loadDbTemplates()
}

const formatShortDate = (value?: string) => {
  if (!value) return '—'
  return new Date(value).toLocaleString()
}

const fetchHeroImageFromPrimaryUrl = async () => {
  if (!form.value.primaryBaseUrl) return
  saveMessage.value = ''
  try {
    const response: any = await $fetch('/api/admin/deal-templates/fetch-image', {
      method: 'POST',
      body: { url: form.value.primaryBaseUrl }
    })
    if (!response?.success || !response?.data?.heroImage) {
      throw new Error(response?.error || 'No image found')
    }
    form.value.heroImage = response.data.heroImage
    form.value.heroImageSource = 'og'
    form.value.heroImageFetchedAt = response.data.heroImageFetchedAt
    saveMessageType.value = 'success'
    saveMessage.value = 'Hero image fetched from page metadata.'
  } catch (error: any) {
    saveMessageType.value = 'error'
    saveMessage.value = error?.message || 'Failed to auto fetch hero image.'
  }
}

await loadDbTemplates()
</script>

