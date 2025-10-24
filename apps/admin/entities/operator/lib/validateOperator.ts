/**
 * Operator Entity - Validation
 */

import { OperatorSchema } from './schema';
import type { Operator } from './schema';

export function validateOperator(data: unknown): Operator {
  return OperatorSchema.parse(data);
}

export function isOperator(data: unknown): data is Operator {
  return OperatorSchema.safeParse(data).success;
}
