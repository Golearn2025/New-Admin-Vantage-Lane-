/**
 * BookingsWithTabs Component Tests
 * Simple export test
 */

import { describe, it, expect } from 'vitest';
import { BookingsWithTabs } from './BookingsWithTabs';

describe('BookingsWithTabs', () => {
  it('exports BookingsWithTabs component', () => {
    expect(BookingsWithTabs).toBeTruthy();
    expect(typeof BookingsWithTabs).toBe('function');
  });
});
