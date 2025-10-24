/**
 * Customer Entity - Validation
 */

import { CustomerSchema } from './schema';
import type { Customer } from './schema';

export function validateCustomer(data: unknown): Customer {
  return CustomerSchema.parse(data);
}

export function isCustomer(data: unknown): data is Customer {
  return CustomerSchema.safeParse(data).success;
}
