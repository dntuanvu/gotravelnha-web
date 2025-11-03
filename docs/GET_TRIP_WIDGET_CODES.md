# How to Get Trip.com Widget Codes

## Overview

To use the promotional deal scraper effectively, you need to obtain widget codes and promotional page URLs from Trip.com's affiliate portal.

---

## Step-by-Step Guide

### Step 1: Access Trip.com Affiliate Portal

1. **Visit**: https://www.trip.com/partners
2. **Sign In** with your affiliate account credentials
3. Navigate to: **Partners → Tools**

### Step 2: Find Promotion Tools

Trip.com offers several promotional tools:

#### A. **Promotion Center** ⭐
- Path: Partners → Tools → Promotion Center
- URL: https://www.trip.com/partners/tools/promotion/popularDeals
- **What you get**: Official list of top deals and popular sellers
- **Purpose**: Pre-curated promotional campaigns

#### B. **Promo Campaign**
- Path: Partners → Tools → Promo Campaign  
- **What you get**: Monthly updated popular promotions, discounted products, promo code deals
- **Purpose**: Seasonal and special promotions

#### C. **Search Box**
- **What you get**: Embedded search widget codes
- **Purpose**: Let users search directly on your site

#### D. **Static Banner (SB)**
- **What you get**: Banner widget codes for hotels, flights, etc.
- **Purpose**: Display promotional banners

#### E. **Dynamic Banner (DB)**
- **What you get**: Carousel banner widget codes
- **Purpose**: Rotating promotional displays

---

## Step 3: Choose Your Campaign Type

### Option A: Widget Codes ⭐ RECOMMENDED

**Format**: `https://www.trip.com/partners/ad/WIDGET_CODE`

**Example codes**:
- SB12345 (Static Banner)
- DB67890 (Dynamic Banner)
- PROMO999 (Promotional Widget)

**Advantages**:
✅ Auto-updates when Trip.com adds new deals  
✅ Never shows "expired promotion" message  
✅ Trip.com maintains the content  
✅ Always displays active promotions  

### Option B: Sale Page URLs

**Format**: `https://sg.trip.com/sale/w/XXXX/XXXX.html`

**Example**:
```
https://sg.trip.com/sale/w/4747/flightrebate.html
```

**Considerations**:
⚠️ Specific to one promotion  
⚠️ Shows "expired" message when campaign ends  
⚠️ Need to manually disable when expired  
✅ More control over display  

---

## Step 4: Copy the Required Information

For each campaign, note down:

| Field | Where to Find | Example |
|-------|---------------|---------|
| **Widget Code** | From widget/banner selection | `SB12345` |
| **Sale Page URL** | From promo campaign list | Full URL |
| **Promo Referer** | From campaign details | `3371_4747_2` |
| **Locale** | Usually in URL or settings | `en-SG` |
| **Currency** | Usually in URL or settings | `SGD` |
| **Campaign Type** | From category | `hotel`, `flight`, `activity` |

---

## Step 5: Add to Your System

### Method 1: Using Admin Portal

1. **Navigate**: `/admin/scrapers`
2. **Click**: "Add Source"
3. **Fill in**:
   - Platform: `trip`
   - Type: `promotional-deals`
   - URL: Your widget URL or sale page
   - Name: Descriptive name
4. **Click**: "Create Source"
5. **Click**: "Run" to start scraping

### Method 2: Using Configuration File

Add to `composables/useTripPromotions.ts`:

