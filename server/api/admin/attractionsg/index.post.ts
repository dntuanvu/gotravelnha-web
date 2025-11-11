import { defineEventHandler, readBody, createError } from 'h3'
import prisma from '~/server/utils/prisma'

interface UpdateEventPayload {
  id: string
  publicPrice?: number | null
  isPublished?: boolean
  notes?: string | null
  publishedAt?: string | Date | null
  isSelfBookable?: boolean
  stripePriceId?: string | null
  checkoutNotes?: string | null
}

export default defineEventHandler(async (event) => {
  try {
    const body = (await readBody(event)) as UpdateEventPayload[]

    if (!Array.isArray(body) || body.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'Payload must be a non-empty array'
      })
    }

    const updates = body.map((item) => {
      if (!item.id) {
        throw createError({
          statusCode: 400,
          message: 'Each item must include an id'
        })
      }

      const data: any = {}

      if (item.publicPrice !== undefined) {
        if (item.publicPrice === null || isNaN(Number(item.publicPrice))) {
          data.publicPrice = null
        } else {
          data.publicPrice = Number(item.publicPrice)
        }
      }

      if (typeof item.isPublished === 'boolean') {
        data.isPublished = item.isPublished
        if (item.isPublished) {
          const publishedAtValue =
            item.publishedAt instanceof Date
              ? item.publishedAt
              : item.publishedAt
              ? new Date(item.publishedAt)
              : new Date()
          data.publishedAt = Number.isNaN(publishedAtValue.getTime()) ? new Date() : publishedAtValue
        } else {
          data.publishedAt = null
        }
      }

      if (item.notes !== undefined) {
        data.notes = item.notes?.trim() ? item.notes : null
      }

      if (typeof item.isSelfBookable === 'boolean') {
        data.isSelfBookable = item.isSelfBookable
      }

      if (item.stripePriceId !== undefined) {
        const trimmed = item.stripePriceId?.trim()
        data.stripePriceId = trimmed ? trimmed : null
      }

      if (item.checkoutNotes !== undefined) {
        const trimmed = item.checkoutNotes?.trim()
        data.checkoutNotes = trimmed && trimmed.length > 0 ? trimmed : null
      }

      return prisma.attractionsgEvent.update({
        where: { id: item.id },
        data
      })
    })

    const updatedEvents = await prisma.$transaction(updates)

    return {
      success: true,
      updated: updatedEvents.length,
      data: updatedEvents
    }
  } catch (error: any) {
    console.error('Admin attractions update error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to update attractions events'
    })
  }
})
