import 'dotenv/config'
import { fileURLToPath, pathToFileURL } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const rootDir = resolve(__dirname, '..')

const prismaPath = pathToFileURL(resolve(rootDir, 'server/utils/prisma.ts')).href
const crawlPath = pathToFileURL(resolve(rootDir, 'server/api/attractionsg/crawl.ts')).href

const { default: prisma } = await import(prismaPath)
const { runAttractionsgCrawl } = await import(crawlPath)

const fullCrawl = process.env.CRAWL_FULL === 'true'
const maxPagesEnv = Number(process.env.CRAWL_MAX_PAGES || '')
const maxPages = Number.isFinite(maxPagesEnv) && maxPagesEnv > 0 ? maxPagesEnv : fullCrawl ? 10 : 5

const detailLimitEnv = Number(process.env.CRAWL_DETAIL_LIMIT || '')
const detailLimit = Number.isFinite(detailLimitEnv) && detailLimitEnv > 0 ? detailLimitEnv : undefined

async function main() {
  console.log('🕷️ Running AttractionsSG crawl from CLI...')
  console.log(
    JSON.stringify(
      {
        fullCrawl,
        maxPages,
        detailLimit
      },
      null,
      2
    )
  )

  try {
    const result = await runAttractionsgCrawl(
      {
        fullCrawl,
        maxPages,
        detailLimit
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

