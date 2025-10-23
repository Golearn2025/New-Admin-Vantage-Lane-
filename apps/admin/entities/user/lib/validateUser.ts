/**
 * User Entity - Validation
 */

import { UserSchema } from '../model/schema';
import type { User } from '../model/schema';

export function validateUser(input: unknown): User {
  return UserSchema.parse(input);
}
