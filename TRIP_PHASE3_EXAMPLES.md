# Phase 3: Advanced Features - Usage Examples

## 🎯 Campaign Management

### Basic Usage

```typescript
import { useCampaignManager } from '~/composables/useCampaignManager'

const { registerCampaign, getCampaignDeeplink } = useCampaignManager()

// Register a 3-variant campaign
registerCampaign({
  id: 'homepage-hero-cta',
  name: 'Homepage Hero CTA Test',
  description: 'Testing button colors and copy',
  variants: [
    {
      id: 'blue',
      name: 'Blue CTA',
      allocation: 33.3,
      params: { campaign: 'homepage-hero-blue' },
      metadata: { color: '#3B82F6', cta: 'Book Now' }
    },
    {
      id: 'green',
      name: 'Green CTA',
      allocation: 33.3,
      params: { campaign: 'homepage-hero-green' },
      metadata: { color: '#10B981', cta: 'Reserve Today' }
    },
    {
      id: 'purple',
      name: 'Purple CTA',
      allocation: 33.4,
      params: { campaign: 'homepage-hero-purple' },
      metadata: { color: '#8B5CF6', cta: 'Get Started' }
    }
  ],
  trafficAllocation: 100,  // 100% of traffic sees a variant
  active: true
})

// Get the link for current user
const link = getCampaignDeeplink('homepage-hero-cta', 'hotel')
```

### Viewing Results

```typescript
import { useCampaignManager } from '~/composables/useCampaignManager'

const { getCampaignMetrics, getWinningVariant } = useCampaignManager()

// Get metrics for a campaign
const metrics = getCampaignMetrics('homepage-hero-cta')
console.log('Results:', metrics)

// Find winning variant
const winner = getWinningVariant('homepage-hero-cta')
console.log('Winner:', winner)
```

---

## 🧪 A/B Testing

### Simple A/B Test

```typescript
import { useABTesting } from '~/composables/useABTesting'

const { registerTest, getTestLink } = useABTesting()

// Register 50/50 split test
registerTest('homepage-cta-button', {
  name: 'CTA Button Text Test',
  control: { campaign: 'homepage-cta-book-now' },
  variant: { campaign: 'homepage-cta-start-booking' },
  split: 50,
  active: true
})

// Get link for current user
const link = getTestLink('homepage-cta-button', 'hotel')
```

### 70/30 Test

```typescript
registerTest('hero-subheadline', {
  name: 'Hero Subheadline Test',
  control: { campaign: 'hero-desc-current' },
  variant: { campaign: 'hero-desc-new' },
  split: 30,  // 30% variant, 70% control
  active: true
})
```

### Viewing Test Results

```typescript
const { getTestResults, getAllResults } = useABTesting()

// Get specific test results
const results = getTestResults('homepage-cta-button')
console.log('Control CTR:', results.results.control.ctr)
console.log('Variant CTR:', results.results.variant.ctr)
console.log('Improvement:', results.results.improvement)
console.log('Winner:', results.results.winner)

// Get all test results
const allResults = getAllResults()
```

---

## 💰 Conversion Tracking

### Track Bookings

```typescript
import { useConversionTracker } from '~/composables/useConversionTracker'

const { trackHotelBooking, trackFlightBooking, trackActivityBooking } = useConversionTracker()

// Track hotel booking
trackHotelBooking(
  250.00,  // Value in SGD
  'homepage-hero-hotel',  // Campaign
  { hotel: 'Marina Bay Sands', nights: 3 }
)

// Track flight booking
trackFlightBooking(
  450.00,
  'search-box-flight-desktop',
  { route: 'SIN → BKK', passengers: 2 }
)

// Track activity
trackActivityBooking(
  80.00,
  'attractions-page',
  { activity: 'Universal Studios', tickets: 2 }
)
```

### View Conversion Stats

