# User Activity Tracking & Passive Data Collection

## Overview
This document describes the user activity tracking system implemented in GoTravelNha Web. The system passively collects user behavior data to provide insights for improving the platform and optimizing scraping strategies.

## 🎯 Purpose

### For Platform Improvement
- Understand user preferences and behavior
- Identify popular destinations and hotels
- Track conversion patterns
- Optimize user experience

### For Scraping Insights
- Identify high-demand data points
- Prioritize scraping targets based on user interest
- Track price comparison needs
- Understand search patterns
- Monitor trending content

## 📊 What We Track

### 1. Page Views
- Which pages users visit
- Time spent on each page
- Page flow and navigation patterns

### 2. Search Behavior
- Search queries and terms
- Filters applied
- Search frequency

### 3. Click Interactions
- Destination clicks
- Hotel/activity clicks
- Category selections
- Button clicks

### 4. Scrolling Behavior
- Scroll depth on pages
- Content engagement levels
- How far users scroll

### 5. Time Metrics
- Total time spent on page
- Time between actions
- Session duration

### 6. User Context
- Device information
- Viewport dimensions
- Browser details

## 🔧 Implementation

### Composable: `useActivityTracker.ts`

```typescript
import { useActivityTracker } from '~/composables/useActivityTracker'

const { startTracking, trackPageView, trackClick, trackSearch } = useActivityTracker()

// Start tracking on page mount
onMounted(() => {
  startTracking()
  trackPageView('/trip', { platform: 'trip' })
})

// Track user clicks
<button @click="trackClick('popular_destination', { city: 'Singapore' })">
  Explore Singapore
</button>

// Track searches
const searchHotels = () => {
  trackSearch(searchQuery, { city: selectedCity })
  // ... perform search
}
```

### Available Methods

#### `startTracking()`
Initialize activity tracking for the current session.

#### `trackPageView(page, data?)`
Track when user views a page.
- `page`: Current page path
- `data`: Additional metadata

#### `trackClick(element, data?)`
Track user clicks on elements.
- `element`: Element identifier
- `data`: Additional context

#### `trackSearch(query, filters?)`
Track search queries and filters.
- `query`: Search term
- `filters`: Applied filters

#### `trackHotelInteraction(hotelId, action, data?)`
Track interactions with specific hotels.
- `hotelId`: Hotel identifier
- `action`: Type of interaction
- `data`: Additional context

#### `getActivityInsights()`
Get summary of current session activity.

### Server Endpoint: `/api/track-activity`

Receives and processes activity data. In production, this would store data in a database.

```typescript
POST /api/track-activity
Body: {
  sessionId: string
  timestamp: string
  page: string
  action: string
  data?: any
}
```

## 📈 Data Collection Insights

### How Data Helps Scraping

#### 1. **Demand Prioritization**
Track which hotels, destinations, or activities users click most. This tells us what data to prioritize scraping.

**Example:**
```json
{
  "action": "click",
  "data": {
    "element": "popular_destination",
    "city": "Singapore"
  }
}
```
**Insight**: More users interested in Singapore → prioritize Singapore hotel data scraping

#### 2. **Search Pattern Analysis**
Understand what users are searching for and how they search.

**Example:**
```json
{
  "action": "search",
  "data": {
    "query": "budget hotels",
    "filters": { "priceRange": "50-100" }
  }
}
```
**Insight**: Users want budget hotels in specific price ranges → scrape price data more frequently

#### 3. **Engagement Metrics**
Track which content keeps users engaged longer.

**Example:**
```json
{
  "action": "time_spent",
  "data": {
    "seconds": 180,
    "page": "/trip"
  }
}
```
**Insight**: Trip page has high engagement → ensure data freshness for displayed hotels

#### 4. **Conversion Paths**
Understand the user journey from search to click.

**Example:**
```
1. trackPageView('/trip') 
2. trackClick('popular_destination', 'Tokyo')
3. trackHotelInteraction(hotelId, 'view')
4. trackClick('book_now')
```
**Insight**: Tokyo hotels have high conversion → prioritize scraping Tokyo hotel availability

### Trending Content Detection

The system automatically identifies trending content based on click patterns:

```javascript
const insights = getActivityInsights()
// Returns:
{
  totalActivities: 42,
  timeSpent: 120,
  pageViews: 3,
  clicks: 15,
  searches: 8,
  maxScrollDepth: 85
}
```

## 🔒 Privacy & Compliance

### Data Minimization
- Only collect necessary behavioral data
- No personally identifiable information (PII)
- Session-based, not permanent tracking

### User Consent
- Tracking starts only after user interaction
- Can be easily disabled
- Transparent about data usage

