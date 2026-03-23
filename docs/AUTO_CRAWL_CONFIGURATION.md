# Auto-Crawl Configuration

## Overview

Both Klook and Trip.com crawlers are configured to automatically crawl Singapore and Vietnam events by default, without requiring manual URL configuration.

## Auto-Crawl Behavior

### Klook Crawler

**Default Locations**: Singapore and Vietnam

**Auto-Crawl URLs** (if no URLs configured in database):
- `https://www.klook.com/en-US/search/?query=Singapore`
- `https://www.klook.com/en-US/search/?query=Singapore&category=attractions`
- `https://www.klook.com/en-US/search/?query=Singapore&category=tours`
- `https://www.klook.com/en-US/city/singapore/`
- `https://www.klook.com/en-US/search/?query=Vietnam`
- `https://www.klook.com/en-US/search/?query=Vietnam&category=attractions`
- `https://www.klook.com/en-US/search/?query=Vietnam&category=tours`
- `https://www.klook.com/en-US/city/vietnam/`

**Usage**:
```bash
# Auto-crawl Singapore and Vietnam
npm run crawl:klook

# Or specify locations
curl -X POST http://localhost:3000/api/klook/crawl \
  -H "Content-Type: application/json" \
  -d '{"locations": ["Singapore", "Vietnam"]}'
```

### Trip.com Crawler

**Default URLs** (if no URLs configured in database):
- `https://sg.trip.com/sale/singapore`
- `https://sg.trip.com/sale/vietnam`
- `https://sg.trip.com/hotels/singapore`
- `https://sg.trip.com/hotels/vietnam`

**Usage**:
```bash
# Auto-crawl Singapore and Vietnam
npm run crawl:trip

# Or via API
curl -X POST http://localhost:3000/api/trip/crawl
```

## Manual Configuration (Optional)

If you want to crawl additional locations or specific URLs, you can still configure them manually:

### Via Admin Panel

1. Go to **Admin → Scraper Management**
2. Click **"Add Crawl URL"**
3. Enter:
   - **URL**: Public listing page URL
   - **Platform**: Select `klook` or `trip`
   - **Source Type**: 
     - For Klook: `activity`, `activities`, `public_url`, or `listing`
     - For Trip: `sale`, `hotel`, `activity`, or `public_url`

### Via Database

You can also add URLs directly to the `scraper_sources` table:

```sql
-- Add Klook URL
INSERT INTO scraper_sources (url, platform, source_type, is_active)
VALUES ('https://www.klook.com/en-US/search/?query=Malaysia', 'klook', 'activity', true);

-- Add Trip.com URL
INSERT INTO scraper_sources (url, platform, source_type, is_active)
VALUES ('https://sg.trip.com/sale/malaysia', 'trip', 'sale', true);
```

## Priority Order

When crawlers run, they use URLs in this priority:

1. **Manual URLs from ScraperSource table** (highest priority)
2. **Auto-crawl default URLs** (Singapore and Vietnam)

This means:
- If you've configured URLs manually, those will be used
- If no URLs are configured, auto-crawl kicks in for Singapore and Vietnam
- Manual URLs are never overridden by auto-crawl

## Extracted Data

The crawlers extract:
- **Event/Activity URLs** (public URLs without affiliate parameters)
- **Title**
- **Price** (if available)
- **Image**
- **Location**
- **Category**
- **Rating** (if available)

All data is stored in the unified `events` table with:
- `platform`: 'klook' or 'trip'
- `link`: Public URL (affiliate IDs added when displaying)

## Affiliate Link Handling

- **During Crawling**: Public URLs are stored (no affiliate parameters)
- **When Displaying**: Affiliate IDs are automatically appended via:
  - Klook: `appendKlookAffiliateId()` utility
  - Trip.com: `appendTripAffiliateIds()` utility

## Tips

1. **Start with auto-crawl**: Just run `npm run crawl:klook` or `npm run crawl:trip` to get started
2. **Add custom URLs later**: If you want specific pages, add them via admin panel
3. **Monitor results**: Check `/admin/scrapers/klook` or `/admin/scrapers/trip` to see crawled events
4. **Rate limiting**: Crawlers include delays between requests to be respectful
