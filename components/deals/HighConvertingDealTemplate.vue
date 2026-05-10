<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50 pb-24">
    <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
      <NuxtLink to="/deals" class="inline-flex items-center gap-2 text-sm text-emerald-700 hover:text-emerald-800 font-medium">
        <span>←</span>
        Back to deals
      </NuxtLink>
    </section>

    <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
      <div class="rounded-3xl overflow-hidden border border-slate-200 shadow-lg bg-white">
        <div class="relative h-64 md:h-80">
          <img :src="template.heroImage" :alt="template.title" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent"></div>
          <div class="absolute left-5 right-5 bottom-5 text-white">
            <span class="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/90 text-xs font-semibold mb-3">
              {{ template.badge }}
            </span>
            <h1 class="text-2xl md:text-4xl font-black">{{ template.title }}</h1>
            <p class="text-sm md:text-base text-emerald-50 mt-2 max-w-3xl">{{ template.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <article class="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
        <div class="flex flex-wrap gap-2 text-xs text-slate-600 mb-4">
          <span class="px-2 py-1 rounded-full bg-slate-100">Destination: {{ template.destination }}</span>
          <span class="px-2 py-1 rounded-full bg-slate-100 capitalize">Category: {{ template.category }}</span>
          <span class="px-2 py-1 rounded-full bg-slate-100">{{ template.lastUpdatedLabel }}</span>
        </div>

        <h2 class="text-xl font-bold text-slate-900 mb-3">Why this page converts</h2>
        <ul class="space-y-2 text-slate-700 mb-6">
          <li v-for="bullet in template.summaryBullets" :key="bullet" class="flex items-start gap-2">
            <span class="text-emerald-600">•</span>
            <span>{{ bullet }}</span>
          </li>
        </ul>

        <h3 class="text-lg font-bold text-slate-900 mb-3">Quick booking tips</h3>
        <ul class="space-y-2 text-slate-700">
          <li v-for="tip in template.tips" :key="tip" class="flex items-start gap-2">
            <span class="text-blue-600">✓</span>
            <span>{{ tip }}</span>
          </li>
        </ul>
      </article>

      <aside class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
        <h3 class="text-lg font-bold text-slate-900 mb-2">Book now</h3>
        <p class="text-sm text-slate-600 mb-4">Get live rates from our affiliate partners.</p>
        <button
          @click="openAffiliate(template.primaryProvider, template.primaryBaseUrl, template.primaryCtaLabel, `${template.placementKey}_sidebar`)"
          class="w-full px-4 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
        >
          {{ template.primaryCtaLabel }}
        </button>
        <p class="mt-3 text-xs text-slate-500">
          Affiliate note: we may earn commission from qualified bookings.
        </p>
      </aside>
    </section>

    <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
        <h2 class="text-xl font-bold text-slate-900 mb-4">Compare booking options</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <article v-for="option in template.comparison" :key="option.label" class="rounded-xl border border-slate-200 p-4">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-bold text-slate-900">{{ option.label }}</h3>
              <span class="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">{{ option.provider }}</span>
            </div>
            <p class="text-sm text-slate-700">{{ option.priceNote }}</p>
            <p class="text-sm text-emerald-700 font-medium mt-1">{{ option.highlight }}</p>
            <button
              @click="openAffiliate(option.provider, option.baseUrl, `Check ${option.label} Price`, `${template.placementKey}_comparison_${option.provider}`)"
              class="mt-4 w-full px-4 py-2.5 rounded-lg border border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-semibold"
            >
              Check {{ option.label }} Price
            </button>
          </article>
        </div>
      </div>
    </section>

    <div class="fixed inset-x-0 bottom-0 z-40 md:hidden border-t border-slate-200 bg-white/95 backdrop-blur p-3">
      <button
        @click="openAffiliate(template.primaryProvider, template.primaryBaseUrl, template.primaryCtaLabel, `${template.placementKey}_sticky_mobile`)"
        class="w-full px-4 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600"
      >
        {{ template.primaryCtaLabel }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DealPageTemplate } from '~/data/deal-page-templates'
import { useActivityTracker } from '~/composables/useActivityTracker'

const props = defineProps<{
  template: DealPageTemplate
}>()

const { trackClick } = useActivityTracker()

const getSessionId = () => {
  if (typeof window === 'undefined') return 'anonymous'
  const existing = localStorage.getItem('activity_session_id')
  if (existing) return existing
  const next = `deal-${Date.now().toString(36)}`
  localStorage.setItem('activity_session_id', next)
  return next
}

const openAffiliate = async (provider: string, baseUrl: string, label: string, placementKey: string) => {
  try {
    const sessionId = getSessionId()
    const response: any = await $fetch('/api/affiliate/click', {
      method: 'POST',
      body: {
        provider,
        baseUrl,
        placementKey,
        pagePath: `/deals/${props.template.slug}`,
        sessionId,
        metadata: {
          templateSlug: props.template.slug,
          ctaLabel: label
        }
      }
    })

    trackClick('deal_template_affiliate_click', {
      provider,
      placementKey,
      slug: props.template.slug
    })
    window.open(response?.outboundUrl || baseUrl, '_blank', 'noopener,noreferrer')
  } catch (error) {
    console.error('Failed to track template affiliate click:', error)
    window.open(baseUrl, '_blank', 'noopener,noreferrer')
  }
}
</script>

