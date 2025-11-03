# Klook Affiliate Integration Guide

## Overview

Klook offers one of the most comprehensive affiliate programs in the travel industry, with **over 100,000 attractions and activities worldwide**. This is a significant improvement over Trip.com's limited promotional offerings.

**Key Stats**:
- Portfolio: 100,000+ travel products
- Coverage: Attractions, tours, hotels, car rentals, trains & more
- Commission: Competitive rates with performance-based bonuses
- Infrastructure: Data feeds, API, white label options
- Multi-currency & multilingual support

---

## Available Tools

Based on Klook's affiliate portal documentation, the following tools are available:

### 1. **Recommended Content for Promotion** ⭐
- Curated promotional materials
- Optimized content for conversions
- Seasonal campaigns
- Top-performing products

### 2. **Widgets**
- Embedded booking widgets
- Product displays
- Customizable styles
- Responsive design

### 3. **Search Boxes**
- Activity search functionality
- Destination-based search
- Category filters
- Direct booking integration

### 4. **Banners (Static & Dynamic)**
- Carousel banners
- Category-specific banners
- Promotional banners
- Seasonal campaigns

### 5. **Exclusive Referral Codes**
- Personal referral codes per affiliate
- Custom promotional codes
- Incentive campaigns
- Trackable codes

### 6. **Advanced Integration** (For Big Partners)
- Data feeds API
- White label solutions
- Real-time inventory
- Automated content updates

---

## Comparison: Trip.com vs Klook

| Feature | Trip.com | Klook |
|---------|----------|-------|
| Promotional Deals | 7 total | Comprehensive |
| Inventory Size | Limited campaigns | 100,000+ products |
| Update Frequency | Monthly | Real-time |
| Tools Available | Widgets only | Widgets, APIs, feeds |
| Recommended Content | ❌ | ✅ |
| Data Feeds | ❌ | ✅ |
| API Access | ❌ | ✅ |
| Maintenance | High (manual) | Low (automated) |

**Verdict**: Klook offers a much more scalable solution for building a comparison platform!

---

## Integration Strategy for GoVietHub

### Phase 1: Quick Wins (Widget-Based)

**Objective**: Display Klook promotions alongside Trip.com

**Implementation**:
1. Get widget codes from Klook affiliate portal
2. Embed widgets in `/klook` page
3. Show featured promotions
4. Track clicks and conversions

**Pros**:
- Fast implementation
- Zero maintenance
- Auto-updates
- Professional appearance

**Cons**:
- Limited customization
- Can't scrape data for comparison
- Dependent on Klook's interface

### Phase 2: Enhanced Integration (API/Feeds)

**Objective**: Add Klook to comparison engine

**Requirements**: Advanced affiliate partnership (contact Klook)

**Implementation**:
1. Access Klook data feeds or API
2. Import product data to your database
3. Display in comparison view
4. Real-time availability & pricing

**Pros**:
- Full data control
- Custom display
- True comparison capability
- Scalable

**Cons**:
- Requires partnership approval
- API integration work
- Maintenance overhead

### Phase 3: Full Platform Integration

**Objective**: Seamless multi-platform comparison

**Implementation**:
1. Unified search across Trip.com + Klook
2. Side-by-side comparison
3. Best price recommendations
4. Direct booking integration

---

## Recommended Approach for MVP

### What You Should Do Now:

#### 1. **Get Klook Widget Codes** (Priority 1)
- Login to `affiliate.klook.com/dashboard`
- Navigate to "Tools" section
- Generate widgets for:
  - Featured attractions
  - Top destinations
  - Seasonal promotions
  - Category-specific (Singapore attractions, Vietnam tours, etc.)

#### 2. **Create `/klook` Dedicated Page** (Priority 2)
```
pages/klook/index.vue
- Hero section
- Category filters (Attractions, Tours, Hotels, Car Rentals)
- Embedded Klook widgets
- Direct booking links
```

