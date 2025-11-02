# 🚀 MVP Deployment Guide - Pre-populated Data

## Overview

Since Playwright doesn't work on Vercel serverless, we're using a **MVP approach** with pre-populated data. Later, we'll migrate to PostgreSQL.

---

## ✅ What's Been Done

### 1. Crawler Updated
- Detects serverless environment (`VERCEL` or `NETLIFY`)
- Returns cached data only on serverless (no Playwright attempts)
- Full crawling still works **locally** for data updates

### 2. Vercel Configuration Simplified
- Removed Playwright installation from build
- Just runs `npm run build`
- No browser binaries needed

### 3. Data Committed to Git
- `data/attractionsg-events.json` is now in version control
- Contains pre-crawled events from local development
- Will be deployed with the app

---

## 📋 Deployment Steps

### Step 1: Verify Data
```bash
# Check data file exists and has content
ls -lh data/attractionsg-events.json
head data/attractionsg-events.json
```

### Step 2: Commit and Push
```bash
# Add all changes including data
git add .
git commit -m "MVP: Pre-populate AttractionsSG data for Vercel"
git push origin main
```

### Step 3: Deploy to Vercel
Vercel will auto-deploy on push. The deployment will:
- ✅ Build successfully (no Playwright needed)
- ✅ Include `data/attractionsg-events.json`
- ✅ Serve pre-populated events
- ✅ API endpoints return cached data

### Step 4: Verify Deployment
1. Visit your Vercel URL
2. Go to `/attractionsg`
3. Click "Crawl AttractionsSG Data"
4. Should see events load (from cache)

---

## 🔄 Updating Data

Since crawler can't run on Vercel, update data locally:

### Workflow
```bash
# 1. Update data locally
npm run dev
# Manually trigger crawl at /attractionsg or use API

# 2. Verify data is updated
cat data/attractionsg-events.json | jq '.events | length'

# 3. Commit updated data
git add data/attractionsg-events.json
git commit -m "Update AttractionsSG events"
git push origin main

# 4. Vercel redeploys automatically
```

### Automation (Optional)
Create a script to automate this:

```bash
#!/bin/bash
# scripts/update-data.sh

echo "🕷️ Running local crawl..."
curl -X POST http://localhost:3000/api/attractionsg/crawl \
  -H "Content-Type: application/json" \
  -d '{"fullCrawl": true, "maxPages": 30}'

echo "📦 Committing updated data..."
git add data/attractionsg-events.json
git commit -m "Auto-update: $(date +%Y-%m-%d)"
git push origin main

echo "✅ Data updated and deployed!"
```

---

## ⚠️ Limitations

### Current MVP
- ❌ Data becomes stale over time
- ❌ Manual update process
- ❌ Not real-time
- ✅ Works on Vercel
- ✅ No Playwright issues
- ✅ Fast deployment

### Future with PostgreSQL
- ✅ Real-time data
- ✅ Automatic crawls
- ✅ No manual updates
- ✅ Scales infinitely
- ✅ Search and filtering

---

## 🎯 Migration Path to PostgreSQL

When ready to upgrade:

### Phase 1: Setup Database
1. Create Vercel Postgres database
2. Add connection string to env vars
3. Update `nuxt.config.ts` with Postgres config

### Phase 2: Update Crawler
1. Deploy crawler to Railway/Render
2. Schedule daily/hourly crawls
3. Save to PostgreSQL instead of files

### Phase 3: Update API
1. Read from PostgreSQL
2. Implement caching layer
3. Add pagination and search

### Phase 4: Remove Git Data
1. Remove `data/` from Git
2. Add back to `.gitignore`
3. Clean up old code paths

---

## 📝 Environment Variables

Still needed on Vercel:

```
ATTRACTIONSG_EMAIL=...
ATTRACTIONSG_PASSWORD=...
SMTP_HOST=...
SMTP_PORT=...
SMTP_USER=...
SMTP_PASS=...
```

**Note**: `ATTRACTIONSG_*` not used on Vercel now, but needed for future migration.

---

## 🧪 Testing

### Local
```bash
npm run dev
# Visit /attractionsg
# Click "Crawl AttractionsSG Data"
# Should trigger full Playwright crawl
```

### Production (Vercel)
```bash
# Visit deployed site
# Go to /attractionsg
# Click "Crawl AttractionsSG Data"
# Should return cached data immediately
# No error about Playwright
```

---

## 📊 Monitoring

### Vercel Logs
Check Function Logs in Vercel dashboard:
- Should see: "🌐 Running on serverless platform - returning cached data only"
- Should NOT see: "🕷️ Starting AttractionsSG crawl..."
- Should NOT see: Playwright errors

### Data Freshness
- Check `lastUpdated` timestamp in data
- Commit frequency = data freshness
- Consider daily/weekly updates

---

## ✅ Success Criteria

- [x] Vercel deployment succeeds
- [x] No Playwright errors
- [x] Events display on `/attractionsg`
- [x] Booking requests work
- [x] Data updates via Git workflow
- [ ] PostgreSQL migration (future)

---

## 🆘 Troubleshooting

### "No data available"
- Check `data/attractionsg-events.json` committed to Git
- Verify file exists in Vercel deployment
- Check Function Logs for errors

### "Events are old"
- Run local crawl
- Commit and push updated data
- Wait for Vercel redeploy

### "Crawl button doesn't work"
- Check browser console for errors
- Check Vercel Function Logs
- Verify API endpoint is deployed

---

Made with ❤️ for GoTravelNha MVP

