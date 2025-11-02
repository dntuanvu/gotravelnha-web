import { defineEventHandler, readBody } from 'h3'

interface ActivityData {
  sessionId: string
  timestamp: string
  page: string
  action: string
  data?: any
  userAgent?: string
  viewport?: {
    width: number
    height: number
  }
}

export default defineEventHandler(async (event) => {
  try {
    const activity = await readBody(event) as ActivityData

    // Log activity (in production, you'd save to database)
    console.log('📊 User Activity:', {
      session: activity.sessionId,
      page: activity.page,
      action: activity.action,
      time: activity.timestamp
    })

    // You can add additional processing here:
    // - Save to database
    // - Update analytics
    // - Store for scraping insights
    // - Trigger data collection if needed

    // Example: Store in memory for now (use database in production)
    // In production, you might want to use Redis, MongoDB, or PostgreSQL
    
    // For scraping insights, you could analyze:
    // - Most clicked hotels/activities
    // - Popular search terms
    // - User flow patterns
    // - Price comparison needs
    
    return {
      success: true,
      message: 'Activity tracked successfully'
    }
  } catch (error) {
    console.error('Error tracking activity:', error)
    return {
      success: false,
      message: 'Failed to track activity'
    }
  }
})
