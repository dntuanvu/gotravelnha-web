<template>
  <div class="min-h-screen bg-gray-50 pb-12">
    <div class="max-w-7xl mx-auto px-4 pt-8">
      <!-- Page Header -->
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">🤖 Data Scraper Management</h1>
            <p class="text-gray-600">Manage background scraping jobs for Trip.com, Klook, and SG Attractions</p>
          </div>
          <button
            @click="showAddSourceModal = true"
            class="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-semibold transition-all transform hover:scale-105 flex items-center gap-2"
          >
            <span>➕</span>
            <span>Add Source</span>
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-600 text-sm font-medium">Active Jobs</span>
            <span class="text-blue-600 text-2xl">⚙️</span>
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ stats.activeJobs }}</p>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-600 text-sm font-medium">Total Sources</span>
            <span class="text-green-600 text-2xl">🔗</span>
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ stats.totalSources }}</p>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-600 text-sm font-medium">Data Items</span>
            <span class="text-purple-600 text-2xl">📊</span>
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ stats.dataItems.toLocaleString() }}</p>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-600 text-sm font-medium">Last Scrape</span>
            <span class="text-yellow-600 text-2xl">🕐</span>
          </div>
          <p class="text-sm font-medium text-gray-900">{{ stats.lastScrape }}</p>
        </div>
      </div>

      <!-- Active Jobs Table -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">⚡ Active Scraping Jobs</h2>
          <button
            @click="refreshJobs"
            :disabled="loading"
            class="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <span>🔄</span>
            <span>Refresh</span>
          </button>
        </div>

        <div v-if="loading" class="text-center py-12">
          <div class="animate-spin text-4xl mb-2">⏳</div>
          <p class="text-gray-600">Loading jobs...</p>
        </div>

        <div v-else-if="jobs.length === 0" class="text-center py-12">
          <div class="text-4xl mb-2">📭</div>
          <p class="text-gray-600 mb-4">No active jobs</p>
          <button
            @click="showAddSourceModal = true"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create First Job
          </button>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Platform
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source URL
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="job in jobs" :key="job.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center gap-2 px-2 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {{ getPlatformIcon(job.platform) }}
                    {{ job.platform }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="max-w-xs truncate text-sm text-gray-900" :title="job.sourceUrl">
                    {{ job.sourceUrl }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(job.status)">
                    {{ job.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ job.priority }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(job.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      @click="viewJobDetails(job)"
                      class="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </button>
                    <button
                      v-if="job.status === 'PENDING'"
                      @click="startJob(job.id)"
                      class="text-green-600 hover:text-green-900"
                    >
                      Start
                    </button>
                    <button
                      v-if="job.status === 'RUNNING'"
                      @click="cancelJob(job.id)"
                      class="text-red-600 hover:text-red-900"
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Data Sources Section -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-6">🔗 Configured Sources</h2>
        
        <div v-if="sources.length === 0" class="text-center py-12">
          <div class="text-4xl mb-2">🔌</div>
          <p class="text-gray-600 mb-4">No sources configured yet</p>
          <button
            @click="showAddSourceModal = true"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add First Source
          </button>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="source in sources"
            :key="source.url"
            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <span class="inline-flex items-center gap-2 px-2 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    {{ getPlatformIcon(source.platform) }}
                    {{ source.platform }}
                  </span>
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ source.sourceType }}
                  </span>
                  <span v-if="source.isActive" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✓ Active
                  </span>
                </div>
                <p class="text-sm text-gray-900 mb-2 font-medium break-all">
                  {{ source.url }}
                </p>
                <p class="text-xs text-gray-500">
                  Last scraped: {{ source.lastScrapedAt ? formatDate(source.lastScrapedAt) : 'Never' }} • 
                  {{ source.scrapeCount }} total scrapes
                </p>
              </div>
              <div class="flex items-center gap-2 ml-4">
                <button
                  @click="createJobFromSource(source.url)"
                  class="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  🚀 Run
                </button>
                <button
                  @click="toggleSource(source.url, !source.isActive)"
                  :class="[
                    'px-3 py-1.5 text-sm rounded-lg transition-colors',
                    source.isActive
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  ]"
                >
                  {{ source.isActive ? '⏸️ Disable' : '▶️ Enable' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Klook Promo Codes Import Section -->
      <div class="bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl shadow-sm border-2 border-orange-200 p-6 mt-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">🎫 Klook Promo Codes Import</h2>
          <button
            @click="showKlookImportModal = true"
            :disabled="importingKlook"
            class="px-4 py-2 bg-gradient-to-r from-orange-600 to-pink-600 text-white rounded-lg hover:from-orange-700 hover:to-pink-700 font-semibold transition-all transform hover:scale-105 flex items-center gap-2 disabled:opacity-50"
          >
            <span>{{ importingKlook ? '⏳' : '📤' }}</span>
            <span>{{ importingKlook ? 'Importing...' : 'Import CSV' }}</span>
          </button>
        </div>

        <div class="bg-white rounded-lg p-4 mb-4">
          <div class="flex items-start gap-3">
            <span class="text-2xl">💡</span>
            <div>
              <h4 class="font-semibold text-gray-900 mb-1">Quick Import Process</h4>
              <ol class="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                <li>Login to <a href="https://affiliate.klook.com/my_ads/" target="_blank" class="text-orange-600 hover:underline">Klook Affiliate Portal</a></li>
                <li>Go to "Promo Codes" section</li>
                <li>Click "Export" button</li>
                <li>Upload the CSV file here</li>
                <li>Let the system process and import all promo codes!</li>
              </ol>
            </div>
          </div>
        </div>

        <div v-if="klookPromoCodes.length > 0" class="bg-white rounded-lg overflow-hidden">
          <div class="p-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h4 class="font-semibold text-gray-900">Imported Promo Codes ({{ klookPromoCodes.length }})</h4>
              <button
                @click="loadKlookPromoCodes"
                :disabled="loadingPromoCodes"
                class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {{ loadingPromoCodes ? '🔄' : '🔄 Refresh' }}
              </button>
            </div>
          </div>
          <div class="max-h-64 overflow-y-auto">
            <table class="w-full">
              <thead class="bg-gray-50 sticky top-0">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-600">Code</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-600">Description</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-600">Valid Until</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="code in klookPromoCodes" :key="code.id" class="hover:bg-gray-50">
                  <td class="px-4 py-2">
                    <span class="font-mono font-semibold text-orange-600">{{ code.promoCode }}</span>
                  </td>
                  <td class="px-4 py-2 text-sm text-gray-700">
                    {{ code.discountDescription }}
                  </td>
                  <td class="px-4 py-2 text-sm text-gray-600">
                    {{ formatDate(code.validUntil) }}
                  </td>
                  <td class="px-4 py-2">
                    <span :class="new Date(code.validUntil) > new Date() ? 'px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium' : 'px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium'">
                      {{ new Date(code.validUntil) > new Date() ? '✓ Active' : '✗ Expired' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-else-if="!loadingPromoCodes" class="bg-white rounded-lg p-8 text-center">
          <div class="text-4xl mb-2">🎫</div>
          <p class="text-gray-600">No promo codes imported yet</p>
        </div>
      </div>

      <!-- Klook Hotel Deals Import Section -->
      <div class="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-sm border-2 border-blue-200 p-6 mt-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">🏨 Klook Hotel Deals Import</h2>
          <button
            @click="showKlookHotelsModal = true"
            :disabled="importingKlookHotels"
            class="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 font-semibold transition-all transform hover:scale-105 flex items-center gap-2 disabled:opacity-50"
          >
            <span>{{ importingKlookHotels ? '⏳' : '📤' }}</span>
            <span>{{ importingKlookHotels ? 'Importing...' : 'Import CSV' }}</span>
          </button>
        </div>

        <div class="bg-white rounded-lg p-4 mb-4">
          <div class="flex items-start gap-3">
            <span class="text-2xl">💡</span>
            <div>
              <h4 class="font-semibold text-gray-900 mb-1">Quick Import Process</h4>
              <ol class="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                <li>Login to <a href="https://affiliate.klook.com/my_ads/" target="_blank" class="text-blue-600 hover:underline">Klook Affiliate Portal</a></li>
                <li>Go to "Hotel deals" section</li>
                <li>Click "Export CSV" button</li>
                <li>Upload the CSV file here</li>
                <li>Let the system process and import all hotel deals!</li>
              </ol>
            </div>
          </div>
        </div>

        <div v-if="klookHotels.length > 0" class="bg-white rounded-lg overflow-hidden">
          <div class="p-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h4 class="font-semibold text-gray-900">Imported Hotel Deals ({{ klookHotels.length }})</h4>
              <button
                @click="loadKlookHotels"
                :disabled="loadingHotels"
                class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {{ loadingHotels ? '🔄' : '🔄 Refresh' }}
              </button>
            </div>
          </div>
          <div class="max-h-64 overflow-y-auto">
            <table class="w-full">
              <thead class="bg-gray-50 sticky top-0">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-600">Hotel Name</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-600">Stars</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-600">Original Price</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-600">Deal Price</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-600">Savings</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="hotel in klookHotels" :key="hotel.id" class="hover:bg-gray-50">
                  <td class="px-4 py-2">
                    <div class="font-semibold text-gray-900">{{ hotel.hotelName }}</div>
                    <div class="text-xs text-gray-500">{{ hotel.dealCategory }}</div>
                  </td>
                  <td class="px-4 py-2">
                    <span v-if="hotel.starRating" class="text-yellow-500">{{ '⭐'.repeat(hotel.starRating) }}</span>
                    <span v-else class="text-gray-400">—</span>
                  </td>
                  <td class="px-4 py-2 text-sm text-gray-600 line-through">
                    {{ getCurrencySymbol(hotel.currency) }}{{ formatDecimal(hotel.originalPrice) }}
                  </td>
                  <td class="px-4 py-2">
                    <span class="text-lg font-bold text-blue-600">{{ getCurrencySymbol(hotel.currency) }}{{ formatDecimal(hotel.discountedPrice) }}</span>
                  </td>
                  <td class="px-4 py-2">
                    <span class="text-sm font-semibold text-green-600">Save {{ getCurrencySymbol(hotel.currency) }}{{ formatDecimal(hotel.savings) }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-else-if="!loadingHotels" class="bg-white rounded-lg p-8 text-center">
          <div class="text-4xl mb-2">🏨</div>
          <p class="text-gray-600">No hotel deals imported yet</p>
        </div>
      </div>
    </div>

    <!-- Job Details Modal -->
    <div
      v-if="selectedJob"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click="selectedJob = null"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-2xl font-bold text-gray-900">Job Details</h3>
          <button
            @click="selectedJob = null"
            class="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div class="space-y-4">
          <!-- Job Info -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-700">Platform</label>
              <div class="mt-1 flex items-center gap-2">
                <span class="text-2xl">{{ getPlatformIcon(selectedJob.platform) }}</span>
                <span class="text-gray-900 font-medium">{{ selectedJob.platform }}</span>
              </div>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Status</label>
              <div class="mt-1">
                <span :class="getStatusClass(selectedJob.status)">
                  {{ selectedJob.status }}
                </span>
              </div>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Created</label>
              <div class="mt-1 text-gray-900">{{ formatDate(selectedJob.createdAt) }}</div>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Completed</label>
              <div class="mt-1 text-gray-900">{{ selectedJob.completedAt ? formatDate(selectedJob.completedAt) : 'N/A' }}</div>
            </div>
          </div>

          <!-- Source URL -->
          <div>
            <label class="text-sm font-medium text-gray-700">Source URL</label>
            <div class="mt-1 p-3 bg-gray-50 rounded-lg break-all text-sm text-gray-900">
              {{ selectedJob.sourceUrl }}
            </div>
          </div>

          <!-- Error Message (if failed) -->
          <div v-if="selectedJob.status === 'FAILED' && selectedJob.error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div class="flex items-start gap-3">
              <span class="text-2xl">❌</span>
              <div class="flex-1">
                <h4 class="font-semibold text-red-900 mb-1">Error Details</h4>
                <p class="text-sm text-red-800">{{ selectedJob.error }}</p>
              </div>
            </div>
          </div>

          <!-- Metadata -->
          <div v-if="selectedJob.metadata && Object.keys(selectedJob.metadata).length > 0">
            <label class="text-sm font-medium text-gray-700">Metadata</label>
            <div class="mt-1 p-3 bg-gray-50 rounded-lg">
              <pre class="text-xs text-gray-700 overflow-auto">{{ JSON.stringify(selectedJob.metadata, null, 2) }}</pre>
            </div>
          </div>

          <!-- Data Count -->
          <div>
            <label class="text-sm font-medium text-gray-700">Items Scraped</label>
            <div class="mt-1 text-2xl font-bold text-gray-900">
              {{ selectedJob._count?.dataItems || 0 }}
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button
            @click="selectedJob = null"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Add Source Modal -->
    <div
      v-if="showAddSourceModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click="showAddSourceModal = false"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6"
        @click.stop
      >
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-2xl font-bold text-gray-900">Add Scraper Source</h3>
          <button
            @click="showAddSourceModal = false"
            class="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <form @submit.prevent="handleAddSource" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Platform *
            </label>
            <select
              v-model="newSource.platform"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select platform...</option>
              <option value="trip">Trip.com</option>
              <option value="klook">Klook</option>
              <option value="attractionsg">SG Attractions</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Source URL *
            </label>
            <input
              v-model="newSource.url"
              type="url"
              required
              placeholder="https://..."
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p class="mt-1 text-xs text-gray-500">
              Enter the individual sale page URL (e.g., /sale/w/XXXXX/YYYY.html)
            </p>
            <p class="mt-1 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
              <span class="font-semibold">⚠️ Note:</span> Affiliate portal pages (like Popular Deals) require login and cannot be scraped. Use individual sale page URLs instead.
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Source Type *
            </label>
            <select
              v-model="newSource.sourceType"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select type...</option>
              <option value="promotion_page">Promotion Page ⭐ (Recommended)</option>
              <option value="affiliate_link">Affiliate Link</option>
              <option value="search_url">Search URL</option>
            </select>
            <p class="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
              <span class="font-semibold">💡 Note:</span> Only <strong>Promotion Pages</strong> contain scrapable structured data. 
              Affiliate links and search URLs are for displaying to users, not scraping.
            </p>
          </div>

          <div class="flex gap-3 pt-4">
            <button
              type="submit"
              :disabled="loading"
              class="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-semibold transition-all disabled:opacity-50"
            >
              {{ loading ? 'Adding...' : 'Add Source' }}
            </button>
            <button
              type="button"
              @click="showAddSourceModal = false"
              class="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Klook Import Modal -->
    <div
      v-if="showKlookImportModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click="showKlookImportModal = false"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6"
        @click.stop
      >
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-2xl font-bold text-gray-900">🎫 Import Klook Promo Codes</h3>
          <button
            @click="showKlookImportModal = false"
            class="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div class="space-y-4">
          <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 class="font-semibold text-blue-900 mb-2">📋 Instructions</h4>
            <ol class="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Export promo codes from <a href="https://affiliate.klook.com/my_ads/" target="_blank" class="underline">Klook Affiliate Portal</a></li>
              <li>Click "Choose File" below</li>
              <li>Select the exported CSV file</li>
              <li>Click "Import" to process the file</li>
            </ol>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              CSV File *
            </label>
            <input
              ref="csvFileInput"
              type="file"
              accept=".csv"
              @change="onFileSelect"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div v-if="selectedFile" class="p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center gap-3">
              <span class="text-2xl">📄</span>
              <div class="flex-1">
                <div class="font-medium text-gray-900">{{ selectedFile.name }}</div>
                <div class="text-sm text-gray-600">{{ formatFileSize(selectedFile.size) }}</div>
              </div>
            </div>
          </div>

          <div v-if="importError" class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
            <strong>Error:</strong> {{ importError }}
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <button
              @click="showKlookImportModal = false"
              :disabled="importingKlook"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              @click="importKlookPromoCodes"
              :disabled="!selectedFile || importingKlook"
              class="px-4 py-2 bg-gradient-to-r from-orange-600 to-pink-600 text-white rounded-lg hover:from-orange-700 hover:to-pink-700 transition-all disabled:opacity-50 font-semibold flex items-center gap-2"
            >
              <span>{{ importingKlook ? '⏳' : '📤' }}</span>
              <span>{{ importingKlook ? 'Importing...' : 'Import' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Klook Hotels Import Modal -->
    <div
      v-if="showKlookHotelsModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click="showKlookHotelsModal = false"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6"
        @click.stop
      >
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-2xl font-bold text-gray-900">🏨 Import Klook Hotel Deals</h3>
          <button
            @click="showKlookHotelsModal = false"
            class="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div class="space-y-4">
          <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 class="font-semibold text-blue-900 mb-2">📋 Instructions</h4>
            <ol class="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Export hotel deals from <a href="https://affiliate.klook.com/my_ads/" target="_blank" class="underline">Klook Affiliate Portal</a></li>
              <li>Click "Choose File" below</li>
              <li>Select the exported CSV file</li>
              <li>Click "Import" to process the file</li>
            </ol>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              CSV File *
            </label>
            <input
              ref="csvFileInputHotels"
              type="file"
              accept=".csv"
              @change="onFileSelectHotels"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div v-if="selectedFileHotels" class="p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center gap-3">
              <span class="text-2xl">📄</span>
              <div class="flex-1">
                <div class="font-medium text-gray-900">{{ selectedFileHotels.name }}</div>
                <div class="text-sm text-gray-600">{{ formatFileSize(selectedFileHotels.size) }}</div>
              </div>
            </div>
          </div>

          <div v-if="importErrorHotels" class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
            <strong>Error:</strong> {{ importErrorHotels }}
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <button
              @click="showKlookHotelsModal = false"
              :disabled="importingKlookHotels"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              @click="importKlookHotels"
              :disabled="!selectedFileHotels || importingKlookHotels"
              class="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 font-semibold flex items-center gap-2"
            >
              <span>{{ importingKlookHotels ? '⏳' : '📤' }}</span>
              <span>{{ importingKlookHotels ? 'Importing...' : 'Import' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

definePageMeta({
  layout: 'default',
  middleware: 'admin'
})

// Mock data - replace with real API calls
const loading = ref(false)
const showAddSourceModal = ref(false)
const selectedJob = ref<any>(null)
const jobs = ref<any[]>([])
const sources = ref<any[]>([])

const stats = ref({
  activeJobs: 0,
  totalSources: 0,
  dataItems: 0,
  lastScrape: 'Never'
})

const newSource = ref({
  platform: '',
  url: '',
  sourceType: ''
})

// Klook Promo Codes Import
const showKlookImportModal = ref(false)
const selectedFile = ref<File | null>(null)
const importingKlook = ref(false)
const importError = ref<string | null>(null)
const klookImportStats = ref<any>(null)
const csvFileInput = ref<HTMLInputElement | null>(null)
const klookPromoCodes = ref<any[]>([])
const loadingPromoCodes = ref(false)

// Klook Hotels Import
const showKlookHotelsModal = ref(false)
const selectedFileHotels = ref<File | null>(null)
const importingKlookHotels = ref(false)
const importErrorHotels = ref<string | null>(null)
const klookHotelsStats = ref<any>(null)
const csvFileInputHotels = ref<HTMLInputElement | null>(null)
const klookHotels = ref<any[]>([])
const loadingHotels = ref(false)

const getPlatformIcon = (platform: string) => {
  const icons: Record<string, string> = {
    trip: '🏨',
    klook: '🎯',
    attractionsg: '🎫'
  }
  return icons[platform] || '🌐'
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    PENDING: 'px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800',
    RUNNING: 'px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800',
    COMPLETED: 'px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800',
    FAILED: 'px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800',
    CANCELLED: 'px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
  }
  return classes[status] || ''
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString()
}

const refreshJobs = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/admin/scraper/jobs') as any
    if (response.success) {
      jobs.value = response.data || []
    }
  } catch (error) {
    console.error('Failed to fetch jobs:', error)
    alert('Failed to fetch jobs. Please try again.')
  } finally {
    loading.value = false
  }
}

const loadSources = async () => {
  try {
    const response = await $fetch('/api/admin/scraper/sources') as any
    if (response.success) {
      sources.value = response.data || []
    }
  } catch (error) {
    console.error('Failed to fetch sources:', error)
  }
}

const loadDataStats = async () => {
  try {
    const response = await $fetch('/api/admin/scraper/data?limit=1') as any
    if (response.success) {
      stats.value.dataItems = response.total || 0
    }
  } catch (error) {
    console.error('Failed to fetch stats:', error)
  }
  
  // Update active jobs count
  stats.value.activeJobs = jobs.value.filter(j => j.status === 'RUNNING').length
  
  // Update total sources count
  stats.value.totalSources = sources.value.length
  
  // Get last scrape time from most recent completed job
  const recentJob = jobs.value.find(j => j.completedAt)
  if (recentJob) {
    stats.value.lastScrape = formatRelativeTime(recentJob.completedAt)
  } else {
    stats.value.lastScrape = 'Never'
  }
}

const handleAddSource = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/admin/scraper/sources', {
      method: 'POST',
      body: {
        url: newSource.value.url,
        platform: newSource.value.platform,
        sourceType: newSource.value.sourceType,
        isActive: true
      }
    })
    
    if (response.success) {
      await loadSources()
      newSource.value = { platform: '', url: '', sourceType: '' }
      showAddSourceModal.value = false
    } else {
      alert('Failed to add source. Please try again.')
    }
  } catch (error) {
    console.error('Failed to add source:', error)
    alert('Failed to add source. Please try again.')
  } finally {
    loading.value = false
  }
}

const createJobFromSource = async (sourceUrl: string) => {
  const source = sources.value.find(s => s.url === sourceUrl)
  if (!source) return

  loading.value = true
  try {
    const response = await $fetch('/api/admin/scraper/jobs', {
      method: 'POST',
      body: {
        sourceUrl,
        platform: source.platform,
        jobType: 'event',
        startImmediately: true
      }
    })

    if (response.success) {
      alert('✅ Job created and started!')
      await refreshJobs()
      await loadDataStats()
    } else {
      alert('Failed to create job. Please try again.')
    }
  } catch (error) {
    console.error('Failed to create job:', error)
    alert('Failed to create job. Please try again.')
  } finally {
    loading.value = false
  }
}

const toggleSource = async (sourceUrl: string, isActive: boolean) => {
  loading.value = true
  try {
    const response = await $fetch('/api/admin/scraper/sources', {
      method: 'POST',
      body: {
        url: sourceUrl,
        isActive
      }
    })

    if (response.success) {
      await loadSources()
    } else {
      alert('Failed to update source. Please try again.')
    }
  } catch (error) {
    console.error('Failed to toggle source:', error)
    alert('Failed to update source. Please try again.')
  } finally {
    loading.value = false
  }
}

const viewJobDetails = (job: any) => {
  selectedJob.value = job
}

const startJob = (jobId: string) => {
  // Job starts automatically when created, so just inform user
  alert('Job is already created. It will start automatically.')
}

const cancelJob = (jobId: string) => {
  alert('Job cancellation not yet implemented. Jobs will complete or fail automatically.')
}

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
}

// Klook Promo Codes Import Functions
const onFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0]
    importError.value = null
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const importKlookPromoCodes = async () => {
  if (!selectedFile.value) return

  importingKlook.value = true
  importError.value = null

  try {
    // Read the file
    const text = await selectedFile.value.text()

    // Send to API
    const response = await $fetch('/api/klook/import-promo-codes', {
      method: 'POST',
      body: {
        csvData: text
      }
    }) as any

    if (response.success) {
      klookImportStats.value = response.results
      selectedFile.value = null
      if (csvFileInput.value) {
        csvFileInput.value.value = ''
      }
      showKlookImportModal.value = false
      
      // Show success message
      alert(`Successfully imported ${response.results.imported} promo codes!\nUpdated: ${response.results.updated}\nSkipped: ${response.results.skipped}`)
      
      // Reload promo codes list
      await loadKlookPromoCodes()
    } else {
      importError.value = 'Import failed: Unknown error'
    }
  } catch (error: any) {
    console.error('Import error:', error)
    importError.value = error.message || 'Failed to import promo codes'
  } finally {
    importingKlook.value = false
  }
}

// Klook Hotels Import Functions
const onFileSelectHotels = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    selectedFileHotels.value = target.files[0]
    importErrorHotels.value = null
  }
}

