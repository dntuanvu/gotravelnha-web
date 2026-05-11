<template>
  <div
    class="min-h-[100dvh] bg-gradient-to-b from-slate-50 via-white to-emerald-50 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:pb-12"
  >
    <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-10">
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
      <div class="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
        <div
          class="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 px-4 py-3.5 sm:px-6 sm:py-4 text-center shadow-inner"
        >
          <p class="text-sm sm:text-base font-black text-white tracking-tight">
            {{ bookStripTitle }}
          </p>
          <p class="mt-1 text-xs sm:text-sm font-medium text-emerald-50/95 leading-snug max-w-2xl mx-auto">
            {{ bookStripSub }}
          </p>
        </div>
        <div class="p-4 sm:p-6">
          <div class="mb-4 space-y-1.5">
            <h2 class="text-lg sm:text-xl font-bold text-slate-900">Compare & book</h2>
            <p class="text-sm text-slate-600">{{ partnerOpenHint }}</p>
          </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <article
            v-for="option in template.comparison"
            :key="option.label"
            :class="[
              'rounded-2xl border p-4 sm:p-5 flex flex-col shadow-sm transition-shadow duration-200 hover:shadow-md',
              partnerCardSurface(option.provider)
            ]"
          >
            <div class="flex gap-3 sm:gap-4 mb-3">
              <div
                :class="[
                  'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-inner',
                  option.provider === 'trip'
                    ? 'bg-sky-100 ring-1 ring-sky-200/90'
                    : 'bg-orange-50 ring-1 ring-orange-200/90'
                ]"
                aria-hidden="true"
              >
                <span
                  v-if="option.provider === 'trip'"
                  class="text-[11px] font-black uppercase leading-tight tracking-tight text-sky-800"
                >Trip</span>
                <KlookIcon v-else :size="24" class="shrink-0" />
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="font-bold text-slate-900 text-base leading-snug break-words">{{ option.label }}</h3>
              </div>
            </div>
            <p class="text-sm text-slate-700 leading-relaxed grow">{{ option.priceNote }}</p>
            <p
              class="text-sm font-medium mt-3 leading-snug rounded-xl border px-3 py-2.5"
              :class="
                option.provider === 'trip'
                  ? 'border-sky-100 bg-sky-50/80 text-sky-950'
                  : 'border-orange-100 bg-orange-50/70 text-orange-950'
              "
            >
              {{ option.highlight }}
            </p>
            <a
              :href="partnerNavHref(option)"
              :target="isIOSSafari() ? undefined : '_blank'"
              rel="noopener noreferrer"
              :class="[
                'mt-4 w-full min-h-[48px] px-4 py-3.5 rounded-xl border-2 font-semibold text-[15px] sm:text-base touch-manipulation inline-flex items-center justify-center no-underline transition-colors',
                partnerCtaButtonClass(option.provider)
              ]"
              @click="onPartnerTap($event, option)"
            >
              {{ partnerCtaLabel(option) }}
            </a>
            <p class="mt-2.5 text-center text-[11px] sm:text-xs text-slate-500 leading-snug px-0.5">
              {{ partnerPostCtaHint(option) }}
            </p>
          </article>
        </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import KlookIcon from '~/components/KlookIcon.vue'
import type { DealComparisonOption, DealPageTemplate } from '~/types/deal-template'
import { useActivityTracker } from '~/composables/useActivityTracker'
import { appendKlookAffiliateId, appendTripAffiliateIds } from '~/utils/affiliate-links'
import { unwrapKlookAffiliateRedirectUrl } from '~/utils/unwrapKlookAffiliateRedirect'

const props = defineProps<{
  template: DealPageTemplate
}>()

const { shouldUseSameTabAfterAsyncClick, isIOSSafari } = useIosOutboundNavigation()
const runtimeConfig = useRuntimeConfig()

/**
 * Native `<a href>` (iOS Safari) must include affiliate IDs in the URL itself — same
 * public IDs as `nuxt.config` / server `buildAffiliateLink`. Desktop/mobile use API
 * `outboundUrl` which already applies these plus extra UTM/subid.
 */
