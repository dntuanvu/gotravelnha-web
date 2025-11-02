import { ref, computed } from 'vue'
import { useCampaignManager } from './useCampaignManager'
import { useABTesting } from './useABTesting'
import { useConversionTracker } from './useConversionTracker'

/**
 * Trip.com Analytics Dashboard
 * 
 * Aggregates data from all tracking systems for comprehensive analytics
 */

export const useTripAnalytics = () => {
  const { getAllMetrics } = useCampaignManager()
  const { getAllResults } = useABTesting()
  const { getConversionStats } = useConversionTracker()

  /**
   * Get comprehensive analytics dashboard data
   */
  const getDashboardData = computed(() => {
    const campaignMetrics = getAllMetrics()
    const abTestResults = getAllResults()
    const conversionStats = getConversionStats()

    // Calculate overall performance
    const totalClicks = campaignMetrics.reduce((sum, c) => {
      return sum + c.variants.reduce((vSum: number, v: any) => vSum + v.clicks, 0)
    }, 0)

    const totalImpressions = campaignMetrics.reduce((sum, c) => {
      return sum + c.variants.reduce((vSum: number, v: any) => vSum + v.impressions, 0)
    }, 0)

    const overallCTR = totalImpressions > 0
      ? ((totalClicks / totalImpressions) * 100).toFixed(2)
      : '0.00'

    // Top performing campaigns
    const topCampaigns = [...campaignMetrics]
      .sort((a, b) => {
        const aTotal = a.variants.reduce((sum: number, v: any) => sum + v.clicks, 0)
        const bTotal = b.variants.reduce((sum: number, v: any) => sum + v.clicks, 0)
        return bTotal - aTotal
      })
      .slice(0, 5)

    // Revenue analysis
    const totalRevenue = conversionStats.totalValue
    const averageOrderValue = conversionStats.averageValue
    const roi = totalImpressions > 0
      ? ((totalRevenue / totalImpressions) * 100).toFixed(2)
      : '0.00'

    return {
      overview: {
        totalClicks,
        totalImpressions,
        overallCTR: `${overallCTR}%`,
        totalConversions: conversionStats.totalConversions,
        totalRevenue,
        averageOrderValue,
        roi: `${roi}%`,
        topCampaigns: topCampaigns.length
      },
      campaigns: campaignMetrics,
      abTests: abTestResults,
      conversions: conversionStats,
      topCampaigns,
      byCampaign: conversionStats.byCampaign,
      byType: conversionStats.byType
    }
  })

  /**
   * Get performance summary for a date range
   */
  const getPerformanceSummary = (startDate?: string, endDate?: string) => {
    const dashboard = getDashboardData.value
    const dateFilter = (timestamp: string) => {
      if (!startDate && !endDate) return true
      const date = new Date(timestamp)
      if (startDate && date < new Date(startDate)) return false
      if (endDate && date > new Date(endDate)) return false
      return true
    }

    return {
      clicks: dashboard.overview.totalClicks,
      impressions: dashboard.overview.totalImpressions,
      ctr: dashboard.overview.overallCTR,
      conversions: dashboard.overview.totalConversions,
      revenue: dashboard.overview.totalRevenue,
      averageOrderValue: dashboard.overview.averageOrderValue,
      roi: dashboard.overview.roi,
      campaigns: dashboard.campaigns.filter(c => {
        // Filter campaigns by date if provided
        return true // Simplified for now
      }),
      topPerformers: dashboard.topCampaigns
    }
  }

  /**
   * Export analytics data as CSV
   */
  const exportToCSV = () => {
    const dashboard = getDashboardData.value
    
    // Create CSV for campaigns
    let csv = 'Campaign,Variant,Clicks,Impressions,CTR,Conversions,Conversion Rate,Revenue\n'
    
    for (const campaign of dashboard.campaigns) {
      for (const variant of campaign.variants) {
        csv += `"${campaign.campaign.name}","${variant.name}",${variant.clicks},${variant.impressions},"${variant.ctr}",${variant.conversions},"${variant.conversionRate}",${variant.revenue}\n`
      }
    }
    
    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `trip-analytics-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    console.log('✅ Analytics data exported to CSV')
  }

  /**
   * Export analytics data as JSON
   */
  const exportToJSON = () => {
    const dashboard = getDashboardData.value
    
    const json = JSON.stringify(dashboard, null, 2)
    
    // Download JSON
    const blob = new Blob([json], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `trip-analytics-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    console.log('✅ Analytics data exported to JSON')
  }

  /**
   * Get recommendations based on performance data
   */
  const getRecommendations = () => {
    const dashboard = getDashboardData.value
    const recommendations: string[] = []

    // Campaign recommendations
    for (const campaign of dashboard.campaigns) {
      const lowCTR = campaign.variants.some((v: any) => {
        const ctr = parseFloat(v.ctr)
        return ctr < 1.0 && v.impressions > 100
      })
      
      if (lowCTR) {
        recommendations.push(
          `⚠️ ${campaign.campaign.name}: CTR below 1%. Consider optimizing CTA or placement.`
        )
      }

      // Check for high-performing variant to promote
      const variantsSorted = [...campaign.variants].sort((a: any, b: any) => {
        return parseFloat(b.ctr) - parseFloat(a.ctr)
      })
      
      if (variantsSorted.length > 1) {
        const winner = variantsSorted[0]
        const loser = variantsSorted[1]
        const improvement = ((parseFloat(winner.ctr) - parseFloat(loser.ctr)) / parseFloat(loser.ctr) * 100).toFixed(1)
        
        if (Math.abs(parseFloat(improvement)) > 20) {
          recommendations.push(
            `📈 ${campaign.campaign.name}: "${winner.name}" performs ${Math.abs(parseFloat(improvement))}% better than "${loser.name}". Consider switching to winner.`
          )
        }
      }
    }

    // A/B test recommendations
    for (const test of dashboard.abTests) {
      if (parseInt(test.results.improvement) > 20) {
        recommendations.push(
          `🎯 ${test.test.name}: Variant is ${Math.abs(parseInt(test.results.improvement))}% better. Consider declaring winner and ending test.`
        )
      }
    }

    // Revenue recommendations
    if (dashboard.overview.totalRevenue > 0 && dashboard.overview.totalImpressions > 0) {
      const rpc = parseFloat(dashboard.overview.roi)
      if (rpc < 0.5) {
        recommendations.push(
          `💰 Low revenue per click (${dashboard.overview.roi}). Focus on higher-value traffic sources.`
        )
      }
    }

    return recommendations.length > 0 ? recommendations : [
      '✅ Your campaigns are performing well! Keep monitoring and optimizing.'
    ]
  }

  return {
    getDashboardData,
    getPerformanceSummary,
    exportToCSV,
    exportToJSON,
    getRecommendations
  }
}

