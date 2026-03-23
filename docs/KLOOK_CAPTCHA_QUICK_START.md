# Quick Start: Handling Klook CAPTCHA

## Problem

Klook blocks automated crawlers with CAPTCHA challenges.

## Solution

The crawler now includes:
1. **Stealth techniques** to avoid detection (enabled by default)
2. **Visible browser mode** for manual CAPTCHA solving

## Usage

### Method 1: Stealth Mode (Try First)

Just run normally - stealth mode is enabled by default:

```bash
npm run crawl:klook
```

Most of the time, this works without CAPTCHA issues.

### Method 2: Visible Browser for Manual CAPTCHA Solving

If CAPTCHA appears, use visible browser mode:

**Option A: Update script file**

Edit `scripts/run-klook-crawl.ts` and change:
```typescript
const headless = false // Change from true to false
```

Then run:
```bash
npm run crawl:klook
```

**Option B: Via environment variable**

```bash
KLOOK_CRAWL_HEADLESS=false npm run crawl:klook
```

**Option C: Via API**

```bash
curl -X POST http://localhost:3000/api/klook/crawl \
  -H "Content-Type: application/json" \
  -d '{
    "headless": false,
    "waitForCaptcha": true,
    "locations": ["Singapore", "Vietnam"]
  }'
```

## What Happens

1. Browser opens (visible mode)
2. Script navigates to Klook pages
3. If CAPTCHA detected:
   - Script pauses
   - Browser window stays open
   - Console shows: "🛑 CAPTCHA detected! Please solve it..."
4. **You solve CAPTCHA in the browser window**
5. Script automatically detects CAPTCHA is solved
6. Continues crawling automatically
7. No restart needed!

## Tips

- **First try stealth mode** - it works most of the time
- **Visible mode when blocked** - solve CAPTCHA once, then continue
- **Browser stays open** - you can see what's happening
- **Auto-detection** - script knows when CAPTCHA is solved

## Timeout

Default timeout is 5 minutes. If you need more time, the script will wait for you to solve the CAPTCHA.
