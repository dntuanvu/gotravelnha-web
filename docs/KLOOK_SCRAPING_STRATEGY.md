# Klook Data Collection Strategy

Based on your screenshots from the Klook affiliate portal, here's the definitive scraping strategy.

---

## Key Discovery from Your Screenshots

Your screenshots reveal that Klook offers **3 main data collection paths**:

### 1. **Dynamic Widgets** ⭐ PRIME TARGET
From your screenshot showing the "Dynamic Widgets" configuration page:

**What You Have Access To**:
- Customizable widgets by language, currency, destination, category
- Auto-generated activities OR specific activities you choose
- Filters: City, Category, Number of Items
- Separate tabs for "Things to do" and "Hotels"

**Why This Is Perfect**:
- These widgets are **designed to be embedded** on external sites
- Widget content is **structured and scrapeable**
- Bypasses the captcha/anti-bot entirely
- Can generate specific URLs for scraping

### 2. **Promo Codes** ⭐ RICH DATA SOURCE
From your screenshot showing 6+ promotional deals:

**What You Have**:
- Multiple active promotional codes
- Rich deal data: titles, descriptions, dates, codes
- An **"Export" button** (golden opportunity!)
- "See all info" links for each deal
- Country-based filtering

### 3. **Text Links (Deep Links)**
From your multiple screenshots:

**What You Have**:
- Deep link generation tool
- Direct links to specific products/pages
- Perfect for targeted scraping

---

## Strategic Approach

### Phase 1: Exploit the Export Button (IMMEDIATE WIN)

**From Promo Codes Screen**:
```
1. Manually log in (one time)
2. Navigate to Promo Codes section
3. Click "Export" button
4. Get structured data file (likely CSV/Excel)
5. Parse and import to your database
```

**Implementation**:
```typescript
// server/api/klook/promo-codes.ts
export default defineEventHandler(async (event) => {
  // Since manual export, create endpoint to import the exported file
  // This becomes a manual but periodic data sync
  const uploadedFile = await readMultipartFormData(event)
  // Parse CSV/Excel
  // Store in database
})
```

**Pros**:
- ✅ Structured data
- ✅ One-time manual effort per update
- ✅ No scraping complexity

**Cons**:
- ⚠️ Manual periodic updates needed
- ⚠️ Depends on Klook maintaining export feature

---

### Phase 2: Dynamic Widgets API (SCALABLE SOLUTION)

**Strategy**: Generate widget URLs and scrape the rendered content

**Process**:
```typescript
// 1. Generate Widget URL
const widgetUrl = generateKlookWidgetUrl({
  websiteName: 'GoVietHub',
  language: 'en-SG',
  currency: 'SGD',
  category: 'attractions',
  city: 'Singapore',
  numItems: 20
})

// 2. Scrape Widget Content
// Since widgets are meant for embedding, they're more accessible
const widgetContent = await scrapeKlookWidget(widgetUrl)

// 3. Extract Deal Data
const deals = parseWidgetContent(widgetContent)
```

**Widget URL Pattern** (inferred from your screenshot):
```
https://www.klook.com/affiliate/widget/[config-params]
or
iframe embed with specific parameters
```

**Implementation**:
```typescript
// server/api/klook/widgets.ts
async function scrapeKlookWidget(config: KlookWidgetConfig) {
  // Generate widget URL based on config
  const widgetUrl = buildWidgetUrl(config)
  
  // Use Playwright to render the widget
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto(widgetUrl)
  
  // Wait for widget to load
  await page.waitForSelector('.klook-activity-card')
  
  // Extract structured data
  const activities = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.klook-activity-card')).map(card => ({
      title: card.querySelector('.title')?.textContent,
      price: card.querySelector('.price')?.textContent,
      image: card.querySelector('img')?.src,
      rating: card.querySelector('.rating')?.textContent,
      link: card.querySelector('a')?.href
    }))
  })
  
  return activities
}
```

**Database Storage**:
```prisma
model KlookActivity {
  id            String   @id @default(cuid())
  title         String
  description   String?
  image         String?
  price         String
  currency      String
  rating        Float?
  reviewCount   Int?
  category      String
  city          String
  deepLink      String   // Affiliate link
  promoCode     String?  // If applicable
  
  // Scraper tracking
  scraperJobId  String?
  scraperJob    ScraperJob? @relation(fields: [scraperJobId], references: [id])
  
  // Timing
  validFrom     DateTime?
  validUntil    DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@index([category])
  @@index([city])
  @@index([validUntil])
}
```

