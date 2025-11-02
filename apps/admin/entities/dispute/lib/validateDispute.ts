/**
 * Dispute Entity - Validation
 */

import { DisputeSchema } from '../model/schema';
import type { Dispute } from '../model/types';

export function validateDispute(data: unknown): Dispute {
  return DisputeSchema.parse(data);
}

export function isDispute(data: unknown): data is Dispute {
  return DisputeSchema.safeParse(data).success;
}
