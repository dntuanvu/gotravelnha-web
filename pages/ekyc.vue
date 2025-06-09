<!-- pages/ekyc.vue -->
<script setup>
definePageMeta({
  requiresAuth: true // ✅ This triggers the global middleware
})

const { isAuthenticated, login, user } = await useAuth()

if (!isAuthenticated.value) {
  login()
}
</script>

<template>
  <div v-if="isAuthenticated">
    <h2>Welcome, {{ user?.name }}</h2>
    <!-- eKYC form or steps here -->
  </div>
</template>