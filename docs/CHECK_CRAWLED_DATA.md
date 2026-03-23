# How to Check Crawled Data in Database

## Database Tables

### Trip.com Data
**Table**: `trip_scraped_data`

### Klook Data
- **Activities**: `klook_activities` ⭐ (NEW - for widget crawling)
- **Promo Codes**: `klook_promo_codes`
- **Hotels**: `klook_hotel_deals`

### AttractionsSG Data
**Table**: `attractionsg_events`

---

## SQL Queries to Check Data

### Check Trip.com Deals

```sql
-- Count all deals
SELECT COUNT(*) FROM trip_scraped_data;

-- Count valid deals
SELECT COUNT(*) FROM trip_scraped_data WHERE "isValid" = true;

-- View recent deals
SELECT 
  title, 
  "discountedPrice", 
  currency, 
  category,
  "affiliateLink",
  "createdAt"
FROM trip_scraped_data 
WHERE "isValid" = true
ORDER BY "createdAt" DESC 
LIMIT 20;

-- Check by category
SELECT category, COUNT(*) 
FROM trip_scraped_data 
WHERE "isValid" = true
GROUP BY category;
```

### Check Klook Activities ⭐

```sql
-- Count all activities
SELECT COUNT(*) FROM klook_activities;

-- Count active activities
SELECT COUNT(*) FROM klook_activities WHERE "isActive" = true;

-- View recent activities
SELECT 
  title, 
  price, 
  currency,
  location,
  rating,
  "reviewCount",
  link,
  "createdAt"
FROM klook_activities 
WHERE "isActive" = true
ORDER BY "createdAt" DESC 
LIMIT 20;

-- Check by location
SELECT location, COUNT(*) 
FROM klook_activities 
WHERE "isActive" = true
GROUP BY location;

-- Check by category
SELECT category, COUNT(*) 
FROM klook_activities 
WHERE "isActive" = true
GROUP BY category;
```

### Check Klook Promo Codes

```sql
-- Count all promo codes
SELECT COUNT(*) FROM klook_promo_codes;

-- Count active promo codes
SELECT COUNT(*) FROM klook_promo_codes WHERE "isActive" = true;

-- View recent promo codes
SELECT 
  "promoCode",
  "discountDescription",
  "promoCodeDescription",
  "validUntil",
  "isActive"
FROM klook_promo_codes 
ORDER BY "importedAt" DESC 
LIMIT 20;
```

### Check Klook Hotels

```sql
-- Count all hotels
SELECT COUNT(*) FROM klook_hotel_deals;

-- Count active hotels
SELECT COUNT(*) FROM klook_hotel_deals WHERE "isActive" = true;

-- View recent hotels
SELECT 
  "hotelName",
  "originalPrice",
  "discountedPrice",
  currency,
  savings,
  "affiliateLink",
  "updatedAt"
FROM klook_hotel_deals 
WHERE "isActive" = true
ORDER BY "updatedAt" DESC 
LIMIT 20;
```

### Check Scraper Jobs

```sql
-- View recent jobs
SELECT 
  platform,
  "jobType",
  status,
  "startedAt",
  "completedAt",
  error
FROM scraper_jobs 
ORDER BY "createdAt" DESC 
LIMIT 10;

-- Check job status
SELECT 
  platform,
  status,
  COUNT(*) as count
FROM scraper_jobs 
GROUP BY platform, status;
```

---

## Using Prisma Studio (Visual Tool)

### Start Prisma Studio

```bash
npx prisma studio
```

This opens a web interface at `http://localhost:5555` where you can:
- Browse all tables
- View, edit, and delete records
- Filter and search data
- See relationships between tables

### Navigate to Tables

1. **Trip.com**: Click on `TripScrapedData` table
2. **Klook Activities**: Click on `KlookActivity` table ⭐
3. **Klook Promos**: Click on `KlookPromoCode` table
4. **Klook Hotels**: Click on `KlookHotelDeal` table

