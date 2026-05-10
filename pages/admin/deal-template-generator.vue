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
            <input v-model="form.heroImage" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
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
              <button @click="copyOutput" class="px-3 py-1.5 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">
                {{ copied ? 'Copied' : 'Copy' }}
              </button>
            </div>
            <textarea readonly :value="generatedBlock" rows="22" class="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-xs"></textarea>
            <p class="text-xs text-gray-500 mt-2">
              Paste this object into `data/deal-page-templates.ts` inside `DEAL_PAGE_TEMPLATES`.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

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
</script>

