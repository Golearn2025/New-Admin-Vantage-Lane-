/**
 * Payouts Table Feature - Types
 */

export interface Payout {
  id: string;
  driverId: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
}
