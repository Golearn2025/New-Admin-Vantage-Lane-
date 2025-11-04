/**
 * BookingCreateForm Component
 * Main orchestrator for booking creation
 */

'use client';

import { Clock, MapPin, Plane, Timer, Target, Calendar, Users, Luggage, Baby, FileText, Ruler } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
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
import { useDistanceCalculation } from '../hooks/useDistanceCalculation';
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

  const handleSubmit = async () => {
    console.log('\ud83d\ude80 BookingCreateForm - SUBMIT START');
    console.log('\ud83d\udccb FormData:', formData);
    console.log('\ud83d\udccd Distance/Duration:', { distanceMiles, durationMinutes });
    console.log('\ud83d\udcb0 Pricing:', { basePrice, servicesTotal, total });
    
    if (!validate()) {
      console.error('\u274c Validation failed!');
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

          <GooglePlacesInput
            value={formData.pickupText}
            onChange={handlePickupChange}
            label="Pickup Location"
            icon={<MapPin size={18} strokeWidth={2} />}
            placeholder="Search for pickup location..."
          />

          {formData.tripType !== 'hourly' && (
            <GooglePlacesInput
              value={formData.dropoffText}
              onChange={handleDropoffChange}
              label="Dropoff Location"
              icon={<Target size={14} />}
              placeholder="Search for dropoff location..."
            />
          )}

          {formData.tripType !== 'hourly' && (distanceMiles || isCalculating) && (
            <div className={styles.distanceInfo}>
              <div className={styles.distanceCard}>
                <span className={styles.distanceIcon}><Ruler size={18} strokeWidth={2} /></span>
                <div className={styles.distanceContent}>
                  <span className={styles.distanceLabel}>Distance</span>
                  <span className={styles.distanceValue}>
                    {isCalculating ? 'Calculating...' : `${distanceMiles?.toFixed(2)} miles`}
                  </span>
                </div>
              </div>
              <div className={styles.distanceCard}>
                <span className={styles.distanceIcon}><Timer size={18} strokeWidth={2} /></span>
                <div className={styles.distanceContent}>
                  <span className={styles.distanceLabel}>Duration</span>
                  <span className={styles.distanceValue}>
                    {isCalculating ? 'Calculating...' : `${durationMinutes} min`}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}><Calendar size={14} /> Date</label>
              <input
                type="date"
                className={styles.input}
                value={formData.date}
                onChange={(e) => updateField('date', e.target.value)}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}><Clock size={14} /> Time</label>
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
              <label className={styles.label}><Users size={14} /> Passengers</label>
              <input
                type="number"
                className={styles.input}
                min="1"
                value={formData.passengers}
                onChange={(e) => updateField('passengers', parseInt(e.target.value))}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}><Luggage size={14} /> Bags</label>
              <input
                type="number"
                className={styles.input}
                min="0"
                value={formData.bags}
                onChange={(e) => updateField('bags', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}><Baby size={14} /> Child Seats</label>
              <input
                type="number"
                className={styles.input}
                min="0"
                max="4"
                value={formData.childSeats}
                onChange={(e) => updateField('childSeats', parseInt(e.target.value))}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}><Plane size={14} /> Flight Number</label>
              <input
                type="text"
                className={styles.input}
                placeholder="e.g. BA123"
                value={formData.flightNumber || ''}
                onChange={(e) => updateField('flightNumber', e.target.value)}
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}><FileText size={14} /> Notes</label>
            <textarea
              className={styles.textarea}
              rows={4}
              placeholder="Additional notes or special requests..."
              value={formData.notes || ''}
              onChange={(e) => updateField('notes', e.target.value)}
            />
          </div>

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
