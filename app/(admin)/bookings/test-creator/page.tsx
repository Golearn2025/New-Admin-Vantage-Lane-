'use client';

/**
 * Test Booking Creator - Enhanced Version
 * Create test bookings with custom trip type and vehicle category
 * Random data generation for addresses, prices, distances
 */

import { fetchAuthedJson } from '@admin-shared/utils/fetchAuthedJson';
import { Button } from '@vantage-lane/ui-core';
import { useState } from 'react';

// London locations for random selection
const LONDON_LOCATIONS = [
  { name: 'Heathrow Airport Terminal 5', lat: 51.4700, lng: -0.4543 },
  { name: 'Gatwick Airport', lat: 51.1537, lng: -0.1821 },
  { name: 'Stansted Airport', lat: 51.8860, lng: 0.2389 },
  { name: 'London City Airport', lat: 51.5048, lng: 0.0495 },
  { name: 'King\'s Cross Station', lat: 51.5309, lng: -0.1238 },
  { name: 'Paddington Station', lat: 51.5154, lng: -0.1755 },
  { name: 'Victoria Station', lat: 51.4952, lng: -0.1441 },
  { name: 'Waterloo Station', lat: 51.5031, lng: -0.1132 },
  { name: 'Liverpool Street Station', lat: 51.5179, lng: -0.0823 },
  { name: 'The Savoy Hotel, London WC2R', lat: 51.5104, lng: -0.1205 },
  { name: 'Claridge\'s Hotel, London W1K', lat: 51.5129, lng: -0.1481 },
  { name: 'The Ritz Hotel, London W1J', lat: 51.5074, lng: -0.1419 },
  { name: 'The Connaught, London W1K', lat: 51.5115, lng: -0.1502 },
  { name: 'Oxford Street, London', lat: 51.5154, lng: -0.1447 },
  { name: 'Canary Wharf, London', lat: 51.5054, lng: -0.0235 },
  { name: 'Westminster, London SW1A', lat: 51.4995, lng: -0.1248 },
  { name: 'Mayfair, London W1K', lat: 51.5095, lng: -0.1435 },
  { name: 'Shoreditch, London E1', lat: 51.5254, lng: -0.0778 },
  { name: 'Camden Town, London NW1', lat: 51.5392, lng: -0.1426 },
  { name: 'The Shard, London SE1', lat: 51.5045, lng: -0.0865 },
  { name: 'Tower Bridge, London SE1', lat: 51.5055, lng: -0.0754 },
  { name: 'Buckingham Palace, London SW1A', lat: 51.5014, lng: -0.1419 },
  { name: 'Hyde Park Corner, London SW1X', lat: 51.5027, lng: -0.1527 },
  { name: 'Sloane Square, London SW1W', lat: 51.4923, lng: -0.1564 },
  { name: 'London Eye, London SE1', lat: 51.5033, lng: -0.1196 },
  { name: 'Windsor Castle, Windsor SL4', lat: 51.4839, lng: -0.6044 },
  { name: 'Oxford City Centre', lat: 51.7520, lng: -1.2577 },
  { name: 'Cambridge Railway Station', lat: 52.1943, lng: 0.1371 },
  { name: 'Brighton Pier, Brighton', lat: 50.8154, lng: -0.1371 },
  { name: 'London City Centre, London EC2', lat: 51.5155, lng: -0.0922 },
];

// Random helper functions
const randomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]!;
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomPrice = (category: string) => {
  const ranges: Record<string, [number, number]> = {
    'exec': [50, 120],
    'lux': [80, 200],
    'suv': [60, 140],
    'van': [70, 150],
  };
  const [min, max] = ranges[category.toLowerCase()] || [50, 150];
  return Number((Math.random() * (max - min) + min).toFixed(2));
};

