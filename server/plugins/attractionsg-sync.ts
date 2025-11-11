import { defineNitroPlugin, useRuntimeConfig } from '#imports'
import { runAttractionsgCrawl } from '~/server/api/attractionsg/crawl'

export default defineNitroPlugin((nitroApp) => {
  const config = useRuntimeConfig()

  const enabled =
    process.env.ATTRACTIONSG_BACKGROUND_SYNC === 'true' ||
    config.ATTRACTIONSG_BACKGROUND_SYNC === 'true'

  const crawlEnabled =
    (process.env.ATTRACTIONSG_CRAWL_ENABLED ?? config.ATTRACTIONSG_CRAWL_ENABLED ?? 'true') !== 'false'

  if (!enabled) {
    console.log('⏸️ AttractionsSG background sync disabled')
    return
  }

  if (!crawlEnabled) {
    console.log('⏸️ AttractionsSG crawl disabled via feature flag; background sync not started.')
    return
  }

  if (process.env.VERCEL || process.env.NETLIFY) {
    console.log('🌐 Serverless deployment detected - disabling AttractionsSG background sync')
    return
  }

  const fallbackInterval = 1000 * 60 * 60 * 6 // 6 hours
  const intervalFromEnv =
    Number(process.env.ATTRACTIONSG_SYNC_INTERVAL || config.ATTRACTIONSG_SYNC_INTERVAL || fallbackInterval)

  const interval =
    Number.isFinite(intervalFromEnv) && intervalFromEnv >= 1000 * 60 * 10
      ? intervalFromEnv
      : fallbackInterval

  let isRunning = false

  const runSync = async () => {
    if (isRunning) {
      console.log('⏳ Previous AttractionsSG sync still running, skipping this interval')
      return
    }

    isRunning = true
    try {
      console.log('🔄 Starting scheduled AttractionsSG sync...')
      await runAttractionsgCrawl({ fullCrawl: false })
      console.log('✅ AttractionsSG sync completed')
    } catch (error) {
      console.error('⚠️ AttractionsSG background sync failed:', error)
    } finally {
      isRunning = false
    }
  }

  // Kick off an initial sync without awaiting to avoid blocking startup
  runSync()

  const timer = setInterval(runSync, interval)

  nitroApp.hooks.hook('close', () => {
    clearInterval(timer)
  })
})

