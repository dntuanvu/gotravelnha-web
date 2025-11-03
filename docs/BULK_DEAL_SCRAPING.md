# Bulk Deal Scraping Strategy

## Current Problem

**Manual process is tedious**:
1. View "Popular Deals" in Trip.com affiliate portal
2. Click "Share" on each deal
3. Copy URL one by one
4. Add each to admin scraper
5. Run each job individually

**Result**: Time-consuming, error-prone, not scalable

## Better Solution: Scrape the List

Instead of clicking through 6-10 deals manually, **scrape the "Popular Deals" page itself**!

### How It Works

The Trip.com "Popular Deals" page shows:
- Multiple deal cards in a grid
- Each card has image, title, offer text, expiry date
- Links to individual sale pages

Our scraper can:
1. Visit the Popular Deals page
2. Extract ALL deal cards at once
3. Automatically scrape each deal's details
4. Store in database
5. Done!

---

## Implementation Plan

### Option 1: Scrape Popular Deals Grid

**Target**: The grid/list page showing all deals

**Example URL Structure**:
```
https://www.trip.com/partners/tools/promotion/popularDeals
```

**What to Extract**:
- Deal title
- Image preview
- Offer description
- Expiry date
- Link to detailed sale page
- Then visit each sale page for full details

### Option 2: Scrape Individual Sale Pages

**Current approach** - Still works but tedious

**URLs**:
```
https://sg.trip.com/sale/w/28065/everydayescape.html
https://sg.trip.com/sale/w/14373/swisstravelpass2025.html
```

**What to Extract**:
- Full deal details from each page
- One job = one deal

### Option 3: Hybrid Approach ⭐ RECOMMENDED

**Step 1**: Admin adds Popular Deals page URL once
**Step 2**: Scraper extracts all deal links from grid
**Step 3**: Automatically visits each link
**Step 4**: Extracts full details
**Step 5**: Stores all deals in database

**Benefits**:
✅ One URL to manage
✅ All deals scraped automatically
✅ Always up-to-date
✅ Minimal manual work

---

## Recommended Workflow

### For Admin Users

**Initial Setup** (One-time):
1. Go to Trip.com affiliate portal
2. Copy the Popular Deals page URL
3. Add to `/admin/scrapers` as ONE source
4. Set to run automatically (schedule or manual)

**Ongoing**:
- Deals auto-update when you run scraper
- No manual URL copying needed!
- New deals automatically appear

### For Developers

**Improve the scraper**:
1. Detect grid/list pages
2. Extract multiple deal links
3. Queue individual jobs for each link
4. Process in background
5. Mark as bulk job in UI

---

## ⚠️ IMPORTANT LIMITATION

**Popular Deals page requires login** - The affiliate portal page (`/partners/tools/promotion/popularDeals`) is behind authentication and cannot be scraped directly without logging in first.

### Current Reality

**Option A**: Manually add individual deal URLs (works but tedious)

**Option B**: Use promotional widget codes instead of Popular Deals page

**Option C**: Scrape public-facing promotional pages (if available)

---

## Current vs. Improved

### Original Plan ❌ (Doesn't work due to login)

```
Admin adds 1 grid URL → Scraper finds all 6 deals automatically
Time: 1 minute
Effort: Automatic
Updates: Just re-run the job
```

### Practical Approach ✅

```
Admin manually adds individual sale URLs
Time: 5-10 minutes (still tedious)
Effort: Manual but necessary
Updates: Add new deals as they appear
```

**Alternative**: Research if Trip.com provides public promotional widget URLs that don't require login.

---

## Technical Implementation

### Detect Grid vs. Single Page

```javascript
// In scraper logic
const isGridPage = url.includes('/popularDeals') || 
                   url.includes('/promotion/')

if (isGridPage) {
  // Extract multiple deal links
  const dealLinks = extractDealLinks($)
  
  // Create jobs for each
  for (const link of dealLinks) {
    await createJob(link)
  }
} else {
  // Single page extraction (current approach)
  const deal = extractSingleSalePage($)
}
```

### Extract Grid Deals

```javascript
function extractDealLinks($) {
  const links = []
  
  // Find all deal cards
  $('.deal-card, .promo-card').each((_, card) => {
    const link = $(card).find('a').attr('href')
    const title = $(card).find('.title').text()
    const image = $(card).find('img').attr('src')
    const offer = $(card).find('.offer').text()
    
    links.push({ link, title, image, offer })
  })
  
  return links
}
```

---

## Benefits

### For You

1. **Save Time**: 1 URL instead of 10+
2. **Stay Current**: Auto-detect new deals
3. **Less Work**: Set it and forget it
4. **Fewer Errors**: No manual copy/paste mistakes

### For Users

1. **More Deals**: Easier to maintain = more content
2. **Fresher Data**: Auto-updates keep deals current
3. **Better UX**: More deals = better browsing experience

### For Business

1. **Scale Faster**: Add 10 deals as easily as 1
2. **Lower Costs**: Less manual admin time
3. **Higher Revenue**: More deals = more clicks = more commissions

---

## Next Steps

1. **Immediate**: Add grid page scraper detection
2. **Short-term**: Test with Popular Deals page
3. **Long-term**: Support other grid/list pages

---

**The Bottom Line**: Stop clicking through deals manually! Let the scraper do it for you. 🚀

