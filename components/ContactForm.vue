<template>
    <form @submit.prevent="submitForm" class="space-y-6 max-w-xl mx-auto bg-white p-6 shadow rounded">
      <h2 class="text-2xl font-bold text-gray-800 text-center">Contact Us</h2>
  
      <div>
        <label for="name" class="block font-medium text-gray-700">Name</label>
        <input
          v-model="form.name"
          id="name"
          type="text"
          required
          class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
  
      <div>
        <label for="email" class="block font-medium text-gray-700">Email</label>
        <input
          v-model="form.email"
          id="email"
          type="email"
          required
          class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
  
      <div>
        <label for="message" class="block font-medium text-gray-700">Message</label>
        <textarea
          v-model="form.message"
          id="message"
          rows="5"
          required
          class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
      </div>
  
      <div>
        <button
          type="submit"
          class="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
        >
          Send Message
        </button>
      </div>
  
      <div v-if="status" class="text-center text-green-600 font-medium">{{ status }}</div>
    </form>
</template>
  
<script setup>
  import { ref } from 'vue'
  
  const form = ref({
    name: '',
    email: '',
    message: ''
  })
  
  const status = ref('')
  
  const submitForm = async () => {
    try {
      await $fetch('/api/contact', {
        method: 'POST',
        body: form.value
      })
      status.value = '✅ Your message has been sent!'
      form.value = { name: '', email: '', message: '' }
    } catch (e) {
      status.value = '❌ Failed to send message. Please try again later.'
    }
  }
  </script>