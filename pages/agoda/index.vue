<template>
    <section class="max-w-4xl mx-auto px-4 py-12">
      <div class="bg-white rounded-2xl shadow-lg p-8 mb-8 text-center">
        <img src="https://storage.googleapis.com/travella_assets_images/agoda-logo.png" alt="Agoda" class="mx-auto mb-4 w-40" />
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Find the Best Hotel Deals</h2>
        <p class="text-gray-600 mb-6">
          Discover affordable hotels and vacation rentals with Agoda.
        </p>
        <div class="bg-gray-100 p-6 rounded-xl shadow-sm">
          <!-- Replace the iframe URL with your Agoda affiliate link -->
          <iframe 
            src="/AgodaPartnerVerification.htm" 
            width="100%" 
            height="600" 
            frameborder="0" 
            class="rounded-xl">
          </iframe>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { onMounted } from 'vue';
  
  onMounted(() => {
    console.log("Agoda Page Loaded");
  });
  </script>
  
  <style scoped>
  section {
    text-align: center;
    margin-bottom: 2rem;
  }
  </style>
  