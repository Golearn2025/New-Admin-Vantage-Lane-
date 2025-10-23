/**
 * Payment Entity - Validation
 */

import { PaymentSchema } from '../model/schema';
import type { Payment } from '../model/schema';

export function validatePayment(input: unknown): Payment {
  return PaymentSchema.parse(input);
}
