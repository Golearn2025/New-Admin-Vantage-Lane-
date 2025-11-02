/**
 * Invoice Entity - Validation
 */

import { InvoiceSchema } from '../model/schema';
import type { Invoice } from '../model/types';

export function validateInvoice(data: unknown): Invoice {
  return InvoiceSchema.parse(data);
}

export function isInvoice(data: unknown): data is Invoice {
  return InvoiceSchema.safeParse(data).success;
}