const importKlookHotels = async () => {
  if (!selectedFileHotels.value) return

  importingKlookHotels.value = true
  importErrorHotels.value = null

  try {
    // Read the file
    const text = await selectedFileHotels.value.text()

    // Send to API
    const response = await $fetch('/api/klook/import-hotel-deals', {
      method: 'POST',
      body: {
        csvData: text
      }
    }) as any

    if (response.success) {
      klookHotelsStats.value = response.results
      selectedFileHotels.value = null
      if (csvFileInputHotels.value) {
        csvFileInputHotels.value.value = ''
      }
      showKlookHotelsModal.value = false
      
      // Show success message
      alert(`Successfully imported ${response.results.imported} hotel deals!\nUpdated: ${response.results.updated}\nSkipped: ${response.results.skipped}`)
      
      // Reload hotel deals list
      await loadKlookHotels()
    } else {
      importErrorHotels.value = 'Import failed: Unknown error'
    }
  } catch (error: any) {
    console.error('Import error:', error)
    importErrorHotels.value = error.message || 'Failed to import hotel deals'
  } finally {
    importingKlookHotels.value = false
  }
}

const loadKlookPromoCodes = async () => {
  loadingPromoCodes.value = true
  try {
    const response = await $fetch('/api/klook/promo-codes') as any
    if (response.success) {
      klookPromoCodes.value = response.data || []
    }
  } catch (error) {
    console.error('Failed to load promo codes:', error)
  } finally {
    loadingPromoCodes.value = false
  }
}

