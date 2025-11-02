<template>
  <div class="max-w-4xl mx-auto py-12 space-y-8">
    <div class="bg-white rounded-2xl shadow-soft p-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-4">🔍 Web Scraper Demo</h1>
      <p class="text-gray-600 mb-6">
        Test our web scraping capabilities. Enter a URL to extract data from any website.
      </p>

      <!-- Input Form -->
      <div class="space-y-4 mb-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Website URL
          </label>
          <input
            v-model="url"
            type="url"
            placeholder="https://example.com"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>

        <button
          @click="scrapeData"
          :disabled="loading || !url"
          class="w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <span v-if="loading" class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Scraping...
          </span>
          <span v-else>🚀 Scrape Website</span>
        </button>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
        <div class="flex items-start gap-3">
          <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <div>
            <h3 class="font-semibold text-red-800">Error</h3>
            <p class="text-red-600 text-sm">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Scraped Data -->
      <div v-if="scrapedData && Object.keys(scrapedData).length > 0" class="space-y-6 animate-fade-in">
        <!-- Main Info -->
        <div v-if="scrapedData.title || scrapedData.description" class="bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl p-6 border border-primary-100">
          <div v-if="scrapedData.image" class="mb-4">
            <img 
              :src="scrapedData.image" 
              :alt="scrapedData.title"
              class="w-full max-w-md mx-auto rounded-lg shadow-md"
              @error="handleImageError"
            />
          </div>
          
          <h2 v-if="scrapedData.title" class="text-2xl font-bold text-gray-800 mb-3">
            {{ scrapedData.title }}
          </h2>
          
          <p v-if="scrapedData.description" class="text-gray-700 leading-relaxed">
            {{ scrapedData.description }}
          </p>

          <div v-if="scrapedData.canonical" class="mt-4 text-sm text-gray-600">
            <span class="font-medium">Canonical URL:</span>
            <a :href="scrapedData.canonical" target="_blank" class="text-primary-600 hover:underline ml-2">
              {{ scrapedData.canonical }}
            </a>
          </div>
        </div>

        <!-- Raw Data Display -->
        <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-800">📊 Raw Scraped Data</h3>
            <button
              @click="copyToClipboard"
              class="px-3 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              📋 Copy JSON
            </button>
          </div>
          
          <pre class="bg-white rounded-lg p-4 overflow-x-auto text-sm text-gray-700 border border-gray-200">{{ JSON.stringify(scrapedData, null, 2) }}</pre>
        </div>

        <!-- Quick Access Links -->
        <div v-if="scrapedData.links && scrapedData.links.length > 0" class="bg-white rounded-xl p-6 border border-gray-200">
          <h3 class="text-lg font-bold text-gray-800 mb-4">🔗 Extracted Links</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <a
              v-for="(link, index) in scrapedData.links.slice(0, 10)"
              :key="index"
              :href="link.href"
              target="_blank"
              class="flex items-center gap-2 p-3 bg-gray-50 hover:bg-primary-50 rounded-lg transition-colors text-sm"
            >
              <svg class="w-4 h-4 text-primary-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
              </svg>
              <span class="truncate">{{ link.text }}</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Usage Examples -->
      <div class="mt-8 pt-8 border-t border-gray-200">
        <h3 class="text-lg font-bold text-gray-800 mb-4">💡 Example URLs to Try</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            v-for="exampleUrl in exampleUrls"
            :key="exampleUrl"
            @click="url = exampleUrl"
            class="text-left px-4 py-3 bg-gray-50 hover:bg-primary-50 border border-gray-200 hover:border-primary-300 rounded-lg transition-all text-sm text-gray-700 hover:text-primary-700"
          >
            {{ exampleUrl }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({
  title: 'Web Scraper Demo'
})

const url = ref('')
const loading = ref(false)
const error = ref(null)
const scrapedData = ref(null)

const exampleUrls = [
  'https://example.com',
  'https://github.com',
  'https://news.ycombinator.com',
  'https://producthunt.com'
]

const scrapeData = async () => {
  if (!url.value) return

  try {
    loading.value = true
    error.value = null
    scrapedData.value = null

    const response = await $fetch('/api/scrape-simple', {
      method: 'POST',
      body: {
        url: url.value
      }
    })

    scrapedData.value = response
  } catch (err) {
    error.value = 'Failed to scrape the URL. Please try again.'
    console.error('Scraping error:', err)
  } finally {
    loading.value = false
  }
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(JSON.stringify(scrapedData.value, null, 2))
    
    // Show success toast (you can integrate toast notifications here)
    alert('Copied to clipboard!')
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const handleImageError = (event) => {
  event.target.style.display = 'none'
}
</script>
