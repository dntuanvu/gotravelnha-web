<template>
    <a
      :href="trackedUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
      <slot>Book Now</slot>
    </a>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    baseUrl: { type: String, required: true }, // e.g., trip.com URL
    user: { type: String, default: null },
    campaign: { type: String, default: null },
    subId: { type: String, default: null }
  })
  
  const trackedUrl = computed(() => {
    const url = new URL(props.baseUrl)
    if (props.user) url.searchParams.set('user', props.user)
    if (props.campaign) url.searchParams.set('campaign_id', props.campaign)
    if (props.subId) url.searchParams.set('trip_sub1', props.subId)
    return url.toString()
  })
  </script>
  