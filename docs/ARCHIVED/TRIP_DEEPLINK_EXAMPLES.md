# Trip.com Deep Link Usage Examples

## Quick Start

```typescript
import { useTripDeeplink } from '~/composables/useTripDeeplink'

const { generateDeeplink, openDeeplink, getCommonTemplates } = useTripDeeplink()
```

---

## Common Use Cases

### 1. Generic "Book Now" Link

```vue
<template>
  <a :href="tripLink" target="_blank" rel="noopener">
    Book Now on Trip.com
  </a>
</template>

<script setup>
const { getCommonTemplates } = useTripDeeplink()
const tripLink = getCommonTemplates.value.genericBooking('homepage-cta')
</script>
```

---

### 2. Hotel Search with Destination

```vue
<template>
  <a :href="hotelLink" class="btn btn-primary">
    Book Hotels in Singapore
  </a>
</template>

<script setup>
const { generateDeeplink } = useTripDeeplink()

const hotelLink = generateDeeplink({
  type: 'hotel',
  params: {
    destination: 'Singapore',
    campaign: 'homepage-featured'
  }
})
</script>
```

---

### 3. Complete Hotel Booking Link

```vue
<script setup>
const { generateDeeplink } = useTripDeeplink()

// Full hotel search with dates and guests
const hotelLink = generateDeeplink({
  type: 'hotel',
  params: {
    destination: 'Tokyo',
    checkIn: '2025-12-20',
    checkOut: '2025-12-27',
    guests: 2,
    rooms: 1,
    campaign: 'december-promo',
    subId: 'variant-a'
  }
})
</script>
```

---

### 4. Flight Search

```vue
<template>
  <button @click="openDeeplink(flightOptions)" class="btn">
    Search Flights
  </button>
</template>

<script setup>
const { openDeeplink } = useTripDeeplink()

const flightOptions = {
  type: 'flight',
  params: {
    departure: 'SIN',
    arrival: 'NRT',
    departDate: '2025-12-20',
    returnDate: '2025-12-27',
    passengers: 2,
    class: 'economy',
    campaign: 'flight-search'
  }
}
</script>
```

---

### 5. Activity Search

```vue
<script setup>
const { generateDeeplink } = useTripDeeplink()

const activityLink = generateDeeplink({
  type: 'activity',
  params: {
    destination: 'Singapore',
    activity: 'Universal Studios',
    campaign: 'attractions-page'
  }
})
</script>
```

---

### 6. One-Way Flight (No Return Date)

```typescript
const oneWayFlight = generateDeeplink({
  type: 'flight',
  params: {
    departure: 'NYC',
    arrival: 'LAX',
    departDate: '2025-12-01',
    passengers: 1,
    campaign: 'one-way-special'
  }
})
```

---

### 7. Train Booking

```typescript
const trainLink = generateDeeplink({
  type: 'train',
  params: {
    from: 'Singapore',
    to: 'Kuala Lumpur',
    trainDate: '2025-12-15',
    campaign: 'railway-promo'
  }
})
```

---

### 8. Car Rental

```typescript
const carLink = generateDeeplink({
  type: 'car',
  params: {
    pickup: 'Changi Airport',
    dropoff: 'Changi Airport',
    carDate: '2025-12-10',
    campaign: 'car-rental-deals'
  }
})
```

---

### 9. With A/B Testing

```vue
<script setup>
const { generateDeeplink } = useTripDeeplink()

// Randomly assign user to variant A or B
const variant = Math.random() > 0.5 ? 'variant-a' : 'variant-b'

const abTestLink = generateDeeplink({
  type: 'hotel',
  params: {
    destination: 'Bangkok',
    campaign: 'ab-test-december',
    subId: variant
  }
})
</script>
```

---

### 10. With UTM Parameters for Analytics

```typescript
const trackedLink = generateDeeplink({
  type: 'flight',
  params: {
    departure: 'SIN',
    arrival: 'BKK',
    campaign: 'google-ads',
    source: 'google',
    medium: 'cpc',
    term: 'singapore-bangkok-flight'
  }
})
```

---

## Real-World Examples

### Homepage Hero CTA

```vue
<template>
  <NuxtLink 
    :to="hotelDeeplink" 
    class="cta-button"
    @click="trackClick('homepage-hero-hotel')"
  >
    🏨 Find Amazing Hotels
  </NuxtLink>
  
  <NuxtLink 
    :to="flightDeeplink" 
    class="cta-button"
    @click="trackClick('homepage-hero-flight')"
  >
    ✈️ Search Flights
  </NuxtLink>
</template>

<script setup>
const { generateDeeplink } = useTripDeeplink()

const hotelDeeplink = generateDeeplink({
  type: 'hotel',
  params: {
    campaign: 'homepage-hero'
  }
})

const flightDeeplink = generateDeeplink({
  type: 'flight',
  params: {
    campaign: 'homepage-hero'
  }
})
</script>
```

---

### Featured Destination Cards

