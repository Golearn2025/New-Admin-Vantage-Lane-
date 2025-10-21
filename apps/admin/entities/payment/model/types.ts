/**
 * Payment Entity - Types
 * Domain types for payment entity
 */

export type PaymentStatus = 'pending' | 'authorized' | 'captured' | 'failed' | 'refunded';

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: 'GBP';
  status: PaymentStatus;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}
