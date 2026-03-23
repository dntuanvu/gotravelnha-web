/**
 * Quick script to verify environment variables are loaded correctly
 * Run: npx tsx scripts/test-env.ts
 */

import 'dotenv/config'

console.log('🔍 Checking Environment Variables...\n')

const requiredVars = {
  'DATABASE_URL': process.env.DATABASE_URL,
}

const tripVars = {
  'TRIP_ALLIANCE_ID': process.env.TRIP_ALLIANCE_ID,
  'TRIP_SID': process.env.TRIP_SID,
  'TRIP_CRAWL_ENABLED': process.env.TRIP_CRAWL_ENABLED,
}

const klookVars = {
  'KLOOK_AD_ID': process.env.KLOOK_AD_ID || process.env.KLOOK_AFFILIATE_ID,
  'KLOOK_CRAWL_ENABLED': process.env.KLOOK_CRAWL_ENABLED,
}

console.log('📋 Required Variables:')
Object.entries(requiredVars).forEach(([key, value]) => {
  const status = value ? '✅' : '❌'
  const display = key === 'DATABASE_URL' && value 
    ? `${value.substring(0, 30)}...` 
    : value || 'Missing'
  console.log(`  ${status} ${key}: ${display}`)
})

console.log('\n✈️  Trip.com Variables:')
Object.entries(tripVars).forEach(([key, value]) => {
  const status = value ? '✅' : '⚠️'
  console.log(`  ${status} ${key}: ${value || 'Not set'}`)
})

console.log('\n🎯 Klook Variables:')
Object.entries(klookVars).forEach(([key, value]) => {
  const status = value ? '✅' : '⚠️'
  console.log(`  ${status} ${key}: ${value || 'Not set'}`)
})

console.log('\n📝 Optional Variables:')
const optionalVars = [
  'CRAWL_FULL',
  'CRAWL_MAX_PAGES',
  'KLOOK_CRAWL_TYPE',
  'KLOOK_CRAWL_MAX_ITEMS',
  'KLOOK_CRAWL_LOCATIONS'
]

optionalVars.forEach(key => {
  const value = process.env[key]
  if (value) {
    console.log(`  ✅ ${key}: ${value}`)
  }
})

console.log('\n' + '='.repeat(50))
const allRequiredPresent = Object.values(requiredVars).every(v => v)
if (allRequiredPresent) {
  console.log('✅ All required variables are set!')
  console.log('🚀 You can now run: npm run crawl:trip or npm run crawl:klook')
} else {
  console.log('❌ Missing required variables. Please check your .env file.')
  console.log('📖 See docs/LOCAL_CRAWLER_TESTING.md for setup instructions.')
}
console.log('='.repeat(50))

