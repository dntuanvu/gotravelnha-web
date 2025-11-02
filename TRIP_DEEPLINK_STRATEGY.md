# Trip.com Deep Linking Strategy & Implementation

## Current State

### Existing Affiliate IDs
- **Alliance ID**: `3883416`
- **SID**: `22874365`
- **Status**: ✅ Active and working

### Current Implementation
1. **Search Boxes**: Using iframes for flights/hotels (`ResponsiveTripSearchBox.vue`)
2. **Banners**: Static and Dynamic banners
3. **Components**: Basic `TripAffiliateLink.vue` with simple URL construction

## 🎯 Deep Linking Opportunities

Based on [Trip.com's deep linking tools](https://www.trip.com/partners/tools/deeplink), here are the highest-impact implementations:

---

## 1. Dynamic Deep Link Generation (Priority 1) 🏆

### Use Cases
- Direct hotel bookings
- Flight searches with specific routes
- Activity/attraction bookings
- Package deals

### Implementation Approach

```typescript
// composables/useTripDeeplink.ts
interface DeeplinkOptions {
  type: 'hotel' | 'flight' | 'activity' | 'train' | 'car' | 'package'
  params: {
    // Hotel params
    destination?: string
    checkIn?: string
    checkOut?: string
    guests?: number
    
    // Flight params
    departure?: string
    arrival?: string
    departDate?: string
    returnDate?: string
    passengers?: number
    
    // Activity params
    location?: string
    activity?: string
    date?: string
    
    // Universal params
    campaign?: string
    subId?: string
  }
}
```

### Benefits
✅ Dynamic tracking per user/session
✅ Better conversion attribution
✅ Campaign-specific tracking
✅ A/B testing capabilities

---

## 2. Contextual Deep Links (Priority 2) 🎯

### Use Cases
- **Homepage → Trip.com**: Generic "Book Now"
- **Featured Hotels → Specific Hotel**: Direct hotel page
- **Popular Destinations → Search Results**: Pre-filled destination
- **Deal Cards → Deal Landing Page**: Specific promotions

### Implementation
Replace generic links with context-aware deep links:

```vue
<!-- Instead of -->
<a href="/trip">Book Now</a>

<!-- Use -->
<a :href="tripDeeplink({ type: 'hotel', params: { campaign: 'homepage-cta' }})">
  Book Now
</a>
```

---

## 3. Progressive Deep Linking (Priority 3) 📊

### Flow Example
1. **User browses homepage** → Generic trip.com link
2. **User searches hotels** → Destination-specific link
3. **User views hotel card** → Specific hotel deep link
4. **User clicks CTA** → Tracked booking attempt

### Tracking Chain
```
Homepage (campaign: homepage)
  → Search Page (campaign: search)
    → Hotel Detail (campaign: detail-view)
      → Booking (campaign: booking-attempt)
```

---

## 4. Smart Link Optimization (Priority 4) 🚀

### Current Issues
- Hardcoded iframes in `ResponsiveTripSearchBox.vue`
- Missing tracking on many CTAs
- No dynamic campaign parameters

### Solutions

#### A. Centralized Deep Link Utility

```typescript
// composables/useTripDeeplink.ts
export const useTripDeeplink = () => {
  const config = {
    allianceId: '3883416',
    sid: '22874365',
    baseUrl: 'https://www.trip.com'
  }

  const generateDeeplink = (options: DeeplinkOptions) => {
    const { type, params } = options
    
    // Build base deep link based on type
    let url = ''
    
    switch (type) {
      case 'hotel':
        url = `${config.baseUrl}/hotels/list`
        if (params.destination) url += `?city=${encodeURIComponent(params.destination)}`
        if (params.checkIn) url += `&checkIn=${params.checkIn}`
        if (params.checkOut) url += `&checkOut=${params.checkOut}`
        break
      
      case 'flight':
        url = `${config.baseUrl}/flights/list`
        if (params.departure && params.arrival) {
          url += `?departure=${params.departure}&arrival=${params.arrival}`
        }
        break
      
      // ... more types
    }
    
    // Add affiliate tracking
    const separator = url.includes('?') ? '&' : '?'
    url += `${separator}Allianceid=${config.allianceId}&SID=${config.sid}`
    
    // Add custom tracking
    if (params.campaign) {
      url += `&trip_campaign=${encodeURIComponent(params.campaign)}`
    }
    if (params.subId) {
      url += `&trip_sub1=${encodeURIComponent(params.subId)}`
    }
    
    return url
  }

  return { generateDeeplink }
}
```

#### B. Update Existing Components

**Priority Targets**:
1. `components/AffiliateCard.vue` - Homepage cards
2. `components/ResponsiveTripSearchBox.vue` - Search boxes
3. `pages/index.vue` - CTA buttons
4. Any "Book Now" buttons

---

## 5. Advanced Tracking (Priority 5) 📈

### Enhanced Analytics

```typescript
// Track click events
const trackTripClick = (campaign: string, link: string) => {
  // Send to analytics
  useActivityTracker().trackClick('trip_deeplink', {
    campaign,
    destination: link,
    platform: 'trip'
  })
  
  // Optional: Send to Google Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', 'outbound_link', {
      'event_category': 'Trip.com',
      'event_label': campaign,
      'value': link
    })
  }
}
```

---

## 🎬 Implementation Plan

### Phase 1: Foundation (Week 1)
1. ✅ Create `useTripDeeplink.ts` composable
2. ✅ Add deep link types interface
3. ✅ Configure environment variables for IDs
4. ✅ Create test/debug utility

### Phase 2: Integration (Week 2)
1. ✅ Update homepage cards
2. ✅ Enhance search boxes
3. ✅ Add CTAs to hero sections
4. ✅ Implement contextual links in banners

### Phase 3: Advanced Features (Week 3)
1. ✅ Dynamic campaign generation
2. ✅ A/B testing framework
3. ✅ Conversion tracking
4. ✅ Analytics dashboard

### Phase 4: Optimization (Week 4)
1. ✅ Performance monitoring
2. ✅ Link health checks
3. ✅ ROI analysis
4. ✅ Iterative improvements

---

## 📝 Deep Link Templates

Based on Trip.com's deep linking documentation, here are the templates we'll support:

### Hotels
```
https://www.trip.com/hotels/list?city=DESTINATION
  &Allianceid=3883416
  &SID=22874365
  &trip_campaign=hotel-search
  &trip_sub1=homepage
```

### Flights
```
https://www.trip.com/flights/list?departure=DEPART&arrival=ARRIVE&date=DATE
  &Allianceid=3883416
  &SID=22874365
  &trip_campaign=flight-search
```

### Activities
```
https://www.trip.com/wow/activities/list?dest=DESTINATION
  &Allianceid=3883416
  &SID=22874365
  &trip_campaign=activities
```

### Trains
```
https://www.trip.com/trains/list?from=FROM&to=TO
  &Allianceid=3883416
  &SID=22874365
```

---

## 🧪 Testing Strategy

### 1. Local Testing
```bash
# Test deep link generation
npm run test:trip-deeplinks

# Validate URLs
curl -I "https://www.trip.com/hotels/list?..."
```

### 2. Staging
- Deploy to Vercel preview
- Test all deep link variations
- Verify tracking parameters

### 3. Production
- Monitor conversion rates
- A/B test campaigns
- Track performance metrics

---

## 📊 Expected Results

### Metrics to Track
- Click-through rate (CTR)
- Booking conversion rate
- Revenue per visitor (RPV)
- Campaign performance
- User journey analytics

### Optimization Opportunities
- Best-performing campaigns
- Optimal link placements
- Effective CTA copy
- Conversion funnel analysis

---

## 🔗 Resources

- [Trip.com Deep Link Tool](https://www.trip.com/partners/tools/deeplink)
- [Trip.com Affiliate Portal](https://www.trip.com/partners)
- Commission Rates: Hotels 5.5%, Attractions 2.5%, Flights 1%

---

## Next Steps

1. **Approve this strategy** ✅
2. **Implement Phase 1** (Composable & Types)
3. **Update existing components**
4. **Deploy & monitor**
5. **Iterate based on data**

---

Made with ❤️ for GoTravelNha Revenue Optimization

