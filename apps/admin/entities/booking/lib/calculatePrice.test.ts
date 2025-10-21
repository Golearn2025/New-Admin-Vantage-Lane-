/**
 * Price Calculation - Tests
 */

import { describe, it, expect } from 'vitest';
import { calculateTotalPrice, calculateServiceTotal, buildPriceBreakdown, formatPrice } from './calculatePrice';

describe('Price Calculation', () => {
  describe('calculateServiceTotal', () => {
    it('calculates service total correctly', () => {
      expect(calculateServiceTotal(750, 1)).toBe(750);
      expect(calculateServiceTotal(350, 2)).toBe(700);
      expect(calculateServiceTotal(0, 5)).toBe(0);
    });
  });

  describe('calculateTotalPrice', () => {
    it('calculates total with base price only', () => {
      const total = calculateTotalPrice(85, []);
      expect(total).toBe(85);
    });

    it('calculates total with paid services', () => {
      const services = [
        { code: 'security_escort', quantity: 1, unitPrice: 750, total: 750 },
        { code: 'fresh_flowers', quantity: 1, unitPrice: 120, total: 120 },
      ];
      const total = calculateTotalPrice(85, services);
      expect(total).toBe(955); // 85 + 750 + 120
    });

    it('ignores free services (unitPrice = 0)', () => {
      const services = [
        { code: 'wifi', quantity: 1, unitPrice: 0, total: 0 },
        { code: 'champagne', quantity: 1, unitPrice: 350, total: 350 },
      ];
      const total = calculateTotalPrice(100, services);
      expect(total).toBe(450); // 100 + 350 (wifi ignored)
    });
  });

  describe('buildPriceBreakdown', () => {
    it('builds complete price breakdown', () => {
      const breakdown = buildPriceBreakdown(
        85,
        [
          { code: 'security_escort', quantity: 1, unitPrice: 750 },
          { code: 'fresh_flowers', quantity: 1, unitPrice: 120 },
        ],
        'GBP'
      );

      expect(breakdown.basePrice).toBe(85);
      expect(breakdown.services).toHaveLength(2);
      expect(breakdown.services[0]?.total).toBe(750);
      expect(breakdown.services[1]?.total).toBe(120);
      expect(breakdown.total).toBe(955);
      expect(breakdown.currency).toBe('GBP');
    });
  });

  describe('formatPrice', () => {
    it('formats GBP correctly', () => {
      expect(formatPrice(955, 'GBP')).toBe('£955.00');
    });

    it('formats USD correctly', () => {
      expect(formatPrice(100.5, 'USD')).toBe('$100.50');
    });

    it('formats EUR correctly', () => {
      expect(formatPrice(75.99, 'EUR')).toBe('€75.99');
    });

    it('uses currency code for unknown currencies', () => {
      expect(formatPrice(100, 'JPY')).toBe('JPY100.00');
    });
  });
});
