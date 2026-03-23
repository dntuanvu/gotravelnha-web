# Local Crawler Testing Guide

## Prerequisites

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Ensure `.env` file exists** in the project root with all required variables

3. **Install Playwright browsers** (first time only):
   ```bash
   npx playwright install chromium
   ```

---

## Required Environment Variables

Add these to your `.env` file:

### Database (Required)
```env
DATABASE_URL=postgresql://user:password@host:5432/database
```

### Trip.com Crawler
```env
TRIP_CRAWL_ENABLED=true
TRIP_ALLIANCE_ID=3883416
TRIP_SID=22874365

# IMPORTANT: Add sale page URLs for more data (comma-separated)
TRIP_SALE_URLS=https://sg.trip.com/sale/w/4747/flightrebate.html,https://sg.trip.com/sale/w/28065/everydayescape.html

# Optional - configure crawl behavior
CRAWL_FULL=false                    # Set to 'true' for full crawl
CRAWL_MAX_PAGES=5                   # Number of pages to crawl
```

### Klook Crawler
```env
KLOOK_CRAWL_ENABLED=true
KLOOK_AD_ID=your_klook_ad_id        # Get from Klook affiliate portal
KLOOK_AFFILIATE_ID=your_klook_ad_id # Alternative name

# IMPORTANT: Add widget/activity URLs for more data (comma-separated)
KLOOK_WIDGET_URLS=https://www.klook.com/affiliate/widget?city=Singapore&category=attractions
# OR
KLOOK_ACTIVITY_URLS=https://www.klook.com/activity/123456-universal-studios

# Optional - configure crawl behavior
KLOOK_CRAWL_TYPE=all                # Options: activities, promos, hotels, all
KLOOK_CRAWL_MAX_ITEMS=50            # Max items to crawl
KLOOK_CRAWL_LOCATIONS=Singapore     # Comma-separated locations (used as fallback)
```

### AttractionsSG (Optional - if testing AttractionsSG too)
```env
ATTRACTIONSG_EMAIL=your_email
ATTRACTIONSG_PASSWORD=your_password
```

---

## Running Crawlers Locally

### Method 1: Using npm scripts (Recommended)

#### Trip.com Crawler
```bash
npm run crawl:trip
```

#### Klook Crawler
```bash
npm run crawl:klook
```

#### AttractionsSG Crawler
```bash
npm run crawl:attractionsg
```

---

### Method 2: Using tsx directly

If npm scripts don't work, you can run directly with tsx:

```bash
# Trip.com
npx tsx scripts/run-trip-crawl.ts

# Klook
npx tsx scripts/run-klook-crawl.ts

# AttractionsSG
npx tsx scripts/run-attractionsg-crawl.ts
```

---

### Method 3: Using environment variables inline

You can override `.env` values inline:

```bash
# Trip.com with custom settings
CRAWL_MAX_PAGES=3 npm run crawl:trip

# Klook with custom settings
KLOOK_CRAWL_MAX_ITEMS=20 KLOOK_CRAWL_LOCATIONS=Singapore,Bangkok npm run crawl:klook
```

---

## Verifying Environment Variables Loaded

Create a quick test script to verify your `.env` is loading:

```bash
# Create test script
cat > test-env.ts << 'EOF'
import 'dotenv/config'

console.log('✅ Environment Variables:')
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Missing')
console.log('TRIP_ALLIANCE_ID:', process.env.TRIP_ALLIANCE_ID || '❌ Missing')
console.log('TRIP_SID:', process.env.TRIP_SID || '❌ Missing')
console.log('KLOOK_AD_ID:', process.env.KLOOK_AD_ID || process.env.KLOOK_AFFILIATE_ID || '❌ Missing')
EOF

# Run test
npx tsx test-env.ts

# Clean up
rm test-env.ts
```

---

## Common Issues & Solutions

### Issue 1: "Cannot find module 'dotenv/config'"

**Solution**: Install dotenv package:
```bash
npm install dotenv
```

### Issue 2: Environment variables not loading

**Check**:
1. Is `.env` file in the project root? (same level as `package.json`)
2. Does `.env` have correct format? (no spaces around `=`)
3. Are variables spelled correctly?

**Test**:
```bash
# Check if .env file exists
ls -la .env

# Check if variables are readable
cat .env | grep TRIP_ALLIANCE_ID
```

### Issue 3: "Error: Prisma Client did not initialize"

**Solution**: Generate Prisma client:
```bash
npx prisma generate
```

### Issue 4: "Error connecting to database"

**Check**:
1. Is `DATABASE_URL` correct in `.env`?
2. Is database accessible from your machine?
3. Test connection:
   ```bash
   npx prisma db pull
   ```

### Issue 5: Playwright browser not found

**Solution**: Install Playwright browsers:
```bash
npx playwright install chromium
```

Or install all browsers:
```bash
npx playwright install --with-deps
```

### Issue 6: Crawler runs but no data saved

**Check**:
1. Check database connection
2. Verify crawler completed successfully (look for `✅` messages)
3. Check database:
   ```sql
   -- Trip.com
   SELECT COUNT(*) FROM trip_scraped_data;
   
   -- Klook
   SELECT COUNT(*) FROM klook_promo_codes;
   SELECT COUNT(*) FROM klook_hotel_deals;
   ```

---

## Testing with Sample Data

### Quick Test (Small Crawl)

For faster testing, reduce the crawl size:

```bash
# Trip.com - crawl only 1 page
CRAWL_MAX_PAGES=1 npm run crawl:trip

# Klook - crawl only 10 items
KLOOK_CRAWL_MAX_ITEMS=10 npm run crawl:klook
```

---

## Expected Output

### Successful Trip.com Crawl
```
🕷️ Running Trip.com crawl from CLI...
{
  "fullCrawl": false,
  "maxPages": 5
}
📋 Created Trip.com crawl job: abc-123-xyz
✅ Trip.com crawler completed successfully
📊 Crawled 15 deals
✅ Trip.com crawl completed: { dealsCount: 15, ... }
```

### Successful Klook Crawl
```
🕷️ Running Klook crawl from CLI...
{
  "type": "all",
  "maxItems": 50,
  "locations": ["Singapore"]
}
📋 Created Klook crawl job: def-456-uvw
✅ Klook crawler completed successfully
📊 Crawled 50 items
✅ Klook crawl completed: { itemsCount: 50, ... }
```

---

## Debugging Tips

### Enable Verbose Logging

Check console output for:
- ✅ Success messages
- ❌ Error messages
- 📊 Data counts
- 🔍 URL being crawled

### Check Database After Crawl

```bash
# Connect to database and check
npx prisma studio
# Or use your database client to run queries
```

### Test Individual Components

If crawler fails, test components separately:

1. **Test database connection**:
   ```bash
   npx prisma db pull
   ```

2. **Test Playwright**:
   ```bash
   npx playwright codegen https://www.trip.com
   ```

3. **Test crawler function directly** (in Node REPL):
   ```bash
   node
   > import { crawlTripCom } from './server/services/trip-crawler.ts'
   > await crawlTripCom({ maxPages: 1 })
   ```

---

## Next Steps

After successful local test:

1. ✅ Verify data appears in database
2. ✅ Check affiliate links have tracking parameters
3. ✅ Test unified search API includes crawled data
4. ✅ Push to GitHub and test GitHub Actions workflow

---

## Need Help?

If crawlers still don't work:

1. Check logs for specific error messages
2. Verify all environment variables are set
3. Ensure database is accessible
4. Try running with `CRAWL_MAX_PAGES=1` to reduce scope
5. Check GitHub Actions logs if testing in CI/CD

