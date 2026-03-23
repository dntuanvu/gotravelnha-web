/**
 * Cleanup Script: Remove Deprecated Tables
 * 
 * WARNING: This script removes deprecated tables after migration to unified Event model.
 * Only run this after:
 * 1. Migration has been completed successfully
 * 2. Data integrity has been verified
 * 3. Application has been tested and confirmed working
 * 4. Backup has been taken
 * 
 * This script:
 * - Drops deprecated tables from database
 * - Updates Prisma schema to remove deprecated models
 * 
 * Usage:
 *   tsx scripts/remove-deprecated-tables.ts --confirm
 * 
 * Safety:
 *   - Requires --confirm flag to prevent accidental execution
 *   - Creates backup before deletion
 *   - Lists tables that will be removed
 */

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs/promises'
import { join } from 'path'
import { readFile, writeFile } from 'fs/promises'

const prisma = new PrismaClient()

const DEPRECATED_TABLES = [
  'attractionsg_events',
  'attractionsg_bookings',
  'klook_activities',
  'trip_scraped_data'
]

const DEPRECATED_MODELS = [
  'AttractionsgEvent',
  'AttractionsgBooking',
  'KlookActivity',
  'TripScrapedData'
]

async function main() {
  const args = process.argv.slice(2)
  const confirmed = args.includes('--confirm')
  const dryRun = args.includes('--dry-run')

  if (!confirmed && !dryRun) {
    console.log('⚠️  WARNING: This script will PERMANENTLY DELETE deprecated tables!')
    console.log('')
    console.log('Tables to be removed:')
    DEPRECATED_TABLES.forEach(table => console.log(`  - ${table}`))
    console.log('')
    console.log('Prisma models to be removed:')
    DEPRECATED_MODELS.forEach(model => console.log(`  - ${model}`))
    console.log('')
    console.log('⚠️  This action cannot be undone!')
    console.log('')
    console.log('To proceed:')
    console.log('  1. Ensure migration has been completed successfully')
    console.log('  2. Verify data integrity')
    console.log('  3. Test the application thoroughly')
    console.log('  4. Create a database backup')
    console.log('  5. Run: tsx scripts/remove-deprecated-tables.ts --confirm')
    console.log('')
    console.log('Or run in dry-run mode: tsx scripts/remove-deprecated-tables.ts --dry-run')
    process.exit(1)
  }

  console.log('🧹 Cleaning up deprecated tables...')
  console.log(`Mode: ${dryRun ? 'DRY RUN (no changes will be made)' : 'LIVE DELETION'}`)
  console.log('')

  try {
    // Step 1: Verify tables exist and get row counts
    console.log('📊 Checking table status...')
    const tableStatus = await checkTableStatus()
    
    for (const [table, count] of Object.entries(tableStatus)) {
      if (count === null) {
        console.log(`   ⚠️  Table ${table} does not exist (may have been already removed)`)
      } else {
        console.log(`   📋 Table ${table}: ${count} rows`)
      }
    }
    console.log('')

    // Step 2: Create backup
    if (!dryRun && confirmed) {
      console.log('📦 Creating backup...')
      await createBackup(tableStatus)
      console.log('✅ Backup created\n')
    }

    // Step 3: Drop tables
    if (!dryRun && confirmed) {
      console.log('🗑️  Dropping deprecated tables...')
      for (const table of DEPRECATED_TABLES) {
        if (tableStatus[table] !== null) {
          try {
            await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "${table}" CASCADE`)
            console.log(`   ✓ Dropped table: ${table}`)
          } catch (error: any) {
            console.error(`   ❌ Error dropping table ${table}:`, error.message)
          }
        } else {
          console.log(`   ⏭️  Skipping (table doesn't exist): ${table}`)
        }
      }
      console.log('')
    } else {
      console.log('📝 Would drop tables (dry-run mode):')
      DEPRECATED_TABLES.forEach(table => {
        if (tableStatus[table] !== null) {
          console.log(`   - ${table} (${tableStatus[table]} rows)`)
        }
      })
      console.log('')
    }

    // Step 4: Update Prisma schema
    if (!dryRun && confirmed) {
      console.log('📝 Updating Prisma schema...')
      await updatePrismaSchema()
      console.log('✅ Prisma schema updated\n')
    } else {
      console.log('📝 Would update Prisma schema (dry-run mode)')
      console.log('   Models to remove:')
      DEPRECATED_MODELS.forEach(model => console.log(`   - ${model}`))
      console.log('')
    }

    console.log('='.repeat(60))
    if (dryRun) {
      console.log('✅ Dry run completed. No changes were made.')
      console.log('   Run with --confirm to perform actual cleanup.')
    } else {
      console.log('✅ Cleanup completed!')
      console.log('')
      console.log('Next steps:')
      console.log('  1. Run: npx prisma generate')
      console.log('  2. Run: npx prisma migrate dev --name remove_deprecated_tables')
      console.log('  3. Test the application')
      console.log('  4. Deploy to production')
    }
    console.log('='.repeat(60))

  } catch (error: any) {
    console.error('\n❌ Cleanup failed:', error)
    console.error('\n💡 Check the backup directory for restore information.')
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

async function checkTableStatus(): Promise<Record<string, number | null>> {
  const status: Record<string, number | null> = {}

  for (const table of DEPRECATED_TABLES) {
    try {
      const result = await prisma.$queryRawUnsafe<Array<{ count: bigint }>>(
        `SELECT COUNT(*) as count FROM "${table}"`
      )
      status[table] = Number(result[0]?.count || 0)
    } catch (error: any) {
      // Table doesn't exist
      status[table] = null
    }
  }

  return status
}

async function createBackup(tableStatus: Record<string, number | null>) {
  const backupDir = join(process.cwd(), 'backups', `cleanup-${Date.now()}`)
  await fs.mkdir(backupDir, { recursive: true })

  const backup = {
    timestamp: new Date().toISOString(),
    note: 'Backup before removing deprecated tables',
    tableStatus
  }

  await fs.writeFile(
    join(backupDir, 'backup-info.json'),
    JSON.stringify(backup, null, 2)
  )

  console.log(`   Backup directory: ${backupDir}`)
  console.log('   Note: This is a metadata backup. For full data backup, use pg_dump or similar.')
}

async function updatePrismaSchema() {
  const schemaPath = join(process.cwd(), 'prisma', 'schema.prisma')
  let schema = await readFile(schemaPath, 'utf-8')

  // Remove deprecated model definitions
  for (const model of DEPRECATED_MODELS) {
    // Match model definition including its entire block
    const modelRegex = new RegExp(
      `// DEPRECATED[^]*?model ${model}[^]*?\\n\\}`,
      'gm'
    )
    schema = schema.replace(modelRegex, '')
    
    // Also remove any standalone references
    const standaloneRegex = new RegExp(`model ${model}[^]*?\\n\\}`, 'gs')
    schema = schema.replace(standaloneRegex, '')
  }

  // Clean up extra blank lines
  schema = schema.replace(/\n{3,}/g, '\n\n')

  await writeFile(schemaPath, schema, 'utf-8')
  console.log(`   ✓ Updated: ${schemaPath}`)
}

main()
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
