# ⚠️ Critical: Playwright Does NOT Work on Vercel Serverless

## The Problem

After extensive testing and research, **Playwright cannot run on Vercel serverless functions** due to fundamental architectural limitations:

### Why It Fails

1. **Build vs Runtime Separation**
   - Browser binaries installed during **build** phase
   - But **runtime** environment is completely separate
   - Binaries are NOT included in the deployment package

2. **File System Limitations**
   - Serverless functions have read-only filesystem
   - Only `/tmp` is writable (and ephemeral)
   - Playwright needs to write browser binaries during build

3. **Package Size Limits**
   - Vercel limits serverless functions to 250MB uncompressed
   - Playwright Chromium is ~200MB alone
   - Too large even if we could include it

4. **Path Issues**
   - Playwright looks for binaries in specific paths during runtime
   - Serverless environment paths don't match
   - Even with `npx playwright install chromium` in build, it fails

## Evidence

Error you're getting:
```
browserType.launch: Executable doesn't exist at 
/home/sbx_user1051/.cache/ms-playwright/chromium_headless_shell-1194/chrome-linux/headless_shell
```

This happens because:
- Binary was installed during build at path: `/vercel/path/to/binary`
- But runtime looks for it at: `/home/sbx_user1051/.cache/ms-playwright/...`
- These paths don't match in serverless environment

## Solutions

### ✅ Option 1: Separate Scraping Service (RECOMMENDED)

Deploy the crawler separately on a platform that supports Playwright:

**Platforms:**
- **Railway** (railway.app) - Easy Docker support
- **Render** (render.com) - Background workers
- **DigitalOcean** App Platform - Full Node.js support
- **Heroku** - Traditional servers
- **AWS Lambda** with proper configuration

**Architecture:**
```
Vercel (Frontend) 
    ↓ HTTP Request
Separate Scraper Service (Railway/Render)
    ↓ Returns JSON
Vercel displays data
```

**Benefits:**
- ✅ Works perfectly
- ✅ No timeout issues
- ✅ Can use full Playwright features
- ✅ Can run scheduled crawls
- ✅ Proper logging and monitoring

---

### ✅ Option 2: Pre-populate Data (MVP ONLY)

For quick MVP/testing:

1. **Run crawls locally**
2. **Commit data to Git** (not recommended for production)
3. **Deploy data with the app**

```bash
# Local
npm run crawl  # Your custom script

# Commit data
git add data/attractionsg-events.json
git commit -m "Update crawled data"
git push

# Vercel deploys with static data
```

**Downsides:**
- ❌ Data becomes stale quickly
- ❌ Manual process
- ❌ Not scalable

---

### ✅ Option 3: Use Cheerio (If No Auth Required)

**Only works if AttractionsSG is public**

Since AttractionsSG requires **login authentication**, Cheerio alone cannot work because:
- Cheerio cannot execute JavaScript
- Cannot handle login forms
- Cannot maintain session cookies

**Would need:**
- HTTP client with cookie jar (like `axios`)
- Login endpoint discovery
- Session management
- Complex to maintain

---

### ❌ Option 4: Puppeteer Alternative

**Won't work on Vercel either**

Puppeteer has similar issues:
- Also too large for serverless
- Same path problems
- Not better than Playwright

---

## Recommended Implementation

### Step 1: Keep Playwright for Local Development

Your current local setup is **perfect**. Keep it:
- ✅ Full Playwright crawler
- ✅ File-based caching
- ✅ Detailed extraction
- ✅ Works great locally

### Step 2: Deploy Scraper Separately

Create a simple HTTP API on Railway/Render:

```typescript
// scraper-service/server.ts
import express from 'express';
import { crawlAttractionsSG } from './crawl';

const app = express();
app.post('/crawl', async (req, res) => {
  const data = await crawlAttractionsSG();
  res.json(data);
});

app.listen(3000);
```

Then update Vercel to call it:

```typescript
// server/api/attractionsg/crawl.ts (Vercel)
export default defineEventHandler(async (event) => {
  // Call external scraper
  const response = await fetch('https://your-scraper-service.railway.app/crawl');
  return await response.json();
});
```

### Step 3: Optional - Add Database

Store results in:
- **Vercel Postgres** (free tier available)
- **Supabase** (free tier)
- **MongoDB Atlas** (free tier)
- **Upstash Redis** (free tier)

This way Vercel can serve cached data without calling scraper every time.

---

## Quick Fix for Testing

If you need **something working NOW** on Vercel:

1. **Commit pre-crawled data to Git**
2. **Remove `data/` from `.gitignore` temporarily**
3. **Update crawler to be a no-op on Vercel**

```typescript
// server/api/attractionsg/crawl.ts
export default defineEventHandler(async (event) => {
  // Return cached data if on Vercel
  if (process.env.VERCEL) {
    return {
      success: true,
      cached: true,
      total: eventsCache.length,
      message: 'Using pre-cached data on Vercel'
    };
  }
  
  // Otherwise run full crawler (local/dev)
  // ... existing code
});
```

---

## Summary

| Solution | Works? | Effort | Production Ready? |
|----------|--------|--------|-------------------|
| Playwright on Vercel | ❌ NO | - | Never |
| Separate Scraper | ✅ YES | Medium | Yes |
| Pre-populated Data | ⚠️ MVP | Low | No |
| Cheerio | ❌ NO | - | Auth required |
| Puppeteer on Vercel | ❌ NO | - | Same issues |

**Best Path Forward:** Deploy scraper separately, keep Vercel for the frontend.

---

## Questions?

Open an issue or contact support. The Playwright + Vercel limitation is well-documented and affects all users, not just you.

---

**Last Updated:** Now
**Status:** Won't Fix - Architectural Limitation

