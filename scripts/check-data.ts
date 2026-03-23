/**
 * Quick script to check crawled data in database
 * Run: npx tsx scripts/check-data.ts
 */

import 'dotenv/config'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const rootDir = resolve(__dirname, '..')
const prismaPath = new URL(resolve(rootDir, 'server/utils/prisma.ts'), 'file://').href

const { default: prisma } = await import(prismaPath)

async function checkData() {
  console.log('📊 Database Data Summary\n')
  console.log('='.repeat(50))
  
  try {
    // Trip.com
    const tripCount = await prisma.tripScrapedData.count({ where: { isValid: true } })
    const tripTotal = await prisma.tripScrapedData.count()
    console.log(`\n✈️  Trip.com:`)
    console.log(`   Total: ${tripTotal}`)
    console.log(`   Valid: ${tripCount}`)
    
    if (tripCount > 0) {
      const recentTrip = await prisma.tripScrapedData.findFirst({
        where: { isValid: true },
        orderBy: { createdAt: 'desc' },
        select: { title: true, createdAt: true }
      })
      console.log(`   Latest: ${recentTrip?.title?.substring(0, 40)}... (${recentTrip?.createdAt?.toLocaleDateString()})`)
    }
    
    // Klook Activities
    const klookActivityCount = await prisma.klookActivity.count({ where: { isActive: true } })
    const klookActivityTotal = await prisma.klookActivity.count()
    console.log(`\n🎯 Klook Activities:`)
    console.log(`   Total: ${klookActivityTotal}`)
    console.log(`   Active: ${klookActivityCount}`)
    
    if (klookActivityCount > 0) {
      const recentActivity = await prisma.klookActivity.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
        select: { title: true, createdAt: true, location: true }
      })
      console.log(`   Latest: ${recentActivity?.title?.substring(0, 40)}... (${recentActivity?.location || 'Unknown'})`)
    }
    
    // Klook Promos
    const klookPromoCount = await prisma.klookPromoCode.count({ where: { isActive: true } })
    const klookPromoTotal = await prisma.klookPromoCode.count()
    console.log(`\n🎫 Klook Promo Codes:`)
    console.log(`   Total: ${klookPromoTotal}`)
    console.log(`   Active: ${klookPromoCount}`)
    
    // Klook Hotels
    const klookHotelCount = await prisma.klookHotelDeal.count({ where: { isActive: true } })
    const klookHotelTotal = await prisma.klookHotelDeal.count()
    console.log(`\n🏨 Klook Hotels:`)
    console.log(`   Total: ${klookHotelTotal}`)
    console.log(`   Active: ${klookHotelCount}`)
    
    // Scraper Jobs
    const recentJobs = await prisma.scraperJob.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        platform: true,
        status: true,
        jobType: true,
        createdAt: true,
        error: true
      }
    })
    
    console.log(`\n📋 Recent Scraper Jobs (last 5):`)
    recentJobs.forEach((job, index) => {
      const status = job.status === 'COMPLETED' ? '✅' : job.status === 'FAILED' ? '❌' : '⏳'
      console.log(`   ${index + 1}. ${status} ${job.platform} (${job.jobType}) - ${job.status}`)
      if (job.error) {
        console.log(`      Error: ${job.error.substring(0, 60)}...`)
      }
    })
    
    console.log('\n' + '='.repeat(50))
    
    if (tripCount === 0 && klookActivityCount === 0 && klookPromoCount === 0 && klookHotelCount === 0) {
      console.log('\n⚠️  No data found in database!')
      console.log('   Run crawlers: npm run crawl:trip or npm run crawl:klook')
    } else {
      console.log('\n✅ Data found in database!')
    }
    
  } catch (error: any) {
    console.error('❌ Error checking data:', error.message)
    if (error.message.includes('does not exist')) {
      console.log('\n💡 Run migrations: npx prisma migrate deploy')
    }
  } finally {
    await prisma.$disconnect()
  }
}

checkData()

