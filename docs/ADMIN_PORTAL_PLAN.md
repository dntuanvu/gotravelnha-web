# Admin Portal & User System Implementation Plan

## 🎯 Vision

Build a comprehensive admin portal for internal management and a user portal for end users, with the constraint that Playwright doesn't work on Vercel serverless.

---

## 🏗️ Architecture Overview

### Two-Portal System

```
┌─────────────────────────────────────────────────┐
│           GoTravelNha Platform                   │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────┐      ┌──────────────┐        │
│  │ Admin Portal │      │ User Portal  │        │
│  │ /admin       │      │ /user        │        │
│  └──────────────┘      └──────────────┘        │
│         │                      │                │
│    Internal              Public Users           │
│    Management            Self-Service           │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Strategy

### Current State
- Auth0 configured but not fully implemented
- No user registration system
- No role-based access control

### Proposed Implementation

#### Option A: Auth0 (Recommended for Production)
**Pros:**
- Enterprise-grade security
- Social login support
- Email verification built-in
- Password reset out-of-box
- Multi-factor auth support
- User management dashboard

**Cons:**
- Costs money after free tier
- External dependency

#### Option B: Custom Auth with Database
**Pros:**
- Full control
- No external dependencies
- Completely free

**Cons:**
- Need to build password reset
- Email verification from scratch
- Security implementation burden

### Recommended: Auth0 + Vercel Postgres

**Architecture:**
```
Auth0 (Identity) → Vercel Postgres (User Data)
                      ↓
              Role Management (Admin vs User)
