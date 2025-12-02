'use client';

/**
 * Test Booking Creator - STEP 2 Testing Page
 * Rapid creation of different booking types for realtime testing
 */

import { useState } from 'react';
import { Button } from '@vantage-lane/ui-core';
import { fetchAuthedJson } from '@admin-shared/utils/fetchAuthedJson';

interface TestBookingData {
  type: 'oneway' | 'return' | 'hourly' | 'fleet';
  category: 'EXEC' | 'LUX' | 'SUV' | 'VAN'; // Schema compatible
  pickup: string;
  destination: string;
  price: number;
  passengers: number;
}

const TEST_BOOKINGS: TestBookingData[] = [
  {
    type: 'oneway',
    category: 'EXEC',
    pickup: 'Heathrow Terminal 2, London',
    destination: 'Oxford Street, London',
    price: 85.50,
    passengers: 2
  },
  {
    type: 'return',
    category: 'LUX', // Fixed schema compatibility
    pickup: 'Gatwick Airport, London',
    destination: 'Canary Wharf, London',
    price: 120.00,
    passengers: 1
  },
  {
    type: 'oneway',
    category: 'SUV', // Fixed schema compatibility
    pickup: 'King\'s Cross Station, London',
    destination: 'Westminster, London',
    price: 65.00,
    passengers: 4
  },
  {
    type: 'hourly',
    category: 'EXEC',
    pickup: 'Mayfair, London',
    destination: 'City of London',
    price: 150.00,
    passengers: 2
  }
];

export default function TestBookingCreatorPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [lastCreated, setLastCreated] = useState<string | null>(null);

  const createTestBooking = async (testData: TestBookingData) => {
    setLoading(testData.type);
    setLastCreated(null);

    try {
      // Create booking exactly like landing page would - proper schema format
      const requestBody = {
        payload: {
          customer_id: '052cba46-26f0-4312-95ee-b2210056caff', // Use existing customer ID
          operator_id: 'premium-exec',
          trip_type: testData.type,
          category: testData.category,
          start_at: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
          passenger_count: testData.passengers,
          bag_count: 1,
          child_seats: 0, // Missing field
          currency: 'GBP',
          payment_method: 'CARD',
          status: 'NEW', // Missing field
          payment_status: 'pending', // Missing field
          notes: `STEP2 Test booking - ${testData.type} created at ${new Date().toLocaleTimeString()}`,
          // Fleet fields (optional but needed for validation)
          fleet_executive: testData.category === 'EXEC' ? 1 : 0,
          fleet_s_class: testData.category === 'LUX' ? 1 : 0,
          fleet_v_class: testData.category === 'VAN' ? 1 : 0,
          fleet_suv: testData.category === 'SUV' ? 1 : 0,
          ...(testData.type === 'return' && {
            return_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            return_time: '18:00'
          }),
          ...(testData.type === 'hourly' && {
            hours: 3
          })
        },
        segments: [
          {
            seq_no: 1,
            role: 'pickup' as const,
            place_text: testData.pickup,
            place_label: testData.pickup.split(',')[0],
            lat: 51.4700,
            lng: -0.4543
          },
          {
            seq_no: 2,
            role: 'dropoff' as const,
            place_text: testData.destination,
            place_label: testData.destination.split(',')[0],
            lat: 51.5154,
            lng: -0.1447
          }
        ],
        services: [],
        basePrice: testData.price
      };

      const result = await fetchAuthedJson<{ reference: string }>('/api/bookings/create', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });

      setLastCreated(`${result.reference} - ${testData.type.toUpperCase()}`);
      
      // Success feedback - allow console for test page
      // eslint-disable-next-line no-console
      console.log('✅ Test booking created:', result);

    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('❌ Failed to create test booking:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px' }}>
      <h1>🧪 Test Booking Creator</h1>
      <p>Create test bookings with 1-click to test STEP 2 realtime functionality</p>
      
      {lastCreated && (
        <div style={{ 
          background: '#d4edda', 
          border: '1px solid #c3e6cb', 
          padding: '1rem', 
          borderRadius: '4px',
          marginBottom: '1rem',
          color: '#155724'
        }}>
          ✅ Created: <strong>{lastCreated}</strong>
        </div>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '1rem',
        marginTop: '2rem'
      }}>
        {TEST_BOOKINGS.map((booking, index) => (
          <div key={index} style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            padding: '1.5rem',
            background: '#f8f9fa'
          }}>
            <h3>
              {booking.type.toUpperCase()} - {booking.category}
            </h3>
            
            <div style={{ margin: '1rem 0', fontSize: '0.9rem', color: '#666' }}>
              <div>📍 <strong>From:</strong> {booking.pickup}</div>
              <div>🎯 <strong>To:</strong> {booking.destination}</div>
              <div>👥 <strong>Passengers:</strong> {booking.passengers}</div>
              <div>💰 <strong>Price:</strong> £{booking.price}</div>
            </div>

            <Button
              onClick={() => createTestBooking(booking)}
              disabled={loading === booking.type}
              style={{ 
                width: '100%',
                backgroundColor: loading === booking.type ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                padding: '0.75rem',
                borderRadius: '4px',
                cursor: loading === booking.type ? 'not-allowed' : 'pointer'
              }}
            >
              {loading === booking.type ? '⏳ Creating...' : `🚀 Create ${booking.type.toUpperCase()}`}
            </Button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f1f3f4', borderRadius: '4px' }}>
        <h4>📋 Testing Instructions:</h4>
        <ol>
          <li>Open <strong>/bookings/active</strong> in another tab</li>
          <li>Open DevTools → Console</li>
          <li>Click any booking type above</li>
          <li>Watch for:
            <ul>
              <li>✅ Booking appears instantly in list</li>
              <li>🔊 Single sound (no duplicates)</li>
              <li>📡 No API calls to /api/bookings/list</li>
            </ul>
          </li>
        </ol>
      </div>
    </div>
  );
}
