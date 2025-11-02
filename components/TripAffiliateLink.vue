<template>
    <a
      :href="trackedUrl"
      target="_blank"
      rel="noopener noreferrer"
      @click="handleClick"
      class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
      <slot>Book Now</slot>
    </a>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { useTripDeeplink } from '~/composables/useTripDeeplink'
  
  const props = defineProps({
    baseUrl: { type: String, required: true }, // e.g., trip.com URL
    type: { type: String, default: 'generic' }, // 'hotel', 'flight', 'activity', etc.
    destination: { type: String, default: null },
    campaign: { type: String, default: null },
    subId: { type: String, default: null },
    // Legacy support
    user: { type: String, default: null }
  })
  
  const { generateDeeplink, trackDeeplinkClick } = useTripDeeplink()
  
  const trackedUrl = computed(() => {
    // Use new deep link system if campaign is provided
    if (props.campaign) {
      return generateDeeplink({
        type: props.type as any || 'generic',
        params: {
          destination: props.destination || undefined,
          campaign: props.campaign,
          subId: props.subId || undefined
        }
      })
    }
    
    // Legacy mode: manually construct URL
    const url = new URL(props.baseUrl)
    if (props.user) url.searchParams.set('user', props.user)
    if (props.campaign) url.searchParams.set('campaign_id', props.campaign)
    if (props.subId) url.searchParams.set('trip_sub1', props.subId)
    return url.toString()
  })
  
  const handleClick = () => {
    if (props.campaign) {
      trackDeeplinkClick(trackedUrl.value, props.campaign)
    }
  }
  </script>
  