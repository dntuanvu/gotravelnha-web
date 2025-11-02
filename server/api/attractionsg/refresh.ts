import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    console.log('🔄 Triggering AttractionsSG data refresh in background...')
    
    // Import the crawl handler directly to avoid HTTP call overhead
    const { default: crawlHandler } = await import('./crawl')
    
    // Trigger crawl in background without blocking
    crawlHandler(event).catch(err => {
      console.error('Background crawl error:', err)
    })

    return {
      success: true,
      message: 'Data refresh initiated in background',
      status: 'processing'
    }

  } catch (error: any) {
    console.error('Refresh error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to initiate refresh'
    })
  }
})
