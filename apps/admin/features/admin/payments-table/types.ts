/**
 * Payments Table Feature - Types
 */

export type { Payment } from '@entities/payment';

// Table-specific row type for column definitions
export interface PaymentTableRow {
  id: string;
  bookingId: string;
  amount: number;
  currency: 'GBP';
  status: 'pending' | 'failed' | 'authorized' | 'captured' | 'refunded';
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}
