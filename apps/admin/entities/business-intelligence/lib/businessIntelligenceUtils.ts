/**
 * Business Intelligence Utils
 *
 * Centralized formatters and utilities for BI data.
 * File: < 200 lines (RULES.md compliant)
 */

import type { AIInsight } from '../api/businessIntelligenceTypes';

/**
 * Format hour to display format (24h)
 */
export function formatHour(hour: number): string {
  return `${hour.toString().padStart(2, '0')}:00`;
}

/**
 * Format percentage with symbol
 */
export function formatPercentage(value: number, total: number): string {
  if (total === 0) return '0%';
  const percentage = Math.round((value / total) * 100);
  return `${percentage}%`;
}

/**
 * Format currency (GBP)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-GB').format(num);
}

/**
 * Format rating display
 */
export function formatRating(rating: number | null): string {
  if (rating === null || rating === 0) return 'No ratings';
  return `${rating.toFixed(1)}⭐`;
}

/**
 * Get day name from day of week number
 */
export function getDayName(dayOfWeek: number): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayOfWeek] || 'Unknown';
}

/**
 * Get AI insight color based on impact
 */
export function getInsightColor(impact: AIInsight['impact']): string {
  const colorMap = {
    low: 'info',
    medium: 'warning', 
    high: 'danger',
    critical: 'burnred',
  };
  return colorMap[impact];
}

/**
 * Get AI insight icon based on type
 */
export function getInsightIcon(type: AIInsight['type']): string {
  const iconMap = {
    pattern: 'clock',
    recommendation: 'lightbulb',
    alert: 'alertTriangle',
    opportunity: 'trendingUp',
  };
  return iconMap[type];
}

/**
 * Format route display
 */
export function formatRoute(pickup: string, destination: string): string {
  // Simplify long addresses for display
  const simplifyAddress = (address: string): string => {
    if (address.includes('Heathrow')) return 'Heathrow';
    if (address.includes('Mayfair')) return 'Mayfair';
    if (address.includes('London')) return 'London';
    return address.length > 30 ? `${address.substring(0, 27)}...` : address;
  };
  
  return `${simplifyAddress(pickup)} → ${simplifyAddress(destination)}`;
}

/**
 * Calculate growth percentage
 */
export function calculateGrowth(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

/**
 * Get empty state message based on data type
 */
export function getEmptyStateMessage(dataType: string): string {
  const messages = {
    bookings: 'Creează primul booking pentru a vedea analytics în timp real!',
    routes: 'După câteva curse, rutele frecvente vor apărea aici.',
    drivers: 'Adaugă șoferi pentru a vedea performance-ul echipei.',
    revenue: 'Datele financiare vor apărea după primele curse complete.',
    peakHours: 'După 10+ bookinguri vei vedea pattern-urile de timp.',
  };
  
  return messages[dataType as keyof typeof messages] || 'Nu sunt date disponibile încă.';
}

/**
 * Generate industry benchmark data for empty states
 */
export function getIndustryBenchmarks(dataType: string): string[] {
  const benchmarks = {
    bookings: [
      'Industry average: 15 rides/day for small operators',
      'Peak seasons: +40% în December și Summer',
      'Weekend demand: Usually 2-3x higher than weekdays',
    ],
    routes: [
      'Airport transfers: 60-70% of luxury transport business', 
      'City-to-city: 20-25% of bookings',
      'Hotel pickups: 10-15% of rides',
    ],
    drivers: [
      'Top drivers: 4.8+ star rating average',
      'Response time: < 15 minutes industry standard',
      'Document compliance: 95%+ for premium operators',
    ],
    revenue: [
      'Executive class: 40-60% higher revenue per mile',
      'Airport premium: +25% vs city rides',
      'Night surcharge: +30% între 22:00-06:00',
    ],
    peakHours: [
      'Morning peak: 6:00-9:00 AM (airport departures)',
      'Evening peak: 5:00-8:00 PM (city pickups)',
      'Weekend: Friday 6 PM - Sunday 11 PM',
    ],
  };
  
  return benchmarks[dataType as keyof typeof benchmarks] || [];
}
