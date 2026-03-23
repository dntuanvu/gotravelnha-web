<template>
  <div class="bg-gray-100 min-h-full">
    <div class="px-4 sm:px-6 lg:px-8 py-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center gap-3 mb-6">
          <span class="text-3xl">🏨</span>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Trip.com Events Management</h1>
            <p class="text-sm text-gray-600">Manage and view scraped Trip.com deals and promotions</p>
          </div>
        </div>
        
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div class="flex items-start gap-3">
            <span class="text-xl">💡</span>
            <div>
              <h3 class="font-semibold text-blue-900 mb-1">Trip.com Events Data</h3>
              <p class="text-sm text-blue-800">
                This page will display all scraped Trip.com deals and promotions. Configure crawl URLs from the 
                <NuxtLink to="/admin/scrapers" class="underline font-medium">Scraper Management Overview</NuxtLink> page.
              </p>
            </div>
          </div>
        </div>

        <div class="text-center py-12 text-gray-500">
          <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          <p class="text-lg font-medium mb-2">Trip.com Events View</p>
          <p class="text-sm">This feature will display scraped Trip.com deals data</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})
</script>
