# GitHub Actions Crawlers Setup

## Overview

Since Playwright doesn't work on Vercel serverless functions (due to timeout limits and file system constraints), we use **GitHub Actions** to run crawlers on a schedule. This is the same approach used for AttractionsSG crawler.

---

## ✅ Crawlers Available

All three crawlers are configured to run via GitHub Actions:

1. **AttractionsSG Crawler** - Daily at 18:30 UTC
2. **Trip.com Crawler** - Daily at 02:00 UTC  
3. **Klook Crawler** - Twice daily at 06:00 and 18:00 UTC

---

## 📋 Setup Steps

### Step 1: Configure GitHub Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these secrets:

#### Required for All Crawlers
```
DATABASE_URL=your_postgresql_connection_string
```

#### Trip.com Crawler Secrets
```
TRIP_ALLIANCE_ID=3883416
TRIP_SID=22874365
TRIP_CRAWL_FULL=false                    # Optional: true for full crawl
TRIP_CRAWL_MAX_PAGES=5                   # Optional: max pages to crawl
```

#### Klook Crawler Secrets
```
KLOOK_AD_ID=your_klook_ad_id             # Get from Klook affiliate portal
KLOOK_AFFILIATE_ID=your_klook_ad_id      # Alternative name, same value
KLOOK_CRAWL_TYPE=all                     # Optional: activities/promos/hotels/all
KLOOK_CRAWL_MAX_ITEMS=50                 # Optional: max items to crawl
KLOOK_CRAWL_LOCATIONS=Singapore          # Optional: comma-separated locations
```

#### AttractionsSG Crawler Secrets
```
ATTRACTIONSG_EMAIL=your_email
ATTRACTIONSG_PASSWORD=your_password
CRAWL_FULL=true                          # Optional
CRAWL_MAX_PAGES=40                       # Optional
```

---

### Step 2: Enable Workflows

Workflows are in `.github/workflows/`:

1. **`.github/workflows/attractionsg-crawl.yml`** - AttractionsSG crawler
2. **`.github/workflows/trip-crawl.yml`** - Trip.com crawler
3. **`.github/workflows/klook-crawl.yml`** - Klook crawler

They're automatically enabled when pushed to the repository.

---

### Step 3: Test Workflows

#### Manual Trigger

1. Go to **Actions** tab in GitHub
2. Select the workflow (e.g., "Trip.com Crawl")
3. Click **"Run workflow"** button
4. Select branch (usually `main`)
5. Click **"Run workflow"**

#### Verify Execution

- Check the workflow run logs
- Look for success messages like:
  - `✅ Trip.com crawler completed successfully`
  - `📊 Crawled X deals`

---

## ⏰ Schedule Configuration

### AttractionsSG
```yaml
schedule:
  - cron: "30 18 * * *"  # Daily at 18:30 UTC (02:30 SG time)
```

### Trip.com
```yaml
schedule:
  - cron: "0 2 * * *"    # Daily at 02:00 UTC (10:00 SG time)
```

### Klook
```yaml
schedule:
  - cron: "0 6,18 * * *" # Twice daily at 06:00 and 18:00 UTC (14:00 and 02:00 SG time)
```

### Customize Schedule

Edit the `cron` expression in the workflow files. Use [crontab.guru](https://crontab.guru) to test cron expressions.

**Examples:**
- `"0 */6 * * *"` - Every 6 hours
- `"0 0 * * 0"` - Weekly on Sunday at midnight
- `"0 9 * * 1-5"` - Weekdays at 9 AM

---

## 🔍 How It Works

### Execution Flow

1. **GitHub Actions** triggers on schedule or manual dispatch
2. **Checkout** repository code
3. **Install** Node.js and dependencies
4. **Run** Prisma migrations
5. **Install** Playwright browsers
6. **Execute** crawler script (`npm run crawl:trip`, etc.)
7. **Store** data in database via Prisma

### Vercel Detection

The API endpoints (`/api/trip/crawl`, `/api/klook/crawl`) automatically detect serverless environments:

```typescript
const isServerless = process.env.VERCEL || process.env.NETLIFY

if (isServerless) {
  // Return message about using GitHub Actions
  return {
    message: 'Playwright not available on serverless. Use GitHub Actions...'
  }
}
```

---

## 📊 Monitoring

### GitHub Actions Logs

1. Go to **Actions** tab
2. Click on a workflow run
3. View step-by-step logs
4. Check for errors or warnings

### Database Verification

After a crawl completes, verify data:

```sql
-- Check Trip.com deals
SELECT COUNT(*) FROM trip_scraped_data WHERE "isValid" = true;

-- Check Klook data
SELECT COUNT(*) FROM klook_promo_codes WHERE "isActive" = true;
SELECT COUNT(*) FROM klook_hotel_deals WHERE "isActive" = true;

-- Check AttractionsSG events
SELECT COUNT(*) FROM attractionsg_events WHERE "isPublished" = true;
```

---

## 🔧 Troubleshooting

### Workflow Fails Immediately

**Issue**: Database connection error
- **Fix**: Verify `DATABASE_URL` secret is correct
- Check database is accessible from GitHub Actions IPs

### Playwright Installation Fails

**Issue**: Browser installation timeout
- **Fix**: Usually resolves on retry. GitHub Actions runners have limited resources.
- Consider reducing `CRAWL_MAX_PAGES` or `KLOOK_CRAWL_MAX_ITEMS`

### Crawler Completes But No Data

**Issue**: Selectors changed or website structure updated
- **Fix**: Check crawler logs for extraction errors
- Update selectors in crawler service files
- Test locally first: `npm run crawl:trip`

### Rate Limiting

**Issue**: Too many requests to external sites
- **Fix**: Add delays between requests in crawler code
- Reduce `maxPages` or `maxItems`
- Stagger crawl schedules

---

## 🚀 Alternative: External Worker

If GitHub Actions doesn't meet your needs, you can use:

1. **Railway** - Deploy crawler as separate service
2. **Render** - Scheduled cron jobs
3. **DigitalOcean** - App Platform with cron
4. **Your own server** - VPS with cron

Set up webhooks:
- `TRIP_CRAWLER_WEBHOOK` - URL to trigger Trip.com crawl
- `KLOOK_CRAWLER_WEBHOOK` - URL to trigger Klook crawl
- `ATTRACTIONSG_CRAWLER_WEBHOOK` - URL to trigger AttractionsSG crawl

The API endpoints will delegate to these webhooks when in serverless mode.

---

## 📝 Next Steps

1. ✅ Add secrets to GitHub repository
2. ✅ Push workflow files to repository
3. ✅ Test manual workflow runs
4. ✅ Verify data appears in database
5. ✅ Monitor scheduled runs

---

## Reference

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Cron Schedule Expression](https://crontab.guru)
- [Playwright Documentation](https://playwright.dev)
- Workflow files: `.github/workflows/*.yml`

