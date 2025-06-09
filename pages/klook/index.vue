<template>
    <section class="mx-auto">
      <div class="bg-white rounded-2xl shadow-lg text-center">
        <img src="https://storage.googleapis.com/travella_assets_images/klook-logo.png" alt="Klook" class="mx-auto w-40" />
        <h2 class="text-2xl font-bold text-gray-800">Find Your Next Adventure</h2>
        <p class="text-gray-600 mb-4">
          Explore the world with Klook – tours, activities, and experiences.
        </p>
        <div class="bg-gray-100 p-4 rounded-xl shadow-sm">
          <ins class="klk-aff-widget" data-wid="89020" data-height="340px" data-adid="1045566" data-lang="" data-prod="search_vertical" data-currency="">
            <a href="//www.klook.com/?aid=">Klook.com</a>
          </ins>
        </div>
      </div>
    </section>
</template>
  
<script setup>
  import { onMounted } from 'vue';
  
  onMounted(() => {
    const script = document.createElement('script');
    script.src = 'https://affiliate.klook.com/widget/fetch-iframe-init.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  });
</script>
  
<style scoped>
  section {
    text-align: center;
    margin-bottom: 2rem;
  }
</style>