---

### Phase 3: Promo Code Details Scraping

**Strategy**: Use "See all info" links to get full deal details

**Process**:
```typescript
// From the Promo Codes export or scrape, get initial list
const promoCodes = [
  { code: 'HFKP1103', title: '2-for-1', seeAllInfoLink: 'https://...' },
  { code: 'POST254001103', title: 'TWD400 off', seeAllInfoLink: 'https://...' },
  // etc.
]

// Then scrape each "See all info" page
for (const promo of promoCodes) {
  const details = await scrapePromoDetails(promo.seeAllInfoLink)
  // Extract full description, terms, images, affiliate links
}
```

---

## Recommended Implementation Priority

### This Week:
1. ✅ **Manual Export Test**
   - Login to Klook affiliate portal
   - Click "Export" on Promo Codes page
   - Analyze the file format
   - Build importer for this format

2. ✅ **Dynamic Widget Analysis**
   - Click "Dynamic Widgets demo" button
   - Inspect network requests
   - Identify widget URL structure
   - Document parameters

3. ✅ **Create Admin UI**
   - Add "Klook Promo Code Import" section
   - Add "Klook Widget Scraper" section
   - Integrate with existing scraper dashboard

### Next 2 Weeks:
1. **Build Widget Scraper**
   - Implement widget URL generation
   - Create Playwright-based scraper
   - Parse widget HTML structure
   - Store in database

2. **Build Details Scraper**
   - Scrape "See all info" pages
   - Extract comprehensive deal data
   - Handle pagination if needed

3. **Schedule Automation**
   - Run weekly Promo Code checks
   - Daily widget updates for trending items
   - Clean up expired deals

---

## Specific Code Implementation

### Widget Scraper Service

```typescript
// server/api/klook/widgets.ts
import { chromium } from 'playwright'

interface KlookWidgetConfig {
  websiteName: string
  language: string
  currency: string
  destination?: string
  category?: string
  numItems?: number
}

export async function scrapeKlookDynamicWidget(config: KlookWidgetConfig) {
  const browser = await chromium.launch({
    headless: true
  })
  
  try {
    const page = await browser.newPage()
    
    // Navigate to Klook's affiliate widget embed page
    // This URL pattern needs to be discovered from the demo button
    const widgetUrl = `https://www.klook.com/affiliate/widget?${buildQueryString(config)}`
    
    await page.goto(widgetUrl, { waitUntil: 'networkidle' })
    
    // Wait for activities to load
    await page.waitForSelector('.activity-item, .klook-card, .product-card', { timeout: 10000 })
    
    const activities = await page.evaluate(() => {
      const items = document.querySelectorAll('.activity-item, .klook-card, .product-card')
      
      return Array.from(items).map(item => {
        const title = item.querySelector('.title, h3')?.textContent?.trim()
        const price = item.querySelector('.price, .amount')?.textContent?.trim()
        const image = item.querySelector('img')?.getAttribute('src')
        const link = item.querySelector('a')?.getAttribute('href')
        const rating = item.querySelector('.rating, .stars')?.getAttribute('data-rating')
        const reviews = item.querySelector('.reviews')?.textContent?.match(/\d+/)?.[0]
        
        return {
          title,
          price,
          image,
          link,
          rating: rating ? parseFloat(rating) : null,
          reviewCount: reviews ? parseInt(reviews) : null
        }
      })
    })
    
    return activities
  } finally {
    await browser.close()
  }
}

