# Crawler URL Configuration Guide

## Problem

By default, crawlers use a limited set of hardcoded URLs, resulting in minimal data:
- **Trip.com**: Only 3 default sale pages → ~7 deals
- **Klook**: Generic search pages → 0 items found

## Solution

Configure additional URLs via environment variables or database entries.

---

## Trip.com Crawler

### Method 1: Environment Variable (Recommended)

Add to your `.env` file:

```env
# Comma-separated list of Trip.com sale page URLs
TRIP_SALE_URLS=https://sg.trip.com/sale/w/4747/flightrebate.html,https://sg.trip.com/sale/w/28065/everydayescape.html,https://sg.trip.com/sale/w/14373/swisstravelpass2025.html,https://sg.trip.com/sale/w/XXXXX/another-deal.html
```

**How to get URLs:**
1. Login to Trip.com affiliate portal: https://www.trip.com/partners
2. Go to "Popular Deals" section
3. For each deal, click "Share" button
4. Copy the generated sale page URL
5. Add to `TRIP_SALE_URLS` separated by commas

**Example URLs:**
```
https://sg.trip.com/sale/w/28065/everydayescape.html?locale=en-SG&promo_referer=3371_28065_1&Allianceid=3883416&SID=22874365
https://sg.trip.com/sale/w/14373/swisstravelpass2025.html?locale=en-SG&promo_referer=3371_14373_2
```

### Method 2: Database (ScraperSource table)

Add URLs via admin interface at `/admin/scrapers`:
1. Click "Add Source"
2. Platform: `trip`
3. Source Type: `promotion_page`
4. URL: Paste the sale page URL
5. Click "Save"

The crawler will automatically use these URLs.

---

## Klook Crawler

### Method 1: Widget Ad IDs (Recommended) ⭐

Klook widgets are identified by **Ad IDs**, not URLs. Add to `.env`:

```env
# Comma-separated list of Klook widget Ad IDs
KLOOK_AD_IDS=1154201,1154210,1154216,1154213,1154215,1154218

# Alternative environment variable name
KLOOK_WIDGET_AD_IDS=1154201,1154210,1154216
```

**How to get Ad IDs:**
1. Login to Klook affiliate portal: https://affiliate.klook.com
2. Go to "My Ads" → "Dynamic Widgets"
3. Configure a widget (city, category, number of items)
4. Copy the widget code
5. Extract the `data-adid` value (e.g., `data-adid="1154201"`)
6. Add all Ad IDs to `KLOOK_AD_IDS` separated by commas

**Example widget code:**
```html
<ins class="klk-aff-widget" 
     data-adid="1154201"  <!-- This is the Ad ID -->
     data-prod="dynamic_widget"
     ...>
```

### Method 2: Widget URLs (Alternative)

Klook widget URLs are more reliable than search pages. Add to `.env`:

```env
# Comma-separated list of Klook widget or activity URLs
KLOOK_WIDGET_URLS=https://www.klook.com/affiliate/widget?city=Singapore&category=attractions,https://www.klook.com/affiliate/widget?city=Bangkok&category=activities

# Alternative environment variable name
KLOOK_ACTIVITY_URLS=https://www.klook.com/activity/123456-singapore,https://www.klook.com/activity/789012-bangkok
```

**How to get widget URLs:**
1. Login to Klook affiliate portal: https://affiliate.klook.com
2. Go to "My Ads" → "Dynamic Widgets"
3. Configure a widget for your target location/category
4. Copy the widget URL
5. Add to `KLOOK_WIDGET_URLS`

### Method 2: Specific Activity Pages

You can also add direct activity URLs:

```env
KLOOK_ACTIVITY_URLS=https://www.klook.com/activity/123456-universal-studios-singapore,https://www.klook.com/activity/789012-singapore-flyer
```

### Method 3: Database (ScraperSource table)

Add via admin interface:
1. Go to `/admin/scrapers`
2. Click "Add Source"
3. Platform: `klook`
4. Source Type: `activity` or `widget`
5. URL: Widget URL or activity page URL
6. Click "Save"

---

## Promo Codes (Klook)

**Klook promo codes require manual CSV import**, not scraping:

1. Login to Klook affiliate portal
2. Go to "Promo Codes" section
3. Click "Export" button
4. Upload the CSV file via admin interface at `/admin/scrapers`

---

## Hotels (Klook)

For hotel deals, add specific hotel deal URLs:

```env
KLOOK_HOTEL_URLS=https://www.klook.com/hotel/123456-singapore,https://www.klook.com/hotel/789012-bangkok
```

Or add via database as `klook` platform, `hotel` source type.

---

## Verification

After configuring URLs, test the crawlers:

```bash
# Trip.com
npm run crawl:trip

# Klook
npm run crawl:klook
```

Expected results:
- **Trip.com**: Should find more deals (depends on URLs configured)
- **Klook**: Should find activities (depends on widget/activity URLs)

---

## Troubleshooting

### Still Getting 0 Results

1. **Check URLs are valid**:
   ```bash
   # Test if URLs are accessible
   curl -I "https://sg.trip.com/sale/w/28065/everydayescape.html"
   ```

2. **Verify selectors**:
   - Websites may have changed HTML structure
   - Check crawler logs for selector warnings
   - May need to update selectors in crawler code

3. **Check environment variables loaded**:
   ```bash
   npm run test:env
   ```

### Low Number of Results

1. **Add more URLs**: The more URLs you configure, the more data you'll get
2. **Increase maxPages/maxItems**: Adjust in crawler configuration
3. **Check URLs are still active**: Some sale pages expire

---

## Best Practices

1. **Regularly update URLs**: Sale pages expire, new ones appear
2. **Use widget URLs for Klook**: More reliable than search pages
3. **Monitor crawler logs**: Check for warnings about missing selectors
4. **Store URLs in database**: Easier to manage than environment variables
5. **Test incrementally**: Start with 1-2 URLs, then add more

---

## Example .env Configuration

```env
# Trip.com - Add all your sale page URLs
TRIP_SALE_URLS=https://sg.trip.com/sale/w/4747/flightrebate.html,https://sg.trip.com/sale/w/28065/everydayescape.html,https://sg.trip.com/sale/w/14373/swisstravelpass2025.html

# Klook - Widget Ad IDs (most reliable) - Get from Klook affiliate portal
KLOOK_AD_IDS=1154201,1154210,1154216,1154213,1154215,1154218

# Klook - Widget URLs (alternative if Ad IDs not available)
KLOOK_WIDGET_URLS=https://www.klook.com/affiliate/widget?city=Singapore&category=attractions

# Klook - Specific activities (if you have activity IDs)
KLOOK_ACTIVITY_URLS=https://www.klook.com/activity/123456-universal-studios

# Optional: Limit crawl size for testing
CRAWL_MAX_PAGES=10
KLOOK_CRAWL_MAX_ITEMS=50
```

---

## Quick Start

1. **Get URLs from affiliate portals** (see methods above)
2. **Add to `.env` file** or database
3. **Run crawlers**: `npm run crawl:trip` and `npm run crawl:klook`
4. **Check results**: Verify data in database
5. **Update URLs regularly**: Add new deals/promotions as they appear

