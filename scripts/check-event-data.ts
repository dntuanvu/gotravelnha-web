/**
 * Check Event Data Script
 * 
 * This script checks if data exists in the unified Event table
 * and shows counts by platform.
 * 
 * Usage:
 *   npm run check:event-data
 *   or
 *   tsx scripts/check-event-data.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Checking Event table data...\n')

  try {
    // Count events by platform
    const platforms = ['attractionsg', 'klook', 'trip']
    
    for (const platform of platforms) {
      const count = await (prisma as any).event.count({
        where: { platform }
      })
      
      console.log(`📊 ${platform.toUpperCase()}: ${count} events`)
    }

    // Total count
    const total = await (prisma as any).event.count()
    console.log(`\n📈 Total Events: ${total}`)

    // Show some sample events
    if (total > 0) {
      console.log('\n📋 Sample Events (first 5):')
      const samples = await (prisma as any).event.findMany({
        take: 5,
        select: {
          id: true,
          platform: true,
          title: true,
          link: true,
          createdAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      samples.forEach((event: any) => {
        console.log(`   - [${event.platform}] ${event.title.substring(0, 50)}...`)
        console.log(`     ID: ${event.id}`)
        console.log(`     Link: ${event.link || 'N/A'}`)
        console.log(`     Created: ${event.createdAt}`)
        console.log('')
      })
    } else {
      console.log('\n⚠️  No events found in Event table!')
      console.log('   This means:')
      console.log('   1. Migration was not run, OR')
      console.log('   2. Data was lost when cleanup was run before migration')
    }

    // Check if old tables still exist (they shouldn't if cleanup was run)
    console.log('🔍 Checking for deprecated tables...\n')
    
    const deprecatedTables = [
      'attractionsg_events',
      'klook_activities', 
      'trip_scraped_data'
    ]

    for (const table of deprecatedTables) {
      try {
        const result = await prisma.$queryRawUnsafe<Array<{ count: bigint }>>(
          `SELECT COUNT(*) as count FROM "${table}"`
        )
        const count = Number(result[0]?.count || 0)
        if (count > 0) {
          console.log(`⚠️  Table ${table} still exists with ${count} rows`)
        } else {
          console.log(`✅ Table ${table} is empty or doesn't exist`)
        }
      } catch (error: any) {
        if (error.message.includes('does not exist') || error.message.includes('relation')) {
          console.log(`✅ Table ${table} has been removed (as expected)`)
        } else {
          console.log(`❓ Table ${table}: ${error.message}`)
        }
      }
    }

  } catch (error: any) {
    console.error('❌ Error checking data:', error.message)
    
    if (error.message.includes('event') || error.message.includes('Event')) {
      console.error('\n💡 It looks like the Event model might not exist.')
      console.error('   Try running: npx prisma generate')
    }
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
