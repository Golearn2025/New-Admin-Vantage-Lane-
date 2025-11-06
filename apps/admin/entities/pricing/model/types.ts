/**
 * Pricing Entity - Type Definitions
 * 
 * Domain types for pricing configuration
 */

export interface VehicleTypeRates {
  name: string;
  base_fare: number;
  per_mile_first_6: number;
  per_mile_after_6: number;
  per_minute: number;
  hourly_in_town: number;
  hourly_out_town: number;
  minimum_fare: number;
}

export interface TimeMultiplier {
  value: number;
  label: string;
  start_time?: string;
  end_time?: string;
  days?: number[];
  active: boolean;
}

export interface EventMultiplier {
  value: number;
  label: string;
  active: boolean;
}

export interface AirportFee {
  name: string;
  pickup_fee: number;
  dropoff_fee: number;
  free_wait_minutes: number;
}

export interface ZoneFee {
  name: string;
  fee: number;
  type: 'congestion' | 'toll';
}

export interface PremiumServiceOption {
  label: string;
  price: number;
}

export interface PremiumService {
  name: string;
  [key: string]: string | PremiumServiceOption;
}

export interface ServicePolicies {
  multi_stop_fee: number;
  waiting_rate_per_hour: number;
  free_waiting_normal_minutes: number;
  free_waiting_airport_minutes: number;
  minimum_distance_miles: number;
  minimum_time_minutes: number;
}

export interface GeneralPolicies {
  rounding: {
    to: number;
    direction: 'up' | 'down' | 'nearest';
  };
  cancellation: {
    free_hours: number;
    charge_rate: number;
  };
  corporate_discounts: {
    tier1: number;
    tier2: number;
  };
}

export interface FleetSettings {
  discounts: {
    tier1: { min_vehicles: number; discount_rate: number };
    tier2: { min_vehicles: number; discount_rate: number };
  };
  premium_services_multiply: boolean;
}

export interface HourlySettings {
  rates: {
    executive: number;
    luxury: number;
    van: number;
    suv: number;
  };
  minimum_hours: number;
  maximum_hours: number;
  distance_limit_per_hour: number;
  area_restriction: string;
}

export interface ReturnSettings {
  discount_rate: number;
  minimum_hours_between: number;
}

export interface PricingConfig {
  id: string;
  config_version: number;
  is_active: boolean;
  vehicle_types: Record<string, VehicleTypeRates>;
  time_multipliers: Record<string, TimeMultiplier>;
  event_multipliers: Record<string, EventMultiplier>;
  airport_fees: Record<string, AirportFee>;
  zone_fees: Record<string, ZoneFee>;
  premium_services: Record<string, PremiumService>;
  service_policies: ServicePolicies;
  general_policies: GeneralPolicies;
  fleet_settings?: FleetSettings;
  hourly_settings?: HourlySettings;
  return_settings?: ReturnSettings;
  created_at: string;
  updated_at: string;
  notes: string | null;
}

export interface UpdateVehicleTypePayload {
  vehicleType: string;
  rates: Partial<VehicleTypeRates>;
}

export interface UpdateAirportFeePayload {
  airportCode: string;
  fee: Partial<AirportFee>;
}

export interface UpdateMultiplierPayload {
  key: string;
  multiplier: Partial<TimeMultiplier | EventMultiplier>;
}
