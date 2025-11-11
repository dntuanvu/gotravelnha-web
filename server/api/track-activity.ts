import { defineEventHandler, readBody } from 'h3'
import prisma from '~/server/utils/prisma'

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
    const userAgentHeader = event.node.req.headers['user-agent']

    const ipHeader = event.node.req.headers['x-forwarded-for'] ?? event.node.req.socket.remoteAddress
    const fallbackSession = Array.isArray(ipHeader) ? ipHeader[0] : typeof ipHeader === 'string' ? ipHeader : null

    const sessionId = (activity?.sessionId && String(activity.sessionId).trim()) || fallbackSession || 'anonymous'
    const page = activity?.page?.trim() || event.node.req.url || 'unknown'
    const action = activity?.action?.trim() || 'view'

    const parsedTimestamp = activity.timestamp ? new Date(activity.timestamp) : new Date()
    const timestamp = Number.isNaN(parsedTimestamp.getTime()) ? new Date() : parsedTimestamp
    const viewportWidth =
      typeof activity.viewport?.width === 'number' ? activity.viewport.width : null
    const viewportHeight =
      typeof activity.viewport?.height === 'number' ? activity.viewport.height : null

    await prisma.userActivity.create({
      data: {
        sessionId,
        timestamp,
        page,
        action,
        data: activity.data ?? null,
        userAgent: activity.userAgent ?? (Array.isArray(userAgentHeader) ? userAgentHeader.join(' ') : userAgentHeader) ?? null,
        viewportWidth,
        viewportHeight
      }
    })

    // Log activity (in production, you'd save to database)
    console.log('📊 User Activity recorded:', {
      session: sessionId,
      page,
      action,
      time: timestamp.toISOString()
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
