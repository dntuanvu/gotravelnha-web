# AttractionsSG API Documentation

## 📡 API Endpoints

### 1. **Crawl Data** - `/api/attractionsg/crawl`

Triggers a comprehensive crawl of AttractionsSG to collect all event data.

**Method:** `POST`

**Request Body:**
```json
{
  "fullCrawl": true,      // Optional: Perform deep crawl (default: false)
  "maxPages": 50          // Optional: Maximum pages to crawl (default: 20)
}
```

**Response:**
```json
{
  "success": true,
  "total": 150,
  "cached": false,
  "timestamp": "2025-01-02T12:00:00.000Z"
}
```

**Usage:**
```bash
# Trigger full crawl
curl -X POST http://localhost:3000/api/attractionsg/crawl \
  -H "Content-Type: application/json" \
  -d '{"fullCrawl": true, "maxPages": 50}'

# Quick refresh
curl -X POST http://localhost:3000/api/attractionsg/crawl \
  -H "Content-Type: application/json" \
  -d '{"fullCrawl": false}'
```

---

### 2. **Get Events** - `/api/attractionsg/events`

Retrieves cached AttractionsSG events with filtering, sorting, and pagination.

**Method:** `POST`

**Request Body:**
```json
{
  "search": "universal studios",  // Optional: Search term
  "category": "attractions",      // Optional: Filter by category
  "page": 1,                      // Optional: Page number (default: 1)
  "limit": 20,                    // Optional: Items per page (default: 20)
  "sortBy": "price",              // Optional: "title" | "price" | "rating" | "date"
  "sortOrder": "asc"              // Optional: "asc" | "desc" (default: "asc")
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "universal-studios-singapore-123",
      "title": "Universal Studios Singapore",
      "description": "Experience thrilling rides...",
      "price": "S$81",
      "originalPrice": "S$99",
      "image": "https://example.com/image.jpg",
      "category": "Theme Parks",
      "location": "Sentosa, Singapore",
      "rating": 4.5,
      "link": "https://mobile.attractionsg.com/tickets/123",
      "lastUpdated": "2025-01-02T12:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  },
  "filters": {
    "search": "universal studios",
    "category": null
  },
  "cached": true,
  "timestamp": "2025-01-02T10:00:00.000Z"
}
```

**Usage:**
```bash
# Search events
curl -X POST http://localhost:3000/api/attractionsg/events \
  -H "Content-Type: application/json" \
  -d '{"search": "zoo", "page": 1, "limit": 20}'

# Filter by category
curl -X POST http://localhost:3000/api/attractionsg/events \
  -H "Content-Type: application/json" \
  -d '{"category": "museums", "sortBy": "rating", "sortOrder": "desc"}'

# Browse all
curl -X POST http://localhost:3000/api/attractionsg/events \
  -H "Content-Type: application/json" \
  -d '{"page": 1, "limit": 50}'
```

---

### 3. **Refresh Data** - `/api/attractionsg/refresh`

Triggers a background data refresh without blocking.

**Method:** `GET`

**Response:**
```json
{
  "success": true,
  "message": "Data refresh initiated",
  "status": "processing"
}
```

**Usage:**
```bash
curl http://localhost:3000/api/attractionsg/refresh
```

---

## 🗄️ Data Structure

### Event Data Schema

```typescript
interface EventData {
  id: string                 // Unique identifier (slug-based)
  title: string              // Event/ticket title
  description?: string        // Detailed description
  price?: string             // Current price (e.g., "S$81")
  originalPrice?: string      // Original price if on sale
  image?: string             // Image URL
  category?: string          // Category (Attractions, Tours, etc.)
  location?: string          // Location/venue
  rating?: number            // Rating (0-5)
  link?: string              // Ticket purchase link
  validFrom?: string         // Valid from date
  validTo?: string           // Valid to date
  duration?: string          // Duration of experience
  ageRestriction?: string    // Age restrictions
  cancellation?: string      // Cancellation policy
  lastUpdated: string        // ISO timestamp of last update
}
```

---

## 🏗️ Architecture

### Data Flow

```
1. Admin triggers /crawl
   ↓
2. Playwright logs into AttractionsSG
   ↓
3. Crawls all pages, categories, and searches
   ↓
4. Extracts event data
   ↓
5. Deduplicates events
   ↓
6. Saves to disk cache (data/attractionsg-events.json)
   ↓
7. Loads into memory cache
   ↓
8. Serves via /events API
```

### Caching Strategy

**Three-Tier Caching:**

