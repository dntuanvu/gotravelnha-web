import { defineEventHandler, readBody } from 'h3'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) {
    return { success: false, error: 'Template ID is required' }
  }

  if (event.node.req.method === 'PUT') {
    try {
      const body = await readBody(event)
      const updated = await prisma.dealTemplate.update({
        where: { id },
        data: {
          slug: body.slug,
          title: body.title,
          description: body.description,
          destination: body.destination,
          heroImage: body.heroImage,
          heroImageSource: body.heroImageSource || 'manual',
          heroImageFetchedAt: body.heroImageFetchedAt || null,
          badge: body.badge,
          category: body.category,
          lastUpdatedLabel: body.lastUpdatedLabel,
          primaryProvider: body.primaryProvider,
          primaryCtaLabel: body.primaryCtaLabel,
          primaryBaseUrl: body.primaryBaseUrl,
          placementKey: body.placementKey,
          summaryBullets: body.summaryBullets || [],
          tips: body.tips || [],
          comparison: body.comparison || [],
          isActive: body.isActive !== false
        }
      })

      return {
        success: true,
        data: updated
      }
    } catch (error: any) {
      console.error('Failed to update deal template:', error)
      return {
        success: false,
        error: error.message || 'Failed to update template'
      }
    }
  }

  if (event.node.req.method === 'DELETE') {
    try {
      await prisma.dealTemplate.delete({ where: { id } })
      return {
        success: true
      }
    } catch (error: any) {
      console.error('Failed to delete deal template:', error)
      return {
        success: false,
        error: error.message || 'Failed to delete template'
      }
    }
  }

  return {
    success: false,
    error: 'Method not allowed'
  }
})

