/**
 * Customer Entity - Validation
 */

import { CustomerSchema } from '../model/schema';
import type { Customer } from '../model/schema';

export function validateCustomer(data: unknown): Customer {
  return CustomerSchema.parse(data);
}

export function isCustomer(data: unknown): data is Customer {
  return CustomerSchema.safeParse(data).success;
}