---

## Using Database Client

### PostgreSQL (psql)

```bash
# Connect to database
psql $DATABASE_URL

# Or with connection string
psql postgresql://user:password@host:5432/database
```

### DBeaver / pgAdmin

1. Connect using your `DATABASE_URL`
2. Navigate to tables in the schema
3. Right-click table → "View Data"

---

## Troubleshooting: No Data in Database

### Check Crawler Logs

Look for these messages:
- `✅ Stored X activities` - Data was saved
- `⚠️ Skipping activity` - Activity was skipped (check why)
- `✗ Error storing` - Storage failed (check error message)

### Common Issues

1. **No jobId provided**
   - Error: `⚠️ Skipping deal/activity - no jobId provided`
   - Fix: Ensure crawler is called with a jobId (API creates this automatically)

2. **Database connection error**
   - Check `DATABASE_URL` in `.env`
   - Verify database is accessible
   - Test: `npx prisma db pull`

3. **Table doesn't exist**
   - Run migrations: `npx prisma migrate deploy`
   - Generate client: `npx prisma generate`

4. **Data extracted but not stored**
   - Check storage function logs
   - Verify Prisma schema matches database
   - Check for validation errors

### Verify Storage Function is Called

Add logging to see if storage is invoked:

```typescript
// In crawler service
console.log(`📦 About to store ${activities.length} activities...`)
const stored = await storeKlookActivities(activities, jobId)
console.log(`✅ Storage complete: ${stored} stored`)
```

---

## Quick Verification Script

Create a test script to check data:

```bash
# Create check-data.ts
cat > scripts/check-data.ts << 'EOF'
import prisma from '../server/utils/prisma'

async function checkData() {
  console.log('📊 Database Data Summary\n')
  
  // Trip.com
  const tripCount = await prisma.tripScrapedData.count({ where: { isValid: true } })
  console.log(`Trip.com: ${tripCount} deals`)
  
  // Klook Activities
  const klookActivityCount = await prisma.klookActivity.count({ where: { isActive: true } })
  console.log(`Klook Activities: ${klookActivityCount} activities`)
  
  // Klook Promos
  const klookPromoCount = await prisma.klookPromoCode.count({ where: { isActive: true } })
  console.log(`Klook Promos: ${klookPromoCount} promo codes`)
  
  // Klook Hotels
  const klookHotelCount = await prisma.klookHotelDeal.count({ where: { isActive: true } })
  console.log(`Klook Hotels: ${klookHotelCount} hotels`)
  
  await prisma.$disconnect()
}

checkData()
EOF

# Run it
npx tsx scripts/check-data.ts
```

---

## Expected Results After Crawl

### Trip.com Crawl
- **Table**: `trip_scraped_data`
- **Expected**: 7+ deals (depending on URLs configured)
- **Check**: `SELECT COUNT(*) FROM trip_scraped_data WHERE "isValid" = true;`

### Klook Crawl (with Ad IDs)
- **Table**: `klook_activities` ⭐
- **Expected**: 20-50+ activities per Ad ID
- **Check**: `SELECT COUNT(*) FROM klook_activities WHERE "isActive" = true;`

### Klook Promo Codes
- **Table**: `klook_promo_codes`
- **Expected**: 0 (requires manual CSV import)
- **Check**: `SELECT COUNT(*) FROM klook_promo_codes;`

### Klook Hotels
- **Table**: `klook_hotel_deals`
- **Expected**: 0-20+ hotels (depends on location)
- **Check**: `SELECT COUNT(*) FROM klook_hotel_deals WHERE "isActive" = true;`

---

## Next Steps

If you see data in logs but not in database:

1. ✅ Check storage function is implemented (it is now for activities)
2. ✅ Verify migrations are run: `npx prisma migrate deploy`
3. ✅ Check for errors in crawler logs
4. ✅ Run verification script above
5. ✅ Check Prisma Studio for data

