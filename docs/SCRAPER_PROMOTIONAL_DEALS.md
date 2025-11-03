# Scraper - Promotional Deal Discovery

## Overview

The Trip.com scraper has been optimized to extract promotional deal information from Trip.com's promotional and sale pages. This scraper focuses on collecting **deal metadata** rather than trying to scrape individual product listings.

---

## 🎯 What It Does

The scraper now has **two-tier extraction**:

### Tier 1: Promotional Pages (Primary)
Scrapes pages containing structured promotional deals:
- `/sale/*` - Trip.com sale pages
- `/partners/ad/*` - Affiliate widget pages  
- `/promo/*` - Promotional campaigns
- `/deals` - Deal collection pages

### Tier 2: Generic Pages (Fallback)
Scrapes pages without specific promotional structure:
- General hotel/flight listings
- Search results
- Category pages

---

## 🔍 Extracted Data Fields

### Promotional Deal Extractor
Optimized for sale/promotional pages:

| Field | Description | Example |
|-------|-------------|---------|
| `title` | Deal title/name | "Singapore Staycation - Up to 40% Off" |
| `discountedPrice` | Current sale price | "150" |
| `originalPrice` | Original/regular price | "250" |
| `discount` | Discount text/badge | "Save up to 40%" |
| `discountPercent` | Numeric discount | "40" |
| `image` | Product/deal image URL | Full absolute URL |
| `link` | Deal detail page URL | Full absolute URL |
| `location` | Destination/city | "Singapore" |
| `description` | Deal description | Full text description |
| `currency` | Price currency | "SGD" |
| `validDate` | Deal expiry/validity | "Valid until Mar 31" |
| `rating` | Star rating/reviews | "4.5 ★" |
| `badge` | Special badge/tag | "Best Seller" |

### Generic Deal Extractor
Used when promotional structure not found:

| Field | Description |
|-------|-------------|
| `title` | Product title |
| `discountedPrice` | Current price |
| `originalPrice` | Original price (if applicable) |
| `discount` | Discount text |
| `image` | Product image |
| `link` | Product link |
| `location` | City/location |
| `description` | Product description |
| `currency` | Currency code |

---

## 🚀 Usage

### 1. Create Scraper Source

Navigate to `/admin/scrapers` and click "Add Source":

```typescript
Platform: trip
Type: promotional-deals
URL: https://www.trip.com/partners/ad/YOUR_WIDGET_CODE
Name: Summer Hotel Promotions
```

### 2. Create & Run Job

Click "Run" on the source, or create a manual job:

- The scraper automatically detects promotional pages
- Uses specialized selectors for better extraction
- Falls back to generic extraction if needed

### 3. View Results

Check `/admin/scrapers` to see:
- Job status (RUNNING, COMPLETED, FAILED)
- Items scraped
- Error messages if failed
- Source statistics

---

## 📋 Recommended URLs to Scrape

### Widget URLs (Best)
These are auto-updating promotional widgets:

```
https://www.trip.com/partners/ad/SB12345
https://www.trip.com/partners/ad/DB67890
https://www.trip.com/partners/ad/PROMO999
```

**Find these in**: Trip.com Affiliate Portal → Partners → Tools → Promotion

### Sale Page URLs (Good)
Specific promotional campaigns:

```
https://sg.trip.com/sale/w/4747/flightrebate.html
https://sg.trip.com/sale/w/5000/hotel-summer.html
https://sg.trip.com/sale/w/6000/activity-special.html
```

### ❌ Don't Scrape These
General browsing/search pages don't have structured deal data:

```
❌ https://www.trip.com/?Allianceid=...
❌ https://www.trip.com/hotels/w/home?Allianceid=...
❌ https://www.trip.com/flights/welcome/?Allianceid=...
```

---

## 🔧 Technical Details

### Promotional Page Detection

The scraper identifies promotional pages by URL patterns:

```javascript
const isPromotionPage = sourceUrl.includes('/sale/') || 
                        sourceUrl.includes('/partners/ad/') ||
                        sourceUrl.includes('/promo/') ||
                        sourceUrl.includes('/deals')
```

### Extraction Selectors

Promotional pages use specialized selectors:

```javascript
'.promo-item'
'.deal-item'
'.sale-item'
'.product-card'
'.offer-card'
'div[data-testid*="deal"]'
'div[class*="product-card"]'
'div[class*="promo"]'
'div[class*="deal-card"]'
'div[class*="sale-card"]'
```

Generic pages use fallback selectors:

```javascript
'.hotel-item'
'.hotel-card'
'.product-item'
'.deal-item'
'[class*="hotel"]'
'[class*="product"]'
```

### Image URL Normalization

All image URLs are normalized to absolute URLs:

