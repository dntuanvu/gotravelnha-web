import 'dotenv/config'
import prisma from '../server/utils/prisma'
import { runAttractionsgCrawl } from '../server/api/attractionsg/crawl'

const fullCrawl = process.env.CRAWL_FULL === 'true'
const maxPagesEnv = Number(process.env.CRAWL_MAX_PAGES || '')
const maxPages = Number.isFinite(maxPagesEnv) && maxPagesEnv > 0 ? maxPagesEnv : fullCrawl ? 40 : 20

async function main() {
  console.log('🕷️ Running AttractionsSG crawl from CLI...')
  console.log(
    JSON.stringify(
      {
        fullCrawl,
        maxPages
      },
      null,
      2
    )
  )

  try {
    const result = await runAttractionsgCrawl(
      {
        fullCrawl,
        maxPages
      },
      undefined
    )

    console.log('✅ Crawl completed:', result)
  } catch (error) {
    console.error('❌ Crawl failed:', error)
    process.exitCode = 1
  } finally {
    await prisma.$disconnect()
  }
}

main()

