// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: { enabled: true },
    modules: ['@nuxtjs/tailwindcss'],
    css: ['@/assets/css/tailwind.css'],
    app: {
        head: {
          title: 'GoVietHub - Discover, Compare & Book Travel Deals | Trip.com, Klook & More',
          htmlAttrs: {
            lang: 'en'
          },
          meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { name: 'description', content: 'Compare and book the best travel deals across Trip.com, Klook, and Singapore Attractions. Save on flights, hotels, activities, and attractions. Your all-in-one travel platform.' },
            { name: 'keywords', content: 'travel deals, compare travel prices, trip.com deals, klook deals, vietnam travel, singapore attractions, hotel bookings, flight bookings, travel comparison' },
            { name: 'author', content: 'GoVietHub' },
            { name: 'robots', content: 'index, follow' },
            { name: 'language', content: 'English' },
            { name: 'revisit-after', content: '7 days' },
    
            // Social: Open Graph (Facebook, WhatsApp)
            { property: 'og:title', content: 'GoVietHub - Discover, Compare & Book Travel Deals' },
            { property: 'og:description', content: 'Compare and book the best travel deals across Trip.com, Klook, and Singapore Attractions. Save on flights, hotels, activities, and more.' },
            { property: 'og:image', content: '/favicon.svg' },
            { property: 'og:url', content: 'https://gotravelnha.com/' },
            { property: 'og:type', content: 'website' },
            { property: 'og:site_name', content: 'GoVietHub' },
            { property: 'og:locale', content: 'en_US' },
    
            // Social: Twitter
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:title', content: 'GoVietHub - Discover, Compare & Book Travel Deals' },
            { name: 'twitter:description', content: 'Compare and book the best travel deals across Trip.com, Klook, and Singapore Attractions.' },
            { name: 'twitter:image', content: '/favicon.svg' },
            { name: 'twitter:site', content: '@GoVietHub' }
          ],
          link: [
            { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
            { rel: 'icon', type: 'image/png', href: '/favicon.svg' },
            { rel: 'apple-touch-icon', href: '/apple-touch-icon.svg' },
            { rel: 'canonical', href: 'https://gotravelnha.com/' }
          ],
          script: [
            {
              type: 'application/ld+json',
              children: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'TravelAgency',
                name: 'GoVietHub',
                alternateName: 'GoTravelNha',
                url: 'https://gotravelnha.com',
                logo: '/favicon.svg',
                description: 'Compare and book the best travel deals across Trip.com, Klook, and Singapore Attractions',
                sameAs: [],
                contactPoint: {
                  '@type': 'ContactPoint',
                  contactType: 'Customer Service',
                  availableLanguage: ['English', 'Vietnamese']
                },
                areaServed: 'Worldwide',
                offers: {
                  '@type': 'AggregateOffer',
                  priceCurrency: 'USD'
                }
              })
            }
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
      ATTRACTIONSG_BACKGROUND_SYNC: process.env.ATTRACTIONSG_BACKGROUND_SYNC,
      ATTRACTIONSG_SYNC_INTERVAL: process.env.ATTRACTIONSG_SYNC_INTERVAL,
      ATTRACTIONSG_CRAWLER_WEBHOOK: process.env.ATTRACTIONSG_CRAWLER_WEBHOOK,
      ATTRACTIONSG_CRAWLER_WEBHOOK_SECRET: process.env.ATTRACTIONSG_CRAWLER_WEBHOOK_SECRET,
      ATTRACTIONSG_CRAWL_ENABLED: process.env.ATTRACTIONSG_CRAWL_ENABLED,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
      SELF_BOOKING_NOTIFY_EMAIL: process.env.SELF_BOOKING_NOTIFY_EMAIL || process.env.SMTP_USER,
      public: {
        exchangeApiKey: process.env.EXCHANGE_API_KEY,
        apiBase: process.env.NUXT_PUBLIC_API_BASE,
        auth0Domain: process.env.AUTH0_DOMAIN,
        auth0ClientId: process.env.AUTH0_CLIENT_ID,
        auth0RedirectUri: process.env.AUTH0_REDIRECT_URI,
        TRIP_ALLIANCE_ID: process.env.TRIP_ALLIANCE_ID || '3883416',
        TRIP_SID: process.env.TRIP_SID || '22874365',
        TRIP_BASE_URL: process.env.TRIP_BASE_URL || 'https://www.trip.com',
        STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
        siteUrl: process.env.NUXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://gotravelnha.com'
      }
    }  
})
  