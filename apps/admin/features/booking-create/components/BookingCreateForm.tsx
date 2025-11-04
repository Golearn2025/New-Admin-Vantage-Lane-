/**
 * BookingCreateForm Component
 * Main orchestrator for booking creation
 */

'use client';

import { Clock, Ruler } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { BookingTypeSelector } from './BookingTypeSelector';
import { BookingCustomerSelect } from './BookingCustomerSelect';
import { BookingVehicleSelector } from './BookingVehicleSelector';
import { BookingFleetSelector } from './BookingFleetSelector';
import { BookingRouteInputs } from './BookingRouteInputs';
import { BookingDateTimeInputs } from './BookingDateTimeInputs';
import { BookingPassengerInputs } from './BookingPassengerInputs';
import { BookingServicesPanel } from './BookingServicesPanel';
import { BookingPriceSummary } from './BookingPriceSummary';
import { useBookingCreate } from '../hooks/useBookingCreate';
import { usePriceCalculation } from '../hooks/usePriceCalculation';
import { useDistanceCalculation } from '../hooks/useDistanceCalculation';
import { useBookingSubmit } from '../hooks/useBookingSubmit';
import type { Customer } from '../types';
import styles from './BookingCreateForm.module.css';

export function BookingCreateForm() {
  const router = useRouter();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  const {
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
  } = useBookingCreate();

  const { basePrice, servicesTotal, total, breakdown, details, isLoading: isPriceLoading, error: priceError } = usePriceCalculation(formData);
  const { distanceMiles, durationMinutes, isCalculating } = useDistanceCalculation(
    formData.pickupLat,
    formData.pickupLng,
    formData.dropoffLat,
    formData.dropoffLng
  );

  // Update formData with calculated distance and duration
  useEffect(() => {
    if (distanceMiles !== null && durationMinutes !== null) {
      console.log('📍 BookingCreateForm - Updating distance/duration:', { distanceMiles, durationMinutes });
      updateField('distanceMiles', distanceMiles);
      updateField('durationMinutes', durationMinutes);
    }
  }, [distanceMiles, durationMinutes, updateField]);

  // Stable callbacks for GooglePlacesInput
  const handlePickupChange = useCallback((value: string, placeData?: { lat: number; lng: number; formattedAddress: string }) => {
    updateField('pickupText', value);
    if (placeData) {
      updateField('pickupLat', placeData.lat);
      updateField('pickupLng', placeData.lng);
    }
  }, [updateField]);

  const handleDropoffChange = useCallback((value: string, placeData?: { lat: number; lng: number; formattedAddress: string }) => {
    updateField('dropoffText', value);
    if (placeData) {
      updateField('dropoffLat', placeData.lat);
      updateField('dropoffLng', placeData.lng);
    }
  }, [updateField]);

  const { handleSubmit } = useBookingSubmit({
    formData,
    distanceMiles,
    durationMinutes,
    basePrice,
    validate,
    setIsSubmitting,
    setError,
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Create New Booking</h1>
        <button className={styles.cancelButton} onClick={() => router.push('/bookings')}>
          Cancel
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {priceError && <div className={styles.error}>Price calculation error: {priceError}</div>}
      {isPriceLoading && <div className={styles.info}><Clock size={14} /> Calculating price from backend...</div>}
      {isCalculating && <div className={styles.info}><Ruler size={14} /> Calculating distance...</div>}

      <div className={styles.layout}>
        <div className={styles.formColumn}>
          <BookingTypeSelector value={formData.tripType} onChange={updateTripType} />
          
          <BookingCustomerSelect
            selectedCustomer={selectedCustomer}
            onSelectCustomer={(customer) => {
              setSelectedCustomer(customer);
              updateField('customerId', customer?.id || '');
            }}
          />

          <BookingRouteInputs
            tripType={formData.tripType}
            pickupText={formData.pickupText}
            dropoffText={formData.dropoffText}
            distanceMiles={distanceMiles}
            durationMinutes={durationMinutes}
            isCalculating={isCalculating}
            onPickupChange={handlePickupChange}
            onDropoffChange={handleDropoffChange}
          />

          <BookingDateTimeInputs
            tripType={formData.tripType}
            date={formData.date}
            time={formData.time}
            hours={formData.hours}
            onDateChange={(date) => updateField('date', date)}
            onTimeChange={(time) => updateField('time', time)}
            onHoursChange={(hours) => updateField('hours', hours)}
          />

          {/* Fleet Selector - Only for fleet bookings */}
          {formData.tripType === 'fleet' ? (
            <BookingFleetSelector
              fleetExecutive={formData.fleetExecutive || 0}
              fleetSClass={formData.fleetSClass || 0}
              fleetVClass={formData.fleetVClass || 0}
              fleetSUV={formData.fleetSUV || 0}
              onChange={(field, value) => updateField(field as any, value)}
            />
          ) : (
            <BookingVehicleSelector
              value={formData.category}
              vehicleModel={formData.vehicleModel}
              onChange={updateCategory}
              onModelChange={(model) => updateField('vehicleModel', model)}
            />
          )}

          <BookingPassengerInputs
            passengers={formData.passengers}
            bags={formData.bags}
            childSeats={formData.childSeats}
            flightNumber={formData.flightNumber}
            notes={formData.notes}
            onPassengersChange={(count) => updateField('passengers', count)}
            onBagsChange={(count) => updateField('bags', count)}
            onChildSeatsChange={(count) => updateField('childSeats', count)}
            onFlightNumberChange={(value) => updateField('flightNumber', value)}
            onNotesChange={(value) => updateField('notes', value)}
          />

          <BookingServicesPanel services={formData.services} onToggleService={toggleService} />
        </div>

        <div className={styles.summaryColumn}>
          <BookingPriceSummary
            basePrice={basePrice}
            servicesTotal={servicesTotal}
            total={total}
            isSubmitting={isSubmitting}
            isPriceLoading={isPriceLoading}
            breakdown={breakdown}
            details={details}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
