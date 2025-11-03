# GoVietHub - Complete Documentation

A modern, professional travel booking platform that compares and aggregates deals from multiple travel platforms including Trip.com, Klook, and AttractionsSG.

---

## 🌟 Features

### Professional UI/UX
- Modern, responsive design with animations
- Gradient themes and glassmorphism effects
- Mobile-first responsive layout
- Loading states and error handling
- Custom airplane favicon

### Multi-Platform Integration
- **Trip.com**: Flights, hotels with search and affiliate tracking
- **Klook**: Tours, activities & experiences
- **AttractionsSG**: Singapore attractions & exclusive tickets

### Trip.com Advanced Features
- **Deep Linking**: Dynamic affiliate links with campaign tracking
- **Promotion Management**: Configurable promotional campaigns
- **Data Collection**: Promotional deal scraping for comparison
- **Analytics**: Comprehensive tracking and conversion monitoring
- **Admin Portal**: User management, scraper monitoring, data viewer

### Web Scraping Infrastructure
- **Promotional Deal Scraper**: Optimized for Trip.com sale/promo pages
- **Two-Tier Extraction**: Specialized selectors for promotions + generic fallback
- **Admin Interface**: Monitor jobs, view results, manage sources
- **Background Processing**: Async scraping with Playwright
- **Data Persistence**: PostgreSQL storage with Prisma ORM

### Activity Tracking
- Session management
- Page view tracking
- Click event tracking
- Scroll depth analysis
- Time on page metrics

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm run preview
```

### Environment Setup

Create a `.env` file:

```env
# SMTP Email (REQUIRED)
SMTP_USER=your-email@enjoytravelsingapore.com
SMTP_PASS=your-smtp-password

# AttractionsSG (REQUIRED - PDPA Protected)
ATTRACTIONSG_EMAIL=enjoytravelticket@gmail.com
ATTRACTIONSG_PASSWORD=Truc1@3456101112

# Trip.com Affiliate (Optional)
TRIP_ALLIANCE_ID=3883416
TRIP_SID=22874365

# Auth0 (Optional)
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_CLIENT_ID=your-client-id
```

---

## 📁 Project Structure

```
gotravelnha-web/
├── assets/css/              # Tailwind CSS
├── components/              # Vue components
│   ├── PopularDeals.vue
│   ├── ResponsiveTripSearchBox.vue
│   ├── StaticBanner.vue
│   ├── DynamicBanner.vue
│   └── ...
├── composables/             # Reusable logic
│   ├── useTripDeeplink.ts       # Deep link generator
│   ├── useTripPromotions.ts     # Campaign management
│   ├── useTripScraper.ts        # Data collection
│   ├── useActivityTracker.ts    # User tracking
│   ├── useCampaignManager.ts    # A/B testing
│   └── ...
├── layouts/
│   └── default.vue         # Main layout
├── pages/
│   ├── index.vue           # Homepage
│   ├── trip/               # Trip.com page
│   ├── klook/              # Klook page
│   ├── attractionsg/       # AttractionsSG page
│   ├── analytics/          # Analytics dashboard
│   └── trip-promotions-demo.vue
├── server/api/
│   ├── trip/
│   │   ├── hotels.ts       # Hotel search API
│   │   └── scrape-promotions.ts
│   ├── attractionsg/       # AttractionsSG APIs
│   ├── scrape-simple.ts    # Basic scraper
│   └── scraper.ts          # Advanced scraper
└── public/                 # Static assets
```

---

## 🎯 Trip.com Integration

### 1. Deep Linking System

Generate tracked affiliate links dynamically:

```typescript
import { useTripDeeplink } from '~/composables/useTripDeeplink'

const { generateDeeplink } = useTripDeeplink()

// Generate deep links
const hotelLink = generateDeeplink({
  type: 'hotel',
  params: {
    destination: 'Singapore',
    campaign: 'homepage-hero-hotel'
  }
})

const flightLink = generateDeeplink({
  type: 'flight',
  params: {
    departure: 'SIN',
    arrival: 'BKK',
    campaign: 'homepage-hero-flight'
  }
})
```

**Supported Types**: `hotel`, `flight`, `activity`, `train`, `car`, `package`, `generic`

### 2. Promotion Campaign Management

Add and manage Trip.com promotional campaigns:

```typescript
// Edit: composables/useTripPromotions.ts

const PROMOTION_CAMPAIGNS = [
  {
    id: 'summer-sale',
    name: 'Summer Sale',
    type: 'hotel',
    widgetUrl: 'https://www.trip.com/partners/ad/WIDGET_CODE', // ⭐ RECOMMENDED
    title: '🏖️ Summer Hotel Deals',
    description: 'Up to 50% off',
    active: true,
    priority: 10
  }
]
```

**Get Campaign Widget:**
```vue
<template>
  <PopularDeals campaign-id="summer-sale" />
