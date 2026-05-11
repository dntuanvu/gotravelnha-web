# Klook Dynamic Widgets Setup Guide

## Overview

This guide explains how to configure and use Klook's Dynamic Widgets to display 100,000+ activities, tours, and experiences on GoTravelNha.

---

## Why Dynamic Widgets?

✅ **Auto-updating content**: Klook maintains the widget data  
✅ **100,000+ products**: Vast inventory compared to CSV imports  
✅ **No scraping needed**: Use iframes - works on Vercel  
✅ **Always fresh**: Deals rotate automatically  
✅ **Full tracking**: Complete affiliate tracking built-in  

---

## Setup Process

### Step 1: Access Klook Affiliate Portal

1. **Login**: https://affiliate.klook.com/dashboard
2. **Navigate**: My Ads → Dynamic Widgets
3. **Get Access**: Ensure your account has widget permissions

### Step 2: Generate Widget Configurations

In Klook's Dynamic Widgets section, you can configure:

**Key Parameters**:
- **Website Name**: Your site name (e.g., "GoTravelNha")
- **Language**: `en`, `en-SG`, `vi`, etc.
- **Currency**: `SGD`, `USD`, `VND`, etc.
- **Category**: Attractions, Tours, Transport, Food, etc.
- **City/Destination**: Singapore, Vietnam, Tokyo, etc.
- **Number of Items**: How many products to show
- **Style**: Card, list, carousel, etc.

### Step 3: Get Widget IDs

After configuring, Klook provides:
- **Widget ID** (`data-wid`)
- **Ad ID** (`data-adid`)
- **Embed Code**: Complete HTML snippet

---

## Configuration Options

### Widget Type: "Things to do"

**Configurations Available**:
1. **Top Attractions** (General)
   - Category: Attractions
   - City: (Leave empty for worldwide)
   - Best for: Homepage, general browsing

2. **City-Specific** (Singapore)
   - Category: Attractions
   - City: Singapore
   - Best for: Singapore-focused page

3. **Theme Parks**
   - Category: Theme Parks & Entertainment
   - Best for: Family travel section

4. **Tours & Activities**
   - Category: Tours & Experiences
   - Best for: Adventure/tour pages

5. **Food & Drink**
   - Category: Food & Drinks
   - Best for: Culinary experiences

6. **Transportation**
   - Category: Transport & Transfers
   - Best for: Getting around

### Widget Type: "Hotels"

**Configurations**:
1. **Featured Hotels** (General)
2. **City-Specific Hotels** (Singapore, Vietnam, etc.)
3. **Hotel Deals** (Promotional)

---

## Implementation

### Adding to GoTravelNha

**File**: `composables/useKlookWidgets.ts`

```typescript
export const KLOOK_WIDGET_CONFIGS: KlookWidgetConfig[] = [
  {
    id: 'singapore-attractions',
    name: 'Singapore Attractions',
    description: 'Discover the best of Singapore',
    icon: '🇸🇬',
    widgetId: 'YOUR_WIDGET_ID',      // From Klook portal
    adId: 'YOUR_AD_ID',              // From Klook portal
    productType: 'search_vertical',
    city: 'Singapore',
    lang: 'en-SG',
    currency: 'SGD',
    height: '400px',
    active: true                      // Set to true to display
  }
]
```

### Activating Widgets

1. **Get widget IDs** from Klook portal
2. **Update** `composables/useKlookWidgets.ts` with IDs
3. **Set** `active: true` for widgets you want to show
4. **Save** and widgets appear on `/klook` page

---

## Admin Management

**URL**: `/admin/scrapers`

The admin interface shows:
- All configured widgets
- Active/Inactive status
- Widget details (IDs, parameters)
- Quick preview link
- Configuration instructions

---

## Display on `/klook` Page

Widgets automatically display based on `active` flag:

**View**: All active widgets render sequentially  
**Layout**: Each widget in its own card  
**Height**: Configurable (default 400px)  

**Categories Displayed**:
- By their configured icon
- With descriptive title
- Explanation text below

---

## Example Configurations

### Singapore Attractions

