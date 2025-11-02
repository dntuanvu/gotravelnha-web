import { computed } from 'vue'
import { useTripDeeplink } from './useTripDeeplink'

/**
 * Trip.com Promotion Campaign Management
 * 
 * Manages promotional campaigns including popular deals, seasonal promotions,
 * and special offers from Trip.com's affiliate program.
 */

export interface PromotionCampaign {
  id: string
  name: string
  type: 'hotel' | 'flight' | 'activity' | 'train' | 'car' | 'package' | 'generic'
  widgetUrl?: string           // If using widget from /partners/ad/
  salePageUrl?: string         // If using direct sale page URL
  promoReferer?: string        // Promo referer ID from Trip.com
  locale?: string              // Locale code (default: en-SG)
  currency?: string            // Currency code (default: SGD)
  params?: Record<string, string>  // Additional parameters
  title: string                // Display title
  description: string          // Display description
  icon?: string                // Emoji icon for display
  active: boolean              // Whether campaign is active
  startDate?: string           // Campaign start date (YYYY-MM-DD)
  endDate?: string             // Campaign end date (YYYY-MM-DD)
  priority: number             // Display priority (higher = shown first)
}

// Configuration for all promotional campaigns
// Update this configuration when new campaigns are available from Trip.com affiliate portal
const PROMOTION_CAMPAIGNS: PromotionCampaign[] = [
  {
    id: 'popular-flight-deals',
    name: 'Popular Flight Deals',
    type: 'flight',
    salePageUrl: 'https://sg.trip.com/sale/w/4747/flightrebate.html',
    promoReferer: '3371_4747_2',
    locale: 'en-SG',
    currency: 'SGD',
    params: {
      trip_sub3: 'P104257'
    },
    title: '🔥 Popular Flight Deals',
    description: 'Save more on your bookings! Get rebates on popular flights, powered by Trip.com.',
    icon: '🔥',
    active: false,  // Disabled - Promotion expired. Check Trip.com affiliate portal for new widget codes
    priority: 10
  },
  // Add more campaigns here as they become available
  // Example campaign structure:
  // {
  //   id: 'summer-hotel-sale',
  //   name: 'Summer Hotel Sale',
  //   type: 'hotel',
  //   widgetUrl: 'https://www.trip.com/partners/ad/WIDGET_CODE',
  //   title: '🏖️ Summer Hotel Deals',
  //   description: 'Up to 50% off on summer destinations',
  //   icon: '🏖️',
  //   active: true,
  //   startDate: '2025-06-01',
  //   endDate: '2025-08-31',
  //   priority: 9
  // }
]

export const useTripPromotions = () => {
  const { generateDeeplink } = useTripDeeplink()

  /**
   * Get all active promotions, optionally filtered
   */
  const getActivePromotions = (filters?: {
    type?: PromotionCampaign['type']
    limit?: number
  }) => {
    let promotions = PROMOTION_CAMPAIGNS.filter(c => c.active)

    // Filter by date if campaign has date range
    const now = new Date()
    promotions = promotions.filter(c => {
      if (c.startDate && new Date(c.startDate) > now) return false
      if (c.endDate && new Date(c.endDate) < now) return false
      return true
    })

    // Filter by type if specified
    if (filters?.type) {
      promotions = promotions.filter(c => c.type === filters.type)
    }

    // Sort by priority
    promotions.sort((a, b) => b.priority - a.priority)

    // Limit results if specified
    if (filters?.limit) {
      promotions = promotions.slice(0, filters.limit)
    }

    return promotions
  }

  /**
   * Generate promotion URL with tracking
   */
  const generatePromotionUrl = (campaignId: string): string => {
    const campaign = PROMOTION_CAMPAIGNS.find(c => c.id === campaignId)
    if (!campaign) {
      console.warn(`Campaign ${campaignId} not found`)
      return ''
    }

    // Generate base tracking URL
    const deeplink = generateDeeplink({
      type: campaign.type,
      params: {
        campaign: `promo-${campaignId}`
      }
    })

    const url = new URL(deeplink)
    const allianceId = url.searchParams.get('Allianceid')
    const sid = url.searchParams.get('SID')
    const campaignParam = url.searchParams.get('trip_campaign')

    // Build parameters
    const params = new URLSearchParams()
    if (campaign.locale) params.append('locale', campaign.locale)
    if (campaign.currency) params.append('curr', campaign.currency)
    if (campaign.promoReferer) params.append('promo_referer', campaign.promoReferer)
    params.append('Allianceid', allianceId || '')
    params.append('SID', sid || '')
    params.append('trip_campaign', campaignParam || '')
    
    // Add trip_sub1 (Alliance ID) if not already present
    if (!params.has('trip_sub1') && allianceId) {
      params.append('trip_sub1', allianceId)
    }

    // Add additional campaign-specific parameters
    if (campaign.params) {
      Object.entries(campaign.params).forEach(([key, value]) => {
        params.append(key, value)
      })
    }

    // Generate final URL based on campaign type
    if (campaign.widgetUrl) {
      // Widget URL format: https://www.trip.com/partners/ad/WIDGET_CODE
      return `${campaign.widgetUrl}?${params.toString()}`
    } else if (campaign.salePageUrl) {
      // Sale page URL format: https://sg.trip.com/sale/w/XXX/XXX.html
      return `${campaign.salePageUrl}?${params.toString()}`
    } else {
      // Fall back to generic deeplink
      return deeplink
    }
  }

  /**
   * Get promotion widget iframe URL
   */
  const getPromotionWidget = (campaignId: string) => {
    const campaign = PROMOTION_CAMPAIGNS.find(c => c.id === campaignId)
    if (!campaign) return null

    return {
      url: generatePromotionUrl(campaignId),
      title: campaign.title,
      description: campaign.description,
      icon: campaign.icon,
      config: campaign
    }
  }

  /**
   * Get featured promotions for display
   */
  const getFeaturedPromotions = computed(() => (limit: number = 3) => {
    return getActivePromotions({ limit })
  })

  /**
   * Check if a campaign is currently active
   */
  const isCampaignActive = (campaignId: string): boolean => {
    const campaign = PROMOTION_CAMPAIGNS.find(c => c.id === campaignId)
    if (!campaign || !campaign.active) return false

    const now = new Date()
    if (campaign.startDate && new Date(campaign.startDate) > now) return false
    if (campaign.endDate && new Date(campaign.endDate) < now) return false

    return true
  }

  /**
   * Get all campaigns (for admin/management)
   */
  const getAllCampaigns = () => {
    return PROMOTION_CAMPAIGNS
  }

  return {
    getActivePromotions,
    generatePromotionUrl,
    getPromotionWidget,
    getFeaturedPromotions,
    isCampaignActive,
    getAllCampaigns
  }
}

