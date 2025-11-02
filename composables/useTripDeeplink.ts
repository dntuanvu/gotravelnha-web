import { computed } from 'vue'

/**
 * Trip.com Deep Linking Utility
 * 
 * Generates context-aware affiliate deep links for Trip.com products
 * Based on Trip.com's deep linking tool at https://www.trip.com/partners/tools/deeplink
 */

// Import activity tracker for click tracking
import { useActivityTracker } from './useActivityTracker'

// Configuration - can be moved to environment variables later
const TRIP_CONFIG = {
  allianceId: '3883416',
  sid: '22874365',
  baseUrl: 'https://www.trip.com'
}

/**
 * Deep link parameter options
 */
export interface TripDeeplinkParams {
  // Hotel parameters
  destination?: string      // City name or code
  checkIn?: string          // YYYY-MM-DD format
  checkOut?: string         // YYYY-MM-DD format
  guests?: number           // Number of guests
  rooms?: number            // Number of rooms
  
  // Flight parameters
  departure?: string        // Departure airport/city code
  arrival?: string          // Arrival airport/city code
  departDate?: string       // YYYY-MM-DD format
  returnDate?: string       // YYYY-MM-DD format (optional for one-way)
  passengers?: number       // Number of passengers
  class?: 'economy' | 'business' | 'first'  // Cabin class
  
  // Activity parameters
  location?: string         // Activity location
  activity?: string         // Activity name
  date?: string             // YYYY-MM-DD format
  
  // Train parameters
  from?: string             // Departure station
  to?: string               // Arrival station
  trainDate?: string        // YYYY-MM-DD format
  
  // Car rental parameters
  pickup?: string           // Pickup location
  dropoff?: string          // Dropoff location
  carDate?: string          // Date
  
  // Tracking parameters
  campaign?: string         // Campaign identifier (e.g., 'homepage-cta', 'hotel-card')
  subId?: string            // Sub-identifier for A/B testing (e.g., 'variant-a')
  source?: string           // Traffic source (e.g., 'google', 'facebook')
  medium?: string           // Marketing medium (e.g., 'cpc', 'social')
  term?: string             // Search term or keyword
}

/**
 * Deep link types supported by Trip.com
 */
export type TripDeeplinkType = 
  | 'hotel' 
  | 'flight' 
  | 'activity' 
  | 'train' 
  | 'car' 
  | 'package' 
  | 'generic'

/**
 * Deep link generation options
 */
export interface TripDeeplinkOptions {
  type: TripDeeplinkType
  params?: TripDeeplinkParams
  /**
   * Whether to track the click event
   * @default true
   */
  track?: boolean
}

