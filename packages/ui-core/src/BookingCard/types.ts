/**
 * BookingCard Types
 * Enterprise-grade TypeScript definitions
 */

export type TripType = 'oneway' | 'return' | 'hourly' | 'fleet';

export type BookingStatus = 'draft' | 'confirmed' | 'active' | 'completed' | 'cancelled';

export type PaymentStatus = 'pending' | 'authorized' | 'captured' | 'refunded';

export type VehicleCategory = 'EXEC' | 'LUX' | 'SUV' | 'VAN';

export interface BookingCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface BookingRoute {
  pickupLabel: string;
  dropoffLabel: string;
  distanceMiles: number;
  durationMin: number;
}

export interface BookingCardData {
  id: string;
  reference: string;
  tripType: TripType;
  customer: BookingCustomer;
  route: BookingRoute;
  vehicleCategory: VehicleCategory;
  vehicleModel: string;
  passengerCount: number;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  currency: string;
  startAt: string;
}

export interface BookingCardProps {
  booking: BookingCardData;
  onClick?: (bookingId: string) => void;
  onEdit?: (bookingId: string) => void;
  onAssignDriver?: (bookingId: string) => void;
  className?: string;
}
