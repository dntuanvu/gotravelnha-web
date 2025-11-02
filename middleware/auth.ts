// General auth middleware - Protect user pages
export default defineNuxtRouteMiddleware((to, from) => {
  // Only run on client side
  if (process.server) return

  // Import composable to check auth
  const { isAuthenticated } = useAuthState()

  // If user is not authenticated, redirect to login
  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }
})

