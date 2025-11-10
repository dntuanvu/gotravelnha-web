<template>
  <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
    <div class="flex items-center gap-3 mb-4">
      <div class="text-4xl">🎁</div>
      <div>
        <h3 class="text-xl font-bold text-gray-900">Refer Friends & Earn Rewards</h3>
        <p class="text-sm text-gray-600">Share your code and get points when friends sign up!</p>
      </div>
    </div>

    <div v-if="referralCode" class="space-y-4">
      <!-- Referral Code Display -->
      <div class="bg-white rounded-xl p-4 border-2 border-purple-300">
        <label class="block text-sm font-medium text-gray-700 mb-2">Your Referral Code</label>
        <div class="flex items-center gap-3">
          <code class="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg font-mono text-lg font-bold text-purple-700">
            {{ referralCode }}
          </code>
          <button
            @click="copyReferralCode"
            class="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
          >
            {{ copied ? '✓ Copied!' : '📋 Copy' }}
          </button>
        </div>
      </div>

      <!-- Referral Link -->
      <div class="bg-white rounded-xl p-4 border-2 border-purple-300">
        <label class="block text-sm font-medium text-gray-700 mb-2">Your Referral Link</label>
        <div class="flex items-center gap-3">
          <input
            :value="referralLink"
            readonly
            class="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-sm"
          />
          <button
            @click="copyReferralLink"
            class="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
          >
            {{ copiedLink ? '✓ Copied!' : '📋 Copy' }}
          </button>
        </div>
      </div>

      <!-- Share Buttons -->
      <div class="flex flex-wrap gap-2">
        <button
          @click="shareViaWhatsApp"
          class="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2.04c-5.51 0-9.96 4.45-9.96 9.96 0 1.76.47 3.49 1.36 5.01L2 22l5.16-1.33c1.46.8 3.1 1.23 4.78 1.23h.01c5.51 0 9.96-4.45 9.96-9.96 0-2.66-1.04-5.17-2.93-7.07A9.92 9.92 0 0 0 12 2.04zm5.73 14.27c-.24.67-1.19 1.23-1.92 1.39-.51.11-1.18.2-3.44-.74-2.89-1.2-4.74-4.15-4.88-4.34-.14-.19-1.17-1.56-1.17-2.98s.74-2.12 1.01-2.41c.24-.27.64-.39 1.04-.39.12 0 .23.01.33.01.29.01.44.03.63.49.24.58.83 1.99.9 2.13.08.14.13.32.04.51-.09.19-.14.31-.26.48-.14.17-.3.39-.43.52-.14.14-.28.29-.12.57.17.28.77 1.26 1.64 2.04 1.13 1.01 2.09 1.33 2.39 1.47.31.15.49.13.67-.08.18-.21.77-.9.98-1.2.21-.31.42-.25.7-.15.29.1 1.84.87 2.16 1.04.31.17.52.24.6.38.07.14.07.82-.17 1.49z"/>
          </svg>
          <span>WhatsApp</span>
        </button>
        <button
          @click="shareViaEmail"
          class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold flex items-center justify-center gap-2"
        >
          <span>📧</span>
          <span>Email</span>
        </button>
        <button
          @click="shareViaTelegram"
          class="flex-1 px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors font-semibold flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M22 3.24c-.24-.24-.6-.31-.9-.19L2.35 11.01a.75.75 0 0 0 .02 1.4l5.32 2.02 2.05 5.44c.11.3.39.5.7.52h.05c.29 0 .56-.16.69-.42l2.39-4.68 4.35 4.35a.75.75 0 0 0 .53.22h.06a.75.75 0 0 0 .53-.33c2.53-3.79 3.71-7.12 3.81-10.54a.76.76 0 0 0-.22-.56zM9.51 13.86l-3.38-1.29 10.94-5.01-7.56 6.3zM12.1 17.08l-1.21-3.21 3.27-2.72-2.06 4.83z"/>
          </svg>
          <span>Telegram</span>
        </button>
      </div>

      <!-- Stats (if available) -->
      <div v-if="stats" class="grid grid-cols-3 gap-3 pt-4 border-t border-purple-200">
        <div class="text-center">
          <div class="text-2xl font-bold text-purple-700">{{ stats.totalReferrals || 0 }}</div>
          <div class="text-xs text-gray-600">Total Referrals</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-700">{{ stats.signedUp || 0 }}</div>
          <div class="text-xs text-gray-600">Signed Up</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-orange-700">{{ stats.totalRewards || 0 }}</div>
          <div class="text-xs text-gray-600">Reward Points</div>
        </div>
      </div>
    </div>

    <div v-else-if="loading" class="text-center py-4">
      <div class="animate-spin text-purple-600 text-2xl">⏳</div>
      <p class="text-sm text-gray-600 mt-2">Loading referral code...</p>
    </div>

    <div v-else class="text-center py-4">
      <p class="text-gray-600">Please log in to get your referral code</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthState } from '~/composables/useAuthState'
import { useReferral } from '~/composables/useReferral'
import { useActivityTracker } from '~/composables/useActivityTracker'

const { user, isAuthenticated } = useAuthState()
const { getMyReferralCode, getReferralLink, getReferralStats } = useReferral()
const { trackClick } = useActivityTracker()

const referralCode = ref<string | null>(null)
const referralLink = ref<string>('')
const stats = ref<any>(null)
const loading = ref(true)
const copied = ref(false)
const copiedLink = ref(false)

const loadReferralCode = async () => {
  if (!isAuthenticated.value || !user.value) {
    loading.value = false
    return
  }

  try {
    const response = await getMyReferralCode(user.value.id)
    if (response) {
      referralCode.value = response
      referralLink.value = getReferralLink(response)
      
      // Load stats
      const statsResponse = await getReferralStats(user.value.id)
      if (statsResponse.success) {
        stats.value = statsResponse.stats
      }
    }
  } catch (error) {
    console.error('Error loading referral code:', error)
  } finally {
    loading.value = false
  }
}

const copyReferralCode = async () => {
  if (!referralCode.value) return
  
  await navigator.clipboard.writeText(referralCode.value)
  copied.value = true
  trackClick('referral', { action: 'copy_code' })
  setTimeout(() => { copied.value = false }, 2000)
}

const copyReferralLink = async () => {
  if (!referralLink.value) return
  
  await navigator.clipboard.writeText(referralLink.value)
  copiedLink.value = true
  trackClick('referral', { action: 'copy_link' })
  setTimeout(() => { copiedLink.value = false }, 2000)
}

const shareViaWhatsApp = () => {
  const text = `Join GoVietHub and discover amazing travel deals! Use my referral code: ${referralCode.value}\n${referralLink.value}`
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`
  window.open(url, '_blank')
  trackClick('referral', { action: 'share_whatsapp' })
}

const shareViaEmail = () => {
  const subject = 'Join GoVietHub - Amazing Travel Deals!'
  const body = `Hi! I thought you might be interested in GoVietHub, a travel comparison platform.\n\nUse my referral code: ${referralCode.value}\nSign up here: ${referralLink.value}`
  const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  window.location.href = url
  trackClick('referral', { action: 'share_email' })
}

const shareViaTelegram = () => {
  const text = `Join GoVietHub and discover amazing travel deals! Use my referral code: ${referralCode.value}\n${referralLink.value}`
  const url = `https://t.me/share/url?url=${encodeURIComponent(referralLink.value)}&text=${encodeURIComponent(text)}`
  window.open(url, '_blank')
  trackClick('referral', { action: 'share_telegram' })
}

onMounted(() => {
  loadReferralCode()
})
</script>

