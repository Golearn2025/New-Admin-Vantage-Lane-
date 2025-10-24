/**
 * BookingTabs Component Tests
 * Simple export and function tests
 */

import { describe, it, expect } from 'vitest';
import { BookingTabs, createBookingTabs } from './BookingTabs';

describe('BookingTabs', () => {
  it('exports BookingTabs component', () => {
    expect(BookingTabs).toBeTruthy();
    expect(typeof BookingTabs).toBe('function');
  });

  it('exports createBookingTabs function', () => {
    expect(createBookingTabs).toBeTruthy();
    expect(typeof createBookingTabs).toBe('function');
  });
});

describe('createBookingTabs', () => {
  it('should create tabs array with 8 items', () => {
    const counts = {
      all: 100,
      oneway: 25,
      return: 15,
      hourly: 30,
      fleet: 10,
      by_request: 5,
      events: 8,
      corporate: 12,
    };

    const tabs = createBookingTabs(counts);
    
    expect(tabs).toBeTruthy();
    expect(Array.isArray(tabs)).toBe(true);
    expect(tabs.length).toBe(8);
  });

  it('should create tabs with correct structure', () => {
    const counts = {
      all: 100,
      oneway: 25,
      return: 15,
      hourly: 30,
      fleet: 10,
    };

    const tabs = createBookingTabs(counts);
    const firstTab = tabs[0];
    
    expect(firstTab).toBeDefined();
    expect(firstTab?.value).toBe('all');
    expect(firstTab?.label).toBe('All Bookings');
    expect(firstTab?.count).toBe(100);
  });
});