</template>
```

### 3. Data Collection & Scraping

Scrape Trip.com promotional data for comparison:

```typescript
import { useTripScraper } from '~/composables/useTripScraper'

const { scrapePromotions, scrapeHotels } = useTripScraper()

// Scrape promotional deals
const result = await scrapePromotions(
  'https://sg.trip.com/sale/w/4747/flightrebate.html',
  'flight'
)

// Scrape hotel data
const hotels = await scrapeHotels({
  cityId: '33',
  checkinDate: '2025-03-01',
  checkoutDate: '2025-03-05'
})
```

### 4. Campaign Tracking & Analytics

Track clicks and conversions:

```typescript
import { useActivityTracker } from '~/composables/useActivityTracker'

const { trackClick } = useActivityTracker()

// Track affiliate link clicks
<a href="link" @click="() => trackClick('trip_link', { campaign: 'homepage-hero-hotel', option: 'external' })">
  Book Hotel
</a>
```

View analytics at `/analytics` (currently hidden from public navigation).

---

## 🎨 AttractionsSG Integration

### Setup

Add credentials to `.env`:
```env
ATTRACTIONSG_EMAIL=your-email@gmail.com
ATTRACTIONSG_PASSWORD=your-password
```

### Usage

The AttractionsSG page (`/attractionsg`) automatically:
- Scrapes available tickets
- Displays in responsive card layout
- Tracks user interactions
- Handles loading/error states

---

## 🔍 Web Scraping

### Simple Scraper (Cheerio)

Fast HTML scraping without JavaScript:

```typescript
const response = await $fetch('/api/scrape-simple', {
  method: 'POST',
  body: {
    url: 'https://example.com',
    selectors: {
      title: 'h1',
      price: '.price'
    }
  }
})
```

### Advanced Scraper (Playwright)

Full browser automation:

```typescript
const response = await $fetch('/api/scraper', {
  method: 'POST',
  body: {
    url: 'https://example.com',
    timeout: 30000
  }
})
```

### Composable Usage

```vue
<script setup>
import { useScraper } from '~/composables/useScraper'

const { scrapeUrl, loading, error } = useScraper()

const fetchData = async () => {
  const data = await scrapeUrl({ url: 'https://example.com' })
  console.log(data.title, data.description)
}
</script>
```

---

## 📊 Activity Tracking

Track user behavior passively:

```typescript
import { useActivityTracker } from '~/composables/useActivityTracker'

const { startTracking, trackClick, trackPageView } = useActivityTracker()

onMounted(() => {
  startTracking()
  trackPageView('/trip', { platform: 'trip' })
})

// Track interactions
trackClick('destination', { city: 'Singapore' })
```

**Tracked Data:**
- Page views
- Click events
- Search queries
- Scroll depth
- Time on page
- Device info

---

## 🎯 Current Implementation Status

### ✅ Active Platforms

| Platform | Status | Features |
|----------|--------|----------|
| **Trip.com** | ✅ Active | Flights, Hotels, Deep links, Promotions, Data scraping |
| **Klook** | ✅ Active | Activities, Tours, Widget integration |
| **AttractionsSG** | ✅ Active | Singapore tickets, Automated scraping |

### 🏗️ Architecture

**Frontend:**
- Nuxt 3 + Vue 3
- Tailwind CSS
- TypeScript

**Backend:**
- Server API routes
- Playwright scraping
- Cheerio HTML parsing

**Tracking:**
- Activity tracking
- Campaign analytics
- Conversion monitoring

---

## 🌐 Key URLs

| Page | URL | Description |
|------|-----|-------------|
| Homepage | `/` | Generic landing page |
| Trip.com | `/trip` | Hotels, flights, deals |
| Klook | `/klook` | Activities & tours |
| AttractionsSG | `/attractionsg` | Singapore tickets |
| Analytics | `/analytics` | Dashboard (hidden from nav) |
| Scraper Demo | `/scraper-demo` | Web scraping tools |
| Trip Promotions | `/trip-promotions-demo` | Trip.com scraper demo |

---

## 🔧 Configuration Files

### Trip.com Deep Linking

**File**: `composables/useTripDeeplink.ts`
- Alliance ID: 3883416
- SID: 22874365
- Configurable in `nuxt.config.ts`

### Promotions

**File**: `composables/useTripPromotions.ts`
- Add/remove campaigns
- Set active/inactive
- Configure priorities

### Tailwind CSS

**File**: `tailwind.config.js`
- Custom colors (primary gradient)
- Custom shadows
- Animations (fade-in, slide-up)

---

## 📋 Common Tasks

### Add Trip.com Promotion Campaign

1. Get widget code from Trip.com affiliate portal
2. Edit `composables/useTripPromotions.ts`
3. Add campaign object with `active: true`
4. Use `<PopularDeals campaign-id="your-id" />`

### Generate Affiliate Link

```typescript
import { useTripDeeplink } from '~/composables/useTripDeeplink'

