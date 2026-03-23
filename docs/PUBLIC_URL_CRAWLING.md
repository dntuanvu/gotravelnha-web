# Public URL Crawling Strategy

## Overview

This document explains the new crawling strategy that uses **public URLs** instead of affiliate-specific links. Affiliate IDs are appended transparently when displaying activities to users.

## Why Public URLs?

### Problems with Affiliate-Only Crawling:
- ❌ Affiliate links are limited by platform quotas
- ❌ Dependent on affiliate portal availability
- ❌ Cannot access full public catalog
- ❌ Widget-based crawling is complex and unreliable

### Benefits of Public URL Crawling:
- ✅ Access to complete public catalog (100,000+ items)
- ✅ No dependency on affiliate portal quotas
- ✅ More reliable and scalable
- ✅ Transparent to users - affiliate tracking added only when displaying
- ✅ Easier to maintain and debug

## Architecture

### Crawling Phase (No Affiliate Tracking)
1. Crawlers visit **public URLs** only:
   - Klook: `https://www.klook.com/en-US/search/?query=singapore`
   - Trip.com: `https://www.trip.com/things-to-do/`
2. Extract activity data and **original public URLs**
3. Store in database **without affiliate parameters**

### Display Phase (Affiliate Tracking Added)
1. API endpoints fetch activities from database
2. **Add affiliate tracking** when returning data to frontend
3. Users click links with affiliate IDs appended
4. Commission is tracked transparently

## Implementation

### Klook Crawler

**Public URLs Used:**
- Search pages: `https://www.klook.com/en-US/search/?query={location}`
- Category pages: `https://www.klook.com/en-US/search/?query={location}&category={category}`
- Destination pages: `https://www.klook.com/en-US/city/{location}/`

**Configuration:**
```env
# Public URLs for crawling (comma-separated)
KLOOK_PUBLIC_URLS=https://www.klook.com/en-US/search/?query=singapore,https://www.klook.com/en-US/search/?query=tokyo
```

### Trip.com Crawler

**Public URLs Used:**
- Sale pages: `https://www.trip.com/sale/`
- Activity pages: `https://www.trip.com/things-to-do/`
- Specific destinations: `https://www.trip.com/things-to-do/list/singapore/`

**Configuration:**
```env
# Public URLs for crawling (comma-separated)
TRIP_PUBLIC_URLS=https://www.trip.com/things-to-do/,https://www.trip.com/sale/
```

## Database Storage

### KlookActivity Model
```typescript
{
  link: string // Original public URL (no affiliate params)
  // ... other fields
}
```

### TripScrapedData Model
```typescript
{
  affiliateLink: string // Original public URL (no affiliate params)
  // ... other fields
}
```

## Affiliate Tracking Application

### API Layer (`server/api/activities/compare.ts`)
```typescript
// When returning data to frontend
klook: {
  link: addKlookAffiliateTracking(
    activity.link, // Original public URL
    undefined,
    'gotravelnha-activity-compare'
  )
}
```

### Frontend Layer
Affiliate tracking is added before displaying to users, ensuring transparency.

## URL Cleaning

Crawlers automatically clean URLs to remove any existing affiliate parameters:

**Klook:**
- Removes: `aid`, `utm_source`, `utm_campaign`, `utm_medium`

**Trip.com:**
- Removes: `Allianceid`, `SID`, `trip_campaign`, `utm_source`, `utm_medium`

This ensures we store only pure public URLs.

## Configuration

### Environment Variables

```env
# Klook
KLOOK_PUBLIC_URLS=https://www.klook.com/en-US/search/?query=singapore
KLOOK_CRAWL_ENABLED=true

# Trip.com
TRIP_PUBLIC_URLS=https://www.trip.com/things-to-do/
TRIP_CRAWL_ENABLED=true

# Affiliate IDs (used when displaying, not crawling)
KLOOK_AD_ID=your_klook_ad_id
TRIP_ALLIANCE_ID=your_alliance_id
TRIP_SID=your_sid
```

### Database Configuration

Add public URLs to `ScraperSource` table:

```sql
-- Klook public URLs
INSERT INTO scraper_sources (url, platform, source_type, is_active)
VALUES 
  ('https://www.klook.com/en-US/search/?query=singapore', 'klook', 'public_url', true),
  ('https://www.klook.com/en-US/search/?query=tokyo', 'klook', 'public_url', true);

-- Trip.com public URLs
INSERT INTO scraper_sources (url, platform, source_type, is_active)
VALUES 
  ('https://www.trip.com/things-to-do/', 'trip', 'public_url', true),
  ('https://www.trip.com/activities/', 'trip', 'public_url', true);
```

## Migration from Old System

1. **Existing Data:** URLs with affiliate parameters will be cleaned automatically on next crawl
2. **Crawlers:** Will now use public URLs instead of widget/ad IDs
3. **APIs:** Will add affiliate tracking when returning data

## Best Practices

1. **Use Public URLs Only:** Never crawl from affiliate-specific links
2. **Store Clean URLs:** Remove any affiliate parameters before storing
3. **Add Tracking at Display:** Apply affiliate IDs only when showing to users
4. **Monitor URLs:** Ensure public URLs are accessible and not blocked
5. **Rate Limiting:** Respect robots.txt and add delays between requests

## Troubleshooting

### No Activities Found
- Verify public URLs are accessible
- Check selectors match current page structure
- Ensure URLs don't require authentication

### Affiliate Tracking Not Working
- Verify affiliate IDs in environment variables
- Check `addKlookAffiliateTracking()` and `addTripAffiliateTracking()` functions
- Ensure links are being processed in API layer

### Duplicate Activities
- URL cleaning might not be working
- Check if same activity exists with different URLs
- Verify deduplication logic

## Related Files

- `server/services/klook-crawler.ts` - Klook public URL crawler
- `server/services/trip-crawler.ts` - Trip.com public URL crawler
- `server/api/activities/compare.ts` - Adds affiliate tracking when displaying
- `server/utils/affiliate-tracking.ts` - Affiliate tracking utilities
