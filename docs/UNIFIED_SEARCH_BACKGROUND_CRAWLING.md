# Unified Search - Background Crawling for Trip.com & Klook

## Overview

This document outlines the implementation of background crawling systems for Trip.com and Klook, similar to the existing AttractionsSG crawler. This enables unified search to work with fresh, crawled data from all platforms.

## Current State

### ✅ What Works
- **AttractionsSG**: Full background crawling via `/api/attractionsg/crawl` with Playwright
- **Trip.com**: Manual scraping endpoints exist (`/api/trip/scrape-promotions`) but no background sync
- **Klook**: Promo codes and hotel deals stored, but no automated crawling

### 🎯 Goal
Implement automated background crawling for Trip.com and Klook that:
1. Runs on a schedule (similar to AttractionsSG)
2. Stores data in database for unified search
3. Updates existing records, creates new ones
4. Handles authentication and rate limiting
5. Provides admin UI for monitoring

---

## Implementation Plan

### Phase 1: Trip.com Background Crawler

#### 1.1 Crawler Service
**File:** `server/services/trip-crawler.ts`

**Features:**
- Crawl Trip.com promotional sale pages
- Extract deal details (title, price, description, images, affiliate links)
- Handle pagination for listing pages
- Parse individual deal pages for detailed info
- Store/update records in `TripScrapedData` table

**Strategy:**
```typescript
// Key URLs to crawl:
1. Sale pages: https://sg.trip.com/sale/w/{id}/{slug}.html
2. Category pages: Hotels, Flights, Activities
3. Popular deals (if accessible via affiliate portal)

// Data extracted:
- Title, description, images
- Prices (original, discounted)
- Affiliate links with tracking
- Location, category, dates
- Discount percentages
```

#### 1.2 API Endpoint
**File:** `server/api/trip/crawl.post.ts`

**Features:**
- Accept crawl configuration (URLs, categories, max pages)
- Run crawl as background job
- Return job status immediately
- Similar structure to AttractionsSG crawler

#### 1.3 Background Sync
**File:** `server/services/trip-sync.ts`

**Features:**
- Scheduled crawls (daily/weekly)
- Configurable via environment variables
- Tracks last crawl time
- Incremental updates (only crawl new/changed deals)

---

### Phase 2: Klook Background Crawler

#### 2.1 Crawler Service
**File:** `server/services/klook-crawler.ts`

**Features:**
- Crawl Klook activities via widget/API
- Extract promo codes from affiliate portal
- Extract hotel deals
- Store in `KlookPromoCode` and `KlookHotelDeal` tables

**Strategy:**
```typescript
// Data Sources:
1. Dynamic Widgets (embed URLs) - scrape widget content
2. Promo Codes - affiliate portal export or scraping
3. Hotel Deals - affiliate portal or public pages
4. Activity listings - category pages

// Key challenges:
- May require affiliate portal login
- Dynamic content loading (needs Playwright)
- Rate limiting considerations
```

#### 2.2 API Endpoint
**File:** `server/api/klook/crawl.post.ts`

**Features:**
- Crawl activities by category/location
- Crawl promo codes
- Crawl hotel deals
- Background job execution

#### 2.3 Background Sync
**File:** `server/services/klook-sync.ts`

**Features:**
- Scheduled crawls for different data types
- Separate schedules for promos vs activities vs hotels
- Handles authentication tokens if needed

---

### Phase 3: Unified Crawler Orchestrator

#### 3.1 Orchestrator Service
**File:** `server/services/crawler-orchestrator.ts`

**Features:**
- Manages all platform crawlers
- Coordinates scheduling
- Handles failures and retries
- Provides status dashboard data

#### 3.2 Admin UI
**File:** `pages/admin/crawlers.vue` (enhance existing)

**Features:**
- View crawl status for all platforms
- Trigger manual crawls
- View crawl history and logs
- Configure crawl schedules
- View data statistics per platform

---

## Technical Implementation

### Database Schema (Already Exists)

