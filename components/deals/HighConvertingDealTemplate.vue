<template>
  <div
    class="min-h-[100dvh] bg-gradient-to-b from-slate-50 via-white to-emerald-50 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:pb-12"
  >
    <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-10">
      <NuxtLink
        to="/deals"
        class="inline-flex items-center gap-2 min-h-[44px] py-2 pr-3 -ml-1 pl-1 rounded-xl text-sm font-semibold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 active:bg-emerald-100 touch-manipulation"
      >
        <span aria-hidden="true">←</span>
        Back to hub
      </NuxtLink>
    </section>

    <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-3 sm:mt-4">
      <div class="rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 shadow-lg bg-white">
        <div class="relative h-52 sm:h-64 md:h-80">
          <img
            :src="template.heroImage"
            :alt="template.title"
            class="w-full h-full object-cover"
            loading="eager"
            decoding="async"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent"></div>
          <div class="absolute inset-x-4 bottom-4 sm:left-5 sm:right-5 sm:bottom-5 text-white">
            <span
              class="inline-flex items-center px-2.5 py-1 sm:px-3 sm:py-1 rounded-full bg-emerald-500/90 text-[11px] sm:text-xs font-semibold mb-2 sm:mb-3"
            >
              {{ template.badge }}
            </span>
            <h1 class="text-xl sm:text-2xl md:text-4xl font-black leading-tight text-balance break-words">
              {{ template.title }}
            </h1>
            <p class="text-sm sm:text-base text-emerald-50/95 mt-2 max-w-3xl leading-relaxed line-clamp-4 sm:line-clamp-none">
              {{ template.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-5 sm:mt-6">
      <article class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6">
        <div class="flex flex-wrap gap-2 text-[11px] sm:text-xs text-slate-600 mb-4">
          <span class="px-2.5 py-1 rounded-full bg-slate-100 max-w-full truncate sm:truncate-none sm:max-w-none">
            Destination: {{ template.destination }}
          </span>
          <span class="px-2.5 py-1 rounded-full bg-slate-100 capitalize">Category: {{ template.category }}</span>
          <span
            v-if="showLastUpdatedPill"
            class="px-2.5 py-1 rounded-full bg-slate-100"
          >{{ template.lastUpdatedLabel }}</span>
        </div>

        <h2 class="text-lg sm:text-xl font-bold text-slate-900 mb-3">Why compare here</h2>
        <ul class="space-y-2.5 text-sm sm:text-base text-slate-700 mb-6">
          <li v-for="bullet in template.summaryBullets" :key="bullet" class="flex items-start gap-2.5">
            <span class="text-emerald-600 shrink-0 mt-0.5">•</span>
            <span class="leading-snug">{{ bullet }}</span>
          </li>
        </ul>

        <h3 class="text-base sm:text-lg font-bold text-slate-900 mb-3">Quick tips</h3>
        <ul class="space-y-2.5 text-sm sm:text-base text-slate-700">
          <li v-for="tip in template.tips" :key="tip" class="flex items-start gap-2.5">
            <span class="text-blue-600 shrink-0 mt-0.5">✓</span>
            <span class="leading-snug">{{ tip }}</span>
          </li>
        </ul>
      </article>
    </section>

    <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-5 sm:mt-6 mb-2">
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6">
        <h2 class="text-lg sm:text-xl font-bold text-slate-900 mb-1">Compare & book</h2>
        <p class="text-sm text-slate-600 mb-4">{{ partnerOpenHint }}</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <article
            v-for="option in template.comparison"
            :key="option.label"
            class="rounded-xl border border-slate-200 p-4 sm:p-5 flex flex-col"
          >
            <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between mb-2">
              <h3 class="font-bold text-slate-900 text-base leading-snug pr-2 break-words">{{ option.label }}</h3>
              <span
                class="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wide shrink-0 self-start"
              >
                {{ option.provider }}
              </span>
            </div>
            <p class="text-sm text-slate-700 leading-relaxed grow">{{ option.priceNote }}</p>
            <p class="text-sm text-emerald-700 font-medium mt-2 leading-snug">{{ option.highlight }}</p>
            <button
              type="button"
              @click="openAffiliate(option.provider, option.baseUrl, `Check ${option.label} Price`, `${template.placementKey}_comparison_${option.provider}`)"
              class="mt-4 w-full min-h-[48px] px-4 py-3.5 rounded-xl border-2 border-emerald-600 text-emerald-800 bg-emerald-50/40 hover:bg-emerald-50 active:bg-emerald-100 font-semibold text-[15px] sm:text-base touch-manipulation"
            >
              Open {{ option.provider === 'trip' ? 'Trip.com' : 'Klook' }}
            </button>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { DealPageTemplate } from '~/types/deal-template'
import { useActivityTracker } from '~/composables/useActivityTracker'

const props = defineProps<{
  template: DealPageTemplate
}>()

const { shouldUseSameTabAfterAsyncClick } = useIosOutboundNavigation()

const partnerOpenHint = computed(() =>
  shouldUseSameTabAfterAsyncClick()
    ? 'Tap a partner to open their app or site (same tab on iPhone/iPad).'
    : 'Tap a partner to open their site in a new tab.'
)

/** Hub comparison pages (flight / hotel / attractions) omit the partner-source pill. */
const showLastUpdatedPill = computed(() => {
  const c = props.template.category
  if (c === 'flight' || c === 'hotel' || c === 'activity') return false
  return Boolean(props.template.lastUpdatedLabel?.trim())
})

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
    const outboundUrl = response?.outboundUrl || baseUrl
    if (shouldUseSameTabAfterAsyncClick()) {
      window.location.assign(outboundUrl)
    } else {
      window.open(outboundUrl, '_blank', 'noopener,noreferrer')
    }
  } catch (error) {
    console.error('Failed to track template affiliate click:', error)
    if (shouldUseSameTabAfterAsyncClick()) {
      window.location.assign(baseUrl)
    } else {
      window.open(baseUrl, '_blank', 'noopener,noreferrer')
    }
  }
}
</script>

