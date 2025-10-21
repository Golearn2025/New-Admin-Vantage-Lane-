/**
 * Booking Entity - Price Calculation
 * Business logic for calculating booking prices
 * 
 * Formula: FINAL TOTAL = base_price + SUM(paid_services where unit_price > 0)
 */

import type { PriceBreakdown, ServiceItem } from '../model/types';

/**
 * Calculate total price from base price and services
 */
export function calculateTotalPrice(
  basePrice: number,
  services: ServiceItem[]
): number {
  const servicesTotal = services
    .filter(s => s.unitPrice > 0)
    .reduce((sum, service) => sum + service.total, 0);
  
  return basePrice + servicesTotal;
}

/**
 * Calculate service item total
 */
export function calculateServiceTotal(
  unitPrice: number,
  quantity: number
): number {
  return unitPrice * quantity;
}

/**
 * Build complete price breakdown
 */
export function buildPriceBreakdown(
  basePrice: number,
  services: Array<Omit<ServiceItem, 'total'>>,
  currency: string = 'GBP'
): PriceBreakdown {
  const servicesWithTotal: ServiceItem[] = services.map(s => ({
    ...s,
    total: calculateServiceTotal(s.unitPrice, s.quantity),
  }));
  
  const total = calculateTotalPrice(basePrice, servicesWithTotal);
  
  return {
    basePrice,
    services: servicesWithTotal,
    total,
    currency,
  };
}

/**
 * Format price for display
 */
export function formatPrice(amount: number, currency: string = 'GBP'): string {
  const symbols: Record<string, string> = {
    GBP: '£',
    USD: '$',
    EUR: '€',
  };
  
  const symbol = symbols[currency] || currency;
  return `${symbol}${amount.toFixed(2)}`;
}
