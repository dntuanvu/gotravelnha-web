// Admin route middleware - Protect admin pages
export default defineNuxtRouteMiddleware((to, from) => {
  // Only run on client side
  if (process.server) return

  // Import composable to check auth
  const { isAuthenticated, isAdmin } = useAuthState()

  // If user is not authenticated, redirect to login
  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }

  // If user is not admin, redirect to user portal
  if (!isAdmin.value) {
    return navigateTo('/user')
  }
})

