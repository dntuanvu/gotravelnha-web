<template>
  <div class="space-y-6 sm:space-y-8 pb-12 sm:pb-16 bg-gradient-to-b from-white to-slate-50 min-h-screen">
    <!-- Mobile Native Header (Mobile Only) -->
    <section class="lg:hidden max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
      <div class="mb-6">
        <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
          Klook
        </h1>
        <p class="text-lg sm:text-xl font-semibold text-slate-700">
          Activities, Tours & Experiences
        </p>
      </div>
    </section>

    <!-- Desktop Hero Section (Hidden on Mobile) -->
    <section class="hidden lg:block max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 lg:pt-1 mb-6">
      <div class="bg-gradient-to-br from-orange-500 via-orange-600 to-pink-600 text-white p-10 md:p-16 rounded-[40px] shadow-2xl overflow-hidden relative">
        <!-- Decorative background elements -->
        <div class="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full -ml-48 -mb-48 blur-3xl"></div>
        
        <div class="relative z-10 text-center">
          <div class="flex items-center justify-center gap-3 mb-4">
            <KlookIcon :size="48" />
            <h2 class="text-5xl md:text-6xl font-black text-white drop-shadow-2xl">
              Klook
            </h2>
          </div>
          
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-black mb-4 drop-shadow-2xl">
            Activities, Tours & Experiences
          </h1>
          <p class="text-lg md:text-xl text-orange-100 max-w-2xl mx-auto mb-8 font-medium">
            Discover 100,000+ amazing experiences worldwide with exclusive deals
          </p>
          
          <!-- Feature highlights -->
          <div class="flex flex-wrap justify-center gap-3">
            <div class="flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/30">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-sm font-semibold">Verified Reviews</span>
            </div>
            <div class="flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/30">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-sm font-semibold">Instant Confirmation</span>
            </div>
            <div class="flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/30">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-sm font-semibold">Best Prices</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Klook Search Box Hero Section -->
    <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <ClientOnly>
        <div class="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden border border-slate-200/80">
          <!-- Klook Search Vertical Widget -->
          <div class="klook-search-widget-container">
            <ins 
              class="klk-aff-widget" 
              data-wid="89020"
              data-height="340px"
              data-adid="1041352"
              data-lang=""
              data-prod="search_vertical"
              data-currency=""
            >
              <a href="//www.klook.com/?aid=">Klook.com</a>
            </ins>
          </div>
        </div>
        <template #fallback>
          <div class="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-8 sm:p-12 text-center border border-slate-200/80">
            <div class="animate-pulse">
              <div class="h-16 bg-slate-200 rounded-lg mb-4 max-w-md mx-auto"></div>
              <div class="h-12 bg-slate-100 rounded-lg max-w-xs mx-auto"></div>
            </div>
          </div>
        </template>
      </ClientOnly>
    </section>

    <!-- Klook Dynamic Widgets with Tabs -->
    <section id="klook-widget" class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
      <!-- Tab Navigation -->
      <div class="flex gap-2 sm:gap-4 border-b-2 border-slate-200 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        <button
          @click="selectedTab = 'things_to_do'"
          :class="[
            'px-4 sm:px-6 py-3 font-semibold transition-all border-b-2 -mb-0.5 whitespace-nowrap touch-manipulation',
            selectedTab === 'things_to_do'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-slate-500 hover:text-slate-700 active:text-slate-700'
          ]"
        >
          <KlookIcon :size="18" class="sm:w-5 sm:h-5 inline-block mr-2" />
          Things to Do
        </button>
        <button
          @click="selectedTab = 'hotels'"
          :class="[
            'px-4 sm:px-6 py-3 font-semibold transition-all border-b-2 -mb-0.5 whitespace-nowrap touch-manipulation',
            selectedTab === 'hotels'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-slate-500 hover:text-slate-700 active:text-slate-700'
          ]"
        >
          <span class="mr-2 text-lg sm:text-base">🏨</span>
          Hotels
        </button>
      </div>

      <!-- Category Pills - Only show for Things to Do tab (Compact Version) -->
      <template v-if="selectedTab === 'things_to_do'">
        <ClientOnly>
          <div class="mb-6">
            <h3 class="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4">Browse by Category</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
              <button
                v-for="category in categories"
                :key="category.name"
                @click="scrollToWidget(category)"
                class="group px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-slate-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 active:bg-orange-100 transition-all text-left touch-manipulation shadow-sm hover:shadow-md"
              >
                <div class="flex items-center gap-2 sm:gap-2.5">
                  <span class="text-lg sm:text-xl">{{ category.icon }}</span>
                  <span class="text-xs sm:text-sm font-semibold text-slate-700 group-hover:text-orange-700">{{ category.name }}</span>
                </div>
              </button>
            </div>
          </div>
          <template #fallback>
            <div class="mb-6">
              <div class="h-6 bg-gray-200 rounded animate-pulse mb-3 w-40"></div>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                <div
                  v-for="i in 6"
                  :key="i"
                  class="h-10 bg-gray-100 rounded-lg animate-pulse"
                />
              </div>
            </div>
          </template>
        </ClientOnly>
      </template>

      <!-- Widgets Display -->
      <ClientOnly>
        <div
          v-for="widget in filteredWidgets"
          :key="widget.id"
          :id="`widget-${widget.id}`"
          class="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 border border-slate-200/80 animate-fade-in scroll-mt-8"
        >
          <div class="text-center mb-4 sm:mb-6">
            <h2 class="text-xl sm:text-2xl font-bold text-slate-900 mb-2 flex items-center justify-center gap-2">
              <span class="text-2xl sm:text-3xl">{{ widget.icon }}</span>
              {{ widget.name }}
            </h2>
            <p class="text-sm sm:text-base text-slate-600">{{ widget.description }}</p>
          </div>
          <div 
            class="bg-slate-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl klook-widget-container"
          >
            <!-- Klook Dynamic Widget - Product type depends on widget type -->
            <ins 
              class="klk-aff-widget" 
              :data-adid="String(widget.adId)"
              :data-prod="widget.widgetType === 'hotels' ? 'hotel_dynamic_widget' : 'dynamic_widget'"
            >
              <a href="//www.klook.com/">Klook.com</a>
            </ins>
          </div>
        </div>
        
        <template #fallback>
          <div class="bg-gray-50 rounded-2xl p-6 text-center">
            <p class="text-gray-500">Loading Klook widgets...</p>
          </div>
        </template>
      </ClientOnly>

      <!-- Info message when no widgets configured -->
      <div v-if="!filteredWidgets.length" class="bg-orange-50 border-2 border-orange-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center">
        <div class="text-4xl sm:text-5xl mb-3 sm:mb-4">⚙️</div>
        <h3 class="text-lg sm:text-xl font-bold text-slate-900 mb-2">No {{ selectedTab === 'hotels' ? 'Hotels' : 'Things to Do' }} Widgets Configured</h3>
        <p class="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6">
          Visit Klook affiliate portal to get widget codes and add them to the configuration.
        </p>
        <a
          href="https://affiliate.klook.com/my_ads/"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 active:bg-orange-800 transition-all font-semibold touch-manipulation shadow-lg hover:shadow-xl"
        >
          <span>🚀</span>
          <span>Go to Klook Affiliate Portal</span>
        </a>
      </div>
    </section>

  </div>
