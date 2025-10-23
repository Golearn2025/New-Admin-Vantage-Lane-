/**
 * Payment Entity - Zod Schemas
 */

import { z } from 'zod';

export const PaymentStatusSchema = z.enum(['pending', 'authorized', 'captured', 'failed', 'refunded']);

export const PaymentSchema = z.object({
  id: z.string().uuid(),
  bookingId: z.string().uuid(),
  amount: z.number().nonnegative(),
  currency: z.literal('GBP'),
  status: PaymentStatusSchema,
  paymentMethod: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;
export type Payment = z.infer<typeof PaymentSchema>;
