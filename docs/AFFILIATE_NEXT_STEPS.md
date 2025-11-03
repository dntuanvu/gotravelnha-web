# GoVietHub Affiliate Accounts - Next Steps & Opportunities

## Current Implementation Status

✅ **Completed**:
- Klook Promo Codes import from CSV
- Klook Hotel Deals import from CSV
- Trip.com individual sale page scraping
- Unified deals display page with tabs
- Admin scraper management UI

---

## Immediate Opportunities

### 1. **Klook Dynamic Widgets** 🎯 HIGH PRIORITY

**What**: Auto-generated activity widgets by category/destination

**Why**: 100,000+ products vs Trip.com's 7 deals!

**How to Access**:
1. Login to https://affiliate.klook.com/my_ads/
2. Click "Dynamic Widgets" tab
3. Generate widget URLs for:
   - Singapore attractions
   - Top Vietnam activities
   - Popular categories (City Pass, Museums, etc.)

**Implementation**:
```typescript
// Scrape widget content (similar to Trip.com scraper)
const widgetUrl = 'https://www.klook.com/affiliate/widget?city=singapore&category=attractions'
const deals = await scrapeKlookWidget(widgetUrl)
```

**Value**: Massive inventory increase, automated updates

---

### 2. **Trip.com Widget Codes** ⭐ RECOMMENDED

**What**: Auto-updating promotional banners/widgets

**Available Types**:
- SB (Static Banner) - Hotels, Flights
- DB (Dynamic Banner) - Rotating promotions
- Search Box - Embedded search widget

**How to Access**:
1. Login to https://www.trip.com/partners
2. Navigate: Tools → Widget Codes
3. Copy widget codes like `SB12345`, `DB67890`

**Implementation**:
```typescript
// Use iframe or scrape widget content
const widgetUrl = 'https://www.trip.com/partners/ad/SB12345?Allianceid=...'
```

**Value**: No more "expired promotion" messages, auto-updating content

---

### 3. **Klook Recommended Content** 💎 GOLDMINE

**What**: Curated promotional materials and top products

**How to Access**:
1. Login to Klook affiliate dashboard
2. Look for "Recommended Content" or "Top Products" section
3. Export/copy top-performing activities

**Value**: Pre-optimized content, higher conversion rates

---

### 4. **Trip.com Text Links (Deep Link Generator)** 🔗

**What**: Direct links to specific products with your affiliate ID

**How to Access**:
1. Tools → Deep Link Generator
2. Enter product URL or search
3. Generate branded link

**Use Case**: For targeted recommendations (e.g., "Best Hotels in Singapore")

**Value**: More control over product promotion

---

## Strategic Priorities

### **Priority 1: Klook Widget Scraping** (This Week)

**Why**: 
- 100,000+ activities vs 7 Trip.com deals
- Automated, scalable
- No manual CSV imports needed

**Steps**:
1. Generate widget URLs from Klook portal
2. Build scraper for widget HTML
3. Add to admin UI
4. Schedule weekly updates

---

### **Priority 2: Trip.com Widget Codes** (Next Week)

**Why**:
- Solves "expired promotion" problem
- Auto-updating content
- Less manual work

**Steps**:
1. Get 3-5 widget codes from portal
2. Add iframe/widget display
3. Replace static scraping

---

### **Priority 3: Enhanced Integration** (Next Month)

**Why**:
- Build comprehensive inventory
- Better user experience
- Higher conversions

**Options**:

#### A. **Klook Data Feed API** (If Available)
- Real-time inventory
- Structured data
- Automated sync

#### B. **Featured Products Rotation**
- Daily showcase top deals
- Seasonal campaigns
- User-recommended content

#### C. **Category-Based Widgets**
- Singapore-specific widgets
- Vietnam travel packages
- City-specific activities

---

## Not Recommended (Low ROI)

❌ **Scrape Trip.com's full catalog**
- They don't have API
- Against ToS
- Too much effort for limited value

❌ **Manual CSV exports repeatedly**
- Klook widgets are better
- Higher maintenance
- Not scalable

---

## Recommended Next Actions

### **This Week**:
1. ☐ Login to Klook, generate 3 widget URLs (Singapore, Vietnam, Top Activities)
2. ☐ Build Klook widget scraper
3. ☐ Add to `/admin/scrapers` UI
4. ☐ Test scraping one widget

### **Next Week**:
1. ☐ Get Trip.com widget codes (SB, DB, Search Box)
2. ☐ Implement widget display
3. ☐ Replace manual scraping
4. ☐ Add widget management UI

### **This Month**:
1. ☐ Request Klook API/data feed access
2. ☐ Build scheduled automation
3. ☐ Create featured deals system
4. ☐ Add category-specific pages

---

## Expected Impact

**Current State**:
- Klook: ~10 promo codes + ~10 hotel deals = ~20 items
- Trip.com: 7 promotional deals
- **Total: ~27 deals** (manual, limited)

**After Widget Integration**:
- Klook: 100,000+ activities via widgets
- Trip.com: Auto-updating widget content
- **Total: Unlimited deals** (automated, scalable)

**ROI**: 3,700x inventory increase! 🚀

---

## Technical Considerations

### **Vercel Limitations**:
- Playwright won't run on Vercel serverless
- Need separate scraping service or pre-rendered widgets

**Solutions**:
1. **Use iframes** for widgets (recommended)
2. **Separate scraping service** (Railway, Render)
3. **Pre-populate data** from CSV exports
4. **Hybrid approach**: iframe + background scraping

### **Recommended Architecture**:
```
User Browser → Your Site → iframe Widget → Affiliate Platform
                                    ↓
                              Track clicks
                                    ↓
                              Your Analytics
```

**Benefits**:
- ✅ No scraping needed
- ✅ Always up-to-date
- ✅ No Vercel issues
- ✅ Full affiliate tracking

---

## Summary

**Maximize Your Affiliate Accounts**:

1. **Use Klook Dynamic Widgets** → 100K+ products
2. **Get Trip.com Widget Codes** → Auto-updating
3. **Build iframe integration** → No scraping needed
4. **Add widget management** → Admin control

**Result**: 
- From 27 manual deals
- To 100,000+ automated products
- With minimal maintenance
- And better user experience

---

**Next Command**: 
```
"Can you help me implement Klook Dynamic Widget integration?"
```

or

```
"Can you help me get Trip.com widget codes working?"
```

🎯 **Your choice!**

