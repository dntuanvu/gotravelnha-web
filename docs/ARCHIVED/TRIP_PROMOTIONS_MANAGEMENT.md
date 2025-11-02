# Trip.com Promotions Management Guide

## Overview

This system allows you to manage Trip.com promotional campaigns dynamically without code changes. You can add, update, and activate/deactivate promotional deals directly in the configuration file.

---

## Quick Start

### Where to Update Campaigns

All promotional campaigns are managed in:
```
composables/useTripPromotions.ts
```

### Current Active Campaign

⚠️ **IMPORTANT**: Always check Trip.com affiliate portal for **active widget codes** to avoid showing expired promotions.

**Current Status**:
- No active campaigns configured
- Check Trip.com affiliate portal for new promotional widgets

---

## How to Add a New Campaign

### Step 1: Access Trip.com Affiliate Portal

1. Log in to your Trip.com affiliate account
2. Navigate to: **Partners → Tools → Promotion → Popular Deals**
   - URL: https://www.trip.com/partners/tools/promotion/popularDeals

### Step 2: Choose Campaign Type

⚠️ **CRITICAL**: Prefer **Widget Codes** over Sale Page URLs to avoid expired promotions!

Trip.com offers two types of promotional widgets:

#### A. Widget Code ⭐ RECOMMENDED
```
https://www.trip.com/partners/ad/WIDGET_CODE
```
- Automatically pulls latest deals from Trip.com
- Always up-to-date and active
- Never shows "promotion expired" message
- Similar to banner widgets (SB/DB codes)

#### B. Sale Page URL ⚠️ Use with Caution
```
https://sg.trip.com/sale/w/XXXX/XXXX.html
```
- Specific promotion landing page
- **Will show "promotion expired" when campaign ends**
- Only use if you know the promotion is long-term
- Must manually disable when expired

### Step 3: Copy the Parameters

You'll need:
- **Widget URL** or **Sale Page URL**
- **Promo Referer ID** (if applicable)
- Any **special parameters** Trip.com provides

### Step 4: Add to Configuration

Open `composables/useTripPromotions.ts` and add your campaign to the `PROMOTION_CAMPAIGNS` array:

```typescript
{
  id: 'summer-hotel-sale',                    // Unique identifier
  name: 'Summer Hotel Sale',                   // Internal name
  type: 'hotel',                               // hotel, flight, activity, train, car, package, generic
  widgetUrl: 'https://www.trip.com/partners/ad/XXXXX',  // OR salePageUrl
  // salePageUrl: 'https://sg.trip.com/sale/w/XXX/XXX.html',  // Alternative
  
  // Optional parameters (if provided by Trip.com)
  promoReferer: '3371_4747_2',               // From affiliate portal
  locale: 'en-SG',                           // Default: en-SG
  currency: 'SGD',                           // Default: SGD
  params: {                                  // Additional parameters
    trip_sub3: 'P104257'                     // Example parameter
  },
  
  // Display configuration
  title: '🏖️ Summer Hotel Deals',
  description: 'Up to 50% off on summer destinations worldwide',
  icon: '🏖️',
  
  // Campaign status
  active: true,                              // Set to false to hide
  startDate: '2025-06-01',                  // Optional: Auto-activate date
  endDate: '2025-08-31',                    // Optional: Auto-expire date
  priority: 9                                // Display order (higher = shown first)
}
```

### Step 5: Use in Your Site

The campaign is now automatically available! Use it in components:

```vue
<template>
  <!-- Default (uses popular-flight-deals) -->
  <PopularDeals />
  
  <!-- Specific campaign -->
  <PopularDeals campaign-id="summer-hotel-sale" />
</template>
```

---

## Campaign Configuration Reference

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique campaign identifier (kebab-case) |
| `name` | string | Internal campaign name |
| `type` | string | Product type: hotel, flight, activity, train, car, package, generic |
| `title` | string | Display title (shown to users) |
| `description` | string | Display description |
| `active` | boolean | Whether campaign is currently active |
| `priority` | number | Display order (10 = highest priority) |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `widgetUrl` | string | Widget URL: `https://www.trip.com/partners/ad/CODE` |
| `salePageUrl` | string | Sale page URL: `https://sg.trip.com/sale/w/XXX/XXX.html` |
| `promoReferer` | string | Promo referer ID from affiliate portal |
| `locale` | string | Locale code (default: en-SG) |
| `currency` | string | Currency code (default: SGD) |
| `params` | object | Additional URL parameters |
| `icon` | string | Emoji icon for display |
| `startDate` | string | Auto-activate on this date (YYYY-MM-DD) |
| `endDate` | string | Auto-expire on this date (YYYY-MM-DD) |

**Note:** You must provide either `widgetUrl` OR `salePageUrl`, not both.

---

## Advanced Usage

### Get Active Campaigns Programmatically

