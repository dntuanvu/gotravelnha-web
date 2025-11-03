# Scheduled Scraping Guide

## Overview

Automated scraping allows you to keep your deals database up-to-date without manual intervention. This guide explains different approaches to implement scheduled scraping.

---

## Options for Scheduled Scraping

### Option 1: Server-Side Cron Job ⭐ RECOMMENDED

Best for: Vercel, VPS, dedicated servers

#### Implementation

Create a cron endpoint that triggers scraping:

**File**: `server/api/admin/scraper/cron.ts`

```typescript
import { defineEventHandler } from 'h3'
import prisma from '~/server/utils/prisma'
import { runScraperJob } from '../jobs'

export default defineEventHandler(async (event) => {
  // Verify cron secret for security
  const authHeader = event.headers.get('authorization')
  const cronSecret = useRuntimeConfig().cronSecret
  
  if (authHeader !== `Bearer ${cronSecret}`) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  try {
    // Get all active scraper sources
    const activeSources = await prisma.scraperSource.findMany({
      where: { isActive: true }
    })

    const results = []

    for (const source of activeSources) {
      // Create job
      const job = await prisma.scraperJob.create({
        data: {
          platform: source.platform,
          sourceUrl: source.url,
          jobType: source.type || 'promotional-deals',
          status: 'PENDING',
          priority: 5
        }
      })

      // Run scraper asynchronously
      runScraperJob(job.id).catch(err => {
        console.error(`Job ${job.id} failed:`, err)
      })

      results.push({
        source: source.url,
        jobId: job.id
      })
    }

    return {
      success: true,
      message: `Started ${results.length} scraping jobs`,
      jobs: results
    }
  } catch (error: any) {
    console.error('Cron job failed:', error)
    throw createError({
      statusCode: 500,
      message: error.message
    })
  }
})
```

#### External Cron Service

Use a service like **cron-job.org** or **EasyCron** to call your endpoint:

1. **Set up cron job**:
   - URL: `https://your-domain.com/api/admin/scraper/cron`
   - Schedule: `0 */6 * * *` (every 6 hours)
   - Method: POST
   - Headers: `Authorization: Bearer YOUR_CRON_SECRET`

2. **Add to `.env`**:
   ```
   CRON_SECRET=your-secure-random-string-here
   ```

---

### Option 2: Vercel Cron Jobs

Best for: Vercel deployments

#### Implementation

**File**: `vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/admin/scraper/cron",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

**File**: `server/api/admin/scraper/cron.ts` (same as above)

**Note**: Vercel cron requires a Pro plan. For free tier, use external cron service.

---

### Option 3: Background Worker Process

Best for: Dedicated servers, Railway, Render

#### Implementation

**File**: `scripts/scraper-worker.ts`

```typescript
import prisma from '../server/utils/prisma'
import { runScraperJob } from '../server/api/admin/scraper/jobs'

// Scrape every 6 hours
const SCRAPE_INTERVAL = 6 * 60 * 60 * 1000