**Trip.com:**
```prisma
model TripScrapedData {
  id              String   @id @default(cuid())
  title           String?
  description     String?
  originalPrice   Float?
  discountedPrice Float?
  currency        String?
  image           String?
  affiliateLink   String?
  sourceUrl       String?
  category        String?
  location        String?
  discount        String?
  discountPercent String?
  isValid         Boolean  @default(true)
  metadata        Json?
  jobId           String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  job             ScraperJob? @relation(fields: [jobId], references: [id])
}
```

**Klook:**
```prisma
model KlookPromoCode {
  id                    String   @id @default(cuid())
  promoCode             String   @unique
  promoCodeDescription  String?
  affiliateDescription  String?
  discountDescription   String?
  termsAndConditions    String?
  validUntil            DateTime
  redeemFrom            DateTime?
  redeemBefore          DateTime?
  isActive              Boolean  @default(true)
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}

model KlookHotelDeal {
  id            String   @id @default(cuid())
  hotelName     String?
  title         String?
  description   String?
  price         Float?
  originalPrice Float?
  discountedPrice Float?
  currency      String?
  image         String?
  affiliateLink String?
  location      String?
  category      String?
  discountPercent String?
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

### Crawler Pattern (Following AttractionsSG)

```typescript
// Standard crawler structure:
1. Launch Playwright browser
2. Navigate to target URLs
3. Extract data with selectors/parsing
4. Normalize data format
5. Store in database (upsert by unique identifier)
6. Handle errors gracefully
7. Log progress and results
```

---

## Environment Variables

```env
# Trip.com Crawler
TRIP_CRAWL_ENABLED=true
TRIP_CRAWL_INTERVAL=86400000  # 24 hours
TRIP_AFFILIATE_ID=your_affiliate_id
TRIP_CRAWL_SALE_PAGES=true
TRIP_CRAWL_MAX_PAGES=10

# Klook Crawler
KLOOK_CRAWL_ENABLED=true
KLOOK_CRAWL_INTERVAL=43200000  # 12 hours
KLOOK_AFFILIATE_ID=your_affiliate_id
KLOOK_CRAWL_WIDGETS=true
KLOOK_CRAWL_PROMO_CODES=true
KLOOK_CRAWL_HOTELS=true

# Crawler General
CRAWLER_CONCURRENT_JOBS=3
CRAWLER_TIMEOUT=60000
CRAWLER_RETRY_ATTEMPTS=3
```

---

## API Endpoints

### Trip.com
```
POST /api/trip/crawl
Body: {
  fullCrawl?: boolean
  maxPages?: number
  categories?: string[]
  urls?: string[]
}

Response: {
  success: boolean
  jobId: string
  message: string
}
```

### Klook
```
POST /api/klook/crawl
Body: {
  type?: 'activities' | 'promos' | 'hotels' | 'all'
  categories?: string[]
  locations?: string[]
  maxItems?: number
}

Response: {
  success: boolean
  jobId: string
  message: string
}
```

---

## Next Steps

1. ✅ Create Trip.com crawler service
2. ✅ Create Klook crawler service
3. ✅ Add API endpoints for manual triggering
4. ✅ Implement background sync schedules
5. ✅ Enhance admin UI for monitoring
6. ✅ Update unified search to prioritize crawled data
7. ✅ Add data freshness indicators
8. ✅ Implement incremental crawling (only new/changed items)

---

## Reference: AttractionsSG Implementation

Key files to reference:
- `server/api/attractionsg/crawl.ts` - Main crawler logic
- `server/api/attractionsg/events.ts` - Data retrieval
- Uses Playwright for browser automation
- Stores in `AttractionsgEvent` table
- Background sync via webhook/cron

---

## Benefits

1. **Unified Search** - All platforms have fresh data in database
2. **Better Performance** - Query database instead of external APIs
3. **Offline Capability** - Search works even if platforms are down
4. **Analytics** - Track price changes, deal trends
5. **Price Alerts** - Enable price drop monitoring
6. **SEO** - Better indexing with structured data

