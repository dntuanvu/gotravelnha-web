<script setup>
const router = useRouter()

onMounted(async () => {
  const { handleRedirectCallback } = await useAuth()
  await handleRedirectCallback()
  router.replace('/') // or wherever the user should go
})
</script>

<template>
  <div class="text-center mt-10">Logging you in…</div>
</template>