</template>
  
<script setup lang="ts">
import { useActivityTracker } from '~/composables/useActivityTracker'
import { getActiveKlookWidgets, KLOOK_CATEGORIES } from '~/composables/useKlookWidgets'
import { ref, computed, onMounted, nextTick, watch } from 'vue'
  
const { startTracking, trackPageView, trackClick } = useActivityTracker()

const categories = KLOOK_CATEGORIES

const activeWidgets = ref<any[]>([])
const selectedTab = ref<'things_to_do' | 'hotels'>('things_to_do')

const requestURL = useRequestURL()
const baseUrl = computed(() => `${requestURL.protocol}//${requestURL.host}`)
const klookTitle = 'Klook Activities, Tours & Deals | GoVietHub'
const klookDescription = 'Discover curated Klook activities, tours, passes and hotel deals. Explore our embedded Klook widgets, promo codes and trending experiences.'
const klookOgImage = computed(() => `${baseUrl.value}/klook-logo.png`)

useHead(() => ({
  title: klookTitle,
  meta: [
    { name: 'description', content: klookDescription },
    { property: 'og:title', content: klookTitle },
    { property: 'og:description', content: klookDescription },
    { property: 'og:image', content: klookOgImage.value },
    { property: 'og:url', content: `${baseUrl.value}/klook` },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'GoVietHub' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: klookTitle },
    { name: 'twitter:description', content: klookDescription },
    { name: 'twitter:image', content: klookOgImage.value }
  ],
  link: [
    { rel: 'canonical', href: `${baseUrl.value}/klook` }
  ]
}))

// Filter widgets by selected tab
const filteredWidgets = computed(() => {
  return activeWidgets.value.filter(widget => widget.widgetType === selectedTab.value)
})

