import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'

let migrationsChecked = false

const checkMigrations = () => {
  if (migrationsChecked) return
  migrationsChecked = true

  try {
    console.log('🔧 Checking database migrations...')
    
    // Always generate Prisma Client first
    console.log('📦 Generating Prisma Client...')
    execSync('npx prisma generate', { stdio: 'inherit' })
    console.log('✅ Prisma Client generated')

    // In production, deploy migrations
    if (process.env.NODE_ENV === 'production') {
      console.log('🚀 Production mode: Deploying migrations...')
      execSync('npx prisma migrate deploy', { stdio: 'inherit' })
      console.log('✅ Migrations deployed')
    }
  } catch (error) {
    console.warn('⚠️ Migration check failed (non-critical):', error)
    // Don't throw - let the app start
  }
}

const prismaClientSingleton = () => {
  checkMigrations()
  return new PrismaClient()
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma

