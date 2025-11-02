# Vercel Deployment Guide

## 🚀 Deploying GoTravelNha Web to Vercel

### Step 1: Verify .env is in .gitignore ✅

The `.gitignore` file already includes:
```
.env
.env.*
!.env.example
```

This ensures your `.env` file will **NOT** be pushed to GitHub. ✅

---

## 📋 Step 2: Push to GitHub (without .env)

```bash
# Check what will be committed
git status

# Make sure .env is NOT in the list!
# If you see .env, DON'T commit it

# Add and commit your code
git add .
git commit -m "Add AttractionsSG integration and improvements"
git push origin main
```

---

## 🔐 Step 3: Add Environment Variables in Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project

2. **Navigate to Settings**
   - Click on your project
   - Go to **Settings** → **Environment Variables**

3. **Add Each Environment Variable** (click "Add New" for each):

   ```
   SMTP_HOST = smtp.gmail.com
   ```
   ```
   SMTP_PORT = 587
   ```
   ```
   SMTP_USER = your-email@gmail.com
   ```
   ```
   SMTP_PASS = your-app-password
   ```
   ```
   ATTRACTIONSG_EMAIL = enjoytravelticket@gmail.com
   ```
   ```
   ATTRACTIONSG_PASSWORD = Truc1@3456101112
   ```

4. **Apply to All Environments**
   - Select: Production, Preview, Development
   - Click "Save"

5. **Redeploy**
   - Go to **Deployments** tab
   - Click **⋯** → **Redeploy**
   - This ensures new env vars are loaded

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Set environment variables
vercel env add SMTP_HOST
vercel env add SMTP_PORT
vercel env add SMTP_USER
vercel env add SMTP_PASS
vercel env add ATTRACTIONSG_EMAIL
vercel env add ATTRACTIONSG_PASSWORD

# Follow prompts to enter values

# Deploy
vercel --prod
```

---

## ⚙️ Step 4: Vercel Configuration

A simplified `vercel.json` has been created with minimal configuration:

```json
{
  "regions": ["sin1"],
  "env": {
    "PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD": "1"
  }
}
```

⚠️ **CRITICAL**: Playwright has limitations on Vercel serverless:
- **Timeout**: Vercel functions have 10-60s limits (extended)
- **File System**: Read-only except `/tmp` (ephemeral)
- **Browser**: Needs to download during build

**Current Setup**: The crawler runs in the background and returns quickly, while data loads from cache.

---

## 🧪 Step 5: Verify Deployment

After deployment, test:

1. **Visit your Vercel URL**
   - Check homepage loads
   - Test navigation

2. **Test AttractionsSG**
   - Go to `/attractionsg`
   - Click "Crawl AttractionsSG Data"
   - Check server logs in Vercel dashboard

3. **Test Email (if configured)**
   - Try contact form
   - Try booking request
   - Check server logs for errors

---

## 🔍 Troubleshooting

### Playwright Won't Work on Vercel

**The Reality**: Playwright crawls cannot run reliably on Vercel serverless functions due to:
1. **Timeout limits**: Crawls take 2-5 minutes, Vercel max is 60s
2. **File system**: Data writes to disk are ephemeral in `/tmp`
3. **Browser overhead**: Large Playwright binary increases cold start time

**Production Solutions**:

**Option 1**: Use external database (RECOMMENDED)
- Store crawled data in Vercel Postgres, MongoDB Atlas, or Supabase
- Update crawler to use database instead of file system

**Option 2**: Separate scraping service
- Deploy crawler on Railway, Render, or DigitalOcean
- Use Vercel only for the web app

**Option 3**: For MVP, use caching
- Run crawls locally and commit data to Git
- Or use a cron service like EasyCron to trigger external scrape

**Current Setup**: Crawler will likely timeout on first crawl in production

### Environment Variables Not Working

**Check**:
1. Did you redeploy after adding env vars?
2. Are env var names EXACTLY matching `nuxt.config.ts`?
3. Check Vercel logs: Deployments → Select deployment → Functions Log

---

## 📝 Summary

✅ `.env` is already in `.gitignore` - **Safe to push**
✅ Add env vars in Vercel Dashboard
✅ Redeploy after adding env vars
⚠️ Playwright may need special setup on Vercel

---

## 🔗 Quick Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Environment Variables**: https://vercel.com/docs/concepts/projects/environment-variables
- **Build Logs**: Check in Vercel Dashboard → Deployments → [Your Deployment] → Build Logs

---

Made with ❤️ by GoTravelNha team

