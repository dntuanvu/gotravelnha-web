import { ref, computed } from 'vue'
import { useTripDeeplink } from './useTripDeeplink'

/**
 * Campaign Manager
 * 
 * Manages A/B testing, campaign variants, and performance tracking
 */

// Campaign configuration
interface CampaignConfig {
  id: string
  name: string
  description?: string
  variants: CampaignVariant[]
  trafficAllocation?: number  // Percentage (0-100)
  active?: boolean
}

interface CampaignVariant {
  id: string
  name: string
  allocation: number  // Percentage of traffic for this variant
  params: any  // Deeplink parameters
  metadata?: {
    description?: string
    cta?: string
    color?: string
  }
}

interface CampaignResult {
  campaignId: string
  variantId: string
  clicks: number
  impressions: number
  conversions: number
  revenue?: number
  startDate: string
  lastUpdated: string
}

export const useCampaignManager = () => {
  const { generateDeeplink } = useTripDeeplink()
  
  // Store campaign configurations
  const campaignConfigs = ref<Map<string, CampaignConfig>>(new Map())
  
  // Store performance results
  const campaignResults = ref<Map<string, Map<string, CampaignResult>>>(new Map())
  
  /**
   * Register a new campaign
   * 
   * @example
   * ```typescript
   * registerCampaign({
   *   id: 'homepage-hero-cta',
   *   name: 'Homepage Hero CTA Test',
   *   description: 'Testing CTA button colors',
   *   variants: [
   *     { id: 'blue', name: 'Blue Button', allocation: 50, params: { campaign: 'homepage-hero-blue' } },
   *     { id: 'green', name: 'Green Button', allocation: 50, params: { campaign: 'homepage-hero-green' } }
   *   ],
   *   active: true
   * })
   * ```
   */
  const registerCampaign = (config: CampaignConfig) => {
    // Validate allocation percentages
    const totalAllocation = config.variants.reduce((sum, v) => sum + v.allocation, 0)
    if (totalAllocation !== 100) {
      console.warn(`⚠️ Campaign ${config.id}: Variant allocations total ${totalAllocation}%, not 100%`)
    }
    
    campaignConfigs.value.set(config.id, {
      ...config,
      active: config.active !== false,
      trafficAllocation: config.trafficAllocation ?? 100
    })
    
    console.log(`✅ Campaign registered: ${config.name} (${config.id})`)
  }

  /**
   * Get active variant for a campaign
   * Determines which variant a user sees based on allocation
   * 
   * @param campaignId Campaign identifier
   * @returns Selected variant ID and parameters
   */
  const getActiveVariant = (campaignId: string) => {
    const config = campaignConfigs.value.get(campaignId)
    
    if (!config || !config.active) {
      console.warn(`⚠️ Campaign ${campaignId} not found or inactive`)
      return null
    }
    
    // Check traffic allocation
    const shouldShow = Math.random() * 100 < (config.trafficAllocation || 100)
    if (!shouldShow) {
      return null
    }
    
    // Select variant based on allocation
    const random = Math.random() * 100
    let cumulative = 0
    
    for (const variant of config.variants) {
      cumulative += variant.allocation
      if (random <= cumulative) {
        // Track impression
        trackImpression(campaignId, variant.id)
        
        return {
          variantId: variant.id,
          params: variant.params,
          metadata: variant.metadata
        }
      }
    }
    
    // Fallback to first variant
    const firstVariant = config.variants[0]
    trackImpression(campaignId, firstVariant.id)
    
    return {
      variantId: firstVariant.id,
      params: firstVariant.params,
      metadata: firstVariant.metadata
    }
  }

  /**
   * Generate deep link for a campaign variant
   * 
   * @param campaignId Campaign identifier
   * @param type Deeplink type
   * @param additionalParams Additional parameters to merge
   * @returns Deep link URL or null
   */
  const getCampaignDeeplink = (
    campaignId: string,
    type: 'hotel' | 'flight' | 'activity' | 'train' | 'car' | 'package' | 'generic',
    additionalParams?: any
  ): string | null => {
    const variant = getActiveVariant(campaignId)
    
    if (!variant) {
      return null
    }
    
    // Merge variant params with additional params
    const params = {
      ...variant.params,
      ...additionalParams,
      // Add variant ID for tracking
      subId: variant.variantId
    }
    
    return generateDeeplink({ type, params })
  }

  /**
   * Track campaign impression
   */
  const trackImpression = (campaignId: string, variantId: string) => {
    if (!campaignResults.value.has(campaignId)) {
      campaignResults.value.set(campaignId, new Map())
    }
    
    const variantResults = campaignResults.value.get(campaignId)!
    
    if (!variantResults.has(variantId)) {
      variantResults.set(variantId, {
        campaignId,
        variantId,
        clicks: 0,
        impressions: 0,
        conversions: 0,
        startDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      })
    }
    
    const result = variantResults.get(variantId)!
    result.impressions++
    result.lastUpdated = new Date().toISOString()
    
    // Store in localStorage for persistence
    saveResultsToStorage()
  }

  /**
   * Track campaign click
   */
  const trackClick = (campaignId: string, variantId: string) => {
    if (!campaignResults.value.has(campaignId)) {
      return
    }
    
    const variantResults = campaignResults.value.get(campaignId)!
    const result = variantResults.get(variantId)
    
    if (result) {
      result.clicks++
      result.lastUpdated = new Date().toISOString()
      saveResultsToStorage()
    }
  }

  /**
   * Track campaign conversion
   */
  const trackConversion = (campaignId: string, variantId: string, revenue?: number) => {
    if (!campaignResults.value.has(campaignId)) {
      return
    }
    
    const variantResults = campaignResults.value.get(campaignId)!
    const result = variantResults.get(variantId)
    
    if (result) {
      result.conversions++
      if (revenue) {
        result.revenue = (result.revenue || 0) + revenue
      }
      result.lastUpdated = new Date().toISOString()
      saveResultsToStorage()
    }
  }

  /**
   * Get campaign performance metrics
   */
  const getCampaignMetrics = (campaignId: string) => {
    const config = campaignConfigs.value.get(campaignId)
    const variantResults = campaignResults.value.get(campaignId)
    
    if (!config || !variantResults) {
      return null
    }
    
    const metrics = {
      campaign: config,
      variants: [] as any[]
    }
    
    for (const [variantId, result] of variantResults) {
      const variant = config.variants.find(v => v.id === variantId)
      
      if (variant) {
        const ctr = result.impressions > 0 ? (result.clicks / result.impressions * 100).toFixed(2) : '0.00'
        const conversionRate = result.clicks > 0 ? (result.conversions / result.clicks * 100).toFixed(2) : '0.00'
        
        metrics.variants.push({
          ...variant,
          ...result,
          ctr: `${ctr}%`,
          conversionRate: `${conversionRate}%`,
          revenue: result.revenue || 0
        })
      }
    }
    
    return metrics
  }

  /**
   * Get all campaign metrics
   */
  const getAllMetrics = () => {
    const allMetrics: any[] = []
    
    for (const campaignId of campaignConfigs.value.keys()) {
      const metrics = getCampaignMetrics(campaignId)
      if (metrics) {
        allMetrics.push(metrics)
      }
    }
    
    return allMetrics
  }

  /**
   * Save results to localStorage for persistence across sessions
   */
  const saveResultsToStorage = () => {
    if (typeof window === 'undefined') return
    
    try {
      const dataToSave: any = {}
      for (const [campaignId, variantResults] of campaignResults.value) {
        dataToSave[campaignId] = {}
        for (const [variantId, result] of variantResults) {
          dataToSave[campaignId][variantId] = result
        }
      }
      localStorage.setItem('campaign_results', JSON.stringify(dataToSave))
    } catch (error) {
      console.error('Error saving campaign results:', error)
    }
  }

  /**
   * Load results from localStorage
   */
  const loadResultsFromStorage = () => {
    if (typeof window === 'undefined') return
    
    try {
      const stored = localStorage.getItem('campaign_results')
      if (stored) {
        const data = JSON.parse(stored)
        for (const [campaignId, variantData] of Object.entries(data)) {
          const variantResults = new Map<string, CampaignResult>()
          for (const [variantId, result] of Object.entries(variantData)) {
            variantResults.set(variantId, result as CampaignResult)
          }
          campaignResults.value.set(campaignId, variantResults)
        }
        console.log('✅ Loaded campaign results from storage')
      }
    } catch (error) {
      console.error('Error loading campaign results:', error)
    }
  }

  /**
   * Clear all campaign results
   */
  const clearResults = () => {
    campaignResults.value.clear()
    if (typeof window !== 'undefined') {
      localStorage.removeItem('campaign_results')
    }
    console.log('🗑️ Campaign results cleared')
  }

  /**
   * Get winning variant for a campaign
   */
  const getWinningVariant = (campaignId: string) => {
    const metrics = getCampaignMetrics(campaignId)
    
    if (!metrics || metrics.variants.length === 0) {
      return null
    }
    
    // Find variant with highest conversion rate
    let winner = metrics.variants[0]
    let highestRate = parseFloat(winner.conversionRate)
    
    for (const variant of metrics.variants.slice(1)) {
      const rate = parseFloat(variant.conversionRate)
      if (rate > highestRate) {
        highestRate = rate
        winner = variant
      }
    }
    
    return winner
  }

  // Load results on initialization
  if (typeof window !== 'undefined') {
    loadResultsFromStorage()
  }

  return {
    registerCampaign,
    getActiveVariant,
    getCampaignDeeplink,
    trackImpression,
    trackClick,
    trackConversion,
    getCampaignMetrics,
    getAllMetrics,
    clearResults,
    getWinningVariant
  }
}

