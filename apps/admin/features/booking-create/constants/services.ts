/**
 * Available Services for Bookings
 * Based on Supabase booking_services analysis
 */

import type { BookingService } from '../types';

export const AVAILABLE_SERVICES: BookingService[] = [
  // FREE Services
  {
    code: 'wifi',
    label: 'WiFi',
    price: 0,
    selected: false,
    isFree: true,
  },
  {
    code: 'meet_and_greet',
    label: 'Meet & Greet',
    price: 0,
    selected: false,
    isFree: true,
  },
  {
    code: 'luggage_assistance',
    label: 'Luggage Assistance',
    price: 0,
    selected: false,
    isFree: true,
  },
  {
    code: 'pet_friendly',
    label: 'Pet Friendly',
    price: 0,
    selected: false,
    isFree: true,
  },
  {
    code: 'bottled_water',
    label: 'Bottled Water',
    price: 0,
    selected: false,
    isFree: true,
  },
  {
    code: 'phone_chargers',
    label: 'Phone Chargers',
    price: 0,
    selected: false,
    isFree: true,
  },
  {
    code: 'priority_support',
    label: 'Priority Support',
    price: 0,
    selected: false,
    isFree: true,
  },
  {
    code: 'wait_time_included',
    label: 'Wait Time Included',
    price: 0,
    selected: false,
    isFree: true,
  },
  {
    code: 'music_preference',
    label: 'Music Preference',
    price: 0,
    selected: false,
    isFree: true,
  },
  {
    code: 'temperature_preference',
    label: 'Temperature Preference',
    price: 0,
    selected: false,
    isFree: true,
  },
  {
    code: 'communication_style',
    label: 'Communication Style',
    price: 0,
    selected: false,
    isFree: true,
  },
  
  // PAID Services
  {
    code: 'fresh_flowers',
    label: 'Fresh Flowers',
    price: 120,
    selected: false,
    isFree: false,
  },
  {
    code: 'champagne',
    label: 'Champagne',
    price: 120,
    selected: false,
    isFree: false,
  },
  {
    code: 'security_escort',
    label: 'Security Escort',
    price: 750,
    selected: false,
    isFree: false,
  },
];
