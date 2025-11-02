import { ref, computed } from 'vue'

// Global auth state
const user = ref<any>(null)

// Load user from localStorage on module init
if (process.client) {
  const storedUser = localStorage.getItem('gotravelnha_user')
  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser)
    } catch (e) {
      console.error('Failed to parse stored user:', e)
      localStorage.removeItem('gotravelnha_user')
    }
  }
}

export const useAuthState = () => {
  const setUser = (userData: any) => {
    user.value = userData
    // Persist to localStorage
    if (process.client) {
      localStorage.setItem('gotravelnha_user', JSON.stringify(userData))
    }
  }

  const clearUser = () => {
    user.value = null
    // Remove from localStorage
    if (process.client) {
      localStorage.removeItem('gotravelnha_user')
    }
  }

  const isAuthenticated = computed(() => user.value !== null)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')
  const isUser = computed(() => user.value?.role === 'USER')

  return {
    user,
    setUser,
    clearUser,
    isAuthenticated,
    isAdmin,
    isUser
  }
}

