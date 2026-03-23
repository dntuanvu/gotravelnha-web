# Migration Execution Guide

## Overview

This guide walks through executing the migration from platform-specific tables to the unified Event model.

## Prerequisites

1. ✅ All API endpoints updated to use Event model (completed)
2. ✅ Crawler services updated to use Event model (completed)
3. ✅ Database backup created
4. ✅ Tested in development environment

## Migration Steps

### Step 1: Dry Run Migration

Test the migration without making changes:

```bash
tsx scripts/migrate-to-unified-event-model.ts --dry-run
```

This will:
- Show what data will be migrated
- Identify any issues
- Provide statistics without modifying data

### Step 2: Perform Migration

Once dry run is successful:

```bash
tsx scripts/migrate-to-unified-event-model.ts
```

This will:
- Create a backup
- Migrate all data from old tables to Event model
- Show migration statistics

### Step 3: Verify Data Integrity

After migration, verify:

```sql
-- Check event counts by platform
SELECT platform, COUNT(*) as count 
FROM events 
GROUP BY platform;

-- Compare with original counts
SELECT 'AttractionsSG' as source, COUNT(*) FROM attractionsg_events
UNION ALL
SELECT 'Klook', COUNT(*) FROM klook_activities
UNION ALL
SELECT 'Trip', COUNT(*) FROM trip_scraped_data;
```

### Step 4: Test Application

1. Test admin panels:
   - `/admin/scrapers/attractionsg` - Should load events
   - `/admin/scrapers/klook` - Should load events
   - `/admin/scrapers` - Should show all platforms

2. Test public APIs:
   - `/api/attractionsg/events` - Should return events
   - `/api/activities/compare` - Should compare activities
   - `/api/search/global` - Should search across platforms

3. Test affiliate links:
   - Verify Klook URLs have affiliate ID appended
   - Verify Trip.com URLs have affiliate parameters

### Step 5: Cleanup Deprecated Tables (After Verification)

⚠️ **Only after thorough testing and verification!**

#### Dry run cleanup:

```bash
tsx scripts/remove-deprecated-tables.ts --dry-run
```

#### Perform cleanup:

```bash
tsx scripts/remove-deprecated-tables.ts --confirm
```

This will:
- Create a backup
- Drop deprecated tables
- Update Prisma schema

#### Regenerate Prisma client:

```bash
npx prisma generate
npx prisma migrate dev --name remove_deprecated_tables
```

## Rollback Procedure

If issues occur after migration:

1. **Stop the application immediately**

2. **Restore from backup** (if using database backup):
   ```bash
   # Using pg_restore or similar
   pg_restore -d your_database backup_file.dump
   ```

3. **Revert code changes**:
   ```bash
   git revert <migration-commit>
   ```

4. **Restart application**:
   ```bash
   npm run dev
   ```

## Migration Statistics

Expected migration counts (your actual counts may vary):

- **AttractionsSG Events**: ~100-500 events
- **Klook Activities**: ~50-200 activities
- **Trip.com Deals**: ~100-1000 deals
- **Bookings**: ~10-100 bookings

## Troubleshooting

### Issue: Migration fails with duplicate key error

**Solution**: Some events may already exist. The script skips duplicates automatically.

### Issue: Booking migration fails

**Solution**: Bookings migration requires events to be migrated first. Re-run after events are migrated.

### Issue: Missing data after migration

**Solution**: 
1. Check migration logs for errors
2. Verify source tables still have data
3. Check for data type mismatches
4. Re-run migration (it's safe to run multiple times)

### Issue: Application errors after migration

**Solution**:
1. Check that Prisma client is regenerated: `npx prisma generate`
2. Verify API endpoints are using Event model
3. Check database connection
4. Review error logs

## Post-Migration Checklist

- [ ] Migration completed successfully
- [ ] Data integrity verified
- [ ] All API endpoints working
- [ ] Admin panels displaying data correctly
- [ ] Public pages loading correctly
- [ ] Affiliate links working
- [ ] No errors in logs
- [ ] Performance acceptable
- [ ] Backup created before cleanup
- [ ] Cleanup completed (if verified)
- [ ] Production deployment successful

## Production Deployment

1. **Create production backup**
2. **Schedule maintenance window** (if needed)
3. **Run migration** in production
4. **Verify immediately** after migration
5. **Monitor** for 24-48 hours
6. **Schedule cleanup** after verification period

## Support

If you encounter issues:

1. Check the migration logs
2. Review error messages
3. Check database constraints
4. Verify environment variables
5. Contact development team if needed
