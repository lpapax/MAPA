export const MARKET_ALLOWED_FIELDS = [
  'name', 'city', 'region', 'lat', 'lng', 'schedule', 'time',
  'vendors', 'tags', 'is_daily', 'dow', 'active',
] as const

export type MarketField = typeof MARKET_ALLOWED_FIELDS[number]

export function pickMarketFields(body: Record<string, unknown>): Partial<Record<MarketField, unknown>> {
  return Object.fromEntries(
    MARKET_ALLOWED_FIELDS.filter(k => k in body).map(k => [k, body[k]])
  ) as Partial<Record<MarketField, unknown>>
}
