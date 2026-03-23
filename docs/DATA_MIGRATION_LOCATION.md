# Data Migration Location Guide

## Where is the Migrated Data?

### Unified Event Table

All migrated data should be in the **`events`** database table. This is the unified table that replaces:
- `attractionsg_events` → `events` table with `platform='attractionsg'`
- `klook_activities` → `events` table with `platform='klook'`  
- `trip_scraped_data` → `events` table with `platform='trip'`

### Table Structure

The `events` table is mapped via Prisma schema:
```prisma
model Event {
  id                  String   @id @default(uuid())
  platform            String   // 'attractionsg', 'klook', 'trip'
  title               String
  // ... other fields
  @@map("events")  // ← Database table name
}
```

### How to Check if Data Exists

1. **Using Prisma Studio** (Visual):
   ```bash
   npx prisma studio
   ```
   Then navigate to the `Event` model to see all data.

2. **Using SQL Query**:
   ```sql
   -- Count events by platform
   SELECT platform, COUNT(*) as count 
   FROM events 
   GROUP BY platform;
   
   -- See all events
   SELECT id, platform, title, link, created_at 
   FROM events 
   ORDER BY created_at DESC 
   LIMIT 10;
   ```

3. **Using the Check Script**:
   ```bash
   npm run check:event-data
   ```

## What Happened if Tables Were Removed Before Migration?

If you ran `cleanup:deprecated` **before** running `migrate:events`, then:

⚠️ **The data was lost** when the tables were dropped.

### Recovery Options

1. **Check Backups**:
   - Look in the `backups/` directory for any backup files
   - Check if you have database backups from before cleanup

2. **Check if Migration Was Actually Run**:
   - The migration script should have created data in the `events` table
   - Run: `npm run check:event-data` to verify

3. **Re-crawl Data**:
   - If data was lost, you can re-crawl from the source:
     ```bash
     npm run crawl:attractionsg
     npm run crawl:klook
     npm run crawl:trip
     ```

## Correct Migration Order

The correct order should have been:

1. ✅ **Run Migration** (copies data from old tables to `events` table):
   ```bash
   npm run migrate:events
   ```

2. ✅ **Verify Data** (check that data exists in `events` table):
   ```bash
   npm run check:event-data
   ```

3. ✅ **Test Application** (ensure everything works with unified model)

4. ✅ **Run Cleanup** (remove old tables - only after verification):
   ```bash
   npm run cleanup:deprecated
   ```

## Current Status Check

Run this to see what tables exist:
```bash
# Check if events table exists
npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM events;" 2>&1

# Or check via Prisma
npm run check:event-data
```

## Next Steps

If the `events` table doesn't exist or is empty:

1. **Create the table** by running migrations:
   ```bash
   npx prisma migrate dev --name add_unified_event_model
   ```

2. **Re-crawl data** if original tables were removed:
   ```bash
   # These will populate the events table directly (crawlers were updated)
   npm run crawl:attractionsg
   npm run crawl:klook
   npm run crawl:trip
   ```

3. **Verify data exists**:
   ```bash
   npm run check:event-data
   ```
