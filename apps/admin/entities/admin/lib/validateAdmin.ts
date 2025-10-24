/**
 * Admin Entity - Validation
 */

import { AdminSchema } from '../model/schema';
import type { Admin } from '../model/schema';

export function validateAdmin(data: unknown): Admin {
  return AdminSchema.parse(data);
}

export function isAdmin(data: unknown): data is Admin {
  return AdminSchema.safeParse(data).success;
}