const loadKlookHotels = async () => {
  loadingHotels.value = true
  try {
    const response = await $fetch('/api/klook/hotel-deals') as any
    if (response.success) {
      klookHotels.value = response.data || []
    }
  } catch (error) {
    console.error('Failed to load hotel deals:', error)
  } finally {
    loadingHotels.value = false
  }
}

const getCurrencySymbol = (currency: string) => {
  const symbols: Record<string, string> = {
    USD: '$',
    SGD: 'S$',
    EUR: '€',
    GBP: '£',
    MYR: 'RM',
    THB: '฿',
    VND: '₫'
  }
  return symbols[currency] || currency
}

const formatDecimal = (value: number | string) => {
  if (typeof value === 'string') {
    const parsed = parseFloat(value)
    return isNaN(parsed) ? '0.00' : parsed.toFixed(2)
  }
  return value.toFixed(2)
}

onMounted(async () => {
  console.log('🤖 Scraper management loaded')
  await refreshJobs()
  await loadSources()
  await loadDataStats()
  await loadKlookPromoCodes()
  await loadKlookHotels()
  
  // Auto-refresh every 10 seconds
  const interval = setInterval(async () => {
    await refreshJobs()
    await loadDataStats()
  }, 10000)

  onUnmounted(() => {
    clearInterval(interval)
  })
})
</script>