### Data Security
- Server-side processing only
- Secure transmission (HTTPS)
- No third-party tracking libraries

## 🚀 Future Enhancements

### Planned Features

1. **Real-time Analytics Dashboard**
   - Visualize user activity patterns
   - Identify trends and anomalies

2. **Automatic Scraping Triggers**
   - Auto-scrape when demand spikes
   - Update content based on user interest

3. **A/B Testing Integration**
   - Test UI variations based on user behavior
   - Optimize conversion rates

4. **Predictive Analytics**
   - Predict popular destinations
   - Anticipate user needs

5. **Recommendation Engine**
   - Personalized suggestions based on behavior
   - Smart content curation

## 📝 Usage Examples

### Trip.com Page
```vue
<script setup>
import { useActivityTracker } from '~/composables/useActivityTracker'

const { startTracking, trackPageView, trackClick } = useActivityTracker()

const popularDestinations = [
  { city: 'Singapore', count: 1200 }
]

onMounted(() => {
  startTracking()
  trackPageView('/trip', { platform: 'trip' })
})
</script>

<template>
  <button @click="trackClick('popular_destination', { city: dest.city })">
    {{ dest.city }}
  </button>
</template>
```

### Klook Page
```vue
<script setup>
import { useActivityTracker } from '~/composables/useActivityTracker'

const { trackClick, trackSearch } = useActivityTracker()

const searchActivities = (query) => {
  trackSearch(query, { platform: 'klook' })
  // ... perform search
}
</script>
```

## 🎓 Best Practices

### What to Track
✅ User interactions (clicks, searches)  
✅ Navigation patterns (page views)  
✅ Engagement metrics (scroll, time)  
✅ Preferences (destinations, categories)

### What NOT to Track
❌ Personal information  
❌ Sensitive data  
❌ Form contents  
❌ External URLs

### Performance Considerations
- Tracking is non-blocking
- Data sent asynchronously
- Minimal performance impact
- Queue-based for reliability

## 🔍 Monitoring

### Development Mode
In development, all activities are logged to console:
```
📊 Activity tracked: {
  sessionId: "1234567890-abc",
  page: "/trip",
  action: "click",
  data: { element: "popular_destination", city: "Singapore" }
}
```

### Production Mode
Activities are:
1. Sent to server endpoint
2. Stored in database (when implemented)
3. Processed for insights
4. Used for scraping prioritization

## 📊 Data Format

### Activity Object Structure
```typescript
interface UserActivity {
  sessionId: string          // Unique session identifier
  timestamp: string           // ISO timestamp
  page: string                // Current page path
  action: string              // Action type (page_view, click, search, etc.)
  data?: any                  // Additional context data
  userAgent?: string          // Browser user agent
  viewport?: {               // Device viewport
    width: number
    height: number
  }
}
```

### Example Activities

**Page View:**
```json
{
  "sessionId": "1672531200-abc123",
  "timestamp": "2025-01-01T10:00:00Z",
  "page": "/trip",
  "action": "page_view",
  "data": { "platform": "trip" },
  "userAgent": "Mozilla/5.0...",
  "viewport": { "width": 1920, "height": 1080 }
}
```

**Search:**
```json
{
  "sessionId": "1672531200-abc123",
  "timestamp": "2025-01-01T10:05:00Z",
  "page": "/trip",
  "action": "search",
  "data": {
    "query": "Singapore hotels",
    "filters": { "priceRange": "100-200" }
  }
}
```

**Destination Click:**
```json
{
  "sessionId": "1672531200-abc123",
  "timestamp": "2025-01-01T10:10:00Z",
  "page": "/trip",
  "action": "click",
  "data": {
    "element": "popular_destination",
    "city": "Singapore"
  }
}
```

## 🎯 Integration with Scraping

### Automatic Data Collection

The tracking system identifies:
1. **High-demand destinations** → Prioritize hotel scraping
2. **Popular hotels** → Frequent price updates
3. **Search patterns** → Optimize scraper queries
4. **User engagement** → Ensure data freshness

### Scraping Insights API

A planned endpoint to provide scraping recommendations:

```javascript
GET /api/scraping-insights
Response: {
  topDestinations: ['Singapore', 'Tokyo', 'Bangkok'],
  topSearches: ['budget hotels', 'beach resorts'],
  priorityHotels: [hotelId1, hotelId2],
  updateFrequency: {
    'Singapore': 'hourly',
    'Tokyo': 'daily'
  }
}
```

## 📞 Support

For questions or issues with the tracking system:
- Check this documentation
- Review code comments in `composables/useActivityTracker.ts`
- Test in development mode with console logs
- Monitor server endpoints

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Status**: ✅ Active