#### 3. **Add to Homepage** (Priority 3)
- Update homepage quick access pills
- Add Klook option: "Local Experiences & Tours"
- Link to `/klook` page
- Track usage

#### 4. **Integrate with Comparison Engine** (Priority 4)
- Add Klook as platform option in `/compare`
- For now: Manual linking
- Later: API integration for true comparison

---

## Implementation Example

### Homepage Integration

Update `pages/index.vue` quick access pills:

```vue
<!-- Current -->
<div class="flex gap-6 justify-center items-center mb-12">
  <NuxtLink to="/trip" class="pill">
    ✈️ Flights
  </NuxtLink>
  <NuxtLink to="/trip" class="pill">
    🏨 Hotels
  </NuxtLink>
</div>

<!-- Add Klook -->
<div class="flex gap-6 justify-center items-center mb-12">
  <NuxtLink to="/trip" class="pill">
    ✈️ Flights
  </NuxtLink>
  <NuxtLink to="/trip" class="pill">
    🏨 Hotels
  </NuxtLink>
  <NuxtLink to="/klook" class="pill">
    🎫 Tours & Activities
  </NuxtLink>
</div>
```

### Create Klook Page

New file: `pages/klook/index.vue`

```vue
<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50">
    <!-- Hero Section -->
    <section class="container mx-auto px-4 py-16">
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold mb-4">
          🎫 Local Experiences & Tours
        </h1>
        <p class="text-xl text-gray-600">
          Discover 100,000+ amazing experiences worldwide
        </p>
        <p class="text-md text-gray-500 mt-2">
          Powered by Klook
        </p>
      </div>

      <!-- Category Filters -->
      <div class="flex gap-4 justify-center mb-12">
        <button class="px-6 py-3 bg-white rounded-full shadow-lg">All</button>
        <button class="px-6 py-3 bg-white rounded-full shadow-lg">Attractions</button>
        <button class="px-6 py-3 bg-white rounded-full shadow-lg">Tours</button>
        <button class="px-6 py-3 bg-white rounded-full shadow-lg">Experiences</button>
      </div>

      <!-- Klook Widgets -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Featured Attractions Widget -->
        <div class="bg-white rounded-2xl shadow-xl p-6">
          <h2 class="text-2xl font-bold mb-4">Featured Attractions</h2>
          <!-- Embed Klook widget here -->
          <div class="klook-widget">
            <!-- Widget code from affiliate portal -->
          </div>
        </div>

        <!-- Top Destinations Widget -->
        <div class="bg-white rounded-2xl shadow-xl p-6">
          <h2 class="text-2xl font-bold mb-4">Top Destinations</h2>
          <div class="klook-widget">
            <!-- Widget code from affiliate portal -->
          </div>
        </div>

        <!-- Promotional Deals Widget -->
        <div class="bg-white rounded-2xl shadow-xl p-6">
          <h2 class="text-2xl font-bold mb-4">Special Deals</h2>
          <div class="klook-widget">
            <!-- Widget code from affiliate portal -->
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
useHead({
  title: 'Local Experiences & Tours | GoVietHub',
  meta: [
    {
      name: 'description',
      content: 'Discover amazing travel experiences with Klook - attractions, tours, activities worldwide'
    }
  ]
})
</script>
```

---

## Database Schema Extension

Consider adding Klook data to your existing scraper schema:

```prisma
model KlookScrapedData {
  id            String   @id @default(cuid())
  title         String
  description   String?
  image         String?
  url           String
  affiliateLink String
  category      String
  location      String?
  price         String?
  currency      String?
  rating        Float?
  reviewCount   Int?
  platform      String   @default("klook")
  
  // Scraper tracking
  scraperJobId  String?
  scraperJob    ScraperJob? @relation(fields: [scraperJobId], references: [id])
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@index([category])
  @@index([location])
  @@index([platform])
}

// Add to existing ScraperSource model
model ScraperSource {
  // ... existing fields
  
  // Add Klook sources
  platform String // "trip" | "klook" | "sg_attractions"
}
```

