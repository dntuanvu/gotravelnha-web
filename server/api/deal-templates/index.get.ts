import { defineEventHandler } from 'h3'
import prisma from '~/server/utils/prisma'
import { listBuiltinDealTemplates } from '~/server/utils/builtinDealTemplates'

export default defineEventHandler(async () => {
  let templates: Awaited<ReturnType<typeof prisma.dealTemplate.findMany>> = []
  try {
    templates = await prisma.dealTemplate.findMany({
      where: { isActive: true },
      orderBy: [{ updatedAt: 'desc' }]
    })
  } catch (error: unknown) {
    console.error(
      'Deal templates DB unavailable — returning built-in hubs only:',
      error instanceof Error ? error.message : error
    )
  }

  try {
    const config = useRuntimeConfig()
    const builtins = listBuiltinDealTemplates(config.public as Record<string, unknown>)
    const slugSet = new Set(templates.map((t) => t.slug))
    const merged = [...builtins.filter((b) => !slugSet.has(b.slug)), ...templates]

    return {
      success: true,
      data: merged
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch deal templates'
    console.error('Failed to merge deal templates:', error)
    return {
      success: false,
      error: message,
      data: []
    }
  }
})