export const useTripDeeplink = () => {
  const { trackClick } = useActivityTracker()

  /**
   * Generate a Trip.com affiliate deep link
   * 
   * @param options Deep link generation options
   * @returns Complete Trip.com affiliate URL
   * 
   * @example
   * ```typescript
   * const link = generateDeeplink({
   *   type: 'hotel',
   *   params: {
   *     destination: 'Singapore',
   *     checkIn: '2025-12-01',
   *     checkOut: '2025-12-05',
   *     campaign: 'homepage-deals'
   *   }
   * })
   * // Returns: https://www.trip.com/hotels/list?city=Singapore&checkIn=2025-12-01&checkOut=2025-12-05&Allianceid=3883416&SID=22874365&trip_campaign=homepage-deals
   * ```
   */
  const generateDeeplink = (options: TripDeeplinkOptions): string => {
    const { type, params = {} } = options
    const config = useRuntimeConfig()
    
    // Use runtime config if available, otherwise use default
    const allianceId = config.public?.TRIP_ALLIANCE_ID || TRIP_CONFIG.allianceId
    const sid = config.public?.TRIP_SID || TRIP_CONFIG.sid
    const baseUrl = config.public?.TRIP_BASE_URL || TRIP_CONFIG.baseUrl

    // Build base URL based on type
    let url = ''
    
    switch (type) {
      case 'hotel':
        url = `${baseUrl}/hotels/list`
        if (params.destination) {
          url += `?city=${encodeURIComponent(params.destination)}`
        }
        if (params.checkIn) {
          const separator = url.includes('?') ? '&' : '?'
          url += `${separator}checkIn=${encodeURIComponent(params.checkIn)}`
        }
        if (params.checkOut) {
          const separator = url.includes('?') ? '&' : '?'
          url += `${separator}checkOut=${encodeURIComponent(params.checkOut)}`
        }
        if (params.guests) {
          const separator = url.includes('?') ? '&' : '?'
          url += `${separator}adultNum=${params.guests}`
        }
        if (params.rooms) {
          const separator = url.includes('?') ? '&' : '?'
          url += `${separator}roomNum=${params.rooms}`
        }
        break
      
      case 'flight':
        url = `${baseUrl}/flights`
        const flightParams: string[] = []
        if (params.departure) flightParams.push(`departure=${encodeURIComponent(params.departure)}`)
        if (params.arrival) flightParams.push(`arrival=${encodeURIComponent(params.arrival)}`)
        if (params.departDate) flightParams.push(`date=${encodeURIComponent(params.departDate)}`)
        if (params.returnDate) flightParams.push(`returnDate=${encodeURIComponent(params.returnDate)}`)
        if (params.passengers) flightParams.push(`passengers=${params.passengers}`)
        if (params.class) flightParams.push(`cabinClass=${params.class}`)
        
        if (flightParams.length > 0) {
          url += '?' + flightParams.join('&')
        }
        break
      
      case 'activity':
        url = `${baseUrl}/wow/activities/list`
        if (params.destination || params.location) {
          const dest = params.destination || params.location
          url += `?dest=${encodeURIComponent(dest!)}`
        }
        if (params.activity) {
          const separator = url.includes('?') ? '&' : '?'
          url += `${separator}keyword=${encodeURIComponent(params.activity)}`
        }
        break
      
      case 'train':
        url = `${baseUrl}/trains/list`
        if (params.from || params.to) {
          url += '?'
          if (params.from) url += `from=${encodeURIComponent(params.from)}`
          if (params.to) {
            if (params.from) url += '&'
            url += `to=${encodeURIComponent(params.to)}`
          }
        }
        break
      
      case 'car':
        url = `${baseUrl}/cars/list`
        if (params.pickup) {
          url += `?pickup=${encodeURIComponent(params.pickup)}`
        }
        if (params.dropoff) {
          const separator = url.includes('?') ? '&' : '?'
          url += `${separator}dropoff=${encodeURIComponent(params.dropoff)}`
        }
        break
      
      case 'package':
        url = `${baseUrl}/vacation-packages/list`
        if (params.destination) {
          url += `?dest=${encodeURIComponent(params.destination)}`
        }
        break
      
      case 'generic':
      default:
        url = baseUrl
        break
    }

    // Add affiliate tracking parameters
    const separator = url.includes('?') ? '&' : '?'
    url += `${separator}Allianceid=${allianceId}&SID=${sid}`

    // Add custom tracking parameters
    if (params.campaign) {
      url += `&trip_campaign=${encodeURIComponent(params.campaign)}`
    }
    if (params.subId) {
      url += `&trip_sub1=${encodeURIComponent(params.subId)}`
    }
    if (params.source) {
      url += `&utm_source=${encodeURIComponent(params.source)}`
    }
    if (params.medium) {
      url += `&utm_medium=${encodeURIComponent(params.medium)}`
    }
    if (params.term) {
      url += `&utm_term=${encodeURIComponent(params.term)}`
    }

    return url
  }

  /**
   * Track a Trip.com deeplink click
   * 
   * @param link The generated deep link
   * @param campaign Campaign identifier
   */
  const trackDeeplinkClick = (link: string, campaign?: string) => {
    trackClick('trip_deeplink', {
      campaign: campaign || 'untracked',
      destination: link,
      platform: 'trip.com'
    })
  }

  /**
   * Generate a deep link and open it in a new tab
   * Automatically tracks the click event
   * 
   * @param options Deep link generation options
   */
  const openDeeplink = (options: TripDeeplinkOptions) => {
    const link = generateDeeplink(options)
    
    if (options.track !== false) {
      trackDeeplinkClick(link, options.params?.campaign)
    }
    
    window.open(link, '_blank', 'noopener,noreferrer')
  }

  /**
   * Get common deep link templates
   * Useful for quick access to frequently used configurations
   */
  const getCommonTemplates = computed(() => ({
    hotelSearch: (destination?: string) => generateDeeplink({
      type: 'hotel',
      params: { destination, campaign: 'common_hotel_search' }
    }),
    
    flightSearch: (departure?: string, arrival?: string) => generateDeeplink({
      type: 'flight',
      params: { departure, arrival, campaign: 'common_flight_search' }
    }),
    
    activitySearch: (destination?: string) => generateDeeplink({
      type: 'activity',
      params: { destination, campaign: 'common_activity_search' }
    }),
    
    genericBooking: (campaign: string) => generateDeeplink({
      type: 'generic',
      params: { campaign }
    })
  }))

  return {
    generateDeeplink,
    trackDeeplinkClick,
    openDeeplink,
    getCommonTemplates,
    config: TRIP_CONFIG
  }
}

