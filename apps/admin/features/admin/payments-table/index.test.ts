import { describe, it, expect } from 'vitest';
import * as mod from '.';

describe('payments-table', () => {
  it('exports PaymentsTable', () => {
    expect(mod.PaymentsTable).toBeTruthy();
  });
});