```

---

## 👨‍💼 Admin Portal Features

### Access: `/admin`

#### 1. **Dashboard Overview**
- Total events scraped
- Recent scrapes
- Analytics summary
- System health

#### 2. **Event Data Management**
- **View AttractionsSG Events**
  - Browse all scraped events
  - Search and filter
  - View event details
  - Edit metadata
  - Refresh data manually

#### 3. **Scraper Management**
- **Trip.com Scraper**
  - Trigger manual scrape
  - View scraped deals
  - Configure campaigns
  - View scrape history

- **Klook Scraper**
  - Trigger manual scrape
  - View scraped activities
  - Configure categories

- **AttractionsSG Scraper**
  - View current data
  - Trigger refresh (if external service)
  - Monitor scrape status

#### 4. **Analytics & Metrics**
- Link current `/analytics` page
- Campaign performance
- User behavior
- Conversion tracking
- Revenue reporting

#### 5. **System Configuration**
- Environment variables
- Feature flags
- Notification settings
- Data retention policies

---

## 👤 User Portal Features

### Access: `/user` (requires login)

#### 1. **Profile Dashboard**
- Personal information
- Booking history
- Saved favorites
- Preferences

#### 2. **Bookings Management**
- View all bookings
- Booking details
- Cancellation requests
- Receipt downloads

#### 3. **Loyalty Points System**
- Points balance
- Points history
- Redemption catalog
- Earning rules

#### 4. **Favorites & Wishlist**
- Saved hotels
- Saved flights
- Saved activities
- Price alerts

#### 5. **Account Settings**
- Change password
- Email preferences
- Notification settings
- Privacy controls

---

## 🗃️ Database Schema Design

### Users Table
```sql
users (
  id UUID PRIMARY KEY
  auth0_id VARCHAR UNIQUE
  email VARCHAR UNIQUE
  role VARCHAR(20) -- 'admin' | 'user'
  created_at TIMESTAMP
  updated_at TIMESTAMP
)
```

### Bookings Table
```sql
bookings (
  id UUID PRIMARY KEY
  user_id UUID REFERENCES users(id)
  platform VARCHAR -- 'trip', 'klook', 'attractionsg'
  booking_type VARCHAR -- 'hotel', 'flight', 'activity'
  booking_data JSONB
  status VARCHAR -- 'pending', 'confirmed', 'cancelled'
  created_at TIMESTAMP
)
```

### Loyalty Points Table
```sql
loyalty_points (
  id UUID PRIMARY KEY
  user_id UUID REFERENCES users(id)
  points INTEGER
  reason VARCHAR
  created_at TIMESTAMP
)
```

### Scrape History Table
```sql
scrape_history (
  id UUID PRIMARY KEY
  platform VARCHAR
  total_items INTEGER
  status VARCHAR
  run_at TIMESTAMP
  data JSONB -- Store results
)
```

---

## 🚫 Vercel Limitations & Solutions

### Problem: Playwright Doesn't Work on Vercel

**Impact:**
- Cannot scrape AttractionsSG on Vercel
- Cannot scrape Trip.com/Klook on Vercel
- All scrapers currently use Playwright

**Solutions:**

#### 1. **Separate Scraper Service** (RECOMMENDED)
Deploy scrapers on Railway/Render/DigitalOcean:

```
┌─────────────────┐         ┌──────────────────┐
│  Vercel Frontend│  HTTP   │  Scraper Service │
│                 │─────────│  (Railway/etc)   │
│  Public Pages   │         │                  │
│  Admin Portal   │         │  Playwright      │
│  User Portal    │         │  Cron Jobs       │
└─────────────────┘         └──────────────────┘
```

**Implementation:**
```typescript
// Admin triggers scrape
const triggerScrape = async (platform: string) => {
  // Call external scraper service
  const response = await fetch('https://scraper.railway.app/scrape', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${adminToken}` },
    body: JSON.stringify({ platform })
  })
  return response.json()
}
```

#### 2. **Use Static Data + Manual Updates**
For MVP:
- Manually crawl data locally
- Commit to Git
- Deploy with data

Not scalable but works for testing.

#### 3. **Hybrid Approach**
- **Tri

.com/Klook**: Use iframe widgets (no scraping needed)
- **AttractionsSG**: Use static data file
- **Future**: Add external scraper for AttractionsSG

---

## 📊 Implementation Phases

### Phase 1: Foundation (Week 1)
- ✅ Database setup (Vercel Postgres)
- ✅ Auth0 integration
- ✅ Admin/User role management
- ✅ Basic admin dashboard UI

### Phase 2: Admin Portal (Week 2)
- ✅ Event data viewer
- ✅ Analytics integration
- ✅ System configuration
- ✅ User management

### Phase 3: User Portal (Week 3)
- ✅ User registration/login
- ✅ Profile management
- ✅ Bookings tracking
- ✅ Loyalty points foundation

### Phase 4: Scraping Infrastructure (Week 4)
- Deploy separate scraper service
- Admin trigger scraper
- Store results in database
- Display in admin portal

### Phase 5: Loyalty System (Week 5)
- Points earning rules
- Redemption catalog
- Points history
- Rewards management

### Phase 6: Advanced Features (Week 6+)
- Price alerts
- Email notifications
- Booking reminders
- Advanced analytics

---

## 🔧 Technical Stack

### Authentication
- **Auth0** for identity management
- **JWT** tokens for API auth
- **Role-based access control (RBAC)**

### Database
- **Vercel Postgres** (free tier available)
- **Prisma ORM** for database access
- **Connection pooling** for performance

### Frontend
- **Nuxt 3** + **Vue 3**
- **Tailwind CSS** for styling
- **Shadcn/ui** or **Headless UI** for components

### Scraping Service (External)
- **Node.js** + **Express**
- **Playwright** for browsers
- **SQLite** or **PostgreSQL** for storage
- **Cron** for scheduled scrapes

---

## 📝 Current Admin Page Status

**File**: `pages/admin/index.vue`

**Current**: Basic placeholder
**Needed**: Full-featured dashboard

---

## 🎯 Next Steps

### Immediate (This Session)
1. Design admin dashboard UI layout
2. Set up basic authentication
3. Create database schema
4. Build event data viewer

### Short-term
1. Implement scraper trigger interface
2. Add analytics viewer
3. Build user registration flow
4. Create loyalty points foundation

### Long-term
1. Deploy separate scraper service
2. Full loyalty system
3. Advanced features
4. Mobile apps

---

## 🤔 Decisions Needed

1. **Authentication**: Auth0 or custom?
2. **Database**: Vercel Postgres or other?
3. **Scraper Service**: Railway, Render, or other platform?
4. **Loyalty Rules**: How many points per dollar?
5. **Admin Access**: How to authorize internal users?
6. **MVP Scope**: What features are essential vs nice-to-have?

---

Made for GoTravelNha Admin & User Portal Planning 🚀

