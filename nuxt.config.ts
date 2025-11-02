// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: { enabled: true },
    modules: ['@nuxtjs/tailwindcss'],
    css: ['@/assets/css/tailwind.css'],
    app: {
        head: {
          title: 'Go Travel Nha | Compare and Find best deals across platforms.',
          meta: [
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { name: 'description', content: 'Compare and book top flight, hotel and attraction deals across platforms.' },
    
            // Social: Open Graph (Facebook, WhatsApp)
            { property: 'og:title', content: 'Go Travel Nha ✈️ | 🏨' },
            { property: 'og:description', content: 'Compare and book top flight, hotel and attraction deals across platforms.' },
            { property: 'og:image', content: 'https://storage.googleapis.com/travella_assets_images/app_icon.png' },
            { property: 'og:url', content: 'https://gotravelnha.com/' },
            { property: 'og:type', content: 'website' },
    
            // Social: Twitter
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:title', content: 'Go Travel Nha ✈️🏨' },
            { name: 'twitter:description', content: 'Compare and book top flight, hotel and attraction deals across platforms.' },
            { name: 'twitter:image', content: 'https://storage.googleapis.com/travella_assets_images/app_icon.png' }
          ],
          link: [
            { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
            { rel: 'icon', type: 'image/png', href: 'https://storage.googleapis.com/travella_assets_images/favicon.png' },
            { rel: 'apple-touch-icon', href: '/apple-touch-icon.svg' }
          ]
        }
    },
    runtimeConfig: {
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_PORT: process.env.SMTP_PORT,
      SMTP_USER: process.env.SMTP_USER,
      SMTP_PASS: process.env.SMTP_PASS,
      ATTRACTIONSG_EMAIL: process.env.ATTRACTIONSG_EMAIL,
      ATTRACTIONSG_PASSWORD: process.env.ATTRACTIONSG_PASSWORD,
      public: {
        exchangeApiKey: process.env.EXCHANGE_API_KEY,
        apiBase: process.env.NUXT_PUBLIC_API_BASE,
        auth0Domain: process.env.AUTH0_DOMAIN,
        auth0ClientId: process.env.AUTH0_CLIENT_ID,
        auth0RedirectUri: process.env.AUTH0_REDIRECT_URI
      }
    }  
})
  