```typescript
const PROMOTION_CAMPAIGNS: PromotionCampaign[] = [
  {
    id: 'your-campaign-id',           // Unique identifier
    name: 'Your Campaign Name',        // Internal name
    type: 'hotel',                      // hotel, flight, activity, etc.
    widgetUrl: 'https://www.trip.com/partners/ad/YOUR_WIDGET_CODE',
    // OR salePageUrl: 'https://sg.trip.com/sale/w/XXXX/XXXX.html',
    
    promoReferer: 'YOUR_PROMO_REFERER', // Optional
    locale: 'en-SG',                    // Optional, default: en-SG
    currency: 'SGD',                    // Optional, default: SGD
    params: {                           // Optional
      trip_sub3: 'YOUR_TRACKING_CODE'
    },
    
    title: '🏖️ Your Display Title',
    description: 'Your campaign description',
    icon: '🏖️',
    
    active: true,                       // Set to false to hide
    startDate: '2025-06-01',          // Optional
    endDate: '2025-08-31',            // Optional
    priority: 9                        // Display order
  }
]
```

---

## Common Widget Types

### 1. Sale Banner (SB)
**Format**: `https://www.trip.com/partners/ad/SB12345`

**Use case**: Display hotel/flight promotional banners

### 2. Display Banner (DB)
**Format**: `https://www.trip.com/partners/ad/DB67890`

**Use case**: Carousel-style rotating promotions

### 3. Promotional Widget (PROMO)
**Format**: `https://www.trip.com/partners/ad/PROMO999`

**Use case**: Embedded promotional content

### 4. Popular Deals Widget
**Format**: `https://www.trip.com/partners/ad/POP123`

**Use case**: Show trending deals

---

## Testing Your Widget

### 1. Manual Test

Open the widget URL in browser:
```
https://www.trip.com/partners/ad/YOUR_WIDGET_CODE?Allianceid=YOUR_ID&SID=YOUR_SID
```

You should see:
- Product cards
- Prices
- Images
- Links

### 2. Scraper Test

Use admin portal:
1. Add source with widget URL
2. Click "Run"
3. Check job status
4. View scraped data

### 3. Display Test

Add to a page:
```vue
<template>
  <PopularDeals campaign-id="your-campaign-id" />
</template>
```

---

## Troubleshooting

### Widget Not Loading

**Check**:
- Are you logged into affiliate portal?
- Is your account approved?
- Is the widget code correct?
- Are affiliate IDs configured?

### No Deals Extracted

**Check**:
- Is it a widget or sale page?
- Does the page have structured deal items?
- Check browser console for errors
- View page source manually

### Expired Promotions

**Solution**: Use widget codes instead of sale page URLs

Widget codes automatically update with new promotions.

### Tracking Not Working

**Check**:
- Are `Allianceid` and `SID` set in `.env`?
- Are parameters added correctly?
- Check URL in browser network tab

---

## Best Practices

### 1. Use Widget Codes When Possible
✅ Auto-updating content  
✅ No manual maintenance  
✅ Always shows active promotions  

### 2. Mix Campaign Types
- Widget codes for dynamic content
- Sale pages for specific campaigns
- Banners for visual appeal

### 3. Monitor Performance
- Track click-through rates
- Monitor conversion rates
- Update campaigns based on performance

### 4. Stay Updated
- Check affiliate portal monthly
- Add new widget codes
- Remove expired campaigns

### 5. Test Before Production
- Verify widget displays correctly
- Test scraping functionality
- Confirm affiliate tracking works

---

## Example Workflow

1. **Week 1**: Get 3 widget codes from affiliate portal
2. **Week 2**: Add to admin scraper, test scraping
3. **Week 3**: Build deals display page
4. **Week 4**: Monitor performance, optimize

---

## Resources

- **Trip.com Affiliate Portal**: https://www.trip.com/partners
- **Deep Link Tool**: https://www.trip.com/partners/tools/deeplink
- **Promotion Tools**: https://www.trip.com/partners/tools/promotion/popularDeals
- **User Guide**: https://pages.trip.com/affiliates/online/Trip.com%20Affiliate%20Platform%20User%20Guide.pdf

---

## Next Steps

1. ✅ Get widget codes from portal
2. ✅ Add to scraper system
3. ✅ Test scraping functionality
4. ✅ Build deals display page
5. ✅ Enable scheduled scraping

---

**Need Help?** Check job status in `/admin/scrapers` for detailed error messages.

