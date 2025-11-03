import { ref, onMounted, onUnmounted } from 'vue'

export interface UserActivity {
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

export const useActivityTracker = () => {
  const sessionId = ref<string>(generateSessionId())
  const isTracking = ref(false)
  const activityQueue = ref<UserActivity[]>([])
  const startTime = ref<number>(Date.now())

  // Generate unique session ID
  function generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
  }

  // Track page view
  const trackPageView = (page: string, additionalData?: any) => {
    trackActivity({
      sessionId: sessionId.value,
      timestamp: new Date().toISOString(),
      page,
      action: 'page_view',
      data: additionalData,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    })
  }

  // Track user clicks
  const trackClick = (element: string, additionalData?: any) => {
    trackActivity({
      sessionId: sessionId.value,
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      action: 'click',
      data: {
        element,
        ...additionalData
      }
    })
  }

  // Track searches
  const trackSearch = (searchQuery: string, filters?: any) => {
    trackActivity({
      sessionId: sessionId.value,
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      action: 'search',
      data: {
        query: searchQuery,
        filters
      }
    })
  }

  // Track hotel/clicks interactions
  const trackHotelInteraction = (hotelId: string, action: string, additionalData?: any) => {
    trackActivity({
      sessionId: sessionId.value,
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      action: 'hotel_interaction',
      data: {
        hotelId,
        interactionType: action,
        ...additionalData
      }
    })
  }

  // Track scrolling behavior
  const trackScroll = () => {
    const scrollPercentage = Math.round(
      ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
    )
    
    trackActivity({
      sessionId: sessionId.value,
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      action: 'scroll',
      data: {
        scrollPercentage,
        maxScroll: Math.max(...activityQueue.value
          .filter(a => a.action === 'scroll')
          .map(a => a.data?.scrollPercentage || 0))
      }
    })
  }

  // Track time on page
  const trackTimeSpent = () => {
    const timeSpent = Math.round((Date.now() - startTime.value) / 1000)
    
    trackActivity({
      sessionId: sessionId.value,
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      action: 'time_spent',
      data: {
        seconds: timeSpent
      }
    })
  }

  // Add activity to queue
  const trackActivity = (activity: UserActivity) => {
    activityQueue.value.push(activity)
    
    // Send activity to server
    sendActivityToServer(activity)
    
    // Log in development
    if (process.env.NODE_ENV === 'development') {
      //console.log('📊 Activity tracked:', activity)
    }
  }

  // Send activity to server endpoint
  const sendActivityToServer = async (activity: UserActivity) => {
    try {
      await $fetch('/api/track-activity', {
        method: 'POST',
        body: activity
      })
    } catch (error) {
      console.error('Failed to send activity to server:', error)
    }
  }

  // Start tracking
  const startTracking = () => {
    if (isTracking.value) return
    
    isTracking.value = true
    startTime.value = Date.now()

    // Track page view on start
    trackPageView(window.location.pathname)

    // Set up scroll tracking
    let scrollTimeout: NodeJS.Timeout
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(trackScroll, 1000) // Throttle scroll events
    }, { passive: true })

    // Track when user leaves page
    window.addEventListener('beforeunload', trackTimeSpent)

    // Track time spent every 30 seconds
    const timeInterval = setInterval(() => {
      trackTimeSpent()
    }, 30000)

    // Clean up on unmount
    return () => {
      window.removeEventListener('scroll', trackScroll)
      window.removeEventListener('beforeunload', trackTimeSpent)
      clearInterval(timeInterval)
    }
  }

  // Stop tracking
  const stopTracking = () => {
    if (!isTracking.value) return
    
    trackTimeSpent()
    isTracking.value = false
  }

  // Get activity insights
  const getActivityInsights = () => {
    const activities = activityQueue.value
    
    return {
      totalActivities: activities.length,
      timeSpent: Math.round((Date.now() - startTime.value) / 1000),
      pageViews: activities.filter(a => a.action === 'page_view').length,
      clicks: activities.filter(a => a.action === 'click').length,
      searches: activities.filter(a => a.action === 'search').length,
      maxScrollDepth: Math.max(...activities
        .filter(a => a.action === 'scroll')
        .map(a => a.data?.maxScroll || 0), 0)
    }
  }

  return {
    sessionId,
    isTracking,
    trackPageView,
    trackClick,
    trackSearch,
    trackHotelInteraction,
    trackScroll,
    startTracking,
    stopTracking,
    getActivityInsights
  }
}
