<template>
  <client-only>
    <div class="bg-gray-50 p-6 rounded-xl shadow border text-center space-y-6">
      <h2 class="text-2xl font-bold text-gray-800">Find Your Trip - Choose flights or hotels</h2>
      
      <div class="flex justify-center gap-4">
        <button
          class="px-4 py-2 font-semibold rounded border"
          :class="selected === 'flight' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'"
          @click="selected = 'flight'"
        >
          ✈️ Flights
        </button>
        <button
          class="px-4 py-2 font-semibold rounded border"
          :class="selected === 'hotel' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'"
          @click="selected = 'hotel'"
        >
          🏨 Hotels
        </button>
      </div>

      <div class="overflow-x-auto mx-auto max-w-full">
        <iframe
          :key="iframeKey"
          :src="iframeSrc"
          :width="iframeWidth"
          :height="iframeHeight"
          class="mx-auto rounded-lg border transition duration-300 ease-in-out"
          frameborder="0"
          scrolling="no"
          style="border: none;"
        ></iframe>
      </div>
    </div>
  </client-only>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useTripDeeplink } from '~/composables/useTripDeeplink'

const selected = ref('flight')
const iframeSrc = ref('')
const iframeKey = ref('default')
const iframeWidth = ref(900)
const iframeHeight = ref(200)

const { generateDeeplink } = useTripDeeplink()

const updateIframe = () => {
  const isMobile = window.innerWidth <= 768
  
  // Generate campaign ID based on selection and device
  const campaign = `search-box-${selected.value}-${isMobile ? 'mobile' : 'desktop'}`

  if (selected.value === 'flight') {
    // Use Trip.com iframe ad codes for flights
    const baseUrl = isMobile
      ? 'https://www.trip.com/partners/ad/S3375857'
      : 'https://www.trip.com/partners/ad/S553037'
    
    // Add tracking parameters
    const deeplink = generateDeeplink({
      type: 'flight',
      params: {
        campaign: campaign
      }
    })
    
    // Extract tracking params and append to iframe URL
    const url = new URL(deeplink)
    const trackingParams = `Allianceid=${url.searchParams.get('Allianceid')}&SID=${url.searchParams.get('SID')}&trip_campaign=${url.searchParams.get('trip_campaign')}`
    
    iframeSrc.value = `${baseUrl}?${trackingParams}&trip_sub1=`
  } else if (selected.value === 'hotel') {
    // Use Trip.com iframe ad codes for hotels
    const baseUrl = isMobile
      ? 'https://www.trip.com/partners/ad/S3376172'
      : 'https://www.trip.com/partners/ad/S552988'
    
    // Add tracking parameters
    const deeplink = generateDeeplink({
      type: 'hotel',
      params: {
        campaign: campaign
      }
    })
    
    // Extract tracking params and append to iframe URL
    const url = new URL(deeplink)
    const trackingParams = `Allianceid=${url.searchParams.get('Allianceid')}&SID=${url.searchParams.get('SID')}&trip_campaign=${url.searchParams.get('trip_campaign')}`
    
    iframeSrc.value = `${baseUrl}?${trackingParams}&trip_sub1=`
  }

  iframeWidth.value = isMobile ? 320 : 900
  iframeHeight.value = isMobile ? 320 : 200
  iframeKey.value = selected.value + (isMobile ? '-mobile' : '-desktop')
}

onMounted(() => {
  updateIframe()
  window.addEventListener('resize', updateIframe)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateIframe)
})

watch(selected, updateIframe)
</script>
