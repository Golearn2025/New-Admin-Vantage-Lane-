/**
 * useBookingCreate Hook
 * Manages booking creation form state and submission
 */

import { useState } from 'react';
import type { BookingFormData, TripType, VehicleCategory } from '../types';
import { AVAILABLE_SERVICES } from '../constants/services';

export function useBookingCreate() {
  const [formData, setFormData] = useState<BookingFormData>({
    tripType: 'oneway',
    customerId: '',
    pickupText: '',
    dropoffText: '',
    date: '',
    time: '',
    category: 'EXEC',
    passengers: 1,
    bags: 0,
    childSeats: 0,
    services: [...AVAILABLE_SERVICES],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = <K extends keyof BookingFormData>(
    field: K,
    value: BookingFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateTripType = (tripType: TripType) => {
    setFormData(prev => ({ ...prev, tripType }));
  };

  const updateCategory = (category: VehicleCategory) => {
    setFormData(prev => ({ ...prev, category }));
  };

  const toggleService = (serviceCode: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.map(s =>
        s.code === serviceCode ? { ...s, selected: !s.selected } : s
      ),
    }));
  };

  const validate = (): boolean => {
    if (!formData.customerId) {
      setError('Please select a customer');
      return false;
    }
    if (!formData.pickupText) {
      setError('Pickup location is required');
      return false;
    }
    if (formData.tripType !== 'hourly' && !formData.dropoffText) {
      setError('Dropoff location is required');
      return false;
    }
    if (!formData.date) {
      setError('Date is required');
      return false;
    }
    if (!formData.time) {
      setError('Time is required');
      return false;
    }
    if (formData.tripType === 'hourly' && !formData.hours) {
      setError('Hours are required for hourly bookings');
      return false;
    }
    setError(null);
    return true;
  };

  return {
    formData,
    isSubmitting,
    error,
    setIsSubmitting,
    setError,
    updateField,
    updateTripType,
    updateCategory,
    toggleService,
    validate,
  };
}