```typescript
const { getConversionStats, getCampaignConversions } = useConversionTracker()

// Overall stats
const stats = getConversionStats()
console.log('Total Revenue:', stats.totalRevenue)
console.log('AOV:', stats.averageOrderValue)
console.log('By Campaign:', stats.byCampaign)
console.log('By Type:', stats.byType)

// Campaign-specific
const campaignConversions = getCampaignConversions('homepage-hero-hotel')
console.log('Campaign conversions:', campaignConversions)
```

---

## 📊 Analytics Dashboard

### Complete Dashboard

```typescript
import { useTripAnalytics } from '~/composables/useTripAnalytics'

const { getDashboardData, exportToCSV, getRecommendations } = useTripAnalytics()

// Get all analytics data
const dashboard = getDashboardData

console.log('Overview:', dashboard.value.overview)
console.log('Top Campaigns:', dashboard.value.topCampaigns)
console.log('Conversions:', dashboard.value.conversions)

// Get AI recommendations
const recommendations = getRecommendations()
console.log('Recommendations:', recommendations)

// Export data
exportToCSV()  // Downloads CSV file
```

### Performance by Date Range

```typescript
const { getPerformanceSummary } = useTripAnalytics()

const weekly = getPerformanceSummary(
  '2025-11-01',
  '2025-11-07'
)

console.log('Weekly Stats:', weekly)
```

---

## 🎨 Real-World Example: Homepage A/B Test

```vue
<template>
  <div class="hero-section">
    <h1>{{ heroTitle }}</h1>
    <p>{{ heroSubtitle }}</p>
    
    <a :href="ctaLink" @click="handleCTAClick">
      {{ ctaText }}
    </a>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useABTesting } from '~/composables/useABTesting'
import { useCampaignManager } from '~/composables/useCampaignManager'
import { useConversionTracker } from '~/composables/useConversionTracker'

const { registerTest, getTestLink, trackClick } = useABTesting()
const { trackHotelBooking } = useConversionTracker()

// Register A/B test
registerTest('homepage-hero', {
  name: 'Homepage Hero Test',
  control: {
    campaign: 'homepage-hero-control',
    params: { title: 'Welcome to GoTravelNha' }
  },
  variant: {
    campaign: 'homepage-hero-variant',
    params: { title: 'Your Ultimate Travel Companion' }
  },
  split: 50
})

// Get test link and content
const testData = computed(() => getTestLink('homepage-hero', 'hotel'))

const heroTitle = computed(() => {
  // Get from localStorage or default
  return localStorage.getItem('homepage_hero_title') || 'Welcome to GoTravelNha'
})

const heroSubtitle = computed(() => 'Book amazing deals')

const ctaText = computed(() => {
  const variant = localStorage.getItem('homepage_hero_variant')
  return variant === 'variant' ? 'Start Your Journey' : 'Book Now'
})

const ctaLink = computed(() => testData.value || '/trip')

const handleCTAClick = () => {
  const variant = localStorage.getItem('homepage_hero_variant')
  trackClick('homepage-hero', variant)
}
</script>
```

---

## 🎯 Real-World Example: Campaign Performance Monitor

```vue
<template>
  <div class="analytics-dashboard">
    <h1>📊 Trip.com Analytics</h1>
    
    <!-- Overview -->
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Clicks</h3>
        <p class="big-number">{{ dashboard.overview.totalClicks }}</p>
      </div>
      
      <div class="stat-card">
        <h3>CTR</h3>
        <p class="big-number">{{ dashboard.overview.overallCTR }}</p>
      </div>
      
      <div class="stat-card">
        <h3>Revenue</h3>
        <p class="big-number">SGD {{ dashboard.overview.totalRevenue }}</p>
      </div>
      
      <div class="stat-card">
        <h3>ROI</h3>
        <p class="big-number">{{ dashboard.overview.roi }}</p>
      </div>
    </div>
    
    <!-- Campaigns -->
    <div v-for="campaign in dashboard.campaigns" :key="campaign.campaign.id" class="campaign-card">
      <h3>{{ campaign.campaign.name }}</h3>
      
      <div v-for="variant in campaign.variants" :key="variant.id" class="variant-row">
        <span>{{ variant.name }}</span>
        <span>CTR: {{ variant.ctr }}</span>
        <span>Revenue: ${{ variant.revenue }}</span>
      </div>
    </div>
    
    <!-- Recommendations -->
    <div class="recommendations">
      <h2>💡 Recommendations</h2>
      <ul>
        <li v-for="rec in recommendations" :key="rec">{{ rec }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTripAnalytics } from '~/composables/useTripAnalytics'

const { getDashboardData, getRecommendations } = useTripAnalytics()

const dashboard = getDashboardData
const recommendations = getRecommendations()
</script>
```

