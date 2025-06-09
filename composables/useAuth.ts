import { createAuth0Client } from '@auth0/auth0-spa-js'

let client

export async function useAuth() {
  const isClient = process.client
  const auth0 = useState('auth0', () => null)
  const user = useState('user', () => null)
  const isAuthenticated = useState('isAuthenticated', () => false)

  if (!isClient) {
    return {
      login: () => {},
      logout: () => {},
      isAuthenticated,
      user,
      handleRedirectCallback: async () => {}
    }
  }

  if (!auth0.value) {
    client = await createAuth0Client({
      domain: useRuntimeConfig().public.auth0Domain,
      clientId: useRuntimeConfig().public.auth0ClientId,
      authorizationParams: {
        redirect_uri: useRuntimeConfig().public.auth0RedirectUri
      }
    })

    auth0.value = client

    const isAuth = await client.isAuthenticated()
    isAuthenticated.value = isAuth

    if (isAuth) {
      user.value = await client.getUser()
    }
  }

  return {
    login: () => auth0.value.loginWithRedirect(),
    logout: () => auth0.value.logout({ returnTo: window.location.origin }),
    handleRedirectCallback: async () => {
        await auth0.value.handleRedirectCallback()
        isAuthenticated.value = await auth0.value.isAuthenticated()
        user.value = await auth0.value.getUser()
    },
    isAuthenticated,
    user
  }
}
