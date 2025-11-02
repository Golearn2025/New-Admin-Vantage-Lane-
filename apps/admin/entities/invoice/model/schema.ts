/**
 * Invoice Entity - Zod Schemas
 * Maps to invoices table in Supabase
 */

import { z } from 'zod';

export const InvoiceStatusSchema = z.enum([
  'draft',
  'sent',
  'paid',
  'void',
  'overdue',
]);

export const InvoiceLineItemSchema = z.object({
  description: z.string(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
  amount: z.number().positive(),
});

export const InvoiceSchema = z.object({
  id: z.string().uuid(),
  bookingId: z.string().uuid(),
  invoiceNumber: z.string(),
  customerName: z.string(),
  customerEmail: z.string().email(),
  status: InvoiceStatusSchema,
  lineItems: z.array(InvoiceLineItemSchema),
  subtotal: z.number().nonnegative(),
  tax: z.number().nonnegative(),
  total: z.number().positive(),
  currency: z.string().length(3),
  dueDate: z.string().datetime(),
  paidAt: z.string().datetime().nullable(),
  sentAt: z.string().datetime().nullable(),
  voidedAt: z.string().datetime().nullable(),
  metadata: z.record(z.string(), z.unknown()),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const InvoiceListItemSchema = z.object({
  id: z.string().uuid(),
  invoiceNumber: z.string(),
  bookingReference: z.string(),
  customerName: z.string(),
  total: z.number().positive(),
  currency: z.string().length(3),
  status: InvoiceStatusSchema,
  dueDate: z.string().datetime(),
  createdAt: z.string().datetime(),
});

export const CreateInvoiceRequestSchema = z.object({
  bookingId: z.string().uuid(),
  dueDate: z.string().datetime(),
  sendEmail: z.boolean().optional(),
});

export const InvoiceListRequestSchema = z.object({
  status: InvoiceStatusSchema.optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});
