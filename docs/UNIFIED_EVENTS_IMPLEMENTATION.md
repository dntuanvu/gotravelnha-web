# Unified Events Implementation & API Documentation

## Summary

This document outlines the implementation of a unified Event model across all platforms and the setup of comprehensive API documentation using OpenAPI/Swagger.

---

## ✅ Completed Tasks

### 1. Unified Event Model Created

**Location:** `prisma/schema.prisma`

A new unified `Event` model has been created to replace platform-specific tables:
- `AttractionsgEvent` (deprecated)
- `KlookActivity` (deprecated)
- `TripScrapedData` (deprecated)

**Key Features:**
- Platform field to distinguish between 'attractionsg', 'klook', 'trip', etc.
- Comprehensive fields supporting all platform features
- Unified booking model (`EventBooking`) linking to events
- Backward compatible structure to ease migration

**Schema Highlights:**
```prisma
model Event {
  id                  String   @id @default(uuid()) @db.Uuid
  platform            String   // 'attractionsg', 'klook', 'trip', etc.
  title               String
  // ... pricing fields
  // ... media fields
  // ... location & details
  // ... publishing & status
  // ... admin fields (pricing controls, Stripe integration)
  // ... relations
}
```

### 2. Klook Events Management Page

**Location:** `pages/admin/scrapers/klook.vue`

Created a comprehensive admin page for managing Klook events:
- View all scraped Klook events
- Search and filter functionality
- Bulk activate/deactivate events
- View original and affiliate links
- Copy affiliate links with tracking

**Features:**
- Event listing with pagination
- Search by title, location, category
- Status filtering (active/inactive)
- Sorting options (latest, alphabetical, price)
- Affiliate link generation with Klook affiliate ID

### 3. Klook Admin API Endpoints

**Locations:**
- `server/api/admin/klook/index.get.ts` - Fetch Klook events
- `server/api/admin/klook/index.post.ts` - Update Klook events

**Endpoints:**
- `GET /api/admin/klook` - List events with filtering/pagination
- `POST /api/admin/klook` - Update event status (isActive)

### 4. Affiliate Link Utilities

**Location:** `utils/affiliate-links.ts`

Created utility functions for appending affiliate tracking to platform URLs:

- `appendKlookAffiliateId(url, affiliateId?)` - Appends `aid` parameter to Klook URLs
- `appendTripAffiliateIds(url, allianceId?, sid?)` - Appends Trip.com affiliate parameters
- `generateAffiliateLink(url, platform)` - Platform-agnostic affiliate link generator

**Usage:**
```typescript
import { appendKlookAffiliateId } from '~/utils/affiliate-links'

// Client-side (uses runtime config)
const affiliateLink = appendKlookAffiliateId(originalUrl, runtimeConfig.public.KLOOK_AD_ID)

// Server-side (uses env vars)
const affiliateLink = appendKlookAffiliateId(originalUrl)
```

### 5. OpenAPI/Swagger Documentation

**Locations:**
- `server/api/docs/openapi.json` - OpenAPI 3.0 specification
- `server/api/docs/index.get.ts` - API endpoint serving the spec
- `pages/api-docs.vue` - Swagger UI documentation page

**Access Points:**
- JSON Spec: `http://localhost:3000/api/docs`
- UI Documentation: `http://localhost:3000/api-docs`

**Documented APIs:**
- Admin endpoints (events management, scraper management, users)
- Event endpoints (AttractionsSG, Klook, Trip.com)
- Scraper endpoints (crawl jobs, sources)
- Auth endpoints (login, register)
- Booking endpoints (checkout)
- And more...

---

## 🔄 Pending Tasks

### 1. Database Migration

**Status:** Pending

Create a migration script to:
1. Migrate data from platform-specific tables to unified `Event` table
2. Map old fields to new unified structure
3. Update foreign key relationships
4. Verify data integrity

**Migration Strategy:**
```sql
-- Example migration steps:
-- 1. Create Event table
-- 2. Migrate AttractionsgEvent → Event (platform='attractionsg')
-- 3. Migrate KlookActivity → Event (platform='klook')
-- 4. Migrate TripScrapedData → Event (platform='trip')
-- 5. Update EventBooking to reference Event
-- 6. Verify data
-- 7. Remove old tables (after verification)
```

### 2. Update All API Endpoints

**Status:** Pending

