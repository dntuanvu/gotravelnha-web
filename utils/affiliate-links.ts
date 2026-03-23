/**
 * Affiliate Link Utilities
 * Functions to append affiliate tracking parameters to platform URLs
 * Works both client-side and server-side
 */

/**
 * Append Klook affiliate ID to a Klook URL
 * @param url Original Klook URL
 * @param affiliateId Optional affiliate ID (pass from runtime config on client-side)
 * @returns URL with affiliate tracking parameter
 */
export function appendKlookAffiliateId(url: string, affiliateId?: string): string {
  if (!url) return url
  
  try {
    // Handle relative URLs
    if (url.startsWith('/')) {
      url = `https://www.klook.com${url}`
    }
    if (!url.startsWith('http')) {
      url = `https://${url}`
    }
    
    const urlObj = new URL(url)
    
    // Use provided affiliate ID, or try to get from env (server-side only)
    const aid = affiliateId || (typeof process !== 'undefined' && process.env ? (process.env.KLOOK_AD_ID || process.env.KLOOK_AFFILIATE_ID || '') : '')
    
    if (aid && !urlObj.searchParams.has('aid')) {
      urlObj.searchParams.set('aid', aid)
    }
    
    return urlObj.toString()
  } catch (error) {
    // If URL parsing fails, return original URL
    console.warn('Failed to parse URL for Klook affiliate tracking:', url, error)
    return url
  }
}

/**
 * Append Trip.com affiliate IDs to a Trip.com URL
 * @param url Original Trip.com URL
 * @param allianceId Optional alliance ID (defaults to env var)
 * @param sid Optional SID (defaults to env var)
 * @returns URL with affiliate tracking parameters
 */
export function appendTripAffiliateIds(url: string, allianceId?: string, sid?: string): string {
  if (!url) return url
  
  try {
    const urlObj = new URL(url)
    
    const alliance = allianceId || process.env.TRIP_ALLIANCE_ID
    const sId = sid || process.env.TRIP_SID
    
    if (alliance && !urlObj.searchParams.has('Allianceid')) {
      urlObj.searchParams.set('Allianceid', alliance)
    }
    if (sId && !urlObj.searchParams.has('SID')) {
      urlObj.searchParams.set('SID', sId)
    }
    
    return urlObj.toString()
  } catch (error) {
    console.warn('Failed to parse URL for Trip.com affiliate tracking:', url, error)
    return url
  }
}

/**
 * Generate affiliate link based on platform
 * @param url Original URL
 * @param platform Platform name (klook, trip, etc.)
 * @returns URL with appropriate affiliate tracking
 */
export function generateAffiliateLink(url: string, platform: string): string {
  if (!url) return url
  
  switch (platform.toLowerCase()) {
    case 'klook':
      return appendKlookAffiliateId(url)
    case 'trip':
    case 'trip.com':
      return appendTripAffiliateIds(url)
    case 'attractionsg':
      // AttractionsSG doesn't use affiliate tracking
      return url
    default:
      return url
  }
}