```vue
<template>
  <div 
    v-for="dest in destinations" 
    :key="dest.name"
    class="destination-card"
  >
    <img :src="dest.image" :alt="dest.name">
    <h3>{{ dest.name }}</h3>
    <a :href="getDeeplink(dest)" class="btn btn-primary">
      Book Hotels in {{ dest.name }}
    </a>
  </div>
</template>

<script setup>
const destinations = [
  { name: 'Singapore', code: 'SIN' },
  { name: 'Bangkok', code: 'BKK' },
  { name: 'Tokyo', code: 'TYO' }
]

const { generateDeeplink } = useTripDeeplink()

const getDeeplink = (dest) => {
  return generateDeeplink({
    type: 'hotel',
    params: {
      destination: dest.name,
      campaign: 'featured-destinations',
      subId: dest.code
    }
  })
}
</script>
```

---

### Dynamic Search Results

```vue
<template>
  <div class="search-result" v-for="result in results" :key="result.id">
    <h3>{{ result.title }}</h3>
    <p>{{ result.description }}</p>
    <a :href="result.link" class="book-button">
      View on Trip.com
    </a>
  </div>
</template>

<script setup>
const { generateDeeplink } = useTripDeeplink()

const results = computed(() => {
  return rawResults.value.map(result => ({
    ...result,
    link: generateDeeplink({
      type: 'hotel',
      params: {
        destination: result.destination,
        campaign: 'search-results',
        subId: result.id
      }
    })
  }))
})
</script>
```

---

### Replacing Existing Links

#### Before (Old Way)

```vue
<a href="https://www.trip.com/partners/ad/S552988?Allianceid=3883416&SID=22874365&trip_sub1=">
  Book Hotels
</a>
```

#### After (New Way)

```vue
<template>
  <a :href="hotelDeeplink" target="_blank">
    Book Hotels
  </a>
</template>

<script setup>
const { generateDeeplink } = useTripDeeplink()

const hotelDeeplink = generateDeeplink({
  type: 'hotel',
  params: {
    campaign: 'old-component-replacement'
  }
})
</script>
```

---

## Advanced: Tracking Clicks

### With Activity Tracker

```typescript
const { generateDeeplink, trackDeeplinkClick } = useTripDeeplink()

const handleBooking = () => {
  const link = generateDeeplink({
    type: 'hotel',
    params: {
      destination: 'Singapore',
      campaign: 'homepage-cta'
    }
  })
  
  // Track the click
  trackDeeplinkClick(link, 'homepage-cta')
  
  // Navigate
  window.open(link, '_blank')
}
```

### Or Use Built-in Tracking

```typescript
const { openDeeplink } = useTripDeeplink()

// Automatically tracks the click
openDeeplink({
  type: 'flight',
  params: {
    departure: 'SIN',
    arrival: 'BKK',
    campaign: 'quick-booking'
  },
  track: true  // Default is true
})
```

---

## Migration Guide

### Step 1: Find All Trip.com Links

```bash
# Search for Trip.com links
grep -r "trip.com" . --include="*.vue" --include="*.ts"
```

### Step 2: Replace Hardcoded Links

**Find:**
```vue
<a href="https://www.trip.com/hotels/list">
```

**Replace:**
```vue
<script setup>
const { generateDeeplink } = useTripDeeplink()
const hotelLink = generateDeeplink({ type: 'hotel' })
</script>
<template>
  <a :href="hotelLink">
```

### Step 3: Add Campaign Tracking

Add unique campaign identifiers to every link based on context.

---

## Best Practices

### ✅ DO

- **Unique Campaign IDs**: Use descriptive, unique campaign names
- **Context-Aware**: Match campaign to user journey stage
- **Track Everything**: Enable tracking on all affiliate links
- **Test URLs**: Validate generated links before deploying
- **Environment Config**: Use env vars for IDs in production

### ❌ DON'T

- **Hardcode URLs**: Use composable instead
- **Reuse Campaign IDs**: Each placement needs unique ID
- **Ignore Tracking**: Always track clicks
- **Forget Testing**: Test all link variations

---

## Testing

### Local Testing

```typescript
import { useTripDeeplink } from '~/composables/useTripDeeplink'

const { generateDeeplink } = useTripDeeplink()

// Test hotel link
const hotelLink = generateDeeplink({
  type: 'hotel',
  params: {
    destination: 'Test City',
    campaign: 'test'
  }
})

console.log('Generated link:', hotelLink)
// Should output: https://www.trip.com/hotels/list?city=Test%20City&Allianceid=3883416&SID=22874365&trip_campaign=test

// Verify the link structure
import { parseURL } from 'ufo'
const parsed = parseURL(hotelLink)
console.log('Alliance ID:', parsed.query.Allianceid)  // Should be 3883416
console.log('Campaign:', parsed.query.trip_campaign)   // Should be test
```

### Production Testing

1. **Click Test**: Manually click all generated links
2. **Tracking Test**: Verify clicks are tracked in analytics
3. **Commission Test**: Make test booking and verify commission
4. **Mobile Test**: Test on mobile devices
5. **Browser Test**: Test on Chrome, Safari, Firefox

---

## Troubleshooting

### Link Not Working

```typescript
// Debug: Log the generated URL
console.log('Generated deeplink:', hotelLink)

// Debug: Check parameters
const url = new URL(hotelLink)
console.log('Params:', Object.fromEntries(url.searchParams))
```

### Campaign Not Tracking

- Check campaign ID is set
- Verify activity tracker is loaded
- Check browser console for errors
- Validate tracking endpoint is reachable

### Affiliate ID Missing

- Check `nuxt.config.ts` has IDs configured
- Verify environment variables are set
- Test with default values

---

Made with ❤️ for GoTravelNha Revenue Optimization

