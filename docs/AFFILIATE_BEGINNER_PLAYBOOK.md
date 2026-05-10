# Affiliate Beginner Playbook (Trip.com + Klook)

This playbook is for operating GoVietHub as an affiliate-first business model without owning full booking inventory.

## 1) Revenue Setup (One-Time)

- Create and verify affiliate accounts:
  - Trip.com Partner Program
  - Klook Affiliate Program
- Store credentials in environment variables:
  - `TRIP_ALLIANCE_ID`, `TRIP_SID`
  - `KLOOK_AD_ID`, `KLOOK_SEARCH_WIDGET_ID`
- Confirm IDs are loaded in production runtime config.

## 2) Tracking Setup (Must-Have)

- All outbound affiliate clicks should go through:
  - `POST /api/affiliate/click`
- Ensure every click passes:
  - `provider`, `baseUrl`, `placementKey`, `pagePath`, `sessionId`
- Validate click records in `affiliateClickEvent` table:
  - `provider`, `subId`, `outboundUrl`, `deviceType`

## 3) Conversion Strategy (Weekly)

- Focus intent-based landing zones:
  - Homepage funnel cards: flights / hotels / activities
  - Dedicated `/trip` and `/klook` pages
- Keep calls-to-action specific:
  - "Book Hotels", "Find Activities", "Compare Flight Entry Points"
- Prioritize high-intent destinations and seasonal campaigns.

## 4) Operations Workflow (Weekly)

- Update best-performing offers in admin affiliate slots.
- Deactivate stale or broken campaigns.
- Check analytics:
  - Top `placementKey` by clicks
  - Mobile vs desktop performance
  - Provider split (Trip vs Klook)
- Keep only profitable placements and replace low CTR blocks.

## 5) Beginner KPI Targets (First 60 Days)

- CTR from homepage funnels: `> 3%`
- Returning users: `> 15%`
- Affiliate click growth: `+20% month-over-month`
- Provider mix target:
  - Trip.com stronger for hotels/flights
  - Klook stronger for activities/tours

## 6) Compliance and Trust

- Show clear affiliate disclosure in the UI.
- Do not claim "official provider" status if you are an affiliate.
- Keep destination and price claims honest and regularly refreshed.

## 7) Scaling Path

- Phase 1: widgets + deeplinks + click tracking (current model)
- Phase 2: destination-specific content hubs + SEO pages
- Phase 3: richer feed/API partner integrations after performance proof

## 8) Weekly Deal Page Publishing (New Template)

- Deal page route: `pages/deals/[slug].vue`
- Template content source: `data/deal-page-templates.ts`
- Reusable UI block: `components/deals/HighConvertingDealTemplate.vue`

Weekly publishing workflow:

1. Duplicate an item in `DEAL_PAGE_TEMPLATES`.
2. Change:
   - `slug`, `title`, `description`, `destination`
   - `primaryProvider`, `primaryBaseUrl`, `primaryCtaLabel`
   - `placementKey` (use a unique key for analytics)
   - `comparison` options and notes
3. Share URL: `/deals/<slug>`
4. Track performance in admin affiliate dashboard by placement key.

Trip.com deeplink mapping:

- Open `/admin/deal-template-generator`
- Paste your Trip deeplink from the Trip affiliate portal into **Trip.com Affiliate Mapping**
- Click **Apply Trip Mapping** to auto-fill:
  - `primaryProvider: 'trip'`
  - `primaryBaseUrl` with your pasted Trip URL
  - Trip-first comparison row

---

Owner note: Affiliate is the right model when inventory ownership is expensive. Win by selecting high-intent placements, tracking every click, and continuously improving conversion blocks.
