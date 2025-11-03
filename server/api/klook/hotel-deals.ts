import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const platform = query.platform as string || 'klook'
    
    // Fetch all active hotel deals
    const hotelDeals = await prisma.klookHotelDeal.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return {
      success: true,
      data: hotelDeals,
      total: hotelDeals.length,
      platform
    }
  } catch (error: any) {
    console.error('Failed to fetch Klook hotel deals:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch hotel deals: ${error.message}`
    })
  }
})

