<template>
  <div class="bg-gradient-to-b from-slate-50 via-white to-emerald-50">
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-10 sm:pb-14 space-y-5 sm:space-y-7">
      <div class="rounded-3xl bg-gradient-to-br from-emerald-700 via-teal-700 to-cyan-800 p-6 sm:p-10 text-white shadow-2xl">
        <p class="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-white/15 border border-white/25">Affiliate-first travel hub</p>
        <h1 class="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">Find flights, hotels, and attractions faster</h1>
        <p class="mt-3 text-emerald-50/95 max-w-3xl">
          Pick your intent, compare partner options, and open tracked booking links in one click.
        </p>
      </div>

      <div v-if="false" class="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            v-for="chip in categoryChips"
            :key="chip.id"
            @click="activeCategory = chip.id"
            :class="[
              'text-left rounded-xl border px-4 py-3 transition-colors',
              activeCategory === chip.id
                ? 'border-emerald-400 bg-emerald-50'
                : 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40'
            ]"
          >
            <div class="text-lg">{{ chip.icon }}</div>
            <div class="mt-1 font-semibold text-slate-900">{{ chip.label }}</div>
          </button>
        </div>

        <div class="mt-4">
          <input
            v-model.trim="searchText"
            type="text"
            placeholder="Search deal intent (e.g. flights, hotels, attraction)"
            class="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
          />
        </div>
      </div>

      <div class="flex items-center justify-between">
        <h2 class="text-xl sm:text-2xl font-black text-slate-900">Compare & Book</h2>
        <span class="text-sm text-slate-500">{{ filteredTemplates.length }} result{{ filteredTemplates.length === 1 ? '' : 's' }}</span>
      </div>

      <div v-if="loadingTemplates" class="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Loading deal pages...
      </div>

      <div v-else-if="filteredTemplates.length === 0" class="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
        No comparison deal pages available yet.
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
        <NuxtLink
          v-for="item in filteredTemplates"
          :key="item.slug"
          :to="`/deals/${item.slug}`"
          class="group overflow-hidden rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-lg transition-all"
        >
          <div class="h-40 bg-slate-100">
            <img v-if="item.heroImage" :src="item.heroImage" :alt="item.title" class="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" />
          </div>
          <div class="p-4">
            <div class="text-xs uppercase tracking-wide text-slate-500">{{ item.destination }} • {{ item.category }}</div>
            <h3 class="mt-1 text-lg font-bold text-slate-900 line-clamp-2">{{ item.title }}</h3>
            <p class="mt-1 text-sm text-slate-600 line-clamp-2">{{ item.description }}</p>
            <div class="mt-3 inline-flex items-center text-sm font-semibold text-emerald-700">
              Start comparison →
            </div>
          </div>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import type { DealPageTemplate } from '~/types/deal-template'
import { inferOgImageMime, resolveAbsoluteOgImage } from '~/utils/socialPreview'

definePageMeta({
  layout: 'default'
})

const requestURL = useRequestURL()
const siteOrigin = `${requestURL.protocol}//${requestURL.host}`

const dealTemplates = ref<DealPageTemplate[]>([])
const loadingTemplates = ref(false)
const searchText = ref('')
const activeCategory = ref<'all' | 'flight' | 'hotel' | 'activity'>('all')
const allowedBuiltinSlugs = new Set(['flights', 'hotels', 'attractions'])

const categoryChips = [
  { id: 'all', label: 'All intents', icon: '🧭' },
  { id: 'flight', label: 'Flights', icon: '✈️' },
  { id: 'hotel', label: 'Hotels', icon: '🏨' },
  { id: 'activity', label: 'Attractions', icon: '🎡' }
] as const

const loadTemplates = async () => {
  try {
    loadingTemplates.value = true
    const response: any = await $fetch('/api/deal-templates')
    const list = response?.success ? (response.data || []) : []
    dealTemplates.value = list.filter((item: DealPageTemplate) => allowedBuiltinSlugs.has(item.slug))
  } catch (error) {
    console.error('Failed to load deal templates:', error)
    dealTemplates.value = []
  } finally {
    loadingTemplates.value = false
  }
}

const filteredTemplates = computed(() => {
  const keyword = searchText.value.toLowerCase().trim()

  return dealTemplates.value.filter((item) => {
    const categoryMatch = activeCategory.value === 'all' || item.category === activeCategory.value
    if (!categoryMatch) return false
    if (!keyword) return true

    const haystack = [item.title, item.description, item.destination, item.category, item.badge].join(' ').toLowerCase()
    return haystack.includes(keyword)
  })
})

onMounted(async () => {
  await loadTemplates()
})

const hubOgImage = computed(() => {
  const first = dealTemplates.value.find((t) => t.heroImage)
  return resolveAbsoluteOgImage(first?.heroImage || null, siteOrigin)
})

const hubImageMime = computed(() => inferOgImageMime(hubOgImage.value))

useHead(() => {
  const title = 'Compare flights, hotels & attractions | GoTravelNha Deals'
  const description =
    'Pick your travel intent and compare Trip.com and Klook in one place — flights, hotels, and Singapore attractions.'
  const canonical = `${siteOrigin}/deals`
  const img = hubOgImage.value
  const secure = img.startsWith('https://') ? img : img.replace(/^http:\/\//i, 'https://')

  return {
    title,
    meta: [
      { name: 'description', content: description, key: 'description' },
      { property: 'og:title', content: title, key: 'og-title' },
      { property: 'og:description', content: description, key: 'og-description' },
      { property: 'og:url', content: canonical, key: 'og-url' },
      { property: 'og:type', content: 'website', key: 'og-type' },
      { property: 'og:site_name', content: 'GoTravelNha', key: 'og-site-name' },
      { property: 'og:locale', content: 'en_US', key: 'og-locale' },
      { property: 'og:image', content: img, key: 'og-image' },
      { property: 'og:image:secure_url', content: secure, key: 'og-image-secure' },
      { property: 'og:image:type', content: hubImageMime.value, key: 'og-image-type' },
      { property: 'og:image:alt', content: 'GoTravelNha travel comparison hub', key: 'og-image-alt' },
      { name: 'twitter:card', content: 'summary_large_image', key: 'twitter-card' },
      { name: 'twitter:title', content: title, key: 'twitter-title' },
      { name: 'twitter:description', content: description, key: 'twitter-description' },
      { name: 'twitter:image', content: img, key: 'twitter-image' }
    ],
    link: [{ rel: 'canonical', href: canonical, key: 'canonical' }]
  }
})
</script>

