/**
 * Klook Dynamic Widgets Management
 * 
 * Configuration for different Klook widget types based on categories
 */

export interface KlookWidgetConfig {
  id: string
  name: string
  description: string
  icon: string
  widgetId: string
  adId: string
  category?: string
  city?: string
  productType?: string
  lang?: string
  currency?: string
  height?: string
  active?: boolean
}

/**
 * Official Klook portal categories
 * From: https://affiliate.klook.com/my_ads/ -> Dynamic Widgets
 */
export const KLOOK_CATEGORIES = [
  { 
    name: 'Attractions & shows', 
    icon: '🏰', 
    slug: 'attractions',
    description: 'Theme parks, museums, and shows'
  },
  { 
    name: 'Tours & sightseeing', 
    icon: '🚶', 
    slug: 'tours',
    description: 'Guided tours and sightseeing experiences'
  },
  { 
    name: 'Food & dining', 
    icon: '🍜', 
    slug: 'food',
    description: 'Restaurant reservations and dining experiences'
  },
  { 
    name: 'Transport & WiFi', 
    icon: '🚌', 
    slug: 'transport',
    description: 'Trains, buses, and connectivity'
  },
  { 
    name: 'Activities & experiences', 
    icon: '🎢', 
    slug: 'activities',
    description: 'Adventure activities and unique experiences'
  },
  { 
    name: 'Attraction passes', 
    icon: '🎫', 
    slug: 'passes',
    description: 'Multi-attraction passes and packages'
  }
]

/**
 * Predefined Klook widget configurations
 * Update widgetId and adId after getting them from Klook affiliate portal
 */
export const KLOOK_WIDGET_CONFIGS: KlookWidgetConfig[] = [
  {
    id: 'top-attractions',
    name: 'Top Attractions',
    description: 'Explore famous landmarks and attractions worldwide',
    icon: '🏰',
    widgetId: '89020', // Update from Klook portal
    adId: '1045566', // Update from Klook portal
    productType: 'search_vertical',
    category: 'attractions',
    lang: 'en',
    currency: 'SGD',
    height: '400px',
    active: true
  },
  {
    id: 'city-passes',
    name: 'City Passes & Packages',
    description: 'Save with all-inclusive destination passes',
    icon: '🎫',
    widgetId: '89020',
    adId: '1045566',
    productType: 'search_vertical',
    category: 'city_pass',
    lang: 'en',
    currency: 'SGD',
    height: '400px',
    active: true
  },
  {
    id: 'tours-activities',
    name: 'Tours & Activities',
    description: 'Guided experiences and local tours',
    icon: '🚶',
    widgetId: '89020',
    adId: '1045566',
    productType: 'search_vertical',
    category: 'tours',
    lang: 'en',
    currency: 'SGD',
    height: '400px',
    active: true
  },
  {
    id: 'singapore-attractions',
    name: 'Singapore Attractions',
    description: 'Discover the best of Singapore',
    icon: '🇸🇬',
    widgetId: '89020',
    adId: '1045566',
    productType: 'search_vertical',
    city: 'Singapore',
    lang: 'en-SG',
    currency: 'SGD',
    height: '400px',
    active: false // Activate after getting widget config
  },
  {
    id: 'vietnam-tours',
    name: 'Vietnam Tours',
    description: 'Explore Vietnam destinations',
    icon: '🇻🇳',
    widgetId: '89020',
    adId: '1045566',
    productType: 'search_vertical',
    city: 'Vietnam',
    lang: 'en',
    currency: 'USD',
    height: '400px',
    active: false // Activate after getting widget config
  },
  {
    id: 'theme-parks',
    name: 'Theme Parks',
    description: 'Fun-filled adventures for the whole family',
    icon: '🎢',
    widgetId: '89020',
    adId: '1045566',
    productType: 'search_vertical',
    category: 'theme_parks',
    lang: 'en',
    currency: 'SGD',
    height: '400px',
    active: false
  },
  {
    id: 'food-drink',
    name: 'Food & Drink',
    description: 'Culinary experiences and dining',
    icon: '🍜',
    widgetId: '89020',
    adId: '1045566',
    productType: 'search_vertical',
    category: 'food',
    lang: 'en',
    currency: 'SGD',
    height: '400px',
    active: false
  },
  {
    id: 'transportation',
    name: 'Transportation',
    description: 'Trains, buses, and airport transfers',
    icon: '🚌',
    widgetId: '89020',
    adId: '1045566',
    productType: 'search_vertical',
    category: 'transport',
    lang: 'en',
    currency: 'SGD',
    height: '400px',
    active: false
  }
]

/**
 * Get active Klook widgets
 */
export function getActiveKlookWidgets(): KlookWidgetConfig[] {
  return KLOOK_WIDGET_CONFIGS.filter(widget => widget.active)
}

/**
 * Get Klook widget by ID
 */
export function getKlookWidgetById(id: string): KlookWidgetConfig | undefined {
  return KLOOK_WIDGET_CONFIGS.find(widget => widget.id === id)
}

/**
 * Get Klook widgets by category
 */
export function getKlookWidgetsByCategory(category: string): KlookWidgetConfig[] {
  return KLOOK_WIDGET_CONFIGS.filter(widget => widget.category === category)
}

/**
 * Generate widget embed HTML
 */
export function generateKlookWidgetHTML(config: KlookWidgetConfig): string {
  const props: string[] = []
  
  if (config.widgetId) props.push(`data-wid="${config.widgetId}"`)
  if (config.height) props.push(`data-height="${config.height}"`)
  if (config.adId) props.push(`data-adid="${config.adId}"`)
  if (config.lang) props.push(`data-lang="${config.lang}"`)
  if (config.productType) props.push(`data-prod="${config.productType}"`)
  if (config.currency) props.push(`data-currency="${config.currency}"`)
  if (config.category) props.push(`data-category="${config.category}"`)
  if (config.city) props.push(`data-city="${config.city}"`)
  
  return `<ins class="klk-aff-widget" ${props.join(' ')}>
            <a href="//www.klook.com/?aid=${config.adId}">Klook.com</a>
          </ins>`
}

