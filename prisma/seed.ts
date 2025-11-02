import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gotravelnha.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@gotravelnha.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isActive: true
    }
  })
  console.log('✅ Created admin user:', admin.email)

  // Create sample regular user
  const userPassword = await bcrypt.hash('user123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'user@gotravelnha.com' },
    update: {},
    create: {
      username: 'testuser',
      email: 'user@gotravelnha.com',
      password: userPassword,
      firstName: 'Test',
      lastName: 'User',
      role: 'USER',
      isActive: true
    }
  })
  console.log('✅ Created test user:', user.email)

  console.log('🎉 Seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

