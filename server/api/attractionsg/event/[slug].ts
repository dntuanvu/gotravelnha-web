import { defineEventHandler, createError } from 'h3'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug

  if (!slug || typeof slug !== 'string') {
    throw createError({ statusCode: 400, message: 'Invalid attraction identifier' })
  }

  try {
    const record = await prisma.attractionsgEvent.findFirst({
      where: {
        isPublished: true,
        OR: [
          { slug: { equals: slug, mode: 'insensitive' } },
          { id: slug }
        ]
      }
    })

    if (!record) {
      return {
        success: false,
        event: null
      }
    }

    return {
      success: true,
      event: {
        ...record,
        priceAmount: record.priceAmount ?? undefined,
        originalPriceAmount: record.originalPriceAmount ?? undefined,
        resellerPriceAmount: record.resellerPriceAmount ?? undefined
      }
    }
  } catch (error) {
    console.error('Failed to load attractionsg event:', error)
    throw createError({ statusCode: 500, message: 'Failed to load attraction' })
  }
})
