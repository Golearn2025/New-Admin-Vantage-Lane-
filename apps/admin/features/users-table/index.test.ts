import { describe, it, expect } from 'vitest';
import * as mod from '.';

describe('users-table', () => {
  it('exports UsersTable', () => {
    expect(mod.UsersTable).toBeTruthy();
  });
});
