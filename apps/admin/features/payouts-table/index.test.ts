import { describe, it, expect } from 'vitest';
import * as mod from '.';

describe('payouts-table', () => {
  it('exports PayoutsTable', () => {
    expect(mod.PayoutsTable).toBeTruthy();
  });
});
