/**
 * Dispute Entity - Zod Schemas
 * Maps to disputes table in Supabase
 */

import { z } from 'zod';

export const DisputeStatusSchema = z.enum([
  'warning_needs_response',
  'warning_under_review',
  'warning_closed',
  'needs_response',
  'under_review',
  'charge_refunded',
  'won',
  'lost',
]);

export const DisputeReasonSchema = z.enum([
  'fraudulent',
  'duplicate',
  'subscription_canceled',
  'product_unacceptable',
  'product_not_received',
  'unrecognized',
  'credit_not_processed',
  'general',
]);

export const DisputeEvidenceSchema = z.object({
  customerName: z.string().optional(),
  customerEmail: z.string().email().optional(),
  customerPurchaseIp: z.string().optional(),
  billingAddress: z.string().optional(),
  receipt: z.string().optional(),
  customerSignature: z.string().optional(),
  uncategorizedText: z.string().optional(),
});

export const DisputeSchema = z.object({
  id: z.string().uuid(),
  bookingId: z.string().uuid(),
  paymentTransactionId: z.string().uuid(),
  stripeDisputeId: z.string(),
  amount: z.number().positive(),
  currency: z.string().length(3),
  reason: DisputeReasonSchema,
  status: DisputeStatusSchema,
  evidence: DisputeEvidenceSchema.nullable(),
  evidenceDueBy: z.string().datetime().nullable(),
  isChargeRefundable: z.boolean(),
  metadata: z.record(z.string(), z.unknown()),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const DisputeListItemSchema = z.object({
  id: z.string().uuid(),
  bookingReference: z.string(),
  customerName: z.string(),
  amount: z.number().positive(),
  currency: z.string().length(3),
  reason: DisputeReasonSchema,
  status: DisputeStatusSchema,
  evidenceDueBy: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
});

export const SubmitEvidenceRequestSchema = z.object({
  disputeId: z.string().uuid(),
  evidence: DisputeEvidenceSchema,
});

export const DisputeListRequestSchema = z.object({
  status: DisputeStatusSchema.optional(),
  reason: DisputeReasonSchema.optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});
