import { $fetch } from 'ofetch'

export interface SupplierOrderInput {
  bookingId: string
  eventId: string
  eventTitle: string
  optionCode?: string | null
  optionName?: string | null
  quantity: number
  customerName?: string | null
  customerEmail?: string | null
  customerPhone?: string | null
  notes?: string | null
}

export interface SupplierOrderResult {
  success: boolean
  orderId?: string
  status: 'QUEUED' | 'CONFIRMED' | 'FAILED'
  message?: string
  rawResponse?: unknown
}

export async function placeSupplierOrder(
  payload: SupplierOrderInput,
  options: { webhookUrl?: string; webhookSecret?: string } = {}
): Promise<SupplierOrderResult> {
  const { webhookUrl, webhookSecret } = options

  if (!webhookUrl) {
    console.info('[supplier] No webhook configured, marking order as queued for manual processing.')
    return {
      success: false,
      status: 'QUEUED',
      message: 'Supplier webhook not configured. Please process manually.'
    }
  }

  try {
    const response = await $fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(webhookSecret ? { Authorization: `Bearer ${webhookSecret}` } : {})
      },
      body: payload
    })

    if (response && typeof response === 'object') {
      const orderId = (response as any).orderId ?? (response as any).id
      const status = (response as any).status ?? 'QUEUED'

      return {
        success: true,
        orderId,
        status,
        rawResponse: response
      }
    }

    return {
      success: true,
      status: 'QUEUED',
      rawResponse: response
    }
  } catch (error: any) {
    console.error('[supplier] Failed to place supplier order:', error)
    return {
      success: false,
      status: 'FAILED',
      message: error?.message || 'Supplier order failed',
      rawResponse: error
    }
  }
}