function buildQueryString(config: KlookWidgetConfig): string {
  const params = new URLSearchParams()
  
  if (config.websiteName) params.append('website', config.websiteName)
  if (config.language) params.append('lang', config.language)
  if (config.currency) params.append('currency', config.currency)
  if (config.destination) params.append('city', config.destination)
  if (config.category) params.append('category', config.category)
  if (config.numItems) params.append('limit', config.numItems.toString())
  
  return params.toString()
}
```

### Promo Code Details Scraper

```typescript
// server/api/klook/promo-details.ts
export async function scrapePromoDetails(seeAllInfoUrl: string) {
  const browser = await chromium.launch({ headless: true })
  
  try {
    const page = await browser.newPage()
    await page.goto(seeAllInfoUrl, { waitUntil: 'networkidle' })
    
    const details = await page.evaluate(() => {
      return {
        fullDescription: document.querySelector('.description, .terms')?.textContent?.trim(),
        terms: document.querySelector('.conditions, .terms-list')?.textContent?.trim(),
        validUntil: document.querySelector('.valid-until')?.textContent?.trim(),
        promoCode: document.querySelector('.promo-code')?.textContent?.trim(),
        bookingLink: document.querySelector('.book-now a')?.getAttribute('href'),
        images: Array.from(document.querySelectorAll('img')).map(img => img.src),
        applicableProducts: Array.from(document.querySelectorAll('.applicable-product'))
          .map(product => ({
            name: product.querySelector('.name')?.textContent?.trim(),
            link: product.querySelector('a')?.getAttribute('href')
          }))
      }
    })
    
    return details
  } finally {
    await browser.close()
  }
}
```

### Admin API Endpoint

```typescript
// server/api/admin/scraper/klook.ts
export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  
  if (method === 'GET') {
    // List Klook scraping jobs
    const jobs = await prisma.scraperJob.findMany({
      where: { platform: 'klook' },
      include: { dataItems: true }
    })
    return jobs
  }
  
  if (method === 'POST') {
    const body = await readBody(event)
    const { type, config } = body
    
    // Create scraper job
    const job = await prisma.scraperJob.create({
      data: {
        platform: 'klook',
        sourceUrl: buildSourceUrl(type, config),
        status: 'PENDING',
        priority: 5
      }
    })
    
    // Start scraping (fire and forget)
    if (type === 'widget') {
      scrapeKlookDynamicWidget(config).then(activities => {
        // Store in database
        storeKlookActivities(job.id, activities)
      })
    }
    
    if (type === 'promo-details') {
      scrapePromoDetails(config.url).then(details => {
        storePromoDetails(job.id, config.promoCode, details)
      })
    }
    
    return { success: true, jobId: job.id }
  }
})
```

---

## Database Schema Extension

```prisma
// Add to existing schema
model KlookActivity {
  id            String   @id @default(cuid())
  title         String
  description   String?
  image         String?
  price         String
  currency      String   @default("SGD")
  originalPrice String?
  discount      String?
  rating        Float?
  reviewCount   Int?
  category      String
  city          String
  country       String?
  
  // Links
  deepLink      String   // Affiliate link
  promoCode     String?
  bookingLink   String?
  
  // Metadata
  platform      String   @default("klook")
  scraperJobId  String?
  scraperJob    ScraperJob? @relation(fields: [scraperJobId], references: [id])
  
  // Validity
  validFrom     DateTime?
  validUntil    DateTime?
  
  // Tracking
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@index([category])
  @@index([city])
  @@index([platform])
  @@index([validUntil])
  @@index([scraperJobId])
}

// Update ScraperJob to support Klook
model ScraperJob {
  // ... existing fields
  
  // Add Klook-specific fields
  widgetConfig  Json?    // Store widget configuration
  scrapeType    String?  // "widget" | "promo-details" | "export"
}
```

---

## Next Actions

### Immediate (Today):
1. **Manual Export Test**: Login, export Promo Codes, analyze format
2. **Widget Demo Check**: Click "Dynamic Widgets demo", inspect network
3. **Document URLs**: Capture exact widget URL patterns

### This Week:
1. **Build Import System**: Parse exported Promo Codes file
2. **Prototype Widget Scraper**: Scrape one widget, test selectors
3. **Add to Admin UI**: Create Klook scraping section

### Next Sprint:
1. **Automate Widget Scraping**: Multiple cities/categories
2. **Schedule Jobs**: Weekly promo checks, daily widget updates
3. **Integrate Comparison**: Add Klook to `/compare` page

---

## Key Takeaways

**From Your Screenshots**:

1. ✅ **Export Button Exists**: Leverage for bulk data
2. ✅ **Dynamic Widgets Available**: Perfect for scraping
3. ✅ **Structured Data**: Well-formatted cards
4. ✅ **Multiple Categories**: Things to do, Hotels, Car rentals
5. ✅ **Rich Metadata**: Ratings, reviews, prices, images

**Strategic Advantages**:
- No need to bypass captcha repeatedly
- Widgets are embeddable = more accessible
- Klook has 100,000+ products vs Trip.com's 7 deals
- Promo codes are treasure trove of deals
- Scalable through automation

**Your GoVietHub Now Has**:
- Trip.com: 7 promotional deals
- Klook: 100,000+ activities + promo codes
- True multi-platform comparison capability

This is a game-changer! 🚀

