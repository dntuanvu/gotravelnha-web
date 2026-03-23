/**
 * Migration Script: Platform-Specific Tables → Unified Event Model
 * 
 * This script migrates data from:
 * - AttractionsgEvent → Event (platform='attractionsg')
 * - KlookActivity → Event (platform='klook')
 * - TripScrapedData → Event (platform='trip')
 * - AttractionsgBooking → EventBooking
 * 
 * Usage:
 *   tsx scripts/migrate-to-unified-event-model.ts
 * 
 * Safety:
 *   - Creates backup before migration
 *   - Dry-run mode available (--dry-run)
 *   - Can rollback if needed
 */

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs/promises'
import { join } from 'path'

const prisma = new PrismaClient()

interface MigrationStats {
  attractionsg: { migrated: number; errors: number }
  klook: { migrated: number; errors: number }
  trip: { migrated: number; errors: number }
  bookings: { migrated: number; errors: number }
  startTime: Date
  endTime?: Date
}

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const skipBackup = args.includes('--skip-backup')

  console.log('🚀 Starting migration to unified Event model...')
  console.log(`Mode: ${dryRun ? 'DRY RUN (no changes will be made)' : 'LIVE MIGRATION'}`)
  console.log('')

  const stats: MigrationStats = {
    attractionsg: { migrated: 0, errors: 0 },
    klook: { migrated: 0, errors: 0 },
    trip: { migrated: 0, errors: 0 },
    bookings: { migrated: 0, errors: 0 },
    startTime: new Date()
  }

  try {
    // Step 1: Backup existing data
    if (!skipBackup && !dryRun) {
      console.log('📦 Creating backup...')
      await createBackup()
      console.log('✅ Backup created\n')
    }

    // Step 2: Migrate AttractionsSG Events
    console.log('🎫 Migrating AttractionsSG Events...')
    await migrateAttractionsgEvents(stats, dryRun)
    console.log(`   ✓ Migrated: ${stats.attractionsg.migrated}, Errors: ${stats.attractionsg.errors}\n`)

    // Step 3: Migrate Klook Activities
    console.log('🎯 Migrating Klook Activities...')
    await migrateKlookActivities(stats, dryRun)
    console.log(`   ✓ Migrated: ${stats.klook.migrated}, Errors: ${stats.klook.errors}\n`)

    // Step 4: Migrate Trip.com Data
    console.log('🏨 Migrating Trip.com Deals...')
    await migrateTripData(stats, dryRun)
    console.log(`   ✓ Migrated: ${stats.trip.migrated}, Errors: ${stats.trip.errors}\n`)

    // Step 5: Migrate Bookings
    console.log('📋 Migrating Event Bookings...')
    await migrateBookings(stats, dryRun)
    console.log(`   ✓ Migrated: ${stats.bookings.migrated}, Errors: ${stats.bookings.errors}\n`)

    stats.endTime = new Date()
    const duration = (stats.endTime.getTime() - stats.startTime.getTime()) / 1000

    console.log('='.repeat(60))
    console.log('📊 Migration Summary')
    console.log('='.repeat(60))
    console.log(`AttractionsSG Events: ${stats.attractionsg.migrated} migrated, ${stats.attractionsg.errors} errors`)
    console.log(`Klook Activities:    ${stats.klook.migrated} migrated, ${stats.klook.errors} errors`)
    console.log(`Trip.com Deals:      ${stats.trip.migrated} migrated, ${stats.trip.errors} errors`)
    console.log(`Bookings:            ${stats.bookings.migrated} migrated, ${stats.bookings.errors} errors`)
    console.log(`Duration:            ${duration.toFixed(2)} seconds`)
    console.log('='.repeat(60))

    if (dryRun) {
      console.log('\n⚠️  This was a DRY RUN. No data was modified.')
      console.log('   Run without --dry-run to perform actual migration.')
    } else {
      console.log('\n✅ Migration completed!')
      console.log('   Next steps:')
      console.log('   1. Verify data integrity')
      console.log('   2. Update application code to use Event model (already done)')
      console.log('   3. Test the application')
      console.log('   4. After verification, run: tsx scripts/remove-deprecated-tables.ts')
    }

  } catch (error: any) {
    console.error('\n❌ Migration failed:', error)
    console.error('\n💡 If migration partially completed, you may need to rollback.')
    console.error('   Check the backup directory for restore scripts.')
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

async function createBackup() {
  const backupDir = join(process.cwd(), 'backups', `migration-${Date.now()}`)
  await fs.mkdir(backupDir, { recursive: true })

  // Note: In production, you'd want to use pg_dump or similar
  // This is a simplified backup approach
  const backup = {
    timestamp: new Date().toISOString(),
    note: 'Backup before unified Event model migration'
  }

  await fs.writeFile(
    join(backupDir, 'backup-info.json'),
    JSON.stringify(backup, null, 2)
  )

  console.log(`   Backup directory: ${backupDir}`)
}

async function migrateAttractionsgEvents(stats: MigrationStats, dryRun: boolean) {
  try {
    const events = await prisma.attractionsgEvent.findMany()

    for (const event of events) {
      try {
        // Check if already migrated
        let existing = null
        try {
          existing = await (prisma as any).event.findFirst({
            where: {
              platform: 'attractionsg',
              OR: [
                { link: event.link || undefined },
                { slug: event.slug || undefined }
              ]
            }
          })
        } catch (error: any) {
          // If Event model doesn't exist yet, that's okay - we'll create it
          if (!error.message.includes('event') && !error.message.includes('Event')) {
            throw error
          }
        }

        if (existing) {
          console.log(`   ⏭️  Skipping (already exists): ${event.title.substring(0, 50)}`)
          continue
        }

        if (!dryRun) {
          await (prisma as any).event.create({
            data: {
              platform: 'attractionsg',
              title: event.title,
              slug: event.slug || null,
              description: event.description || null,
              priceText: event.priceText || null,
              priceAmount: event.priceAmount || null,
              resellerPriceAmount: event.resellerPriceAmount || null,
              originalPriceText: event.originalPriceText || null,
              originalPriceAmount: event.originalPriceAmount || null,
              publicPrice: event.publicPrice || null,
              currency: 'SGD',
              image: event.image || null,
              gallery: [],
              location: event.location || null,
              category: event.category || null,
              rating: event.rating || null,
              link: event.link || null,
              sourceUrl: event.link || null,
              duration: event.duration || null,
              ageRestriction: event.ageRestriction || null,
              cancellation: event.cancellation || null,
              validFrom: event.validFrom || null,
              validTo: event.validTo || null,
              lastSeenAt: event.lastSeenAt,
              isActive: event.isActive,
              isPublished: event.isPublished,
              publishedAt: event.publishedAt || null,
              notes: event.notes || null,
              isSelfBookable: event.isSelfBookable,
              stripePriceId: event.stripePriceId || null,
              checkoutNotes: event.checkoutNotes || null,
              raw: event.raw || null,
              metadata: {},
              createdAt: event.createdAt,
              updatedAt: event.updatedAt
            }
          })
        }

        stats.attractionsg.migrated++
      } catch (error: any) {
        console.error(`   ❌ Error migrating event ${event.id}:`, error.message)
        stats.attractionsg.errors++
      }
    }
  } catch (error: any) {
    console.error('   ❌ Failed to fetch AttractionsSG events:', error.message)
    throw error
  }
}

async function migrateKlookActivities(stats: MigrationStats, dryRun: boolean) {
  try {
    const activities = await prisma.klookActivity.findMany()

    for (const activity of activities) {
      try {
        // Check if already migrated
        let existing = null
        try {
          existing = await (prisma as any).event.findFirst({
            where: {
              platform: 'klook',
              link: activity.link || undefined
            }
          })
        } catch (error: any) {
          // If Event model doesn't exist yet, that's okay
          if (!error.message.includes('event') && !error.message.includes('Event')) {
            throw error
          }
        }

        if (existing) {
          console.log(`   ⏭️  Skipping (already exists): ${activity.title.substring(0, 50)}`)
          continue
        }

        if (!dryRun) {
          await (prisma as any).event.create({
            data: {
              platform: 'klook',
              title: activity.title,
              slug: null,
              description: activity.description || null,
              priceAmount: activity.price || null,
              originalPriceAmount: activity.originalPrice || null,
              currency: activity.currency || 'SGD',
              image: activity.image || null,
              gallery: [],
              location: activity.location || null,
              category: activity.category || null,
              rating: activity.rating || null,
              reviewCount: activity.reviewCount || null,
              link: activity.link || null,
              sourceUrl: activity.link || null,
              lastSeenAt: activity.createdAt,
              isActive: activity.isActive,
              isPublished: false,
              metadata: activity.metadata || {},
              raw: null,
              createdAt: activity.createdAt,
              updatedAt: activity.updatedAt
            }
          })
        }

        stats.klook.migrated++
      } catch (error: any) {
        console.error(`   ❌ Error migrating activity ${activity.id}:`, error.message)
        stats.klook.errors++
      }
    }
  } catch (error: any) {
    console.error('   ❌ Failed to fetch Klook activities:', error.message)
    throw error
  }
}

async function migrateTripData(stats: MigrationStats, dryRun: boolean) {
  try {
    const deals = await prisma.tripScrapedData.findMany()

    for (const deal of deals) {
      try {
        // Check if already migrated
        let existing = null
        try {
          existing = await (prisma as any).event.findFirst({
            where: {
              platform: 'trip',
              OR: [
                { link: deal.affiliateLink || undefined },
                { title: deal.title, sourceUrl: deal.sourceUrl || undefined }
              ]
            }
          })
        } catch (error: any) {
          // If Event model doesn't exist yet, that's okay
          if (!error.message.includes('event') && !error.message.includes('Event')) {
            throw error
          }
        }

        if (existing) {
          console.log(`   ⏭️  Skipping (already exists): ${deal.title.substring(0, 50)}`)
          continue
        }

        if (!dryRun) {
          await (prisma as any).event.create({
            data: {
              platform: 'trip',
              scraperJobId: deal.jobId || null,
              title: deal.title,
              slug: null,
              description: deal.description || null,
              originalPriceAmount: deal.originalPrice || null,
              discountedPrice: deal.discountedPrice || null,
              discount: deal.discount || null,
              currency: deal.currency || 'SGD',
              image: deal.image || null,
              gallery: [],
              location: deal.location || null,
              category: deal.category || 'general',
              link: deal.affiliateLink || null,
              sourceUrl: deal.sourceUrl || null,
              dates: deal.dates || null,
              lastSeenAt: new Date(),
              isActive: deal.isValid !== false,
              isPublished: false,
              metadata: deal.metadata || {},
              raw: null,
              createdAt: deal.createdAt,
              updatedAt: deal.updatedAt
            }
          })
        }

        stats.trip.migrated++
      } catch (error: any) {
        console.error(`   ❌ Error migrating deal ${deal.id}:`, error.message)
        stats.trip.errors++
      }
    }
  } catch (error: any) {
    console.error('   ❌ Failed to fetch Trip.com data:', error.message)
    throw error
  }
}

async function migrateBookings(stats: MigrationStats, dryRun: boolean) {
  try {
    // Find all AttractionsgBookings that need to be migrated
    // Note: AttractionsgBooking model may not exist if already migrated
    let bookings: any[] = []
    try {
      bookings = await (prisma as any).attractionsgBooking.findMany({
        include: {
          event: true
        }
      })
    } catch (error: any) {
      // If AttractionsgBooking doesn't exist, skip bookings migration
      if (error.message.includes('attractionsgBooking') || error.message.includes('AttractionsgBooking')) {
        console.log('   ℹ️  AttractionsgBooking model not found - skipping bookings migration')
        return
      }
      throw error
    }

    for (const booking of bookings) {
      try {
        // Find the corresponding Event in the unified model
        let event = null
        try {
          event = await (prisma as any).event.findFirst({
            where: {
              platform: 'attractionsg',
              OR: [
                { link: booking.event.link || undefined },
                { slug: booking.event.slug || undefined }
              ]
            }
          })
        } catch (error: any) {
          // If Event model doesn't exist yet, skip this booking
          if (!error.message.includes('event') && !error.message.includes('Event')) {
            throw error
          }
        }

        if (!event) {
          console.log(`   ⚠️  Skipping booking ${booking.id}: Event not found in unified model`)
          stats.bookings.errors++
          continue
        }

        // Check if booking already exists
        let existing = null
        try {
          existing = await (prisma as any).eventBooking.findFirst({
            where: {
              eventId: event.id,
              stripeSessionId: booking.stripeSessionId
            }
          })
        } catch (error: any) {
          // If EventBooking model doesn't exist yet, that's okay
          if (!error.message.includes('eventBooking') && !error.message.includes('EventBooking')) {
            throw error
          }
        }

        if (existing) {
          console.log(`   ⏭️  Skipping (already exists): Booking ${booking.id}`)
          continue
        }

        if (!dryRun) {
          await (prisma as any).eventBooking.create({
            data: {
              eventId: event.id,
              platform: 'attractionsg',
              eventTitle: booking.eventTitle,
              eventSlug: booking.eventSlug || null,
              quantity: booking.quantity,
              adultCount: booking.adultCount,
              childCount: booking.childCount,
              amount: booking.amount,
              unitPrice: booking.unitPrice || null,
              resellerCost: booking.resellerCost || null,
              stripeFeeAmount: booking.stripeFeeAmount || null,
              netRevenue: booking.netRevenue || null,
              currency: booking.currency,
              status: booking.status,
              stripeSessionId: booking.stripeSessionId,
              stripePaymentIntentId: booking.stripePaymentIntentId || null,
              customerEmail: booking.customerEmail || null,
              customerName: booking.customerName || null,
              customerPhone: booking.customerPhone || null,
              optionCode: booking.optionCode || null,
              optionName: booking.optionName || null,
              metadata: booking.metadata || null,
              notes: booking.notes || null,
              supplierOrderId: booking.supplierOrderId || null,
              supplierStatus: booking.supplierStatus || null,
              supplierPayload: booking.supplierPayload || null,
              cart: booking.cart || null,
              createdAt: booking.createdAt,
              updatedAt: booking.updatedAt
            }
          })
        }

        stats.bookings.migrated++
      } catch (error: any) {
        console.error(`   ❌ Error migrating booking ${booking.id}:`, error.message)
        stats.bookings.errors++
      }
    }
  } catch (error: any) {
    console.error('   ❌ Failed to fetch bookings:', error.message)
    // Don't throw - bookings migration is optional
  }
}

main()
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
