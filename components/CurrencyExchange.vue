// frontend/components/CurrencyExchange.vue
<template>
  <div class="bg-white p-6 rounded-xl shadow max-w-xl mx-auto space-y-6">
    <h2 class="text-2xl font-bold text-center text-gray-800">Currency Exchange</h2>

    <div class="flex justify-center gap-4">
      <button
        :class="tab === 'sgd-vnd' ? activeClass : inactiveClass"
        @click="switchTab('sgd-vnd')"
      >
        SGD → VND
      </button>
      <button
        :class="tab === 'vnd-sgd' ? activeClass : inactiveClass"
        @click="switchTab('vnd-sgd')"
      >
        VND → SGD
      </button>
    </div>

    <p class="text-center text-sm text-gray-500">
      Exchange powered by exchangerate.host
    </p>

    <form @submit.prevent="submitForm" class="space-y-4">
      <div>
        <label class="block font-medium">Your Name</label>
        <input v-model="form.name" required class="input" />
      </div>

      <div>
        <label class="block font-medium">Your Email</label>
        <input v-model="form.email" type="email" required class="input" />
      </div>

      <div>
        <label class="block font-medium">{{ inputLabel }}</label>
        <input
            v-model.number="form.inputAmount"
            type="number"
            min="1"
            required
            class="input"
            placeholder="Enter amount"
        />
      </div>

      <div>
        <label class="block font-medium">{{ outputLabel }}</label>
        <input :value="formattedConvertedAmount" readonly class="input bg-gray-100" />
      </div>

      <button type="submit" class="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700">
        Submit
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'
import { useDebounce } from '@vueuse/core'

const toast = useToast()
const config = useRuntimeConfig()

const tab = ref('sgd-vnd')
const exchangeRate = ref(17500)

const form = ref({
  name: '',
  email: '',
  inputAmount: 0
})

const convertedAmount = ref(0)

const amount = computed(() => form.value.inputAmount)
const debouncedAmount = useDebounce(amount, 600)

watch(debouncedAmount, async (amount) => {
  if (!amount || amount <= 0) {
    convertedAmount.value = 0
    return
  }

  const from = tab.value === 'sgd-vnd' ? 'SGD' : 'VND'
  const to = tab.value === 'sgd-vnd' ? 'VND' : 'SGD'

  try {
    const { converted } = await $fetch(`${config.public.apiBase}/exchange/convert`, {
      params: {
        from,
        to,
        amount
      }
    })
    convertedAmount.value = converted

  } catch (e) {
    convertedAmount.value = 0
    toast.error('API limit reached or unavailable. Try again later.')
  }
})

const switchTab = (value) => {
  tab.value = value
  form.value.inputAmount = 0
  convertedAmount.value = 0
}

const inputLabel = computed(() => tab.value === 'sgd-vnd' ? 'SGD Amount' : 'VND Amount')
const outputLabel = computed(() => tab.value === 'sgd-vnd' ? 'VND Amount' : 'SGD Amount')

const formattedConvertedAmount = computed(() => {
  const locale = tab.value === 'sgd-vnd' ? 'vi-VN' : 'en-SG'
  const currency = tab.value === 'sgd-vnd' ? 'VND' : 'SGD'
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(convertedAmount.value || 0)
})

const submitForm = async () => {
  try {
    await $fetch('/api/exchange', {
      method: 'POST',
      body: {
        name: form.value.name,
        email: form.value.email,
        direction: tab.value,
        amount: form.value.inputAmount,
        converted: convertedAmount.value
      }
    })
    toast.success('✅ Your exchange request has been sent!')
    form.value = { name: '', email: '', inputAmount: 0 }
    convertedAmount.value = 0
  } catch (e) {
    toast.error('❌ Failed to send. Please try again.')
  }
}

const activeClass = 'px-4 py-2 bg-blue-600 text-white rounded font-semibold'
const inactiveClass = 'px-4 py-2 bg-white text-gray-800 border rounded font-semibold'
</script>

<style scoped>
.input {
  @apply w-full mt-1 rounded border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring focus:border-blue-500;
}
</style>