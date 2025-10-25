/**
 * BookingCreateForm Component
 * Main orchestrator for booking creation
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookingTypeSelector } from './BookingTypeSelector';
import { BookingCustomerSelect } from './BookingCustomerSelect';
import { BookingVehicleSelector } from './BookingVehicleSelector';
import { BookingFleetSelector } from './BookingFleetSelector';
import { GooglePlacesInput } from './GooglePlacesInput';
import { BookingServicesPanel } from './BookingServicesPanel';
import { BookingPriceSummary } from './BookingPriceSummary';
import { useBookingCreate } from '../hooks/useBookingCreate';
import { usePriceCalculation } from '../hooks/usePriceCalculation';
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

  const { basePrice, servicesTotal, total } = usePriceCalculation(formData);

  const handleSubmit = async () => {
    if (!validate()) return;

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
        { seq_no: 1, role: 'pickup' as const, place_text: formData.pickupText },
        ...(formData.tripType !== 'hourly' ? [{ seq_no: 2, role: 'dropoff' as const, place_text: formData.dropoffText }] : []),
      ];

      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload, segments, services: formData.services, basePrice }),
      });

      const result = await response.json();

      if (result.success) {
        router.push(`/bookings?success=true&reference=${result.reference}`);
      } else {
        setError(result.error || 'Failed to create booking');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Create New Booking</h1>
        <button className={styles.cancelButton} onClick={() => router.push('/bookings')}>
          Cancel
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

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

          <GooglePlacesInput
            value={formData.pickupText}
            onChange={(value) => updateField('pickupText', value)}
            label="Pickup Location"
            icon="📍"
            placeholder="Search for pickup location..."
          />

          {formData.tripType !== 'hourly' && (
            <GooglePlacesInput
              value={formData.dropoffText}
              onChange={(value) => updateField('dropoffText', value)}
              label="Dropoff Location"
              icon="🎯"
              placeholder="Search for dropoff location..."
            />
          )}

          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>📅 Date</label>
              <input
                type="date"
                className={styles.input}
                value={formData.date}
                onChange={(e) => updateField('date', e.target.value)}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>🕒 Time</label>
              <input
                type="time"
                className={styles.input}
                value={formData.time}
                onChange={(e) => updateField('time', e.target.value)}
              />
            </div>
          </div>

          {formData.tripType === 'hourly' && (
            <div className={styles.fieldGroup}>
              <label className={styles.label}>⏰ Hours</label>
              <input
                type="number"
                className={styles.input}
                min="1"
                max="12"
                value={formData.hours || 1}
                onChange={(e) => updateField('hours', parseInt(e.target.value))}
              />
            </div>
          )}

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

          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>👥 Passengers</label>
              <input
                type="number"
                className={styles.input}
                min="1"
                value={formData.passengers}
                onChange={(e) => updateField('passengers', parseInt(e.target.value))}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>🎒 Bags</label>
              <input
                type="number"
                className={styles.input}
                min="0"
                value={formData.bags}
                onChange={(e) => updateField('bags', parseInt(e.target.value))}
              />
            </div>
          </div>

          <BookingServicesPanel services={formData.services} onToggleService={toggleService} />
        </div>

        <div className={styles.summaryColumn}>
          <BookingPriceSummary
            basePrice={basePrice}
            servicesTotal={servicesTotal}
            total={total}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
