<template>
  <HighConvertingDealTemplate v-if="template" :template="template" />
  <div v-else-if="legacyDeal" class="min-h-screen bg-slate-50 px-4 py-12">
    <div class="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
      <NuxtLink to="/deals" class="inline-flex items-center gap-2 text-sm text-emerald-700 hover:text-emerald-800 font-medium mb-5">
        <span>←</span>
        Back to deals
      </NuxtLink>
      <h1 class="text-2xl sm:text-3xl font-bold text-slate-900">{{ legacyDeal.title }}</h1>
      <p v-if="legacyDeal.description" class="mt-3 text-slate-600">{{ legacyDeal.description }}</p>
      <div class="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
        <div class="rounded-lg bg-slate-100 px-3 py-2">
          <div class="text-slate-500">Platform</div>
          <div class="font-semibold text-slate-800 uppercase">{{ legacyDeal.platform }}</div>
        </div>
        <div class="rounded-lg bg-slate-100 px-3 py-2">
          <div class="text-slate-500">Category</div>
          <div class="font-semibold text-slate-800 capitalize">{{ legacyDeal.category || 'deal' }}</div>
        </div>
        <div class="rounded-lg bg-slate-100 px-3 py-2">
          <div class="text-slate-500">Price</div>
          <div class="font-semibold text-slate-800">{{ legacyDeal.priceText }}</div>
        </div>
        <div class="rounded-lg bg-slate-100 px-3 py-2">
          <div class="text-slate-500">Discount</div>
          <div class="font-semibold text-slate-800">{{ legacyDeal.discountText }}</div>
        </div>
      </div>
      <button
        @click="openLegacyDeal"
        class="mt-6 w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold hover:from-emerald-700 hover:to-teal-700"
      >
        Check Live Price
      </button>
    </div>
  </div>
  <div v-else class="min-h-screen bg-slate-50 px-4 py-16">
    <div class="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl p-10 text-center">
      <h1 class="text-3xl font-bold text-slate-900 mb-3">Deal Page Not Found</h1>
      <p class="text-slate-600 mb-6">This slug does not match a configured template or existing deal.</p>
      <NuxtLink to="/deals" class="inline-flex px-5 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700">
        Back to deals
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import HighConvertingDealTemplate from '~/components/deals/HighConvertingDealTemplate.vue'
import type { DealPageTemplate } from '~/types/deal-template'
import { inferOgImageMime, resolveAbsoluteOgImage } from '~/utils/socialPreview'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))
const requestURL = useRequestURL()
const baseUrl = computed(() => `${requestURL.protocol}//${requestURL.host}`)

const { data: templateResponse } = await useAsyncData(`deal-template-${slug.value}`, () =>
  $fetch<{ success: boolean; data: DealPageTemplate | null }>(`/api/deal-templates/${slug.value}`).catch(() => ({
    success: false,
    data: null
  }))
)
const template = computed(() => templateResponse.value?.data || null)

const slugify = (value: string) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const extractShortId = (value: string): string => {
  const match = value.match(/-([a-f0-9]{12})$/i)
  return match?.[1] || ''
}

const { data: legacyDeals } = await useAsyncData(`legacy-deals-${slug.value}`, () =>
  $fetch<{ success: boolean; data: any[] }>('/api/affiliate/deals', { params: { limit: 300 } }).then((res) => (res?.success ? res.data : []))
)

const legacyDeal = computed(() => {
  if (template.value) return null
  const list = legacyDeals.value || []
  const shortId = extractShortId(slug.value)
  const titleSlug = slugify(slug.value.replace(/-[a-f0-9]{12}$/i, ''))

  return (
    list.find((item: any) => String(item.id || '').replace(/[^a-f0-9]/gi, '').includes(shortId)) ||
    list.find((item: any) => slugify(item.title) === titleSlug) ||
    null
  )
})

const openLegacyDeal = async () => {
  if (!legacyDeal.value?.affiliateLink) return
  const deal = legacyDeal.value
  const sessionId = typeof window !== 'undefined'
    ? (localStorage.getItem('activity_session_id') || `deal-${Date.now().toString(36)}`)
    : 'anonymous'
  if (typeof window !== 'undefined' && !localStorage.getItem('activity_session_id')) {
    localStorage.setItem('activity_session_id', sessionId)
  }

  try {
    const response: any = await $fetch('/api/affiliate/click', {
      method: 'POST',
      body: {
        provider: deal.platform,
        baseUrl: deal.affiliateLink,
        placementKey: 'legacy_deal_detail',
        pagePath: `/deals/${slug.value}`,
        sessionId,
        metadata: { dealId: deal.id }
      }
    })
    window.open(response?.outboundUrl || deal.affiliateLink, '_blank', 'noopener,noreferrer')
  } catch {
    window.open(deal.affiliateLink, '_blank', 'noopener,noreferrer')
  }
}

useHead(() => {
  const page = template.value
  const legacy = legacyDeal.value as { title?: string; description?: string; image?: string } | null
  const title = page
    ? `${page.title} | GoTravelNha Deals`
    : legacy
      ? `${legacy.title} | GoTravelNha Deals`
      : 'Deal Page Not Found | GoTravelNha'
  const description = page
    ? page.description
    : legacy?.description || 'This deal page is unavailable. Browse all latest travel deals on GoTravelNha.'
  const canonical = `${baseUrl.value}/deals/${slug.value}`

  const rawImage = page?.heroImage || legacy?.image || null
  const ogImage = resolveAbsoluteOgImage(rawImage, baseUrl.value)
  const ogImageSecure = ogImage.startsWith('https://') ? ogImage : ogImage.replace(/^http:\/\//i, 'https://')
  const imageMime = inferOgImageMime(ogImage)
  const imageAlt = page?.title || legacy?.title || 'GoTravelNha travel deals'

  const jsonLd = page
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: page.title,
        description: page.description,
        image: ogImage,
        brand: { '@type': 'Brand', name: 'GoTravelNha' },
        category: page.category,
        areaServed: page.destination,
        offers: page.comparison.map((option) => ({
          '@type': 'Offer',
          seller: { '@type': 'Organization', name: option.label },
          url: option.baseUrl,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock'
        }))
      }
    : null

  return {
    title,
    meta: [
      { name: 'description', content: description, key: 'description' },
      { property: 'og:title', content: title, key: 'og-title' },
      { property: 'og:description', content: description, key: 'og-description' },
      { property: 'og:url', content: canonical, key: 'og-url' },
      { property: 'og:type', content: page ? 'article' : 'website', key: 'og-type' },
      { property: 'og:site_name', content: 'GoTravelNha', key: 'og-site-name' },
      { property: 'og:locale', content: 'en_US', key: 'og-locale' },
      { property: 'og:image', content: ogImage, key: 'og-image' },
      { property: 'og:image:secure_url', content: ogImageSecure, key: 'og-image-secure' },
      { property: 'og:image:type', content: imageMime, key: 'og-image-type' },
      { property: 'og:image:alt', content: imageAlt, key: 'og-image-alt' },
      { name: 'twitter:card', content: 'summary_large_image', key: 'twitter-card' },
      { name: 'twitter:title', content: title, key: 'twitter-title' },
      { name: 'twitter:description', content: description, key: 'twitter-description' },
      { name: 'twitter:image', content: ogImage, key: 'twitter-image' }
    ],
    link: [{ rel: 'canonical', href: canonical, key: 'canonical' }],
    script: jsonLd
      ? [
          {
            type: 'application/ld+json',
            key: 'deal-jsonld',
            children: JSON.stringify(jsonLd)
          }
        ]
      : []
  }
})
</script>