export default function TestBookingCreatorPage() {
  const [tripType, setTripType] = useState<'oneway' | 'return' | 'hourly' | 'daily'>('oneway');
  const [category, setCategory] = useState<'exec' | 'lux' | 'suv' | 'van'>('exec');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [lastCreated, setLastCreated] = useState<string[]>([]);

  const generateRandomBookingData = () => {
    const pickup = randomElement(LONDON_LOCATIONS);
    const destination = randomElement(LONDON_LOCATIONS.filter(loc => loc.name !== pickup.name));
    const price = randomPrice(category);
    const passengers = randomInt(1, 6);
    const bagCount = randomInt(1, passengers + 2);

    return {
      pickup,
      destination,
      price,
      passengers,
      bagCount
    };
  };

  const createBooking = async () => {
    setLoading(true);
    setLastCreated([]);
    const created: string[] = [];

    try {
      for (let i = 0; i < quantity; i++) {
        const data = generateRandomBookingData();
        const hours = randomInt(2, 8);
        const days = randomInt(1, 5);
        
        // Prepare booking payload for direct database insert
        const requestBody = {
          customer_id: '1a560433-c426-41d8-812c-01c44cb992d7',
          trip_type: tripType,
          category: category,
          start_at: new Date(Date.now() + randomInt(2, 24) * 60 * 60 * 1000).toISOString(),
          passenger_count: data.passengers,
          bag_count: data.bagCount,
          currency: 'GBP',
          notes: `Test ${tripType} ${category} - Created ${new Date().toLocaleString()}`,
          pickup_location: data.pickup.name,
          pickup_lat: data.pickup.lat,
          pickup_lng: data.pickup.lng,
          destination: data.destination.name,
          destination_lat: data.destination.lat,
          destination_lng: data.destination.lng,
          leg_price: data.price,
          driver_payout: data.price, // Driver gets exactly what they see
          ...(tripType === 'return' && {
            return_date: new Date(Date.now() + randomInt(24, 72) * 60 * 60 * 1000).toISOString(),
            return_time: `${randomInt(8, 20)}:00`
          }),
          ...(tripType === 'hourly' && {
            hours: hours
          }),
          ...(tripType === 'daily' && {
            days: days
          })
        };

        const result = await fetchAuthedJson<{ reference: string; success: boolean; error?: string }>('/api/bookings/create-test', {
          method: 'POST',
          body: JSON.stringify(requestBody)
        });

        if (!result.success) {
          throw new Error(result.error || 'Failed to create booking');
        }

        created.push(`${result.reference} - ${tripType.toUpperCase()} ${category.toUpperCase()}`);
        
        // eslint-disable-next-line no-console
        console.log(`✅ Created booking ${i + 1}/${quantity}:`, result);
      }

      setLastCreated(created);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('❌ Failed to create booking:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto', color: '#333' }}>
      <h1 style={{ color: '#222' }}>🧪 Test Booking Creator - Enhanced</h1>
      <p style={{ color: '#555' }}>Create test bookings with random data for testing</p>
      
      {lastCreated.length > 0 && (
        <div style={{ 
          background: '#d4edda', 
          border: '1px solid #c3e6cb', 
          padding: '1rem', 
          borderRadius: '8px',
          marginBottom: '2rem',
          color: '#155724'
        }}>
          <strong>✅ Created {lastCreated.length} booking(s):</strong>
          <ul style={{ marginTop: '0.5rem', marginBottom: 0 }}>
            {lastCreated.map((ref, idx) => (
              <li key={idx}>{ref}</li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ 
        background: '#fff',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '2rem',
        marginBottom: '2rem',
        color: '#333'
      }}>
        <h3 style={{ marginTop: 0, color: '#222' }}>⚙️ Booking Configuration</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {/* Trip Type */}
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#333' }}>
              🚗 Trip Type
            </label>
            <select 
              value={tripType}
              onChange={(e) => setTripType(e.target.value as any)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '1rem',
                color: '#333',
                backgroundColor: '#fff'
              }}
            >
              <option value="oneway">One-Way</option>
              <option value="return">Return</option>
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
            </select>
          </div>

          {/* Vehicle Category */}
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#333' }}>
              🚙 Vehicle Category
            </label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '1rem',
                color: '#333',
                backgroundColor: '#fff'
              }}
            >
              <option value="exec">Executive</option>
              <option value="lux">Luxury</option>
              <option value="suv">SUV</option>
              <option value="van">Van</option>
            </select>
          </div>
        </div>

        {/* Quantity */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#333' }}>
            🔢 Quantity (How many bookings to create)
          </label>
          <input 
            type="number"
            min="1"
            max="20"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '1rem',
              color: '#333',
              backgroundColor: '#fff'
            }}
          />
        </div>

        {/* Random Data Info */}
        <div style={{ 
          background: '#f8f9fa',
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '1.5rem',
          fontSize: '0.9rem',
          color: '#333'
        }}>
          <strong style={{ color: '#222' }}>🎲 Random Data Generated:</strong>
          <ul style={{ marginTop: '0.5rem', marginBottom: 0 }}>
            <li>📍 Pickup & Destination addresses (30+ London locations)</li>
            <li>� Price based on category (Exec: £50-120, Lux: £80-200, SUV: £60-140, Van: £70-150)</li>
            <li>👥 Passengers (1-6)</li>
            <li>🧳 Bag count (1-8)</li>
            <li>⏰ Pickup time (2-24 hours from now)</li>
            {tripType === 'return' && <li>� Return time (24-72 hours after pickup)</li>}
            {tripType === 'hourly' && <li>⏱️ Duration (2-8 hours)</li>}
            {tripType === 'daily' && <li>📅 Duration (1-5 days)</li>}
          </ul>
        </div>

        {/* Create Button */}
        <Button
          onClick={createBooking}
          disabled={loading}
          style={{ 
            width: '100%',
            backgroundColor: loading ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            padding: '1rem',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '1.1rem',
            fontWeight: 'bold'
          }}
        >
          {loading ? '⏳ Creating...' : `🚀 Create ${quantity} ${tripType.toUpperCase()} ${category.toUpperCase()} Booking${quantity > 1 ? 's' : ''}`}
        </Button>
      </div>

      <div style={{ padding: '1rem', background: '#f1f3f4', borderRadius: '8px', color: '#333' }}>
        <h4 style={{ marginTop: 0, color: '#222' }}>📋 How it works:</h4>
        <ul style={{ color: '#333' }}>
          <li>✅ Select trip type (oneway, return, hourly, daily)</li>
          <li>✅ Select vehicle category (exec, lux, suv, van)</li>
          <li>✅ Choose how many bookings to create</li>
          <li>✅ All other data is randomly generated (addresses, prices, passengers, etc.)</li>
          <li>✅ Uses proper database fields matching your documentation</li>
          <li>✅ Creates bookings instantly - check /bookings/active</li>
        </ul>
      </div>
    </div>
  );
}