const link = generateDeeplink({
  type: 'hotel',
  params: { campaign: 'my-campaign' }
})
```

### Track User Interaction

```typescript
trackClick('element_id', {
  campaign: 'campaign-name',
  option: 'external' // or 'internal'
})
```

### Scrape Trip.com Promotional Deals

**Using Admin Portal** (Recommended):
1. Navigate to `/admin/scrapers`
2. Click "Add Source"
3. Enter Trip.com promotional page URL
4. Click "Run" to start scraping
5. Monitor job status and view results

**Using API**:
```typescript
import { useTripScraper } from '~/composables/useTripScraper'

const { scrapePromotions } = useTripScraper()
const data = await scrapePromotions(url, 'flight')
```

**Supported URLs**:
- ✅ `/sale/*` - Trip.com sale pages
- ✅ `/partners/ad/*` - Affiliate widget pages
- ✅ `/promo/*` - Promotional campaigns
- ❌ General browsing/search pages

See [Promotional Deal Scraping Guide](./docs/SCRAPER_PROMOTIONAL_DEALS.md) for details.

---

## 🚀 Deployment

### Vercel Deployment

```bash
npm run build:vercel
```

**Config**: `vercel.json` handles routing and serverless functions.

### Environment Variables

Set in Vercel dashboard:
- `SMTP_USER`, `SMTP_PASS`
- `ATTRACTIONSG_EMAIL`, `ATTRACTIONSG_PASSWORD`
- `TRIP_ALLIANCE_ID`, `TRIP_SID` (optional)

---

## 🧪 Testing & Development

```bash
# Development
npm run dev

# Build
npm run build

# Preview
npm run preview

# Production build for Vercel
npm run build:vercel
```

---

## 📊 Analytics & Tracking

### Available at `/analytics`

- Total clicks
- Click-through rate (CTR)
- Conversions
- Revenue tracking
- Top campaigns
- Real-time monitoring

**Note**: Currently hidden from public navigation until RBAC implementation.

---

## 📖 Additional Documentation

### Active Documentation
- `docs/KLOOK_SCRAPING_STRATEGY.md` - Klook scraping implementation guide based on portal analysis ⭐ NEW
- `docs/KLOOK_AFFILIATE_INTEGRATION.md` - Klook affiliate integration strategy and roadmap
- `docs/SCALING_ROADMAP.md` - Comprehensive scaling strategy and phases
- `docs/AFFILIATE_PLATFORM_REALITY.md` - Real-world constraints and best practices
- `docs/TRIP_AFFILIATE_SCRAPING_REALITY.md` - Trip.com limitations and alternatives
- `docs/SCRAPER_PROMOTIONAL_DEALS.md` - Guide to Trip.com promotional deal scraping
- `docs/WHY_PROMOTIONAL_PAGES_ONLY.md` - Why only promotion pages should be scraped
- `docs/BULK_DEAL_SCRAPING.md` - Bulk scraping strategy and limitations
- `docs/GET_TRIP_WIDGET_CODES.md` - How to obtain widget codes from Trip.com affiliate portal
- `docs/SCHEDULED_SCRAPING_GUIDE.md` - Automated scraping setup and configuration
- `docs/DATABASE_SETUP_COMPLETE.md` - PostgreSQL setup and user management
- `docs/GOOGLE_OAUTH_SETUP.md` - Google OAuth integration guide

### Historical Implementation Notes
- `docs/ARCHIVED/` - Consolidated historical documentation

---

## 🆘 Troubleshooting

### Promotion Shows "Expired" Message

**Solution**: Check if campaign is active in `useTripPromotions.ts`:
```typescript
{ active: false } // ← Change to true
```

**Best Practice**: Use widget codes instead of sale page URLs to avoid expiration.

### Scraping Timeout

**Solution**: Increase timeout parameter:
```typescript
scrapePromotions(url, type, 90000) // 90 seconds
```

### No Deals Found

**Possible Causes**:
- Page structure changed
- JavaScript-rendered content needs more wait time
- Anti-bot protection

---

## 🔗 Resources

### Trip.com Affiliate Portal
- Dashboard: https://www.trip.com/partners
- Deep Link Tool: https://www.trip.com/partners/tools/deeplink
- Promotion Tools: https://www.trip.com/partners/tools/promotion/popularDeals

### Commission Rates
- Hotels: 5.5%
- Attractions: 2.5%
- Flights: 1%

---

## 📞 Support

- Website: https://gotravelnha.com
- Email: support@gotravelnha.com

---

## 📄 License

MIT License

---

**Made with ❤️ for GoTravelNha**

*Last Updated: 2025*
