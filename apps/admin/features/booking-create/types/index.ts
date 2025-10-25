/**
 * Booking Create Types
 * TypeScript interfaces for booking creation form
 */

export type TripType = 'oneway' | 'return' | 'hourly' | 'fleet';
export type VehicleCategory = 'EXEC' | 'LUX' | 'SUV' | 'VAN';

export interface BookingService {
  code: string;
  label: string;
  price: number;
  selected: boolean;
  isFree: boolean;
}

export interface BookingFormData {
  // Trip Type
  tripType: TripType;
  
  // Customer & Operator
  customerId: string;
  customerName?: string;
  customerEmail?: string;
  operatorId?: string;
  organizationId?: string;
  
  // Locations
  pickupText: string;
  pickupLabel?: string;
  dropoffText: string;
  dropoffLabel?: string;
  
  // Date & Time
  date: string;
  time: string;
  
  // Vehicle
  category: VehicleCategory;
  
  // Passengers
  passengers: number;
  bags: number;
  childSeats: number;
  
  // Return trip (if return)
  returnDate?: string;
  returnTime?: string;
  returnFlightNumber?: string;
  
  // Hourly (if hourly)
  hours?: number;
  
  // Fleet (if fleet)
  fleetExecutive?: number;
  fleetSClass?: number;
  fleetVClass?: number;
  fleetSUV?: number;
  
  // Services
  services: BookingService[];
  
  // Additional
  flightNumber?: string;
  notes?: string;
}

export interface CreateBookingPayload {
  customer_id: string;
  organization_id?: string | undefined;
  operator_id: string;
  trip_type: TripType;
  category: VehicleCategory;
  start_at: string;
  passenger_count: number;
  bag_count: number;
  child_seats: number;
  flight_number?: string | undefined;
  notes?: string | undefined;
  status: string;
  payment_status: string;
  currency: string;
  payment_method: string;
  
  // Return fields
  return_date?: string | undefined;
  return_time?: string | undefined;
  return_flight_number?: string | undefined;
  
  // Hourly
  hours?: number | undefined;
  
  // Fleet
  fleet_executive?: number | undefined;
  fleet_s_class?: number | undefined;
  fleet_v_class?: number | undefined;
  fleet_suv?: number | undefined;
}

export interface BookingSegment {
  seq_no: number;
  role: 'pickup' | 'dropoff';
  place_text: string;
  place_label?: string;
}

export interface BookingPricing {
  price: number;
  currency: string;
  extras_total: number;
  payment_method: string;
  payment_status: string;
}

export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
}

export interface Operator {
  id: string;
  name: string;
  contact_email?: string;
}
