/**
 * useBookingSubmit Hook
 * 
 * Handles booking submission logic:
 * - Validates form data
 * - Builds payload with all booking details
 * - Creates segments (pickup/dropoff)
 * - Submits to API
 * - Handles success/error states
 * 
 * Compliant: <200 lines, TypeScript strict, zero any
 */

'use client';

import { useRouter } from 'next/navigation';
import type { BookingFormData } from '../types';

interface UseBookingSubmitParams {
  formData: BookingFormData;
  distanceMiles: number | null;
  durationMinutes: number | null;
  basePrice: number;
  validate: () => boolean;
  setIsSubmitting: (value: boolean) => void;
  setError: (error: string | null) => void;
}

export function useBookingSubmit({
  formData,
  distanceMiles,
  durationMinutes,
  basePrice,
  validate,
  setIsSubmitting,
  setError,
}: UseBookingSubmitParams) {
  const router = useRouter();

  const handleSubmit = async () => {
    console.log('🚀 useBookingSubmit - SUBMIT START');
    console.log('📋 FormData:', formData);
    console.log('📍 Distance/Duration:', { distanceMiles, durationMinutes });
    console.log('💰 Pricing:', { basePrice });
    
    if (!validate()) {
      console.error('❌ Validation failed!');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        customer_id: formData.customerId,
        operator_id: 'premium-exec',
        trip_type: formData.tripType,
        category: formData.category,
        vehicle_model: formData.vehicleModel,
        start_at: `${formData.date}T${formData.time}:00`,
        passenger_count: formData.passengers,
        bag_count: formData.bags,
        child_seats: formData.childSeats,
        flight_number: formData.flightNumber,
        notes: formData.notes,
        distance_miles: formData.distanceMiles,
        duration_min: formData.durationMinutes,
        status: 'NEW',
        payment_status: 'pending',
        currency: 'GBP',
        payment_method: 'CARD',
        return_date: formData.returnDate,
        return_time: formData.returnTime,
        return_flight_number: formData.returnFlightNumber,
        hours: formData.hours,
        fleet_executive: formData.fleetExecutive,
        fleet_s_class: formData.fleetSClass,
        fleet_v_class: formData.fleetVClass,
        fleet_suv: formData.fleetSUV,
      };

      const segments = [
        { 
          seq_no: 1, 
          role: 'pickup' as const, 
          place_text: formData.pickupText,
          lat: formData.pickupLat || null,
          lng: formData.pickupLng || null,
        },
        ...(formData.tripType !== 'hourly' ? [{ 
          seq_no: 2, 
          role: 'dropoff' as const, 
          place_text: formData.dropoffText,
          lat: formData.dropoffLat || null,
          lng: formData.dropoffLng || null,
        }] : []),
      ];

      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload, segments, services: formData.services, basePrice }),
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Booking created successfully!', result.reference);
        router.push(`/bookings?success=true&reference=${result.reference}`);
      } else {
        console.error('❌ API Error:', result.error);
        setError(result.error || 'Failed to create booking');
      }
    } catch (err) {
      console.error('❌ Submit Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit };
}