1. **Memory Cache** - Hot data, instant access (6-hour TTL)
2. **Disk Cache** - Persistent storage, survives restarts (`data/attractionsg-events.json`)
3. **Database** - Central DB in gotravelnha-admin (future integration)

### Data Storage

**Disk Cache Location:**
```
project-root/
  └── data/
      └── attractionsg-events.json
```

**Format:**
```json
{
  "events": [...],
  "timestamp": "2025-01-02T12:00:00.000Z",
  "total": 150
}
```

---

## 🔄 Integration with gotravelnha-admin

### Central Database Schema (Design)

```sql
CREATE TABLE attractionsg_events (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  original_price DECIMAL(10, 2),
  image_url VARCHAR(500),
  category VARCHAR(100),
  location VARCHAR(200),
  rating DECIMAL(2, 1),
  link VARCHAR(500),
  valid_from DATE,
  valid_to DATE,
  duration VARCHAR(50),
  age_restriction VARCHAR(50),
  cancellation VARCHAR(100),
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_location (location),
  FULLTEXT INDEX idx_search (title, description, location)
);
```

### Future Integration Flow

```
1. Crawler saves to disk cache
   ↓
2. Background job reads from disk cache
   ↓
3. Transforms data for DB schema
   ↓
4. Upserts to central database
   ↓
5. Admin portal reads from DB
   ↓
6. Public API can serve from DB or cache
```

---

## 🛠️ Usage Examples

### Initial Data Load

```bash
# 1. Run full crawl to collect all data
curl -X POST http://localhost:3000/api/attractionsg/crawl \
  -H "Content-Type: application/json" \
  -d '{"fullCrawl": true, "maxPages": 100}'

# 2. Verify data collection
curl -X POST http://localhost:3000/api/attractionsg/events \
  -H "Content-Type: application/json" \
  -d '{"limit": 5}'
```

### Scheduled Refresh

```javascript
// In gotravelnha-admin or scheduler
setInterval(async () => {
  await fetch('http://localhost:3000/api/attractionsg/refresh')
  console.log('AttractionsSG data refreshed')
}, 1000 * 60 * 60 * 24) // Every 24 hours
```

### Frontend Integration

```vue
<script setup>
const { data: events } = await useFetch('/api/attractionsg/events', {
  method: 'POST',
  body: {
    search: 'zoo',
    page: 1,
    limit: 20
  }
})
</script>
```

---

## 🚀 Deployment Considerations

### Environment Variables

```bash
ATTRACTIONSG_EMAIL=your@email.com
ATTRACTIONSG_PASSWORD=yourpassword
NUXT_PUBLIC_API_BASE=https://your-domain.com
```

### Production Checklist

- [ ] Set up secure credential storage
- [ ] Configure disk cache directory permissions
- [ ] Set up scheduled crawl jobs
- [ ] Implement rate limiting
- [ ] Set up monitoring & alerts
- [ ] Configure backup for cache data
- [ ] Test crawl performance
- [ ] Monitor memory usage
- [ ] Set up error logging
- [ ] Implement health checks

### Performance Optimization

1. **Crawl Scheduling:** Run full crawls during off-peak hours
2. **Memory Management:** Clear old cache entries
3. **Disk Space:** Rotate old cache files
4. **Database:** Use connection pooling for future DB integration

---

## 📊 Monitoring

### Key Metrics to Track

- Crawl duration
- Events discovered per crawl
- Cache hit ratio
- API response times
- Memory usage
- Disk cache size
- Error rates

### Health Check

```bash
# Check if crawler is working
curl -X POST http://localhost:3000/api/attractionsg/crawl \
  -H "Content-Type: application/json" \
  -d '{"fullCrawl": false}'

# Check cache status
curl -X POST http://localhost:3000/api/attractionsg/events \
  -H "Content-Type: application/json" \
  -d '{"limit": 1}'
```

---

## 🔒 Security

### Credentials Management

- Never expose credentials to client
- Use environment variables
- Rotate credentials periodically
- Monitor access logs

### Rate Limiting

Consider implementing:
- Maximum requests per IP
- Crawl frequency limits
- API usage quotas

---

## 🆘 Troubleshooting

### Common Issues

**Issue:** Crawl returns no data
- Check login credentials
- Verify AttractionsSG site structure hasn't changed
- Check network connectivity
- Review Playwright logs

**Issue:** Cache not updating
- Clear disk cache file
- Check file permissions
- Verify TTL settings

**Issue:** High memory usage
- Reduce cache size
- Implement cache eviction
- Use database instead of memory

---

**Last Updated:** January 2025  
**Version:** 1.0.0  
**Maintainer:** GoTravelNha Team
