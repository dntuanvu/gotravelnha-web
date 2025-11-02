# GoTravelNha Web

A modern, professional travel booking platform that compares and aggregates deals from multiple travel platforms including Trip.com, Klook, Agoda, and Booking.com.

## 🌟 Features

### Professional UI/UX
- **Modern Design**: Beautiful, responsive design with smooth animations
- **Gradient Themes**: Eye-catching gradient backgrounds and buttons
- **Mobile-First**: Fully responsive across all devices
- **Loading States**: Professional skeleton loaders and loading indicators
- **Error Handling**: User-friendly error messages with retry functionality

### Web Scraping Capabilities
- **Simple Scraper**: Lightweight HTML scraper using Cheerio for quick data extraction
- **Advanced Scraper**: Full Playwright-based scraper for JavaScript-rendered pages
- **Flexible Extraction**: Support for custom CSS selectors
- **Metadata Extraction**: Automatic extraction of titles, descriptions, images, and more
- **Price Detection**: Smart price extraction from various formats

### Travel Platform Integration
- **Trip.com**: Hotel and flight bookings with search functionality
- **Klook**: Activity and experience bookings
- **Agoda**: Coming soon
- **Booking.com**: Coming soon

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/gotravelnha-web.git

# Navigate to project directory
cd gotravelnha-web

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
gotravelnha-web/
├── assets/              # CSS and static assets
│   └── css/
│       └── tailwind.css
├── components/          # Vue components
│   ├── AffiliateCard.vue
│   ├── HeroBanner.vue
│   ├── TripHotelList.vue
│   └── ...
├── composables/         # Composable functions
│   ├── useAuth.ts
│   ├── useScraper.ts
│   └── useTrack.ts
├── layouts/             # Layout templates
│   └── default.vue
├── middleware/          # Route middleware
│   └── auth.global.ts
├── pages/               # Application pages
│   ├── index.vue
│   ├── trip/
│   ├── klook/
│   ├── scraper-demo.vue
│   └── ...
├── plugins/             # Nuxt plugins
│   ├── klook-widget.js
│   ├── toast.client.ts
│   └── tripTools.client.ts
├── public/              # Static files
├── server/              # Server-side API
│   └── api/
│       ├── scrape-simple.ts
│       ├── scraper.ts
│       └── trip/
│           └── hotels.ts
├── nuxt.config.ts       # Nuxt configuration
├── tailwind.config.js   # Tailwind configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies
```

## 🛠️ Technology Stack

- **Framework**: Nuxt 3
- **UI**: Vue 3 + Tailwind CSS
- **Language**: TypeScript
- **Scraping**: Cheerio, Playwright, Puppeteer
- **Authentication**: Auth0
- **Email**: Nodemailer

## 🔍 Web Scraping Usage

### Simple Scraper API

Basic HTML scraping without JavaScript rendering:

```javascript
// POST /api/scrape-simple
{
  "url": "https://example.com",
  "selectors": {
    "customData": ".my-custom-selector"
  }
}
```

### Advanced Scraper API

Full browser automation with JavaScript support:

```javascript
// POST /api/scraper
{
  "url": "https://example.com",
  "timeout": 30000
}
```

### Using the Composable

```vue
<script setup>
import { useScraper } from '~/composables/useScraper'

const { scrapeUrl, loading, error } = useScraper()

const fetchData = async () => {
  const data = await scrapeUrl({
    url: 'https://example.com'
  })
  
  if (data) {
    console.log(data.title, data.description)
  }
}
</script>
```

## 🎨 Customization

### Tailwind Configuration

The project uses custom Tailwind themes. Edit `tailwind.config.js` to customize:

```javascript
theme: {
  extend: {
    colors: {
      primary: { /* custom primary colors */ }
    }
  }
}
```

### Branding

Update brand information in:
- `nuxt.config.ts` - SEO and meta tags
- `layouts/default.vue` - Header and footer
- `pages/index.vue` - Homepage content

## 🌐 Environment Variables

**⚠️ IMPORTANT**: Create a `.env` file in the project root with the following variables:

```env
# ==========================================
# SMTP Email Configuration (REQUIRED)
# ==========================================
# Required for: Contact form, Booking requests, Exchange requests
# Contact your hosting provider for sinult3.hostarmada.net credentials
SMTP_USER=your-email@enjoytravelsingapore.com
SMTP_PASS=your-smtp-password

# ==========================================
# AttractionsSG Integration (REQUIRED)
# ==========================================
# ⚠️ CONFIDENTIAL - PDPA Protected
ATTRACTIONSG_EMAIL=enjoytravelticket@gmail.com
ATTRACTIONSG_PASSWORD=Truc1@3456101112

# ==========================================
# Auth0 Authentication (Optional)
# ==========================================
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_REDIRECT_URI=http://localhost:3000/callback

# ==========================================
# External API Configuration (Optional)
# ==========================================
EXCHANGE_API_KEY=your-exchange-api-key
NUXT_PUBLIC_API_BASE=https://api.example.com

# ==========================================
# Trip.com Affiliate Configuration (Optional)
# ==========================================
TRIP_ALLIANCE_ID=3883416
TRIP_SID=22874365
TRIP_BASE_URL=https://www.trip.com
```

### Quick Setup

```bash
# Copy template and add your values
cp .env.example .env
# Edit .env with your actual credentials
```

**Note**: The `.env` file is already in `.gitignore` and will not be committed to version control.

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🔒 Security Considerations

### Web Scraping
- Always respect website terms of service
- Implement rate limiting
- Use proper User-Agent headers
- Handle errors gracefully
- Consider caching to avoid excessive requests

### API Security
- Never expose sensitive API keys client-side
- Use server-side endpoints for scraping
- Implement request validation
- Add timeout limits

## 🧪 Testing

```bash
# Run linter
npm run lint

# Build for testing
npm run build

# Preview production
npm run preview
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, email support@gotravelnha.com or visit our [Contact Page](http://gotravelnha.com/contact).

## 🔗 Links

- **Website**: https://gotravelnha.com
- **Documentation**: Coming soon
- **API Reference**: Coming soon

---

Made with ❤️ by the GoTravelNha team
