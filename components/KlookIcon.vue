<template>
  <svg 
    :width="size" 
    :height="size" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
    class="klook-icon"
  >
    <!-- Klook "Joysplash" icon - abstract multi-colored fragmented circle -->
    <!-- Orange segment -->
    <path d="M12 3 C16 3 19 5 20 8 C19 10 17 11 15 10 C14 8 13 5 12 3 Z" fill="#FF6B35" />
    
    <!-- Teal/Cyan segment -->
    <path d="M20 8 C21 11 21 14 19 16 C17 17 15 16 16 14 C17 12 19 10 20 8 Z" fill="#00D4FF" />
    
    <!-- Yellow segment -->
    <path d="M19 16 C17 18 14 19 12 18 C10 16 11 14 13 15 C15 16 17 16 19 16 Z" fill="#FFD23F" />
    
    <!-- Purple segment -->
    <path d="M12 18 C8 18 5 16 4 13 C6 12 8 13 9 15 C10 17 11 18 12 18 Z" fill="#9B59B6" />
    
    <!-- Orange accent piece -->
    <path d="M4 13 C3 10 4 7 6 6 C7 8 6 11 5 12 C4 13 4 13 4 13 Z" fill="#FF8C42" />
    
    <!-- Yellow accent piece -->
    <path d="M6 6 C8 4 10 4 11 6 C10 7 9 9 8 8 C7 7 6 6 6 6 Z" fill="#FFE66D" />
    
    <!-- Teal accent piece -->
    <path d="M15 10 C16 9 17 10 17 12 C16 13 15 13 14 12 C14 11 15 10 15 10 Z" fill="#1EC8FF" />
  </svg>
</template>

<script setup>
defineProps({
  size: {
    type: [String, Number],
    default: 24
  }
})
</script>

<style scoped>
.klook-icon {
  display: inline-block;
  vertical-align: middle;
}
</style>