---

## Navigation Updates

Update `layouts/default.vue`:

```vue
<!-- Add to main navigation -->
<ul class="flex flex-col lg:flex-row items-center lg:space-x-8 space-y-4 lg:space-y-0">
  <li><NuxtLink to="/">Home</NuxtLink></li>
  <li><NuxtLink to="/trip">Trip.com</NuxtLink></li>
  <li><NuxtLink to="/klook">🎫 Klook</NuxtLink></li> <!-- NEW -->
  <li><NuxtLink to="/deals">🔥 Best Deals</NuxtLink></li>
  <li><NuxtLink to="/compare">🔍 Compare</NuxtLink></li>
  <!-- ... -->
</ul>
```

---

## Next Steps

### Immediate (This Week):
1. ✅ Login to Klook affiliate portal
2. ✅ Navigate to "Tools" section
3. ✅ Generate widget codes for:
   - Featured attractions
   - Top Singapore/Vietnam activities
   - Seasonal promotions
4. ✅ Create `/klook` page with embedded widgets
5. ✅ Add to homepage and navigation

### Short-term (Next Month):
1. Add Klook to comparison view
2. Implement category-based filtering
3. Add activity tracking
4. Create dedicated Singapore attractions widget
5. Add Vietnam-specific tours

### Long-term (Future):
1. Request API/data feed access from Klook
2. Implement real-time scraping/monitoring
3. Add to admin scraper dashboard
4. Create automated comparison feeds
5. Build multi-platform deal aggregator

---

## Competitive Advantage

### Why This Matters:

**Trip.com** (Your Current):
- 7 promotional deals
- Manual updates needed
- Limited inventory

**Klook** (Your Addition):
- 100,000+ products
- Automated updates
- Comprehensive coverage

**Combined Power**:
- Hotels + Flights (Trip.com)
- Activities + Tours (Klook)
- Complete trip planning
- True comparison engine
- Best-in-class selection

---

## Revenue Impact

### Commission Structure (Typical):

| Product Type | Trip.com | Klook |
|--------------|----------|-------|
| Hotels | 8-15% | ~8% |
| Flights | 1-3% | ~5% |
| Activities | N/A | 8-15% |
| Tours | N/A | 10-20% |
| Car Rentals | ~5% | ~10% |

**Opportunity**: Klook has stronger commissions for activities and tours!

---

## Resources

### Klook Affiliate Portal:
- Dashboard: https://affiliate.klook.com/dashboard
- My Ads: https://affiliate.klook.com/my_ads/
- Tools: https://affiliate.klook.com/dashboard/tools
- Help: https://affiliate.klook.com/help

### Documentation:
- This guide will be updated as you gain access
- Add widget codes here once obtained
- Document integration challenges
- Share learnings

---

## Questions to Answer

Once you login, please document:

1. **What widget types are available?**
   - Featured products widget?
   - Category widgets?
   - Destination-specific widgets?
   - Promotional banners?

2. **How many promotional campaigns are available?**
   - More than Trip.com's 7?
   - Update frequency?
   - Geographic coverage?

3. **Are there recommended/promoted products?**
   - Curated lists?
   - Top sellers?
   - Seasonal campaigns?

4. **API/Data Feed Access?**
   - Available for affiliates?
   - Requirements for access?
   - Technical documentation?

5. **Commission Details?**
   - Base rates?
   - Bonus structures?
   - Payment terms?

---

## Summary

Klook's affiliate program offers exactly what you need to scale beyond Trip.com's limitations:

✅ **100,000+ products** vs Trip.com's 7 deals
✅ **Automated widgets** that update themselves
✅ **API/data feeds** for advanced integration
✅ **Curated content** for optimal conversions
✅ **Better commissions** for activities/tours

This is a game-changer for GoVietHub! 🚀

