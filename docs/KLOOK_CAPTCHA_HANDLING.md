# Klook CAPTCHA Handling Guide

## Problem

Klook uses CAPTCHA challenges to block automated crawling/bots. This can interrupt the crawling process.

## Solution

The Klook crawler now supports multiple strategies to handle CAPTCHA:

### 1. Stealth Mode (Recommended First Try)

The crawler includes stealth techniques to reduce bot detection:

- **Removed automation flags**: Hides that it's an automated browser
- **Realistic browser fingerprint**: Mimics real browser behavior
- **Random delays**: Human-like timing between actions
- **Realistic scrolling**: Smooth, gradual scrolling instead of instant jumps
- **Proper headers**: Includes realistic HTTP headers

**Usage**: Just run normally - stealth mode is always enabled
```bash
npm run crawl:klook
```

### 2. Visible Browser Mode (For Manual CAPTCHA Solving)

If CAPTCHA still appears, use visible browser mode to manually solve it:

**Option A: Via Script**
```bash
# Edit scripts/run-klook-crawl.ts to set headless: false
# Then run:
npm run crawl:klook
```

**Option B: Via API**
```bash
curl -X POST http://localhost:3000/api/klook/crawl \
  -H "Content-Type: application/json" \
  -d '{
    "headless": false,
    "waitForCaptcha": true,
    "locations": ["Singapore", "Vietnam"]
  }'
```

### 3. How It Works

When `headless: false` and `waitForCaptcha: true`:

1. Browser opens in visible mode (you can see it)
2. Crawler navigates to Klook pages
3. If CAPTCHA is detected:
   - Script pauses
   - Browser window stays open
   - Console shows: "CAPTCHA detected! Please solve it in the browser window."
4. **You manually solve the CAPTCHA** in the browser window
5. Once solved, the script automatically continues crawling
6. Script checks every 2 seconds if CAPTCHA is gone

### 4. Configuration Options

```typescript
interface KlookCrawlRequest {
  headless?: boolean      // Default: true (set to false for visible browser)
  waitForCaptcha?: boolean // Default: true (waits for manual CAPTCHA solving)
  locations?: string[]    // Default: ['Singapore', 'Vietnam']
  maxItems?: number       // Default: 100
}
```

### 5. Step-by-Step: Manual CAPTCHA Solving

1. **Start crawler with visible browser**:
   ```bash
   # Update scripts/run-klook-crawl.ts:
   headless: false,
   waitForCaptcha: true
   
   npm run crawl:klook
   ```

2. **Browser window opens** - you'll see Klook pages loading

3. **If CAPTCHA appears**:
   - Script pauses automatically
   - Browser window stays open
   - Solve the CAPTCHA in the browser window

4. **After solving**:
   - Script detects CAPTCHA is gone
   - Continues crawling automatically
   - No need to restart

### 6. Troubleshooting

**CAPTCHA keeps appearing:**
- Try increasing delays between requests
- Use proxy/VPN to change IP
- Run during off-peak hours
- Solve CAPTCHA once, then use cookies (future enhancement)

**Script times out waiting for CAPTCHA:**
- Default timeout is 5 minutes
- Increase timeout in code if needed
- Make sure browser window is visible

**CAPTCHA not detected:**
- Script might continue even if CAPTCHA is present
- Watch browser window to see if CAPTCHA appears
- Check console logs for warnings

### 7. Best Practices

1. **First run**: Try with stealth mode (default)
2. **If blocked**: Switch to visible mode (`headless: false`)
3. **Solve CAPTCHA**: Once solved, subsequent requests might work
4. **Schedule crawls**: Run during off-peak hours to reduce detection
5. **Rate limiting**: The crawler includes random delays to appear human-like

### 8. Future Enhancements (Potential)

- Cookie/session persistence (save cookies after solving CAPTCHA once)
- Proxy rotation
- Integration with CAPTCHA solving services (2Captcha, etc.)
- Browser fingerprint randomization
- User agent rotation

### 9. Environment Variables

You can also set these via environment variables:

```bash
# Run in visible mode
KLOOK_CRAWL_HEADLESS=false npm run crawl:klook

# Wait for CAPTCHA
KLOOK_CRAWL_WAIT_CAPTCHA=true npm run crawl:klook
```

### 10. Example: Complete Manual CAPTCHA Solving Workflow

```bash
# 1. Update script or API call to use visible browser
headless: false
waitForCaptcha: true

# 2. Run crawler
npm run crawl:klook

# 3. Browser window opens
# 4. Watch for CAPTCHA
# 5. When CAPTCHA appears, solve it in browser
# 6. Script automatically continues
# 7. Done!
```

## Notes

- **Stealth mode works most of the time** - try it first
- **Visible mode requires manual intervention** - use when needed
- **CAPTCHA solving is one-time** - once solved, subsequent crawls might work
- **Rate limiting helps** - random delays make crawler appear more human-like
