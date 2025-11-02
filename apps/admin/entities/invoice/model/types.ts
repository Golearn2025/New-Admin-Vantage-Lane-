/**
 * Invoice Entity - Type Definitions
 * Maps to invoices table in Supabase
 */

export type InvoiceStatus = 
  | 'draft'
  | 'sent'
  | 'paid'
  | 'void'
  | 'overdue';

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  bookingId: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  status: InvoiceStatus;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  dueDate: string;
  paidAt: string | null;
  sentAt: string | null;
  voidedAt: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceListItem {
  id: string;
  invoiceNumber: string;
  bookingReference: string;
  customerName: string;
  total: number;
  currency: string;
  status: InvoiceStatus;
  dueDate: string;
  createdAt: string;
}

export interface CreateInvoiceRequest {
  bookingId: string;
  dueDate: string;
  sendEmail?: boolean;
}

export interface InvoiceListRequest {
  status?: InvoiceStatus;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}
