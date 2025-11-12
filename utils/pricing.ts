export interface PricingInput {
  resellerPrice: number
  margin?: number
  stripePercent?: number
  stripeFixed?: number
}

export interface PricingBreakdown {
  endUserPrice: number
  stripeFee: number
  netRevenue: number
}

const DEFAULT_STRIPE_PERCENT = 0.034
const DEFAULT_STRIPE_FIXED = 0.5

export function computeEndUserPrice({
  resellerPrice,
  margin = 0,
  stripePercent = DEFAULT_STRIPE_PERCENT,
  stripeFixed = DEFAULT_STRIPE_FIXED
}: PricingInput): PricingBreakdown {
  const desiredGross = resellerPrice + margin + stripeFixed
  const endUserPrice = Math.ceil((desiredGross / (1 - stripePercent)) * 100) / 100
  const stripeFee = endUserPrice * stripePercent + stripeFixed
  const netRevenue = endUserPrice - stripeFee
  return {
    endUserPrice,
    stripeFee: Math.round(stripeFee * 100) / 100,
    netRevenue: Math.round(netRevenue * 100) / 100
  }
}

export function estimateStripeFee(amount: number, stripePercent = DEFAULT_STRIPE_PERCENT, stripeFixed = DEFAULT_STRIPE_FIXED): number {
  const fee = amount * stripePercent + stripeFixed
  return Math.round(fee * 100) / 100
}
