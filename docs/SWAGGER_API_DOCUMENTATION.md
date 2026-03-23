# Swagger API Documentation Guide

## Accessing Swagger Documentation

### Swagger UI (Recommended)

Visit the Swagger JSON endpoint:
- Development: `http://localhost:3000/api/docs`
- Production: `https://gotravelnha.com/api/docs`

You can also view it in Swagger UI by:
1. Opening: https://editor.swagger.io/
2. File → Import URL
3. Enter: `http://localhost:3000/api/docs/openapi.json` (or your production URL)

### OpenAPI JSON

Raw OpenAPI 3.0 specification available at:
- `GET /api/docs/openapi.json`

## What's Documented

The Swagger documentation includes:

### Admin APIs
- `/api/admin/attractionsg` - AttractionsSG event management
- `/api/admin/klook` - Klook event management  
- `/api/admin/scraper/sources` - Affiliate source URL management
- `/api/admin/analytics/affiliate` - Affiliate performance analytics

### Affiliate APIs
- `/api/affiliate/offers` - Resolve affiliate offers per entity
- `/api/affiliate/deals` - Affiliate deals feed
- `/api/affiliate/click` - Track click + return outbound URL
- `/api/affiliate/events` - Track affiliate impression/fallback events

### Public APIs
- `/api/attractionsg/events` - Get published AttractionsSG events
- `/api/auth/login` - User authentication
- `/api/checkout/create` - Create checkout session

### Unified Event Model

All event-related endpoints now use the unified `Event` schema with a `platform` field:
- `platform: 'attractionsg'` for AttractionsSG events
- `platform: 'klook'` for Klook activities
- `platform: 'trip'` for Trip.com deals

See the `Event` schema in Swagger for full field documentation.

## Adding More Endpoints

To add documentation for additional endpoints, edit:
- `server/api/docs/openapi.json`

Follow the existing patterns for:
- Request/response schemas
- Parameters
- Error responses
- Authentication requirements

## Schema Updates

The Swagger documentation has been updated to:
1. ✅ Use unified `Event` model instead of platform-specific models
2. ✅ Document affiliate link handling
3. ✅ Include all admin endpoints
4. ✅ Document authentication requirements
5. ✅ Remove retired Trip/Klook crawler endpoints

## Future Improvements

- [ ] Add more endpoint documentation (currently ~10 of 56 endpoints documented)
- [ ] Add example requests/responses
- [ ] Add authentication flow documentation
- [ ] Generate client SDKs from OpenAPI spec
- [ ] Add API versioning documentation
