# GoVietHub Core Features Implementation Plan

## Overview
This document outlines the implementation plan to build out GoVietHub's core value propositions:

1. **Compare prices across top travel platforms instantly**
2. **Exclusive promo codes and deals you won't find elsewhere**
3. **Save time by searching once instead of browsing multiple sites**
4. **Track price drops and get alerts for your dream destinations**

---

## Current State

### ✅ What Exists:
- **Comparison API** (`/api/deals/compare`) - Compares deals across platforms
- **Compare Page** (`/compare`) - UI for viewing comparisons
- **Price Alert Model** - Database schema ready
- **Klook Promo Codes** - Database and API for promo codes
- **Trip.com Integration** - Deals scraping and widgets
- **SG Attractions** - Full integration with booking

### ❌ What's Missing:
- Unified search across all platforms
- Price alert creation/management UI
- Price alert monitoring service
- Promo code showcase page
- Enhanced comparison with better UX
- Homepage value proposition section

---

## Implementation Roadmap

### Phase 1: Unified Search (Priority: HIGH)

**Goal:** "Save time by searching once instead of browsing multiple sites"

#### 1.1 Unified Search API
- **File:** `server/api/search/global.post.ts`
- **Features:**
  - Accept search query (destination, product type, dates)
  - Search across Trip.com, Klook, SG Attractions
  - Return aggregated results with platform info
  - Sort by relevance, price, rating

#### 1.2 Unified Search Page
- **File:** `pages/search.vue`
- **Features:**
  - Search bar in header/navbar
  - Results grouped by platform
  - Filter by platform, category, price range
  - Quick comparison view

#### 1.3 Search Integration
- Add search icon to navbar
- Homepage search box
- Auto-complete suggestions

---

### Phase 2: Price Alerts (Priority: HIGH)

**Goal:** "Track price drops and get alerts for your dream destinations"

#### 2.1 Price Alert API
- **Files:**
  - `server/api/alerts/create.post.ts` - Create alert
  - `server/api/alerts/list.get.ts` - List user alerts
  - `server/api/alerts/[id].delete.ts` - Delete alert
  - `server/api/alerts/[id]/update.patch.ts` - Update alert

#### 2.2 Price Alert UI
- **File:** `pages/alerts/index.vue` - List all alerts
- **File:** `components/PriceAlertButton.vue` - Add alert button on product pages
- **File:** `components/PriceAlertForm.vue` - Create/edit alert form

#### 2.3 Price Monitoring Service
- **File:** `server/services/price-monitor.ts`
- **Features:**
  - Cron job to check active alerts daily
  - Fetch current prices from platforms
  - Compare with target price
  - Send email notifications when triggered
  - Update alert status

#### 2.4 Email Notifications
- Alert created confirmation
- Price drop notifications
- Alert expiring reminders

---

### Phase 3: Enhanced Comparison (Priority: MEDIUM)

**Goal:** "Compare prices across top travel platforms instantly"

#### 3.1 Comparison Enhancements
- Real-time price updates
- Price history graph
- Save comparison as wishlist
- Share comparison link
- Mobile-optimized comparison cards

#### 3.2 Comparison Features
- Side-by-side platform comparison
- Highlight best deal
- Show price differences clearly
- Filter by features (cancellation, ratings, etc.)

---

### Phase 4: Promo Code Showcase (Priority: MEDIUM)

**Goal:** "Exclusive promo codes and deals you won't find elsewhere"

#### 4.1 Promo Code Page
- **File:** `pages/promo-codes.vue`
- **Features:**
  - List all active promo codes
  - Filter by platform, category
  - Copy code with one click
  - Show usage count, expiry dates
  - Exclusive badge for GoVietHub-only codes

#### 4.2 Promo Code Integration
- Show applicable codes on product pages
- Auto-apply codes where possible
- Track code usage for analytics

---

### Phase 5: Homepage Value Props (Priority: LOW)

**Goal:** Clearly communicate platform benefits

#### 5.1 Value Proposition Section
- **File:** Update `pages/index.vue`
- Add "What makes GoVietHub special" section with:
  - Icon + description for each feature
  - Links to relevant pages
  - Stats (e.g., "Compare 100+ deals")

#### 5.2 Social Proof
- User testimonials
- Savings statistics
- Platform badges

---

## Technical Implementation Details

### Database Changes
No new tables needed - PriceAlert model already exists.

### API Endpoints to Create

1. **Search:**
   - `POST /api/search/global` - Unified search

2. **Price Alerts:**
   - `POST /api/alerts/create` - Create alert
   - `GET /api/alerts` - List user alerts
   - `PATCH /api/alerts/[id]` - Update alert
   - `DELETE /api/alerts/[id]` - Delete alert

3. **Enhancements:**
   - `GET /api/promo-codes/active` - List active promo codes
   - `POST /api/comparison/save` - Save comparison

### Background Jobs
- Daily price check cron (using node-cron or similar)
- Email sending service

### Email Templates Needed
- Price alert created
- Price drop notification
- Alert expiring reminder

---

## User Flows

### Flow 1: Unified Search
1. User searches "Singapore Hotels" on homepage
2. Results show hotels from Trip.com, Klook, SG Attractions
3. User can filter, sort, compare
4. User clicks on best deal → redirected to platform

### Flow 2: Price Alert
1. User views a product (e.g., hotel)
2. Clicks "Set Price Alert"
3. Sets target price
4. Receives email when price drops below target
5. User clicks link → books at lower price

### Flow 3: Comparison
1. User searches for product
2. Sees comparison across platforms
3. Views side-by-side comparison
4. Selects best deal
5. Optionally sets price alert if not ready to book

---

## Success Metrics

- **Search Usage:** % of users using unified search
- **Price Alerts:** Number of alerts created
- **Alert Trigger Rate:** % of alerts that trigger price drops
- **Comparison Usage:** % of users viewing comparisons
- **Promo Code Usage:** Number of codes copied/applied
- **Time Saved:** Average time on site vs. visiting multiple platforms

---

## Next Steps

1. Start with Phase 1 (Unified Search) - Highest impact
2. Then Phase 2 (Price Alerts) - High user value
3. Enhance existing comparison
4. Add promo code showcase
5. Polish homepage

---

## Questions to Consider

1. **Search Scope:** Should we search live APIs or cached data?
2. **Alert Frequency:** How often to check prices? (Daily? More frequent?)
3. **Platform Limits:** Rate limits on API calls?
4. **Email Service:** Which provider? (SendGrid, AWS SES, etc.)
5. **Notification Channels:** Email only, or also push notifications?

