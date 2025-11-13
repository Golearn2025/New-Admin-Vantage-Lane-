/**
 * TripTypeSection Component Tests
 * Simple export test
 */

import { describe, it, expect } from 'vitest';
import { TripTypeSection } from './TripTypeSection';

describe('TripTypeSection', () => {
  it('exports TripTypeSection component', () => {
    expect(TripTypeSection).toBeTruthy();
    expect(typeof TripTypeSection).toBe('function');
  });
});
