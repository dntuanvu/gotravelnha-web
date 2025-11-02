import { ref } from 'vue'
import { useActivityTracker } from './useActivityTracker'

/**
 * Conversion Tracker
 * 
 * Tracks conversions (bookings, signups, etc.) from Trip.com affiliate links
 */

interface Conversion {
  id: string
  campaign: string
  platform: string
  type: string
  value?: number
  currency?: string
  timestamp: string
  sessionId: string
  metadata?: any
}

export const useConversionTracker = () => {
  const { sessionId, trackActivity } = useActivityTracker()
  
  const conversions = ref<Conversion[]>([])
  
  /**
   * Track a conversion event
   * 
   * @param type Conversion type (e.g., 'hotel_booking', 'flight_booking')
   * @param value Conversion value in dollars
   * @param campaign Campaign ID
   * @param metadata Additional metadata
   * 
   * @example
   * ```typescript
   * trackConversion('hotel_booking', 250, 'homepage-hero-hotel', {
   *   hotelName: 'Marina Bay Sands',
   *   nights: 3
   * })
   * ```
   */
  const trackConversion = (
    type: string,
    value?: number,
    campaign?: string,
    metadata?: any
  ) => {
    const conversion: Conversion = {
      id: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
      campaign: campaign || 'unknown',
      platform: 'trip.com',
      type,
      value,
      currency: 'SGD',
      timestamp: new Date().toISOString(),
      sessionId: sessionId.value,
      metadata
    }
    
    conversions.value.push(conversion)
    
    // Track in activity tracker
    trackActivity({
      sessionId: sessionId.value,
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      action: 'conversion',
      data: conversion
    })
    
    // Save to localStorage
    saveConversions()
    
    // Send to analytics (if configured)
    sendToAnalytics(conversion)
    
    console.log('✅ Conversion tracked:', conversion)
  }

  /**
   * Track hotel booking conversion
   */
  const trackHotelBooking = (value: number, campaign?: string, metadata?: any) => {
    trackConversion('hotel_booking', value, campaign, {
      platform: 'trip.com',
      category: 'accommodation',
      ...metadata
    })
  }

  /**
   * Track flight booking conversion
   */
  const trackFlightBooking = (value: number, campaign?: string, metadata?: any) => {
    trackConversion('flight_booking', value, campaign, {
      platform: 'trip.com',
      category: 'transportation',
      ...metadata
    })
  }

  /**
   * Track activity booking conversion
   */
  const trackActivityBooking = (value: number, campaign?: string, metadata?: any) => {
    trackConversion('activity_booking', value, campaign, {
      platform: 'trip.com',
      category: 'experience',
      ...metadata
    })
  }

  /**
   * Get conversion statistics
   */
  const getConversionStats = () => {
    const totalConversions = conversions.value.length
    const totalValue = conversions.value.reduce((sum, c) => sum + (c.value || 0), 0)
    
    // Group by type
    const byType: { [key: string]: number } = {}
    conversions.value.forEach(c => {
      byType[c.type] = (byType[c.type] || 0) + 1
    })
    
    // Group by campaign
    const byCampaign: { [key: string]: { count: number, value: number } } = {}
    conversions.value.forEach(c => {
      if (!byCampaign[c.campaign]) {
        byCampaign[c.campaign] = { count: 0, value: 0 }
      }
      byCampaign[c.campaign].count++
      byCampaign[c.campaign].value += c.value || 0
    })
    
    return {
      totalConversions,
      totalValue,
      averageValue: totalConversions > 0 ? (totalValue / totalConversions).toFixed(2) : 0,
      byType,
      byCampaign,
      conversions: conversions.value
    }
  }

  /**
   * Get conversions for a specific campaign
   */
  const getCampaignConversions = (campaign: string) => {
    return conversions.value.filter(c => c.campaign === campaign)
  }

  /**
   * Send conversion to analytics services
   */
  const sendToAnalytics = (conversion: Conversion) => {
    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('event', 'purchase', {
        'transaction_id': conversion.id,
        'value': conversion.value,
        'currency': conversion.currency,
        'campaign': conversion.campaign,
        'platform': conversion.platform,
        'event_category': conversion.type
      })
    }
    
    // Facebook Pixel (if configured)
    if (typeof window !== 'undefined' && (window as any).fbq) {
      ;(window as any).fbq('track', 'Purchase', {
        content_name: conversion.type,
        content_category: 'Travel',
        value: conversion.value,
        currency: conversion.currency
      })
    }
    
    // Custom analytics endpoint
    // You can configure this to send to your own analytics backend
    if (typeof window !== 'undefined' && process.env.NUXT_PUBLIC_ANALYTICS_URL) {
      fetch(process.env.NUXT_PUBLIC_ANALYTICS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(conversion)
      }).catch(error => {
        console.error('Analytics tracking failed:', error)
      })
    }
  }

  /**
   * Save conversions to localStorage
   */
  const saveConversions = () => {
    if (typeof window === 'undefined') return
    
    try {
      const dataToSave = conversions.value.slice(-1000) // Keep last 1000 conversions
      localStorage.setItem('conversions', JSON.stringify(dataToSave))
    } catch (error) {
      console.error('Error saving conversions:', error)
    }
  }

  /**
   * Load conversions from localStorage
   */
  const loadConversions = () => {
    if (typeof window === 'undefined') return
    
    try {
      const stored = localStorage.getItem('conversions')
      if (stored) {
        const data = JSON.parse(stored)
        conversions.value = data
        console.log(`✅ Loaded ${data.length} conversions from storage`)
      }
    } catch (error) {
      console.error('Error loading conversions:', error)
    }
  }

  /**
   * Clear all conversions
   */
  const clearConversions = () => {
    conversions.value = []
    if (typeof window !== 'undefined') {
      localStorage.removeItem('conversions')
    }
    console.log('🗑️ Conversions cleared')
  }

  // Load conversions on initialization
  if (typeof window !== 'undefined') {
    loadConversions()
  }

  return {
    trackConversion,
    trackHotelBooking,
    trackFlightBooking,
    trackActivityBooking,
    getConversionStats,
    getCampaignConversions,
    clearConversions,
    conversions: conversions.value
  }
}

