# Unified Event Model Migration Guide

## Overview

This document outlines the migration from platform-specific database tables (AttractionsgEvent, KlookActivity, TripScrapedData) to a unified `Event` model that supports all platforms.

## Why Unified Model?

1. **Scalability**: Easy to add new platforms without creating new tables
2. **Consistency**: Unified API structure across all platforms
3. **Maintainability**: Single codebase for event management
4. **Flexibility**: Platform-specific fields stored in `metadata` JSON field

## Database Schema

### New Unified Model: `Event`

```prisma
model Event {
  id                  String   @id @default(uuid())
  platform            String   // 'attractionsg', 'klook', 'trip', etc.
  title               String
  slug                String?
  description         String?  @db.Text
  
  // Pricing
  priceText           String?
  priceAmount         Float?
  resellerPriceAmount Float?
  originalPriceText   String?
  originalPriceAmount Float?
  publicPrice         Float?   // Admin-set public price
  discountedPrice     Decimal? // For Trip.com deals
  discount            String?
  currency            String?  @default("SGD")
  
  // Media
  image               String?
  gallery             String[]
  
  // Location & Details
  location            String?
  category            String?
  rating              Float?
  reviewCount         Int?
  
  // Links
  link                String?  // Original URL (affiliate tracking added when displaying)
  sourceUrl           String?  // Source URL for scraping
  
  // Dates & Validity
  duration            String?
  ageRestriction      String?
  cancellation        String?
  validFrom           String?
  validTo             String?
  dates               String?
  
  // Publishing & Status
  lastSeenAt          DateTime @default(now())
  isActive            Boolean  @default(true)
  isPublished         Boolean  @default(false)
  publishedAt         DateTime?
  
  // Admin Fields
  notes               String?  @db.Text
  isSelfBookable      Boolean  @default(false)
  stripePriceId       String?
  checkoutNotes       String?  @db.Text
  
  // Relations
  bookings            EventBooking[]
  scraperJobId        String?
  scraperJob          ScraperJob?
  
  // Raw data storage
  raw                 Json?
  metadata            Json?
  
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
  
  @@unique([platform, link], name: "platform_link_unique")
  @@index([platform])
  @@index([platform, category])
  @@index([platform, isPublished])
  @@index([platform, isActive])
}
```

### Updated Booking Model: `EventBooking`

```prisma
model EventBooking {
  id                    String        @id @default(cuid())
  eventId               String        @db.Uuid
  platform              String        // 'attractionsg', 'klook', 'trip', etc.
  // ... other fields ...
  
  event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)
}
```

## Deprecated Tables

The following tables are marked as deprecated and will be removed after migration:

- `AttractionsgEvent` → Use `Event` with `platform='attractionsg'`
- `KlookActivity` → Use `Event` with `platform='klook'`
- `TripScrapedData` → Use `Event` with `platform='trip'`
- `AttractionsgBooking` → Use `EventBooking` with `platform='attractionsg'`

## Migration Steps

### Phase 1: Schema Update ✅

- [x] Created unified `Event` model
- [x] Created unified `EventBooking` model
- [x] Marked old tables as deprecated in schema
- [x] Updated Prisma schema

### Phase 2: API Migration (In Progress)

#### Completed:
- [x] Updated `/api/admin/klook` GET to use `Event` model
- [x] Updated `/api/admin/klook` POST to use `Event` model

#### Pending:
- [ ] Update `/api/admin/attractionsg` to use `Event` model
- [ ] Update `/api/attractionsg/events` to use `Event` model
- [ ] Update `/api/attractionsg/event/[slug]` to use `Event` model
- [ ] Update `/api/trip/*` endpoints to use `Event` model
- [ ] Update all crawlers to write to `Event` model
- [ ] Update frontend components to use unified model

### Phase 3: Data Migration

1. **Create migration script** to copy data from old tables to `Event`:
   ```typescript
   // Migrate AttractionsgEvent → Event
   // Migrate KlookActivity → Event
   // Migrate TripScrapedData → Event
   // Migrate AttractionsgBooking → EventBooking
   ```

2. **Run migration** in development environment

3. **Verify data integrity**

4. **Deploy to production**

### Phase 4: Cleanup

- [ ] Remove deprecated table models from Prisma schema
- [ ] Remove old API endpoint implementations
- [ ] Update all frontend code
- [ ] Drop old tables from database

## API Changes

### GET /api/admin/klook

**Before**: Queried `KlookActivity` table
**After**: Queries `Event` table with `platform='klook'`

**Response Schema**: Now uses unified `Event` schema

### POST /api/admin/klook

**Before**: Updated `KlookActivity` table
**After**: Updates `Event` table with `platform='klook'`

**Request Body**:
```typescript
{
  id: string
  isActive?: boolean
  isPublished?: boolean
  publishedAt?: string | null
  publicPrice?: number | null
  notes?: string | null
  isSelfBookable?: boolean
  stripePriceId?: string | null
  checkoutNotes?: string | null
}
```

## Frontend Changes

### Klook Events Page

The Klook events admin page (`/admin/scrapers/klook`) now:
- Uses `Event` model fields (`priceAmount`, `originalPriceAmount` instead of `price`, `originalPrice`)
- Appends affiliate ID to URLs when displaying to users
- Supports full event management (publishing, pricing, etc.)

### Affiliate Link Handling

Klook URLs are automatically appended with affiliate ID when displaying to users:

```typescript
import { appendKlookAffiliateId } from '~/utils/affiliate-links'

const affiliateLink = appendKlookAffiliateId(
  event.link, 
  runtimeConfig.public?.KLOOK_AD_ID || runtimeConfig.public?.KLOOK_AFFILIATE_ID
)
```

## Field Mapping Reference

### AttractionsgEvent → Event

| AttractionsgEvent | Event | Notes |
|-------------------|-------|-------|
| (all fields same) | (all fields same) | Direct mapping, platform='attractionsg' |

### KlookActivity → Event

| KlookActivity | Event | Notes |
|---------------|-------|-------|
| `price` | `priceAmount` | Converted to numeric |
| `originalPrice` | `originalPriceAmount` | Converted to numeric |
| (no slug) | `slug` | Generated from title |
| `link` | `link` | Same, affiliate ID added on display |
| (no isPublished) | `isPublished` | New field |
| `isActive` | `isActive` | Same |

### TripScrapedData → Event

| TripScrapedData | Event | Notes |
|-----------------|-------|-------|
| `dealPrice` | `discountedPrice` | Price after discount |
| `originalPrice` | `originalPriceAmount` | Original price |
| `discountPercent` | `discount` | Stored as string |
| `validDates` | `dates` | Date range string |
| `sourceUrl` | `sourceUrl` | Same |
| `link` | `link` | Same, affiliate IDs added on display |

## Testing Checklist

- [ ] Verify Klook events can be loaded via admin API
- [ ] Verify Klook events can be updated (active status, etc.)
- [ ] Verify affiliate links are correctly appended
- [ ] Verify AttractionsSG events still work
- [ ] Verify Trip.com events still work
- [ ] Verify event booking creation works
- [ ] Verify frontend displays events correctly

## Rollback Plan

If issues occur:
1. Keep old tables in schema (marked as deprecated)
2. API endpoints can temporarily switch back to old tables
3. Run data migration script in reverse if needed

## Next Steps

1. Complete API migration for all endpoints
2. Create data migration script
3. Test in development environment
4. Deploy to production
5. Monitor for issues
6. Remove deprecated tables after verification period