```typescript
{
  id: 'singapore-attractions',
  name: 'Singapore Attractions',
  description: 'Discover the best of Singapore',
  icon: '🇸🇬',
  widgetId: '89020',
  adId: '1045566',
  productType: 'search_vertical',
  city: 'Singapore',
  lang: 'en-SG',
  currency: 'SGD',
  height: '400px',
  active: true
}
```

### Top Worldwide Attractions

```typescript
{
  id: 'top-attractions',
  name: 'Top Attractions',
  description: 'Explore famous landmarks worldwide',
  icon: '🏰',
  widgetId: '89020',
  adId: '1045566',
  productType: 'search_vertical',
  lang: 'en',
  currency: 'SGD',
  height: '400px',
  active: true
}
```

### Vietnam Tours

```typescript
{
  id: 'vietnam-tours',
  name: 'Vietnam Tours',
  description: 'Explore Vietnam destinations',
  icon: '🇻🇳',
  widgetId: '89020',
  adId: '1045566',
  productType: 'search_vertical',
  city: 'Vietnam',
  lang: 'en',
  currency: 'USD',
  height: '400px',
  active: true
}
```

---

## Widget Parameters Reference

| Parameter | Description | Example | Required |
|-----------|-------------|---------|----------|
| `data-wid` | Widget ID from Klook | `89020` | ✅ Yes |
| `data-adid` | Affiliate Ad ID | `1045566` | ✅ Yes |
| `data-height` | Widget height | `400px` | ✅ Yes |
| `data-lang` | Language | `en`, `en-SG`, `vi` | ❌ No |
| `data-currency` | Currency | `SGD`, `USD`, `VND` | ❌ No |
| `data-prod` | Product type | `search_vertical` | ❌ No |
| `data-category` | Category filter | `attractions` | ❌ No |
| `data-city` | City filter | `Singapore` | ❌ No |

---

## Troubleshooting

### Widget Not Loading

**Check**:
- ✅ Are widget ID and Ad ID correct?
- ✅ Is `active: true` set?
- ✅ Did you import the widget library script?
- ✅ Check browser console for errors

**Script Required**:
```html
<script src="https://affiliate.klook.com/widget/fetch-iframe-init.js"></script>
```
Already included in `/klook` page!

### Wrong Products Showing

**Cause**: Widget configuration mismatch

**Solution**:
- Check category parameter
- Verify city/destination settings
- Confirm language/currency
- Regenerate widget in Klook portal

### Empty Widget

**Possible Reasons**:
- Widget not generated in Klook portal
- Wrong widget ID
- Account not approved for widgets
- Regional restrictions

**Action**: Contact Klook support

---

## Best Practices

### 1. **Start with Top Categories**
- Begin with "Top Attractions"
- Add city-specific widgets
- Expand based on user interest

### 2. **Group by Audience**
- Family travel → Theme Parks
- Adventure → Tours & Activities
- Budget → City Passes
- Foodies → Food & Drink

### 3. **Test Before Going Live**
- Preview widgets in admin
- Check on `/klook` page
- Verify affiliate tracking
- Test user experience

### 4. **Monitor Performance**
- Track click-through rates
- Measure conversion rates
- A/B test widget placements
- Rotate widgets based on performance

---

## Next Steps

1. ✅ **Get Widget Codes**: Login to Klook portal
2. ✅ **Generate Configurations**: Create 3-5 widgets
3. ✅ **Update Composable**: Add widget IDs
4. ✅ **Activate Widgets**: Set `active: true`
5. ✅ **Preview**: Check on `/klook` page
6. ✅ **Monitor**: Track user engagement

---

## Expected Results

**Before Widgets**:
- ~10 promo codes
- ~10 hotel deals
- ~20 total items
- Manual CSV imports

**After Widgets**:
- 100,000+ activities
- Auto-updating content
- Multiple categories
- Zero manual work

**Impact**: 5,000x inventory increase! 🚀

---

## Resources

- **Klook Affiliate Portal**: https://affiliate.klook.com/dashboard
- **Dynamic Widgets**: https://affiliate.klook.com/my_ads/
- **Support**: Contact Klook affiliate support
- **Documentation**: Klook affiliate help center

---

**Ready to configure? Update `composables/useKlookWidgets.ts` with your widget IDs!**

