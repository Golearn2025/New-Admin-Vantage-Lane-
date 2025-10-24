/**
 * Driver Entity - Validation
 */

import { DriverSchema } from '../model/schema';
import type { Driver } from '../model/schema';

export function validateDriver(data: unknown): Driver {
  return DriverSchema.parse(data);
}

export function isDriver(data: unknown): data is Driver {
  return DriverSchema.safeParse(data).success;
}