async function runWorker() {
  console.log('🚀 Scraper worker started')

  while (true) {
    try {
      console.log('⏰ Running scheduled scrape...')
      
      const activeSources = await prisma.scraperSource.findMany({
        where: { isActive: true }
      })

      for (const source of activeSources) {
        const job = await prisma.scraperJob.create({
          data: {
            platform: source.platform,
            sourceUrl: source.url,
            jobType: source.type || 'promotional-deals',
            status: 'PENDING',
            priority: 5
          }
        })

        await runScraperJob(job.id)
      }

      console.log(`✅ Scraped ${activeSources.length} sources`)
    } catch (error) {
      console.error('❌ Worker error:', error)
    }

    // Wait before next scrape
    await sleep(SCRAPE_INTERVAL)
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Start worker
runWorker().catch(console.error)
```

**Package.json**:
```json
{
  "scripts": {
    "scraper:worker": "tsx scripts/scraper-worker.ts"
  }
}
```

**Run**: `npm run scraper:worker`

---

### Option 4: Cloud Functions (Google Cloud, AWS Lambda)

Best for: Cloud-native deployments

#### Google Cloud Functions

**File**: `functions/scraper/index.ts`

```typescript
import { onSchedule } from 'firebase-functions/v2/scheduler'
import { setGlobalOptions } from 'firebase-functions/v2'

setGlobalOptions({ maxInstances: 10 })

export const scheduledScraper = onSchedule({
  schedule: 'every 6 hours',
  timeZone: 'Asia/Singapore',
  memory: '512MiB'
}, async (event) => {
  // Trigger scraping logic
  // Can call your cron endpoint or implement directly
})
```

---

## Recommended Configuration

### Schedule Frequency

| Use Case | Frequency | Cron Expression |
|----------|-----------|----------------|
| High-traffic sites | Every 3 hours | `0 */3 * * *` |
| Medium traffic | Every 6 hours | `0 */6 * * *` |
| Low traffic | Daily | `0 0 * * *` |
| Debugging | Hourly | `0 * * * *` |

### Best Practices

1. **Error Handling**: Always log errors, don't let one failed scrape stop others
2. **Rate Limiting**: Don't scrape too frequently to avoid being blocked
3. **Monitoring**: Set up alerts for failed scrapes
4. **Cleanup**: Archive old jobs to keep database manageable
5. **Security**: Protect cron endpoints with secrets/tokens

---

## Monitoring & Maintenance

### Database Cleanup

Archive old jobs periodically:

```typescript
// server/api/admin/scraper/cleanup.ts
export default defineEventHandler(async () => {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  await prisma.scraperJob.deleteMany({
    where: {
      createdAt: { lt: thirtyDaysAgo },
      status: { in: ['COMPLETED', 'FAILED'] }
    }
  })

  return { success: true, message: 'Cleaned up old jobs' }
})
```

### Health Checks

Create a health check endpoint:

```typescript
// server/api/admin/scraper/health.ts
export default defineEventHandler(async () => {
  const recentJobs = await prisma.scraperJob.findMany({
    where: {
      createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    },
    orderBy: { createdAt: 'desc' },
    take: 1
  })

  const lastScrape = recentJobs[0]
  
  return {
    healthy: !!lastScrape,
    lastScrape: lastScrape?.createdAt || null,
    status: lastScrape?.status || 'NO_DATA'
  }
})
```

---

## Testing Scheduled Scraping

### Manual Trigger

Test your cron endpoint manually:

```bash
curl -X POST https://your-domain.com/api/admin/scraper/cron \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### Local Testing

Run cron logic locally:

```bash
# Using tsx
tsx scripts/test-cron.ts

# Or use local cron
node -e "require('./scripts/run-cron')"
```

---

## Cost Considerations

### Free Tier Options

| Service | Limits | Cost |
|---------|--------|------|
| Vercel Cron (Pro) | 1,000 executions/month | $20/month |
| cron-job.org | Free tier available | Free/Paid |
| EasyCron | 1 job free | Free/Paid |
| Railway/Render | Included | Free tier available |

### Self-Hosted

- VPS: $5-20/month
- Cloud functions: Pay-per-execution
- Internal server: Hardware costs

---

## Troubleshooting

### Jobs Not Running

**Check**:
1. Is the cron service active?
2. Are sources set to `isActive: true`?
3. Check server logs for errors
4. Verify cron secret is correct

### High Database Growth

**Solution**: Implement cleanup job for old records

### Failed Scrapes

**Check**:
- Network connectivity
- Target site accessibility
- Playwright installation
- Selector updates needed?

---

## Example: Full Vercel Setup

### 1. Add Cron Secret

`.env`:
```
CRON_SECRET=your-secure-random-string
```

### 2. Create Cron Endpoint

`server/api/admin/scraper/cron.ts` (see above)

### 3. Configure Vercel

`vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/admin/scraper/cron",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

### 4. Deploy

```bash
vercel --prod
```

---

## Next Steps

1. ✅ Choose your scheduling method
2. ✅ Implement cron endpoint or worker
3. ✅ Set up external cron service (if needed)
4. ✅ Test manually first
5. ✅ Monitor first few runs
6. ✅ Set up alerts
7. ✅ Document schedule and logic

---

**Need Help?** Check job status in `/admin/scrapers` and review logs.

