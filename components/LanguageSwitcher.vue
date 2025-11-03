<template>
  <div class="flex items-center gap-2">
    <button
      @click="switchLanguage('en')"
      :class="[
        'px-3 py-1 rounded-lg transition-colors',
        currentLang === 'en' 
          ? 'bg-blue-600 text-white font-semibold' 
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      ]"
    >
      EN
    </button>
    <button
      @click="switchLanguage('vi')"
      :class="[
        'px-3 py-1 rounded-lg transition-colors',
        currentLang === 'vi' 
          ? 'bg-blue-600 text-white font-semibold' 
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      ]"
    >
      VI
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'

const { currentLang, setLanguage } = useI18n()

const switchLanguage = (lang: 'en' | 'vi') => {
  setLanguage(lang)
  // Reload page to apply translations (simple approach)
  if (typeof window !== 'undefined') {
    window.location.reload()
  }
}
</script>

