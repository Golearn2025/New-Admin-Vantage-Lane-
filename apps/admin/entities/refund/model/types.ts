/**
 * Refund Entity - Type Definitions
 * Maps to refunds table in Supabase
 */

export type RefundReason = 
  | 'client_cancellation'
  | 'driver_no_show'
  | 'service_issue'
  | 'duplicate'
  | 'fraudulent'
  | 'other';

export type RefundStatus = 
  | 'pending'
  | 'succeeded'
  | 'failed'
  | 'cancelled';

export interface Refund {
  id: string;
  bookingId: string;
  paymentTransactionId: string;
  stripeRefundId: string | null;
  amount: number;
  currency: string;
  reason: RefundReason;
  status: RefundStatus;
  failureReason: string | null;
  metadata: Record<string, unknown>;
  processedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RefundListItem {
  id: string;
  bookingReference: string;
  customerName: string;
  amount: number;
  currency: string;
  reason: RefundReason;
  status: RefundStatus;
  createdAt: string;
}

export interface CreateRefundRequest {
  bookingId: string;
  amount?: number; // Optional partial refund
  reason: RefundReason;
  note?: string;
}

export interface RefundListRequest {
  status?: RefundStatus;
  reason?: RefundReason;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}
