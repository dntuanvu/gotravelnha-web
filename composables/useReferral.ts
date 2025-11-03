/**
 * Referral Tracking Composable
 * Handles referral code generation, sharing, and tracking
 */

export const useReferral = () => {
  const generateReferralCode = (userId: string): string => {
    // Generate unique code: first 8 chars of userId + random 4 chars
    const userIdPrefix = userId.substring(0, 8).replace(/-/g, '')
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `GVH${userIdPrefix}${randomSuffix}`.toUpperCase()
  }

  const getReferralLink = (code: string): string => {
    if (typeof window === 'undefined') return ''
    const baseUrl = window.location.origin
    return `${baseUrl}/register?ref=${code}`
  }

  const createReferral = async (userId: string, email?: string): Promise<any> => {
    try {
      const response = await $fetch('/api/referrals/create', {
        method: 'POST',
        body: {
          userId,
          email
        }
      })
      return response
    } catch (error) {
      console.error('Error creating referral:', error)
      throw error
    }
  }

  const trackReferralClick = async (code: string, email?: string): Promise<void> => {
    try {
      await $fetch('/api/referrals/track-click', {
        method: 'POST',
        body: {
          code,
          email
        }
      })
    } catch (error) {
      console.error('Error tracking referral click:', error)
    }
  }

  const getReferralStats = async (userId: string): Promise<any> => {
    try {
      const response = await $fetch(`/api/referrals/stats?userId=${userId}`)
      return response
    } catch (error) {
      console.error('Error fetching referral stats:', error)
      throw error
    }
  }

  const getMyReferralCode = async (userId: string): Promise<string | null> => {
    try {
      const response = await $fetch(`/api/referrals/my-code?userId=${userId}`)
      return response.code || null
    } catch (error) {
      console.error('Error fetching referral code:', error)
      return null
    }
  }

  return {
    generateReferralCode,
    getReferralLink,
    createReferral,
    trackReferralClick,
    getReferralStats,
    getMyReferralCode
  }
}

