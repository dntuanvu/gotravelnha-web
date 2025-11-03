# Klook Dynamic Widget Setup Guide

## Quick Start: Get Your Widget Code

### Step 1: Generate Widget in Klook Portal

1. **Login**: https://affiliate.klook.com/my_ads/
2. **Navigate**: My Ads → Dynamic Widgets
3. **Configure Widget**:
   - Destination: "All Destinations"
   - Category: "Attractions & Shows"
   - Items: "6 items"
   - Click "Generate"
4. **Copy Code**: Klook provides JavaScript code like this:

```html
<ins class="klk-aff-widget" 
     data-adid="1154125" 
     data-lang="" 
     data-currency="" 
     data-cardH="126" 
     data-padding="92" 
     data-lgH="470" 
     data-edgeValue="655" 
     data-cid="-1" 
     data-tid="1" 
     data-amount="6" 
     data-prod="dynamic_widget">
  <a href="//www.klook.com/">Klook.com</a>
</ins>
<script type="text/javascript">
  (function (d, sc, u) {
    var s = d.createElement(sc), p = d.getElementsByTagName(sc)[0];
    s.type = "text/javascript";
    s.async = true;
    s.src = u;
    p.parentNode.insertBefore(s, p);
  })(document, "script", "https://affiliate.klook.com/widget/fetch-iframe-init.js");
</script>
```

### Step 2: Extract Ad ID

**For Dynamic Widgets** (recommended):
- **Widget ID**: Leave empty (not needed)
- **Ad ID**: Copy the `data-adid` value → `1154125`

**Example**: 
- `data-adid="1154125"` → Ad ID is **1154125**
- Widget ID → Leave empty

### Step 3: Configure in Admin Portal

1. Go to `/admin/scrapers`
2. Scroll to "Klook Dynamic Widgets Configuration"
3. Click "Edit Config" on a widget
4. Enter:
   - **Ad ID**: `1154125` (required)
   - **Widget ID**: Leave empty
   - **Status**: Active
5. Click "Save Configuration"

---

## Widget Attributes Explained

### Required Attributes

| Attribute | Value | Source |
|-----------|-------|--------|
| `data-adid` | Your Ad ID | `data-adid` from Klook code |
| `data-prod` | `dynamic_widget` | From Klook code |

### Optional Attributes (Auto-configured)

| Attribute | Value | Description |
|-----------|-------|-------------|
| `data-wid` | `null` or empty | Widget ID (legacy) |
| `data-lang` | `en`, `en-SG`, `vi` | Language |
| `data-currency` | `SGD`, `USD`, `VND` | Currency |
| `data-height` | `400px` | Widget height |
| `data-category` | `attractions`, `tours`, etc. | Category filter |
| `data-city` | `Singapore`, `Vietnam` | City filter |

### Dynamic Widget Attributes (from Klook)

These attributes are provided by Klook and should be included:

| Attribute | Example | Description |
|-----------|---------|-------------|
| `data-cardH` | `126` | Card height |
| `data-padding` | `92` | Padding |
| `data-lgH` | `470` | Large height |
| `data-edgeValue` | `655` | Edge value |
| `data-cid` | `-1` | Category ID |
| `data-tid` | `1` | Type ID |
| `data-amount` | `6` | Number of items |

---

## Implementation Details

### How GoVietHub Handles Widgets

```vue
<ins class="klk-aff-widget" 
     :data-adid="widget.adId"
     :data-lang="widget.lang"
     :data-currency="widget.currency"
     :data-prod="widget.productType"
     :data-category="widget.category"
     :data-city="widget.city"
     :data-height="widget.height">
  <a :href="`//www.klook.com/?aid=${widget.adId}`">Klook.com</a>
</ins>
```

**Note**: Dynamic widgets don't use `data-wid`. Only Ad ID is required.

### Database Schema

```prisma
model KlookWidget {
  widgetId      String?  // Optional - not needed for Dynamic Widgets
  adId          String   // Required - from data-adid
  productType   String?  @default("dynamic_widget")
  // ... other fields
}
```

---

## Common Widget Types

### 1. Dynamic Widget (Recommended) ⭐

**Pros**:
- Auto-updating content from Klook
- 100,000+ products
- No scraping needed
- Full affiliate tracking

**Configuration**:
- Widget ID: Leave empty
- Ad ID: From `data-adid`
- Product Type: `dynamic_widget`

### 2. Search Vertical (Legacy)

**Configuration**:
- Widget ID: Required
- Ad ID: Required
- Product Type: `search_vertical`

---

## Category Mapping

### Official Klook Categories

| Display Name | Slug | Icon |
|--------------|------|------|
| Attractions & shows | `attractions` | 🏰 |
| Tours & sightseeing | `tours` | 🚶 |
| Food & dining | `food` | 🍜 |
| Transport & WiFi | `transport` | 🚌 |
| Activities & experiences | `activities` | 🎢 |
| Attraction passes | `passes` | 🎫 |

These categories match the Klook portal exactly.

---

## Troubleshooting

### Widget Not Displaying

**Check**:
1. Is `adId` correct?
2. Is status set to "Active"?
3. Is `productType` set to `dynamic_widget`?
4. Is the widget script loaded? (already included in GoVietHub)

### Widget Shows Wrong Content

**Check**:
1. Is `category` filter correct?
2. Is `city` filter correct?
3. Did you generate the right widget in Klook portal?

### Database Error

**Fix**:
- Run migrations: `npx prisma migrate deploy`
- Re-seed widgets: `npx tsx prisma/seed.ts`

---

## Production Deployment

Migrations run automatically during deployment:

```bash
npm run vercel-build
# → npx prisma generate
# → npx prisma migrate deploy
# → nuxt build
```

No manual setup needed! ✅

---

## Next Steps

1. ✅ Get widget code from Klook portal
2. ✅ Extract Ad ID from `data-adid`
3. ✅ Configure in admin portal
4. ✅ Set status to "Active"
5. ✅ Widget appears on `/klook` page!

🚀 You're ready to display 100,000+ Klook products!

