/**
 * Price Alert Composable
 * Handles price drop alerts
 */

export const usePriceAlert = () => {
  const createAlert = async (data: {
    userId: string
    platform: string
    productType: string
    productId: string
    productName: string
    currentPrice?: number
    targetPrice?: number
    originalUrl: string
  }) => {
    try {
      const response = await $fetch('/api/price-alerts/create', {
        method: 'POST',
        body: data
      })
      return response
    } catch (error) {
      console.error('Error creating price alert:', error)
      throw error
    }
  }

  const getMyAlerts = async (userId: string) => {
    try {
      const response = await $fetch(`/api/price-alerts/my-alerts?userId=${userId}`)
      return response
    } catch (error) {
      console.error('Error fetching alerts:', error)
      throw error
    }
  }

  return {
    createAlert,
    getMyAlerts
  }
}

