<template>
  <div class="klook-logo-container" :class="{ 'inline-flex': inline, 'flex': !inline }" :style="{ alignItems: inline ? 'center' : 'center', gap: gap }">
    <!-- Klook Logo Image -->
    <img 
      :src="logoUrl" 
      alt="Klook" 
      :width="width === 'auto' ? undefined : width" 
      :height="height === 'auto' ? undefined : height"
      :class="['klook-logo', logoClass]"
      :style="{ width: width === 'auto' ? 'auto' : `${width}px`, height: height === 'auto' ? 'auto' : `${height}px` }"
      @error="handleImageError"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  width: {
    type: [String, Number],
    default: 'auto'
  },
  height: {
    type: [String, Number],
    default: 'auto'
  },
  inline: {
    type: Boolean,
    default: false
  },
  gap: {
    type: String,
    default: '0.5rem'
  },
  logoClass: {
    type: String,
    default: ''
  }
})

const logoUrl = ref('https://storage.googleapis.com/travella_assets_images/klook-logo.png')
const imageError = ref(false)

const handleImageError = () => {
  // Fallback to icon if image fails to load
  imageError.value = true
}
</script>

<style scoped>
.klook-logo-container {
  display: inline-flex;
  align-items: center;
}

.klook-logo {
  object-fit: contain;
  display: block;
}
</style>

