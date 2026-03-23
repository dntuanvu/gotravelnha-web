# Background Crawler Setup for Trip.com & Klook

## Overview

This document explains how to configure and use the background crawling system for Trip.com and Klook to enable unified search with fresh, crawled data.

---

## 🎯 What It Does

The background crawlers automatically:
1. **Crawl** promotional deals and activities from Trip.com and Klook
2. **Store** data in your database for fast unified search
3. **Include** affiliate tracking parameters in all URLs for commission tracking
4. **Update** existing records and add new ones
5. **Run** on a schedule (configurable intervals)

---

## 📋 Configuration

### Environment Variables

Add these to your `.env` file:

```env
# Trip.com Crawler
TRIP_CRAWL_ENABLED=true                    # Enable/disable crawler
TRIP_BACKGROUND_SYNC=true                  # Enable background scheduler
TRIP_SYNC_INTERVAL=86400000                # 24 hours in milliseconds
TRIP_ALLIANCE_ID=3883416                   # Your Trip.com Alliance ID
TRIP_SID=22874365                          # Your Trip.com SID

# Klook Crawler
KLOOK_CRAWL_ENABLED=true                   # Enable/disable crawler
KLOOK_BACKGROUND_SYNC=true                 # Enable background scheduler
KLOOK_SYNC_INTERVAL=43200000               # 12 hours in milliseconds
KLOOK_AD_ID=your_ad_id                     # Your Klook Ad ID (from affiliate portal)
KLOOK_AFFILIATE_ID=your_ad_id              # Alternative name for Klook Ad ID
```

### Vercel/Serverless Deployment

Background sync plugins automatically detect serverless environments and disable themselves. For serverless, use:
- **Webhook triggers** - Call `/api/trip/crawl` and `/api/klook/crawl` via cron jobs or webhooks
- **External workers** - Run crawlers on a separate service
- **Manual triggers** - Use admin UI to trigger crawls

---

## 🔗 Affiliate Tracking

### Trip.com
All URLs automatically include:
- `Allianceid=3883416` - Your Trip.com Alliance ID
- `SID=22874365` - Your Trip.com SID
- `utm_source=gotravelnha` - Source tracking
- `utm_medium=affiliate` - Medium tracking
- `trip_campaign=crawler-deal` - Campaign identifier

**Example URL:**
```
https://sg.trip.com/sale/w/4747/flightrebate.html?Allianceid=3883416&SID=22874365&utm_source=gotravelnha&utm_medium=affiliate&trip_campaign=crawler-deal
```

### Klook
All URLs automatically include:
- `aid=your_ad_id` - Your Klook Ad ID
- `utm_source=gotravelnha` - Source tracking
- `utm_medium=affiliate` - Medium tracking
- `utm_campaign=crawler-activity` or `crawler-hotel` - Campaign identifier

**Example URL:**
```
https://www.klook.com/activity/123456?aid=your_ad_id&utm_source=gotravelnha&utm_medium=affiliate&utm_campaign=crawler-activity
```

---

## 🚀 Usage

### Manual Trigger (API)

**Trip.com:**
```bash
POST /api/trip/crawl
Content-Type: application/json

{
  "fullCrawl": false,
  "maxPages": 5,
  "categories": ["hotel", "flight"],
  "urls": ["https://sg.trip.com/sale/w/4747/flightrebate.html"],
  "background": true
}
```

**Klook:**
```bash
POST /api/klook/crawl
Content-Type: application/json

{
  "type": "all",
  "locations": ["Singapore", "Bangkok"],
  "categories": ["attractions", "activities"],
  "maxItems": 50,
  "background": true
}
```

### Background Automatic Sync

Once enabled via environment variables, crawlers run automatically:
- **Trip.com**: Every 24 hours (configurable)
- **Klook**: Every 12 hours (configurable)

The sync runs in the background and doesn't block server startup.

---

## 📊 Database Storage

### Trip.com Deals
Stored in `trip_scraped_data` table with:
- Title, description, prices
- **Affiliate links** (with tracking parameters)
- Category, location, images
- Metadata and timestamps

### Klook Data
Stored in:
- `klook_promo_codes` - Promotional codes
- `klook_hotel_deals` - Hotel deals
- Both include **affiliate links** with tracking

---

## 🔍 Unified Search Integration

Once crawlers are running, the unified search API (`/api/search/global`) automatically includes:
- Trip.com deals from `trip_scraped_data`
- Klook promo codes from `klook_promo_codes`
- Klook hotels from `klook_hotel_deals`
- SG Attractions from `attractionsg_events`

All search results include affiliate links with proper tracking for commission.

---

## 🛠️ Troubleshooting

### Crawler Not Running
1. Check `TRIP_CRAWL_ENABLED` or `KLOOK_CRAWL_ENABLED` is `true`
2. Check `TRIP_BACKGROUND_SYNC` or `KLOOK_BACKGROUND_SYNC` is `true`
3. For serverless: Use manual triggers or webhooks instead

### No Affiliate Tracking in URLs
1. Verify `TRIP_ALLIANCE_ID` and `TRIP_SID` are set
2. Verify `KLOOK_AD_ID` or `KLOOK_AFFILIATE_ID` is set
3. Check crawler logs for errors

### Missing Data in Search Results
1. Run manual crawl via API to test
2. Check database tables for stored data
3. Verify crawlers are completing successfully (check logs)

---

## 📝 Next Steps

1. **Get Klook Ad ID**: Login to Klook affiliate portal and get your Ad ID
2. **Configure URLs**: Add specific Trip.com sale page URLs to crawl
3. **Test Crawls**: Run manual crawls to verify affiliate tracking
4. **Monitor**: Check database and logs to ensure data is being stored
5. **Optimize**: Adjust crawl intervals and max items based on needs

---

## 🔐 Security Notes

- Affiliate IDs are safe to expose in URLs (they're meant for public use)
- Crawlers respect rate limits and add delays between requests
- Background sync only runs on non-serverless environments
- All crawls create job records for audit trail