const partnerNavHref = (option: DealComparisonOption) => {
  let url = unwrapKlookAffiliateRedirectUrl(option.baseUrl)
  const pub = runtimeConfig.public
  const p = option.provider
  if (p === 'klook') {
    url = appendKlookAffiliateId(url, String(pub.KLOOK_AD_ID || ''))
  }
  if (p === 'trip' || p === 'trip.com') {
    url = appendTripAffiliateIds(
      url,
      String(pub.TRIP_ALLIANCE_ID || ''),
      String(pub.TRIP_SID || '')
    )
  }
  return url
}

const partnerOpenHint = computed(() =>
  shouldUseSameTabAfterAsyncClick()
    ? 'Tap a partner to open their app or site (same tab on iPhone/iPad).'
    : 'Tap a partner to open their site in a new tab.'
)

const bookStripTitle = 'Ready to book?'

const bookStripSub = computed(() => {
  const c = props.template.category
  if (c === 'flight') {
    return 'Open Trip.com or Klook to see live fares, pick your flights, and complete checkout on the partner you trust most.'
  }
  if (c === 'hotel') {
    return 'Compare room types and rates, then book the stay you want — payment and confirmation happen on the partner site.'
  }
  return 'Compare ticket options and availability, then book your visit — checkout is on Trip.com or Klook.'
})

const partnerPostCtaHint = (option: DealComparisonOption) => {
  if (option.provider === 'trip' || option.provider === 'trip.com') {
    return 'Live prices, seats, and checkout are on Trip.com after you tap.'
  }
  return 'Live prices, tickets, and checkout are on Klook after you tap.'
}

const partnerCardSurface = (provider: string) => {
  if (provider === 'trip' || provider === 'trip.com') {
    return 'border-sky-200/90 bg-gradient-to-b from-sky-50/80 via-white to-white'
  }
  return 'border-orange-200/90 bg-gradient-to-b from-orange-50/55 via-white to-white'
}

const partnerCtaButtonClass = (provider: string) => {
  if (provider === 'trip' || provider === 'trip.com') {
    return 'border-sky-600 bg-sky-50 text-sky-950 hover:bg-sky-100 active:bg-sky-100'
  }
  return 'border-orange-500 bg-orange-50/90 text-orange-950 hover:bg-orange-100 active:bg-orange-100'
}

const partnerCtaLabel = (option: DealComparisonOption) => {
  const cat = props.template.category
  if (option.provider === 'trip' || option.provider === 'trip.com') {
    if (cat === 'flight') return 'Search flights on Trip.com'
    if (cat === 'hotel') return 'Browse hotels on Trip.com'
    return 'Browse things to do on Trip.com'
  }
  if (option.provider === 'klook') {
    if (cat === 'flight') return 'Search transport & flights on Klook'
    if (cat === 'hotel') return 'Browse hotels on Klook'
    return 'Browse attraction tickets on Klook'
  }
  return 'Open partner'
}

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

/**
 * iOS Safari: same pattern as homepage `handleFunnelClick` — do not preventDefault;
 * browser follows `<a href>` (universal links). Track with sendBeacon + keepalive fetch.
 */
const onPartnerTap = (ev: MouseEvent, option: DealComparisonOption) => {
  const placementKey = `${props.template.placementKey}_comparison_${option.provider}`
  const ctaLabel = partnerCtaLabel(option)

  if (isIOSSafari()) {
    trackClick('deal_template_affiliate_click', {
      provider: option.provider,
      placementKey,
      slug: props.template.slug
    })
    try {
      const sessionId = getSessionId()
      const payload = {
        provider: option.provider,
        baseUrl: option.baseUrl,
        placementKey,
        pagePath: `/deals/${props.template.slug}`,
        sessionId,
        metadata: {
          templateSlug: props.template.slug,
          ctaLabel
        }
      }
      const body = JSON.stringify(payload)
      if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
        navigator.sendBeacon('/api/affiliate/click', new Blob([body], { type: 'application/json' }))
      } else if (typeof fetch !== 'undefined') {
        fetch('/api/affiliate/click', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
          keepalive: true
        }).catch(() => {})
      }
    } catch {
      /* ignore */
    }
    return
  }

  ev.preventDefault()
  void openAffiliate(option.provider, option.baseUrl, ctaLabel, placementKey)
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

