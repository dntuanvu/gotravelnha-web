<template>
  <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
    <ContactForm />
  </section>
</template>
  
<script setup>
  import ContactForm from '~/components/ContactForm.vue'
  
  useSEO({
    title: 'Contact Us - GoVietHub',
    description: 'Get in touch with GoVietHub. We\'re here to help with your travel booking needs and answer any questions.',
    keywords: 'contact gotravelnha, travel support, customer service',
    url: 'https://gotravelnha.com/contact'
  })
</script>
  