<template>
  <div class="min-h-screen bg-white">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">GoVietHub API Documentation</h1>
        <p class="text-lg text-gray-600">
          Interactive API documentation using OpenAPI/Swagger specification
        </p>
        <div class="mt-4 flex gap-4">
          <a
            :href="openApiJsonUrl"
            target="_blank"
            class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            Download OpenAPI JSON
          </a>
        </div>
      </div>

      <!-- Swagger UI Container -->
      <div id="swagger-ui-container" class="border border-gray-200 rounded-lg overflow-hidden"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: 'default'
})

const openApiJsonUrl = '/api/docs'
const swaggerLoaded = ref(false)

onMounted(async () => {
  // Load Swagger UI from CDN
  if (typeof window !== 'undefined' && !swaggerLoaded.value) {
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-bundle.js'
    script.onload = () => {
      const css = document.createElement('link')
      css.rel = 'stylesheet'
      css.href = 'https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui.css'
      document.head.appendChild(css)

      // @ts-ignore
      if (window.SwaggerUIBundle) {
        // @ts-ignore
        window.SwaggerUIBundle({
          url: openApiJsonUrl,
          dom_id: '#swagger-ui-container',
          presets: [
            // @ts-ignore
            window.SwaggerUIBundle.presets.apis,
            // @ts-ignore
            window.SwaggerUIBundle.presets.standalone
          ],
          layout: 'BaseLayout',
          deepLinking: true,
          filter: true,
          tryItOutEnabled: true
        })
        swaggerLoaded.value = true
      }
    }
    document.head.appendChild(script)
  }
})
</script>

<style>
/* Override Swagger UI styles for better integration */
.swagger-ui .topbar {
  display: none;
}
</style>
