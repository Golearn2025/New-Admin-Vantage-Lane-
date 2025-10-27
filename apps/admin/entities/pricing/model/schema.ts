/**
 * Pricing Entity - Zod Schemas
 * 
 * Validation schemas for pricing data
 */

import { z } from 'zod';

export const vehicleTypeRatesSchema = z.object({
  name: z.string(),
  base_fare: z.number().min(0),
  per_mile_first_6: z.number().min(0),
  per_mile_after_6: z.number().min(0),
  per_minute: z.number().min(0),
  hourly_in_town: z.number().min(0),
  hourly_out_town: z.number().min(0),
  minimum_fare: z.number().min(0),
});

export const timeMultiplierSchema = z.object({
  value: z.number().min(0),
  label: z.string(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  days: z.array(z.number()).optional(),
  active: z.boolean(),
});

export const airportFeeSchema = z.object({
  name: z.string(),
  pickup_fee: z.number().min(0),
  dropoff_fee: z.number().min(0),
  free_wait_minutes: z.number().min(0),
});

export const pricingConfigSchema = z.object({
  id: z.string().uuid(),
  config_version: z.number(),
  is_active: z.boolean(),
  vehicle_types: z.record(z.string(), vehicleTypeRatesSchema),
  time_multipliers: z.record(z.string(), timeMultiplierSchema),
  event_multipliers: z.record(z.string(), z.any()),
  airport_fees: z.record(z.string(), airportFeeSchema),
  zone_fees: z.record(z.string(), z.any()),
  premium_services: z.record(z.string(), z.any()),
  service_policies: z.any(),
  general_policies: z.any(),
  created_at: z.string(),
  updated_at: z.string(),
  notes: z.string().nullable(),
});
