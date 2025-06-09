<template>
    <div class="p-4">
      <h1 class="text-xl font-bold">Deal: {{ route.params.slug }}</h1>
      <p>This is a placeholder for deal redirection or details.</p>
    </div>
  </template>
  
  <script setup>
  const route = useRoute()
  </script>
  