export interface DealComparisonOption {
  provider: 'trip' | 'klook'
  label: string
  priceNote: string
  highlight: string
  baseUrl: string
}

export interface DealPageTemplate {
  slug: string
  title: string
  description: string
  destination: string
  heroImage: string
  badge: string
  category: 'hotel' | 'flight' | 'activity'
  lastUpdatedLabel: string
  primaryProvider: 'trip' | 'klook'
  primaryCtaLabel: string
  primaryBaseUrl: string
  placementKey: string
  summaryBullets: string[]
  tips: string[]
  comparison: DealComparisonOption[]
}

export const DEAL_PAGE_TEMPLATES: DealPageTemplate[] = [
  {
    slug: 'singapore-universal-studios-deals',
    title: 'Universal Studios Singapore Deals',
    description: 'Compare Trip.com and Klook options for Universal Studios Singapore tickets, bundles, and same-week bookings.',
    destination: 'Singapore',
    heroImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=80',
    badge: 'High Intent',
    category: 'activity',
    lastUpdatedLabel: 'Updated weekly',
    primaryProvider: 'klook',
    primaryCtaLabel: 'Check Latest USS Price on Klook',
    primaryBaseUrl: 'https://www.klook.com/en-SG/activity/141-universal-studios-singapore/',
    placementKey: 'deal_template_uss_primary',
    summaryBullets: [
      'Best for families and first-time Singapore visitors.',
      'Strong conversion intent from attraction-ticket searches.',
      'Use this page in social posts and itinerary blog links.'
    ],
    tips: [
      'Weekday entries usually have shorter lines and better value bundles.',
      'Bundle Universal Studios with nearby attractions for higher cart value.',
      'Re-check price before publishing social content each week.'
    ],
    comparison: [
      {
        provider: 'klook',
        label: 'Klook',
        priceNote: 'Often best for instant-ticket mobile redemption',
        highlight: 'Great for activity bundles and promo codes',
        baseUrl: 'https://www.klook.com/en-SG/activity/141-universal-studios-singapore/'
      },
      {
        provider: 'trip',
        label: 'Trip.com',
        priceNote: 'Useful alternate option for users already booking hotels',
        highlight: 'Good cross-sell path with flights/hotels',
        baseUrl: 'https://sg.trip.com/travel-guide/attraction/singapore/universal-studios-singapore-88449/'
      }
    ]
  },
  {
    slug: 'singapore-weekend-hotel-deals',
    title: 'Singapore Weekend Hotel Deals',
    description: 'Trip-first hotel deal page for quick weekend planning with a secondary Klook comparison route.',
    destination: 'Singapore',
    heroImage: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1600&q=80',
    badge: 'Trip First',
    category: 'hotel',
    lastUpdatedLabel: 'Updated weekly',
    primaryProvider: 'trip',
    primaryCtaLabel: 'Check Live Hotel Rate on Trip.com',
    primaryBaseUrl: 'https://www.trip.com/hotels/',
    placementKey: 'deal_template_sg_hotel_trip_primary',
    summaryBullets: [
      'Built for high-intent users searching weekend hotel bookings.',
      'Trip.com is the primary conversion route for this page.',
      'Secondary comparison keeps trust and choice for users.'
    ],
    tips: [
      'Refresh this page before each weekend campaign push.',
      'Prioritize properties with strong cancellation policies.',
      'Use one destination + one booking intent per page.'
    ],
    comparison: [
      {
        provider: 'trip',
        label: 'Trip.com',
        priceNote: 'Primary deeplink for live hotel inventory',
        highlight: 'Best path for hotel-focused conversion',
        baseUrl: 'https://www.trip.com/hotels/'
      },
      {
        provider: 'klook',
        label: 'Klook',
        priceNote: 'Useful secondary option for activities and bundles',
        highlight: 'Complements hotel purchase intent',
        baseUrl: 'https://www.klook.com/'
      }
    ]
  }
]

export function getDealTemplateBySlug(slug: string): DealPageTemplate | null {
  return DEAL_PAGE_TEMPLATES.find((item) => item.slug === slug) || null
}

