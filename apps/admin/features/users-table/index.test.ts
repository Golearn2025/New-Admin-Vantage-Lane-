import { describe, it, expect } from 'vitest';
import * as mod from '.';

describe('users-table', () => {
  it('exports AllUsersTable component', () => {
    expect(mod.AllUsersTable).toBeTruthy();
  });
});