// Load Klook widgets script - using Klook's exact pattern
// Handles both search_vertical widget and dynamic widgets
const loadKlookWidgetScripts = () => {
  if (typeof window === 'undefined') return

  // Wait for widgets to be in DOM
  nextTick(() => {
    setTimeout(() => {
      const widgets = document.querySelectorAll('.klk-aff-widget')
      
      if (widgets.length === 0) {
        return
      }

      // Use Klook's exact pattern: inject script after EACH widget
      widgets.forEach((widget) => {
        // Check if script already exists for this widget
        // Check for both search widget container and dynamic widget container
        const widgetContainer = widget.closest('.klook-widget-container') || 
                               widget.closest('.klook-search-widget-container') ||
                               widget.parentElement
        
        if (!widgetContainer) return
        
        const existingScript = widgetContainer.querySelector('script[src*="fetch-iframe-init.js"]')
        if (existingScript) return // Script already injected for this widget

        // Inject script using Klook's exact IIFE pattern - right after each widget
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.async = true
        script.src = 'https://affiliate.klook.com/widget/fetch-iframe-init.js'
        
        // Insert right after the widget element (Klook's exact pattern)
        if (widget.nextSibling) {
          widget.parentNode?.insertBefore(script, widget.nextSibling)
        } else {
          widget.parentNode?.appendChild(script)
        }
      })
    }, 200) // Small delay to ensure DOM is settled
  })
}

const loadWidgets = async () => {
  try {
    // Load all widgets (both things_to_do and hotels)
    const response = await $fetch('/api/klook/widgets') as any
    if (response.success) {
      activeWidgets.value = response.data || []
    } else {
      // Fallback to composable if DB fails
      activeWidgets.value = getActiveKlookWidgets()
    }
  } catch (error) {
    console.error('Failed to load widgets:', error)
    // Fallback to composable
    activeWidgets.value = getActiveKlookWidgets()
  }
}

// Watch for tab changes and reload scripts for new widgets
watch(selectedTab, () => {
  // Wait for Vue to update DOM, then reload scripts
  nextTick(() => {
    setTimeout(() => {
      loadKlookWidgetScripts()
    }, 300)
  })
})

const scrollToWidget = (category: any) => {
  trackClick('category', { name: category.name })
  
  // Find the widget that matches this category
  // Try to match by category slug or widget name
  const matchingWidget = activeWidgets.value.find((widget: any) => {
    if (!widget || widget.widgetType !== 'things_to_do') return false
    
    // Match by category slug if available
    if (widget.category && category.slug) {
      return widget.category.toLowerCase().includes(category.slug.toLowerCase()) ||
             category.slug.toLowerCase().includes(widget.category.toLowerCase())
    }
    
    // Match by widget name
    const categoryNameLower = category.name.toLowerCase()
    const widgetNameLower = widget.name.toLowerCase()
    
    // Check if category name appears in widget name or vice versa
    if (categoryNameLower.includes('attractions') || categoryNameLower.includes('shows')) {
      return widgetNameLower.includes('attraction') || widgetNameLower.includes('show')
    }
    if (categoryNameLower.includes('tour') || categoryNameLower.includes('sightseeing')) {
      return widgetNameLower.includes('tour') || widgetNameLower.includes('sightseeing')
    }
    if (categoryNameLower.includes('food') || categoryNameLower.includes('dining')) {
      return widgetNameLower.includes('food') || widgetNameLower.includes('dining')
    }
    if (categoryNameLower.includes('transport') || categoryNameLower.includes('wifi')) {
      return widgetNameLower.includes('transport') || widgetNameLower.includes('wifi')
    }
    if (categoryNameLower.includes('activit') || categoryNameLower.includes('experience')) {
      return widgetNameLower.includes('activit') || widgetNameLower.includes('experience')
    }
    if (categoryNameLower.includes('pass')) {
      return widgetNameLower.includes('pass') || widgetNameLower.includes('package')
    }
    
    return false
  })
  
  if (matchingWidget) {
    // Scroll to the specific widget
    const widgetElement = document.getElementById(`widget-${matchingWidget.id}`)
    if (widgetElement) {
      // Add highlight effect
      widgetElement.classList.add('ring-4', 'ring-orange-300', 'ring-opacity-50')
      setTimeout(() => {
        widgetElement.classList.remove('ring-4', 'ring-orange-300', 'ring-opacity-50')
      }, 2000)
      
      widgetElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
  }
  
  // Fallback: scroll to widgets section if no match found
  const widgetSection = document.getElementById('klook-widget')
  if (widgetSection) {
    widgetSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

onMounted(async () => {
  startTracking()
  trackPageView('/klook', { platform: 'klook' })
  
  await loadWidgets()
  
  // Wait for Vue to render widgets
  await nextTick()
  await nextTick()
  await nextTick()
  
  // Load Klook widget scripts using their exact pattern
  loadKlookWidgetScripts()
})
</script>