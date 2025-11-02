<template>
  <div v-if="showWidget" class="bg-white p-6 rounded-xl shadow border space-y-4">
    <div>
      <h2 class="text-2xl font-bold text-gray-800">{{ displayTitle }}</h2>
      <p class="text-gray-600">
        {{ displayDescription }}
      </p>
    </div>

    <div class="overflow-x-auto rounded border">
      <iframe
        :src="widget?.url"
        class="w-full min-w-[320px] h-[600px] max-w-[1024px] mx-auto"
        frameborder="0"
        style="border: none;"
      ></iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useTripPromotions } from '~/composables/useTripPromotions'

// Accept campaignId as prop, default to 'popular-flight-deals'
const props = withDefaults(defineProps<{
  campaignId?: string
}>(), {
  campaignId: 'popular-flight-deals'
})

const { getPromotionWidget, isCampaignActive } = useTripPromotions()
const showWidget = ref(true)

const widget = computed(() => {
  return getPromotionWidget(props.campaignId)
})

const displayTitle = computed(() => {
  return widget.value?.title || '🔥 Popular Deals'
})

const displayDescription = computed(() => {
  return widget.value?.description || 'Save more on your bookings! Get exclusive deals, powered by Trip.com.'
})

onMounted(() => {
  // Check if campaign is active
  if (!isCampaignActive(props.campaignId)) {
    // Hide widget if campaign not active
    showWidget.value = false
  }
})
</script>
