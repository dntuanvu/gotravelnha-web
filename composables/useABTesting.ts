import { ref, computed } from 'vue'
import { useTripDeeplink } from './useTripDeeplink'

/**
 * A/B Testing Framework
 * 
 * Simplified A/B testing specifically for Trip.com deep links
 */

interface ABTestConfig {
  name: string
  control: {
    campaign: string
    params?: any
  }
  variant: {
    campaign: string
    params?: any
  }
  split?: number  // Percentage for variant (default: 50)
  active?: boolean
}

export const useABTesting = () => {
  const { generateDeeplink } = useTripDeeplink()
  
  // Store test configurations
  const tests = ref<Map<string, ABTestConfig>>(new Map())
  
  // Store results
  const results = ref<Map<string, any>>(new Map())

  /**
   * Register an A/B test
   * 
   * @example
   * ```typescript
   * registerTest('homepage-hero', {
   *   name: 'Homepage Hero CTA Test',
   *   control: { campaign: 'homepage-hero-blue' },
   *   variant: { campaign: 'homepage-hero-green' },
   *   split: 50  // 50% variant, 50% control
   * })
   * ```
   */
  const registerTest = (testId: string, config: ABTestConfig) => {
    tests.value.set(testId, {
      ...config,
      split: config.split ?? 50,
      active: config.active !== false
    })
    console.log(`✅ A/B Test registered: ${config.name}`)
  }

  /**
   * Get the link for current test
   * Randomly assigns user to control or variant based on split
   * 
   * @param testId Test identifier
   * @param type Deeplink type
   * @returns Deep link URL
   */
  const getTestLink = (
    testId: string,
    type: 'hotel' | 'flight' | 'activity' | 'train' | 'car' | 'package' | 'generic'
  ): string | null => {
    const test = tests.value.get(testId)
    
    if (!test || !test.active) {
      return null
    }
    
    // Determine if user should see variant
    const isVariant = Math.random() * 100 < test.split
    const group = isVariant ? 'variant' : 'control'
    
    // Track assignment
    trackAssignment(testId, group)
    
    // Generate link
    const config = isVariant ? test.variant : test.control
    return generateDeeplink({
      type,
      params: {
        ...config.params,
        campaign: config.campaign,
        subId: group
      }
    })
  }

  /**
   * Track assignment to control or variant
   */
  const trackAssignment = (testId: string, group: 'control' | 'variant') => {
    if (!results.value.has(testId)) {
      results.value.set(testId, {
        control: { assignments: 0, clicks: 0 },
        variant: { assignments: 0, clicks: 0 }
      })
    }
    
    const result = results.value.get(testId)
    result[group].assignments++
    
    // Save to storage
    saveResults()
  }

  /**
   * Track click for a test group
   */
  const trackClick = (testId: string, group: 'control' | 'variant') => {
    const result = results.value.get(testId)
    if (result && result[group]) {
      result[group].clicks++
      saveResults()
    }
  }

  /**
   * Get test results
   */
  const getTestResults = (testId: string) => {
    const test = tests.value.get(testId)
    const result = results.value.get(testId)
    
    if (!test || !result) return null
    
    const controlCTR = result.control.assignments > 0
      ? (result.control.clicks / result.control.assignments * 100).toFixed(2)
      : '0.00'
    
    const variantCTR = result.variant.assignments > 0
      ? (result.variant.clicks / result.variant.assignments * 100).toFixed(2)
      : '0.00'
    
    const improvement = result.control.clicks > 0
      ? (((result.variant.clicks - result.control.clicks) / result.control.clicks) * 100).toFixed(2)
      : '0.00'
    
    return {
      test,
      results: {
        control: {
          ...result.control,
          ctr: `${controlCTR}%`
        },
        variant: {
          ...result.variant,
          ctr: `${variantCTR}%`
        },
        improvement: `${improvement}%`,
        winner: parseFloat(variantCTR) > parseFloat(controlCTR) ? 'variant' : 'control'
      }
    }
  }

  /**
   * Get all test results
   */
  const getAllResults = () => {
    const allResults: any[] = []
    
    for (const testId of tests.value.keys()) {
      const testResult = getTestResults(testId)
      if (testResult) {
        allResults.push({
          testId,
          ...testResult
        })
      }
    }
    
    return allResults
  }

  /**
   * Save results to localStorage
   */
  const saveResults = () => {
    if (typeof window === 'undefined') return
    
    try {
      const dataToSave: any = {}
      for (const [testId, result] of results.value) {
        dataToSave[testId] = result
      }
      localStorage.setItem('ab_test_results', JSON.stringify(dataToSave))
    } catch (error) {
      console.error('Error saving A/B test results:', error)
    }
  }

  /**
   * Load results from localStorage
   */
  const loadResults = () => {
    if (typeof window === 'undefined') return
    
    try {
      const stored = localStorage.getItem('ab_test_results')
      if (stored) {
        const data = JSON.parse(stored)
        for (const [testId, result] of Object.entries(data)) {
          results.value.set(testId, result)
        }
        console.log('✅ Loaded A/B test results from storage')
      }
    } catch (error) {
      console.error('Error loading A/B test results:', error)
    }
  }

  /**
   * Clear all results
   */
  const clearResults = () => {
    results.value.clear()
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ab_test_results')
    }
    console.log('🗑️ A/B test results cleared')
  }

  // Load results on initialization
  if (typeof window !== 'undefined') {
    loadResults()
  }

  return {
    registerTest,
    getTestLink,
    trackAssignment,
    trackClick,
    getTestResults,
    getAllResults,
    clearResults
  }
}

