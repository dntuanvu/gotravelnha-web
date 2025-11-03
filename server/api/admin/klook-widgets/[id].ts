import { defineEventHandler, readBody } from 'h3'
import prisma from '~/server/utils/prisma'

/**
 * PUT/DELETE /api/admin/klook-widgets/[id]
 * Update or delete a Klook widget
 */
export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  if (!id) {
    throw new Error('Widget ID is required')
  }

  // PUT: Update widget
  if (event.node.req.method === 'PUT') {
    try {
      const body = await readBody(event)

      const widget = await prisma.klookWidget.update({
        where: { id },
        data: {
          adId: body.adId,
          name: body.name,
          description: body.description,
          icon: body.icon,
          category: body.category || null,
          widgetType: body.widgetType || 'things_to_do',
          isActive: body.isActive,
          displayOrder: body.displayOrder || 0
        }
      })

      return {
        success: true,
        data: widget,
        message: 'Widget updated successfully'
      }
    } catch (error: any) {
      console.error('Error updating widget:', error)
      return {
        success: false,
        error: error.message || 'Failed to update widget'
      }
    }
  }

  // DELETE: Delete widget
  if (event.node.req.method === 'DELETE') {
    try {
      await prisma.klookWidget.delete({
        where: { id }
      })

      return {
        success: true,
        message: 'Widget deleted successfully'
      }
    } catch (error: any) {
      console.error('Error deleting widget:', error)
      return {
        success: false,
        error: error.message || 'Failed to delete widget'
      }
    }
  }
})

