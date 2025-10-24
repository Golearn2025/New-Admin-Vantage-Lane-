/**
 * Operator Entity - Validation
 */

import { OperatorSchema } from '../model/schema';
import type { Operator } from '../model/schema';

export function validateOperator(data: unknown): Operator {
  return OperatorSchema.parse(data);
}

export function isOperator(data: unknown): data is Operator {
  return OperatorSchema.safeParse(data).success;
}
