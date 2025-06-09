<script setup>
const props = defineProps({
  platform: String, // 'trip', 'booking', or 'klook'
  label: String
})

const { user, isAuthenticated } = await useAuth()

const goToAffiliate = () => {
  if (!isAuthenticated.value) {
    alert('Please login to continue.')
    return
  }

  const email = encodeURIComponent(user.value?.email || 'unknown')
  const name = encodeURIComponent(user.value?.name || 'guest')

  const url = `/api/referral/${props.platform}?user=${name}&email=${email}`
  window.location.href = url
}
</script>

<template>
  <button
      :disabled="!user"
      @click="goToAffiliate"
      class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
    >
    {{ label }}
  </button>

</template>
