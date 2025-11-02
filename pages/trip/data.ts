// This file demonstrates how to use the Trip.com scraper for data comparison
// You can use the scraper in any component or page

import { useTripScraper } from '~/composables/useTripScraper'

export default defineNuxtRouteMiddleware((to, from) => {
  // This is just a reference file to show usage
})

// Example usage in a component:
/*
<script setup lang="ts">
import { useTripScraper } from '~/composables/useTripScraper'

const { loading, error, scrapePromotions, scrapeHotels } = useTripScraper()

// Example 1: Scrape promotional deals from a sale page
const fetchPromotions = async () => {
  const result = await scrapePromotions(
    'https://sg.trip.com/sale/w/4747/flightrebate.html',
    'flight'
  )
  
  if (result) {
    console.log('Deals found:', result.deals.length)
    console.log('First deal:', result.deals[0])
  }
}

// Example 2: Scrape hotel data for comparison
const fetchHotels = async () => {
  const result = await scrapeHotels({
    cityId: '33', // Singapore
    checkinDate: '2025-03-01',
    checkoutDate: '2025-03-05',
    pageIndex: 1,
    pageSize: 20
  })
  
  if (result) {
    console.log('Hotels fetched:', result)
  }
}

// Example 3: Compare multiple promotional sources
const comparePromotions = async () => {
  const urls = [
    'https://www.trip.com/partners/ad/SB553583', // Static banner
    'https://www.trip.com/partners/ad/DB552995', // Dynamic banner
  ]
  
  const results = await scrapeMultiplePromotions(urls, 'generic')
  
  // Now you have data to compare!
  console.log('Comparison results:', results)
}
</script>
*/