Update all API endpoints to use the unified `Event` model:
- `server/api/admin/attractionsg/*` → Use `Event` with `platform='attractionsg'`
- `server/api/admin/klook/*` → Use `Event` with `platform='klook'`
- `server/api/attractionsg/*` → Use `Event` with `platform='attractionsg'`
- Crawler services → Save to `Event` table
- Public display endpoints → Filter by `platform` and `isPublished`

### 3. Remove Platform-Specific Tables

**Status:** Pending (after migration)

Once migration is complete and verified:
1. Remove `AttractionsgEvent` model from schema
2. Remove `KlookActivity` model from schema
3. Remove `TripScrapedData` model from schema
4. Update `ScraperJob` relations
5. Run final migration

---

## 📋 Implementation Details

### Unified Event Model Fields

The unified `Event` model includes all fields needed across platforms:

**Core Fields:**
- `id`, `platform`, `title`, `slug`, `description`

**Pricing Fields:**
- `priceText`, `priceAmount`, `resellerPriceAmount`
- `originalPriceText`, `originalPriceAmount`
- `publicPrice` (admin-set price)
- `discountedPrice`, `discount` (for deals)
- `currency`

**Media:**
- `image`, `gallery[]`

**Location & Details:**
- `location`, `category`
- `rating`, `reviewCount`

**Links:**
- `link` (original public URL)
- `sourceUrl` (source for scraping)

**Dates & Validity:**
- `duration`, `ageRestriction`, `cancellation`
- `validFrom`, `validTo`, `dates`

**Publishing:**
- `isActive`, `isPublished`, `publishedAt`
- `lastSeenAt`

**Admin:**
- `notes`, `isSelfBookable`, `stripePriceId`, `checkoutNotes`

**Relations:**
- `bookings[]`, `scraperJob`

### Klook Affiliate Link Generation

When displaying Klook URLs to users, the affiliate ID (`aid` parameter) is automatically appended:

1. **Original URL:** `https://www.klook.com/activity/12345/`
2. **With Affiliate:** `https://www.klook.com/activity/12345/?aid=YOUR_AFFILIATE_ID`

The affiliate ID comes from:
- Environment variable: `KLOOK_AD_ID` or `KLOOK_AFFILIATE_ID`
- Runtime config (public): Available client-side
- Can be passed explicitly as parameter

### API Documentation Structure

The OpenAPI specification includes:
- **Info:** API title, version, description
- **Servers:** Development and production URLs
- **Tags:** Organized by feature area
- **Paths:** All documented endpoints
- **Schemas:** Request/response models
- **Security:** Authentication schemes
- **Responses:** Error responses

---

## 🚀 Next Steps

1. **Run Database Migration**
   - Create migration script
   - Test on development database
   - Verify data integrity
   - Deploy to production

2. **Update API Endpoints**
   - Refactor to use `Event` model
   - Add platform filtering
   - Update response formats
   - Test all endpoints

3. **Update Frontend Components**
   - Update event display components
   - Use unified Event interface
   - Update affiliate link generation calls

4. **Testing**
   - Integration tests for unified model
   - API endpoint tests
   - Migration verification tests

5. **Documentation Updates**
   - Update API documentation after migration
   - Document migration process
   - Update developer guides

---

## 📝 Notes

- Platform-specific tables are marked as `DEPRECATED` in schema
- Existing APIs continue to work during transition
- Migration should be done in phases to minimize downtime
- Affiliate link generation works seamlessly across platforms
- OpenAPI spec can be extended as new endpoints are added

---

## 🔗 Related Files

- **Schema:** `prisma/schema.prisma`
- **Klook Admin Page:** `pages/admin/scrapers/klook.vue`
- **Klook APIs:** `server/api/admin/klook/*`
- **Affiliate Utils:** `utils/affiliate-links.ts`
- **OpenAPI Spec:** `server/api/docs/openapi.json`
- **Docs Page:** `pages/api-docs.vue`

---

## ✅ Verification Checklist

- [x] Unified Event model created
- [x] Klook events management page created
- [x] Klook admin API endpoints created
- [x] Affiliate link utilities created
- [x] OpenAPI specification created
- [x] Documentation page created
- [ ] Database migration script created
- [ ] All APIs updated to use unified model
- [ ] Platform-specific tables removed
- [ ] All tests passing
- [ ] Documentation updated
