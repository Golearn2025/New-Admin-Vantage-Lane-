/**
 * Refund Entity - Validation
 */

import { RefundSchema } from '../model/schema';
import type { Refund } from '../model/types';

export function validateRefund(data: unknown): Refund {
  return RefundSchema.parse(data);
}

export function isRefund(data: unknown): data is Refund {
  return RefundSchema.safeParse(data).success;
}
