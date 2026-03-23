# GoVietHub API Documentation

## Overview

This document provides an overview of all API endpoints in the GoVietHub platform. For detailed OpenAPI/Swagger documentation, visit `/api/docs` or `/api/docs/openapi.json`.

## Accessing API Documentation

### Swagger UI

Visit: `http://localhost:3000/api/docs` (or your deployed domain)

The Swagger documentation is available in JSON format at:
- Development: `http://localhost:3000/api/docs`
- Production: `https://gotravelnha.com/api/docs`

### OpenAPI JSON

Raw OpenAPI 3.0 specification:
- `GET /api/docs/openapi.json`

## API Structure

### Base URL

- Development: `http://localhost:3000/api`
- Production: `https://gotravelnha.com/api`

## Authentication

Most admin endpoints require authentication. Currently using:
- **Method**: Bearer token (JWT) or session-based
- **Header**: `Authorization: Bearer <token>`

## API Endpoints by Category

### Admin APIs

#### Event Management

- **GET /api/admin/attractionsg** - Get AttractionsSG events (admin)
  - Query params: `page`, `limit`, `search`, `status`, `sort`
  - Returns: Array of events with pagination

- **POST /api/admin/attractionsg** - Update AttractionsSG events
  - Body: Array of event update objects
  - Returns: Updated events

- **GET /api/admin/klook** - Get Klook events (admin)
  - Query params: `page`, `limit`, `search`, `status`, `sort`
  - Returns: Array of events with pagination

- **POST /api/admin/klook** - Update Klook events
  - Body: Array of event update objects
  - Returns: Updated events

#### Affiliate Source Management

- **GET /api/admin/scraper/sources** - List all affiliate source URLs
- **POST /api/admin/scraper/sources** - Create/update affiliate source URL

#### User Management

- **GET /api/admin/users** - List all users
- **POST /api/admin/users** - Create/update user

#### Analytics

- **GET /api/admin/analytics/activities** - Get user activity analytics
- **GET /api/admin/analytics/affiliate** - Get affiliate click analytics

### Public APIs

#### AttractionsSG

- **POST /api/attractionsg/events** - Get published AttractionsSG events
  - Body: `{ page, limit, sortBy, sortOrder }`
  - Returns: Array of published events

- **GET /api/attractionsg/event/[slug]** - Get single AttractionsSG event
  - Returns: Event details

### Affiliate APIs

- **GET /api/affiliate/offers** - Resolve primary/alternative offers by `entityId` or `slug`
- **GET /api/affiliate/deals** - Get affiliate deals feed for UI
- **POST /api/affiliate/click** - Track click and return outbound affiliate URL
- **POST /api/affiliate/events** - Track impressions/fallback/unavailable events

### Authentication APIs

- **POST /api/auth/login** - User login
  - Body: `{ username, password }`
  - Returns: `{ success, user, token }`

- **POST /api/auth/register** - User registration
  - Body: `{ username, email, password, firstName, lastName }`

- **POST /api/auth/forgot-password** - Request password reset
- **POST /api/auth/reset-password** - Reset password

### Booking APIs

- **POST /api/checkout/create** - Create Stripe checkout session
  - Body: `{ eventId, quantity, adultCount, childCount, customerEmail, ... }`
  - Returns: `{ success, sessionId, url }`

- **POST /api/booking-request** - Submit booking request

### Other APIs

- **POST /api/track-activity** - Track user activity
- **POST /api/newsletter/subscribe** - Subscribe to newsletter
- **POST /api/contact** - Submit contact form
- **GET /api/exchange** - Get currency exchange rates
- **POST /api/search/global** - Global search
- **POST /api/deals/compare** - Compare deals
- **POST /api/price-alerts/create** - Create price alert
- **GET /api/price-alerts/my-alerts** - Get user's price alerts

## Unified Event Model

All platform events now use the unified `Event` model with `platform` field:

```typescript
{
  id: string
  platform: 'attractionsg' | 'klook' | 'trip'
  title: string
  priceAmount: number
  // ... see Event schema in Swagger docs
}
```

### Platform Values

- `attractionsg` - AttractionsSG events
- `klook` - Klook activities
- `trip` - Trip.com deals

## Affiliate Link Handling

### Klook URLs

Klook URLs are automatically appended with affiliate ID (`aid` parameter) when displaying to users:

```typescript
import { appendKlookAffiliateId } from '~/utils/affiliate-links'

const affiliateLink = appendKlookAffiliateId(
  originalUrl,
  affiliateId // From runtime config
)
```

### Trip.com URLs

Trip.com URLs are appended with `Allianceid` and `SID` parameters:

```typescript
import { appendTripAffiliateIds } from '~/utils/affiliate-links'

const affiliateLink = appendTripAffiliateIds(
  originalUrl,
  allianceId, // From runtime config
  sid // From runtime config
)
```

### AttractionsSG

AttractionsSG is currently separated from affiliate routing.

## Error Responses

All APIs return errors in this format:

```json
{
  "statusCode": 400,
  "message": "Error description"
}
```

Common status codes:
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting for production use.

## Versioning

API versioning is not currently implemented. All endpoints are under `/api/` prefix.

## Future Enhancements

- [ ] Add API versioning (`/api/v1/`, `/api/v2/`)
- [ ] Implement rate limiting
- [ ] Add request/response logging
- [ ] Add API key authentication for external integrations
- [ ] Complete Swagger documentation for all endpoints
- [ ] Add API usage analytics
