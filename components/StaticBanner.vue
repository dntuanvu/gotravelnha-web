<template>
    <div class="overflow-x-auto rounded shadow border">
      <iframe
        :src="bannerSrc"
        style="width:100%; min-width:320px; height:90px;"
        frameborder="0"
        scrolling="no"
        id="SB553583"
      />
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTripDeeplink } from '~/composables/useTripDeeplink'

const { generateDeeplink } = useTripDeeplink()

// Generate banner URL with campaign tracking
const bannerSrc = computed(() => {
  const baseUrl = 'https://www.trip.com/partners/ad/SB553583'
  const deeplink = generateDeeplink({
    type: 'generic',
    params: {
      campaign: 'static-banner'
    }
  })
  
  // Extract tracking params and append to banner URL
  const url = new URL(deeplink)
  const trackingParams = `Allianceid=${url.searchParams.get('Allianceid')}&SID=${url.searchParams.get('SID')}&trip_campaign=${url.searchParams.get('trip_campaign')}`
  
  return `${baseUrl}?${trackingParams}&trip_sub1=`
})
</script>
  