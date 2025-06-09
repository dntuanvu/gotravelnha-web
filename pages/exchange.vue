<template>
    <section class="py-10 px-4 max-w-4xl mx-auto">
      <client-only>
        <CurrencyExchange />
      </client-only>
    </section>
</template>
  
<script setup>
  import CurrencyExchange from '~/components/CurrencyExchange.vue'
</script>  