```typescript
import { useTripPromotions } from '~/composables/useTripPromotions'

const { getActivePromotions, generatePromotionUrl } = useTripPromotions()

// Get all active campaigns
const allPromotions = getActivePromotions()

// Get campaigns of specific type
const hotelPromotions = getActivePromotions({ type: 'hotel' })

// Get top 3 campaigns by priority
const featured = getActivePromotions({ limit: 3 })

// Generate promotion URL with tracking
const url = generatePromotionUrl('summer-hotel-sale')
```

### Display Multiple Campaigns

```vue
<template>
  <div v-for="promo in promotions" :key="promo.id">
    <PopularDeals :campaign-id="promo.id" />
  </div>
</template>

<script setup>
import { useTripPromotions } from '~/composables/useTripPromotions'

const { getFeaturedPromotions } = useTripPromotions()
const promotions = getFeaturedPromotions(3) // Top 3 campaigns
</script>
```

### Campaign Scheduling

Campaigns automatically activate/deactivate based on dates:

```typescript
{
  id: 'spring-sale',
  name: 'Spring Sale',
  startDate: '2025-03-01',  // Won't show until March 1
  endDate: '2025-03-31',    // Will expire after March 31
  active: true,             // Must be true for scheduling to work
  priority: 10
}
```

### Deactivate Campaigns

```typescript
{
  id: 'old-campaign',
  active: false,  // Hide this campaign
  // ... other fields
}
```

---

## Using Campaigns in Pages

### In Trip Page

```vue
<template>
  <PopularDeals />
</template>

<script setup>
import PopularDeals from '~/components/PopularDeals.vue'
</script>
```

### Multiple Campaigns on One Page

```vue
<template>
  <!-- Featured campaigns -->
  <PopularDeals v-for="campaign in featured" :key="campaign.id" :campaign-id="campaign.id" />
</template>

<script setup>
import PopularDeals from '~/components/PopularDeals.vue'
import { useTripPromotions } from '~/composables/useTripPromotions'

const { getActivePromotions } = useTripPromotions()
const featured = getActivePromotions({ limit: 3 })
</script>
```

---

## Tracking & Analytics

All campaigns automatically include:
- ✅ Alliance ID tracking
- ✅ SID tracking  
- ✅ Campaign parameter (`promo-{campaign-id}`)
- ✅ UTM parameters (if configured)

Tracking format:
```
?Allianceid=3883416&SID=22874365&trip_campaign=promo-summer-hotel-sale
```

View analytics at: `/analytics`

---

## Common Campaign Examples

### Example 1: Widget Campaign

```typescript
{
  id: 'live-hotel-deals',
  name: 'Live Hotel Deals',
  type: 'hotel',
  widgetUrl: 'https://www.trip.com/partners/ad/W12345',
  title: '🏨 Live Hotel Deals',
  description: 'Best hotel prices updated daily',
  icon: '🏨',
  active: true,
  priority: 10
}
```

### Example 2: Seasonal Sale

```typescript
{
  id: 'winter-flight-sale',
  name: 'Winter Flight Sale',
  type: 'flight',
  salePageUrl: 'https://sg.trip.com/sale/w/5000/flight-winter.html',
  promoReferer: '3371_5000',
  locale: 'en-SG',
  currency: 'SGD',
  params: {
    trip_sub3: 'W2025'
  },
  title: '❄️ Winter Flight Sale',
  description: 'Up to 40% off winter destinations',
  icon: '❄️',
  active: true,
  startDate: '2025-12-01',
  endDate: '2026-02-28',
  priority: 9
}
```

### Example 3: Activity Promotion

```typescript
{
  id: 'activity-super-sale',
  name: 'Activity Super Sale',
  type: 'activity',
  widgetUrl: 'https://www.trip.com/partners/ad/A67890',
  title: '🎯 Activity Specials',
  description: 'Exclusive deals on tours and experiences',
  icon: '🎯',
  active: true,
  priority: 8
}
```

---

## Troubleshooting

### Campaign Not Showing

1. Check `active: true`
2. Verify date range (if `startDate`/`endDate` set)
3. Check browser console for errors
4. Verify URL format is correct

### Tracking Not Working

1. Confirm Alliance ID and SID are configured
2. Check URL parameters in generated link
3. View network tab to see iframe source

### Multiple Campaigns Competing

- Use `priority` field to control display order
- Higher priority = shown first
- Use filters to limit campaigns shown

---

## Best Practices

1. **Use Widget URLs when possible** - Auto-updating content
2. **Set priority wisely** - Most important campaigns = 10
3. **Include dates for seasonal campaigns** - Auto-activate/expire
4. **Test campaigns before activating** - Use `active: false` first
5. **Monitor analytics** - See which campaigns perform best
6. **Regular updates** - Check Trip.com affiliate portal monthly

---

## Getting New Campaign Codes

1. Visit: https://www.trip.com/partners/tools/promotion/popularDeals
2. Log in with your affiliate account
3. Browse available campaigns
4. Copy widget code or sale page URL
5. Note any special parameters
6. Add to configuration following examples above

---

## Support

For issues or questions:
- Check Trip.com affiliate portal documentation
- Contact Trip.com affiliate support
- Review analytics to understand campaign performance

---

Made for GoTravelNha Promotional Campaign Management 🚀