---

## 🔄 Integration Example: Full Page

```vue
<template>
  <div class="homepage">
    <header>
      <img src="/logo.png" alt="GoTravelNha" />
      <a :href="hotelLink" @click="() => handleTripClick('homepage-hero-hotel')">
        Hotels
      </a>
    </header>
    
    <section class="hero">
      <h1>{{ heroTitle }}</h1>
      <a :href="ctaLink" @click="handleCTAClick" :class="ctaClass">
        {{ ctaText }}
      </a>
    </section>
    
    <section class="destinations">
      <div v-for="dest in featuredDests" :key="dest.id" class="dest-card">
        <h3>{{ dest.name }}</h3>
        <a :href="dest.link" @click="() => handleDestClick(dest)">
          Book Hotels
        </a>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useTripDeeplink } from '~/composables/useTripDeeplink'
import { useCampaignManager } from '~/composables/useCampaignManager'
import { useConversionTracker } from '~/composables/useConversionTracker'

const { generateDeeplink } = useTripDeeplink()
const { getCampaignDeeplink } = useCampaignManager()
const { trackHotelBooking } = useConversionTracker()

// Hero CTA A/B test
const ctaLink = computed(() => {
  return getCampaignDeeplink('homepage-hero-cta', 'hotel') || 
         generateDeeplink({ type: 'hotel', params: { campaign: 'homepage-default' }})
})

// Regular hotel link
const hotelLink = generateDeeplink({
  type: 'hotel',
  params: { campaign: 'homepage-hero-hotel' }
})

// Featured destinations
const featuredDests = [
  { id: 'singapore', name: 'Singapore', link: '' },
  { id: 'bangkok', name: 'Bangkok', link: '' },
  { id: 'tokyo', name: 'Tokyo', link: '' }
].map(dest => ({
  ...dest,
  link: generateDeeplink({
    type: 'hotel',
    params: {
      destination: dest.name,
      campaign: 'featured-destinations'
    }
  })
}))

const handleCTAClick = () => {
  // Track click
  const variant = localStorage.getItem('homepage-hero-cta-variant')
  if (variant) {
    // Would use campaign manager trackClick here
  }
}

const handleTripClick = (campaign: string) => {
  console.log('Clicked campaign:', campaign)
}

const handleDestClick = (dest: any) => {
  console.log('Clicked destination:', dest.name)
}

// Example: Track conversion when user completes booking
onMounted(() => {
  // This would typically be called from a booking confirmation page
  // trackHotelBooking(250, 'homepage-hero-hotel', { destination: 'Singapore' })
})
</script>
```

---

## 🧹 Cleanup & Management

### Clear All Data

```typescript
import { useCampaignManager, useABTesting, useConversionTracker } from '~/composables'

const { clearResults } = useCampaignManager()
const { clearResults: clearAB } = useABTesting()
const { clearConversions } = useConversionTracker()

// Clear all
clearResults()
clearAB()
clearConversions()
```

### Export All Data

```typescript
import { useTripAnalytics } from '~/composables/useTripAnalytics'

const { exportToCSV, exportToJSON } = useTripAnalytics()

// Export as CSV (for Excel)
exportToCSV()

// Export as JSON (for data analysis)
exportToJSON()
```

---

Made with ❤️ for GoTravelNha Revenue Optimization