```javascript
if (deal.image && !deal.image.startsWith('http')) {
  deal.image = deal.image.startsWith('//') 
    ? `https:${deal.image}` 
    : `https://www.trip.com${deal.image}`
}
```

---

## 💡 Use Cases

### 1. Deal Discovery
Scrape promotional pages to find active deals across platforms

### 2. Price Comparison
Collect pricing data from Trip.com promotions vs competitors

### 3. Trend Analysis
Track promotional patterns, popular destinations, seasonal trends

### 4. Curated Deal Display
Show "Best Deals This Week" on your homepage

### 5. Competitive Intelligence
Monitor Trip.com's promotional strategies

---

## 🎨 Display Integration

### Example: Display Scraped Deals

```vue
<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div 
      v-for="deal in deals" 
      :key="deal.id"
      class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
    >
      <!-- Deal Image -->
      <img 
        :src="deal.image" 
        :alt="deal.title"
        class="w-full h-48 object-cover"
      />
      
      <!-- Deal Info -->
      <div class="p-4">
        <!-- Badge -->
        <span 
          v-if="deal.badge" 
          class="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded mb-2"
        >
          {{ deal.badge }}
        </span>
        
        <!-- Title -->
        <h3 class="font-bold text-lg mb-2 line-clamp-2">
          {{ deal.title }}
        </h3>
        
        <!-- Location -->
        <p v-if="deal.location" class="text-gray-600 text-sm mb-3">
          📍 {{ deal.location }}
        </p>
        
        <!-- Price -->
        <div class="flex items-baseline gap-2 mb-3">
          <span class="text-2xl font-bold text-blue-600">
            {{ deal.currency }} {{ deal.discountedPrice }}
          </span>
          <span 
            v-if="deal.originalPrice" 
            class="text-gray-400 line-through"
          >
            {{ deal.currency }} {{ deal.originalPrice }}
          </span>
        </div>
        
        <!-- Discount -->
        <div v-if="deal.discountPercent" class="mb-3">
          <span class="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
            Save {{ deal.discountPercent }}%
          </span>
        </div>
        
        <!-- Rating -->
        <div v-if="deal.rating" class="flex items-center gap-1 mb-3 text-yellow-500">
          <span>{{ deal.rating }}</span>
        </div>
        
        <!-- CTA Button -->
        <a 
          :href="generateAffiliateLink(deal.link)"
          @click="trackClick('deal_view', deal)"
          class="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          View Deal →
        </a>
      </div>
    </div>
  </div>
</template>
```

---

## 🔗 Affiliate Integration

When displaying scraped deals, always wrap links with your affiliate tracking:

```javascript
function generateAffiliateLink(tripDealUrl) {
  // Parse the Trip.com deal URL
  const url = new URL(tripDealUrl)
  
  // Add your affiliate parameters
  url.searchParams.set('Allianceid', 'YOUR_ALLIANCE_ID')
  url.searchParams.set('SID', 'YOUR_SID')
  url.searchParams.set('trip_sub1', 'YOUR_ALLIANCE_ID')
  url.searchParams.set('trip_sub3', 'DEAL_TAG')
  
  return url.toString()
}
```

---

## ⚠️ Important Notes

1. **Don't try to scrape general pages** - Only promotional/sale pages have extractable structure
2. **Use widgets when possible** - Widgets are maintained by Trip.com and always up-to-date
3. **Track affiliate clicks** - Always wrap scraped deal links with your affiliate ID
4. **Respect rate limits** - Don't overload Trip.com's servers
5. **Monitor job status** - Check `/admin/scrapers` for failed jobs
6. **Keep data fresh** - Re-scrape periodically to get latest deals

---

## 🐛 Troubleshooting

### No deals extracted

**Check**:
1. Is the URL a promotional/sale page?
2. View page source - are there deal items in HTML?
3. Check browser console for selector logs
4. Try running job again after a delay

**Fix**:
- Use Trip.com widget or sale page URLs only
- Check if page structure changed
- Verify JavaScript isn't required (Playwright should handle this)

### Missing images

**Check**:
- Are images lazy-loaded?
- Are images from CDN?
- Check for CORS issues

**Fix**:
- Playwright waits for lazy-loading
- Image URLs should be absolute

### Job failed

**Check**:
- View job details modal
- Check error message
- Verify network connectivity
- Check Playwright installation

**Fix**:
- Re-run job
- Check Trip.com isn't blocking
- Verify URL is accessible

---

## 📊 Example Workflow

1. **Admin**: Login to `/admin/scrapers`
2. **Add Source**: Trip.com promotional widget URL
3. **Run Job**: Click "Run" button
4. **Monitor**: Watch job status (RUNNING → COMPLETED)
5. **Review**: Check scraped data quality
6. **Display**: Show on public deals page
7. **Track**: Monitor affiliate clicks & revenue

---

## 🎯 Next Steps

1. **Add more sources** from Trip.com affiliate portal
2. **Set up scheduling** for automatic scraping
3. **Build deals page** to display scraped promotions
4. **Implement comparison** across platforms (Trip.com vs Klook)
5. **Add price alerts** for users

---

## 📚 Related Documentation

- [Trip.com Promotions Management](./ARCHIVED/TRIP_PROMOTIONS_MANAGEMENT.md)
- [Trip.com Deeplink Strategy](./ARCHIVED/TRIP_DEEPLINK_STRATEGY.md)
- [Admin Portal Guide](./ADMIN_PORTAL_PLAN.md)
- [Database Setup](./DATABASE_SETUP_COMPLETE.md)

---

## 💬 Support

For issues or questions:
1. Check job status in `/admin/scrapers`
2. Review error messages in job details
3. Check server logs for detailed errors
4. Verify URL accessibility manually

