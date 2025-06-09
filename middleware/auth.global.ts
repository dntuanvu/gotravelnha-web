// middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
    if (process.server) return // Don't run on server
  
    const { isAuthenticated, login } = await useAuth()
  
    if (to.meta.requiresAuth && !isAuthenticated.value) {
      return login()
    }
})  