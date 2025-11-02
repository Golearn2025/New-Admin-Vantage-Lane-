/**
 * Dispute Entity - Type Definitions
 * Maps to disputes table in Supabase
 */

export type DisputeStatus = 
  | 'warning_needs_response'
  | 'warning_under_review'
  | 'warning_closed'
  | 'needs_response'
  | 'under_review'
  | 'charge_refunded'
  | 'won'
  | 'lost';

export type DisputeReason = 
  | 'fraudulent'
  | 'duplicate'
  | 'subscription_canceled'
  | 'product_unacceptable'
  | 'product_not_received'
  | 'unrecognized'
  | 'credit_not_processed'
  | 'general';

export interface DisputeEvidence {
  customerName?: string | undefined;
  customerEmail?: string | undefined;
  customerPurchaseIp?: string | undefined;
  billingAddress?: string | undefined;
  receipt?: string | undefined;
  customerSignature?: string | undefined;
  uncategorizedText?: string | undefined;
}

export interface Dispute {
  id: string;
  bookingId: string;
  paymentTransactionId: string;
  stripeDisputeId: string;
  amount: number;
  currency: string;
  reason: DisputeReason;
  status: DisputeStatus;
  evidence: DisputeEvidence | null;
  evidenceDueBy: string | null;
  isChargeRefundable: boolean;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface DisputeListItem {
  id: string;
  bookingReference: string;
  customerName: string;
  amount: number;
  currency: string;
  reason: DisputeReason;
  status: DisputeStatus;
  evidenceDueBy: string | null;
  createdAt: string;
}

export interface SubmitEvidenceRequest {
  disputeId: string;
  evidence: DisputeEvidence;
}

export interface DisputeListRequest {
  status?: DisputeStatus;
  reason?: DisputeReason;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}
