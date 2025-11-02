/**
 * Refund Entity - Zod Schemas
 * Maps to refunds table in Supabase
 */

import { z } from 'zod';

export const RefundReasonSchema = z.enum([
  'client_cancellation',
  'driver_no_show',
  'service_issue',
  'duplicate',
  'fraudulent',
  'other',
]);

export const RefundStatusSchema = z.enum([
  'pending',
  'succeeded',
  'failed',
  'cancelled',
]);

export const RefundSchema = z.object({
  id: z.string().uuid(),
  bookingId: z.string().uuid(),
  paymentTransactionId: z.string().uuid(),
  stripeRefundId: z.string().nullable(),
  amount: z.number().positive(),
  currency: z.string().length(3),
  reason: RefundReasonSchema,
  status: RefundStatusSchema,
  failureReason: z.string().nullable(),
  metadata: z.record(z.string(), z.unknown()),
  processedAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const RefundListItemSchema = z.object({
  id: z.string().uuid(),
  bookingReference: z.string(),
  customerName: z.string(),
  amount: z.number().positive(),
  currency: z.string().length(3),
  reason: RefundReasonSchema,
  status: RefundStatusSchema,
  createdAt: z.string().datetime(),
});

export const CreateRefundRequestSchema = z.object({
  bookingId: z.string().uuid(),
  amount: z.number().positive().optional(),
  reason: RefundReasonSchema,
  note: z.string().optional(),
});

export const RefundListRequestSchema = z.object({
  status: RefundStatusSchema.optional(),
  reason: RefundReasonSchema.optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});
