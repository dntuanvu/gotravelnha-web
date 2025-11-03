import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const platform = query.platform as string || 'klook'
    
    // Fetch all active promo codes
    const promoCodes = await prisma.klookPromoCode.findMany({
      where: {
        isActive: true,
        // Optional: filter by valid date
        // validUntil: {
        //   gte: new Date()
        // }
      },
      orderBy: {
        validUntil: 'desc'
      }
    })

    return {
      success: true,
      data: promoCodes,
      total: promoCodes.length,
      platform
    }
  } catch (error: any) {
    console.error('Failed to fetch Klook promo codes:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch promo codes: ${error.message}`
    })
  }
})

