# Database Migration Guide: Unified Event Model

## Overview

This guide walks through migrating from platform-specific database tables to the unified `Event` model.

## Pre-Migration Checklist

- [ ] Backup your database
- [ ] Test migration script in development/staging environment
- [ ] Verify all API endpoints have been updated to use unified Event model
- [ ] Ensure no code references old table names (`AttractionsgEvent`, `KlookActivity`, `TripScrapedData`)

## Migration Steps

### Step 1: Run Migration Script

```bash
npx tsx prisma/migrations/migrate_to_unified_event.ts
```

The script will:
1. Migrate `AttractionsgEvent` → `Event` (platform='attractionsg')
2. Migrate `KlookActivity` → `Event` (platform='klook')
3. Migrate `TripScrapedData` → `Event` (platform='trip')
4. Migrate `AttractionsgBooking` → `EventBooking`

### Step 2: Verify Migration Results

Check the migration summary output for:
- Number of records migrated per platform
- Number of errors (should be 0)

### Step 3: Verify Data Integrity

Run these queries to verify:

```sql
-- Check total events by platform
SELECT platform, COUNT(*) as count 
FROM events 
GROUP BY platform;

-- Compare counts with old tables
SELECT COUNT(*) FROM attractionsg_events;
SELECT COUNT(*) FROM klook_activities;
SELECT COUNT(*) FROM trip_scraped_data;

-- Verify booking migration
SELECT platform, COUNT(*) as count 
FROM event_bookings 
GROUP BY platform;
```

### Step 4: Test Application

1. Test admin endpoints:
   - `/api/admin/attractionsg` - Should return events
   - `/api/admin/klook` - Should return events
   
2. Test public endpoints:
   - `/api/attractionsg/events` - Should return published events
   - `/api/attractionsg/event/[slug]` - Should return single event

3. Test crawlers:
   - Run AttractionsSG crawl
   - Run Klook crawl
   - Run Trip.com crawl
   - Verify new events are created in unified `events` table

### Step 5: Remove Deprecated Tables

**⚠️ Only after successful verification!**

1. Update Prisma schema to remove deprecated models:
   - Remove `AttractionsgEvent` model
   - Remove `KlookActivity` model
   - Remove `TripScrapedData` model
   - Remove `AttractionsgBooking` model (if exists)

2. Create Prisma migration:

```bash
npx prisma migrate dev --name remove_deprecated_tables
```

3. Verify migration:

```bash
npx prisma migrate status
```

4. Push changes (if using Prisma migrations):

```bash
npx prisma migrate deploy
```

### Step 6: Clean Up Code

Search for any remaining references to old table names:

```bash
# Search for old table references
grep -r "AttractionsgEvent" --include="*.ts" --include="*.vue"
grep -r "KlookActivity" --include="*.ts" --include="*.vue"
grep -r "TripScrapedData" --include="*.ts" --include="*.vue"
grep -r "AttractionsgBooking" --include="*.ts" --include="*.vue"
```

Remove any remaining references.

## Rollback Plan

If issues occur after migration:

1. **Don't delete old tables yet** - Keep them as backup
2. Temporarily revert API endpoints to use old tables
3. Fix issues with migration script
4. Re-run migration after fixes

## Troubleshooting

### Migration Script Errors

If you encounter errors:

1. Check database connection
2. Verify Prisma schema is up to date
3. Check for data type mismatches
4. Review error messages in console output

### Data Count Mismatches

If migrated counts don't match original counts:

1. Check for duplicate records (by link or title)
2. Verify unique constraints are working
3. Review skipped records in migration output

### Foreign Key Issues

If you encounter foreign key errors:

1. Check `EventBooking` references `Event` correctly
2. Verify `scraperJobId` references exist
3. Check for orphaned records

## Post-Migration

After successful migration:

1. ✅ Update documentation
2. ✅ Remove old table references from code
3. ✅ Update API documentation (Swagger)
4. ✅ Monitor application for any issues
5. ✅ Remove old tables after verification period (e.g., 30 days)
