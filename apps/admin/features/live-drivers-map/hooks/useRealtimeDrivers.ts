/**
 * Supabase Realtime Hook for Live Driver Tracking
 * 
 * Listens to real-time changes in the drivers table
 * Updates driver locations and status instantly
 */

'use client';

import { createClient } from '@/lib/supabase/client';
import type { DriverLocationData } from '@entities/driver-location';
import { useEffect, useRef, useState } from 'react';

interface RealtimeDriversHook {
  drivers: DriverLocationData[];
  loading: boolean;
  error: string | null;
  isConnected: boolean;
  lastUpdate: Date | null;
}

export function useRealtimeDrivers(filters: { showOnline: boolean; showBusy: boolean } = { showOnline: true, showBusy: true }): RealtimeDriversHook {
  const [drivers, setDrivers] = useState<DriverLocationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const channelRef = useRef<any>(null);
  const supabase = createClient();

  // Initial data fetch
  const fetchInitialDrivers = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🗺️ [UPDATED] Fetching initial drivers data with NEW DEBUG...');

      // Get current session to ensure auth
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error('❌ No auth session found');
        setError('Authentication required');
        return;
      }

      console.log('👤 Using session for user:', session.user?.email);

      // Test admin access first
      const { data: testData, error: testError } = await supabase
        .from('drivers')
        .select('id')
        .limit(1);

      if (testError) {
        console.error('❌ Admin access test failed:', testError);
        setError(`Access denied: ${testError.message}`);
        return;
      }

      console.log('✅ Admin access confirmed, continuing with full query...');

      // Debug query step by step
      console.log('🔍 Testing query without filters...');
      const { data: allData, error: allError } = await supabase
        .from('drivers')
        .select(`
          id,
          first_name,
          last_name,
          online_status,
          current_latitude,
          current_longitude,
          location_updated_at
        `)
        .is('deleted_at', null);

      console.log('📊 All drivers (no location filter):', allData?.length || 0);
      
      if (allData && allData.length > 0) {
        console.log('📍 Sample driver data:', allData[0]);
      }

      // Now apply location filters and include vehicle data
      const { data, error: fetchError } = await supabase
        .from('drivers')
        .select(`
          id,
          first_name,
          last_name,
          email,
          online_status,
          current_latitude,
          current_longitude,
          location_updated_at,
          profile_photo_url,
          organization_id,
          address,
          phone,
          vehicles!vehicles_driver_id_fkey(
            license_plate,
            make,
            model,
            color,
            category
          )
        `)
        .is('deleted_at', null)
        .not('current_latitude', 'is', null)
        .not('current_longitude', 'is', null);

      console.log('📍 Drivers with location filters:', data?.length || 0);

      if (fetchError) {
        console.error('❌ Drivers fetch error:', fetchError);
        setError(fetchError.message);
        return;
      }

      console.log('✅ Fetched drivers:', data?.length || 0);

      // Transform data to match our interface
      const transformedDrivers: DriverLocationData[] = (data || []).map(driver => ({
        id: driver.id,
        firstName: driver.first_name || '',
        lastName: driver.last_name || '',
        email: driver.email,
        onlineStatus: driver.online_status || 'offline',
        currentLatitude: driver.current_latitude,
        currentLongitude: driver.current_longitude,
        locationUpdatedAt: driver.location_updated_at,
        locationAccuracy: null, // Not stored in current schema
        lastOnlineAt: driver.location_updated_at, // Use location_updated_at as fallback
        profilePhotoUrl: driver.profile_photo_url,
        organizationId: driver.organization_id,
        organizationName: 'Independent', // Simplified for now
        address: (driver as any).address, // Add address field
        phone: (driver as any).phone, // Add phone field
        vehicles: (driver as any).vehicles // Add vehicles array
      }));

      // TEMPORARILY show ALL drivers (no filters)
      console.log('🔥 SHOWING ALL DRIVERS - NO FILTERS FOR DEBUG');
      const filteredDrivers = transformedDrivers; // Show all for now
      
      // Apply filters (commented out for debug)
      // const filteredDrivers = transformedDrivers.filter(driver => {
      //   if (driver.onlineStatus === 'online' && filters.showOnline) return true;
      //   if (driver.onlineStatus === 'busy' && filters.showBusy) return true;
      //   return false;
      // });

      setDrivers(filteredDrivers);
      setLastUpdate(new Date());
      
    } catch (err) {
      console.error('❌ Error fetching drivers:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Setup Realtime subscription
  const setupRealtimeSubscription = () => {
    console.log('🔄 Setting up Realtime subscription...');

    // Clean up existing channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // Create new channel for drivers table
    const channel = supabase
      .channel('drivers-realtime')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events: INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'drivers'
          // NO FILTER - filters can block realtime events
        },
        (payload) => {
          console.log('🔴🔴🔴 REALTIME EVENT RECEIVED! 🔴🔴🔴');
          console.log('Event type:', payload.eventType);
          console.log('Table:', payload.table);
          console.log('New data:', payload.new);
          console.log('Old data:', payload.old);
          handleRealtimeUpdate(payload);
        }
      )
      .subscribe((status) => {
        console.log('📡 Realtime status:', status);
        setIsConnected(status === 'SUBSCRIBED');
        
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to realtime updates!');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Realtime connection failed');
          setError('Realtime connection failed');
        } else if (status === 'CLOSED') {
          console.warn('⚠️ Realtime connection closed');
          setIsConnected(false);
        }
      });

    channelRef.current = channel;
  };

  // Handle realtime updates
  const handleRealtimeUpdate = (payload: any) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    setLastUpdate(new Date());

    switch (eventType) {
      case 'INSERT':
        if (newRecord && newRecord.current_latitude && newRecord.current_longitude) {
          const newDriver = transformDriverRecord(newRecord);
          if (shouldShowDriver(newDriver)) {
            setDrivers(prev => [...prev, newDriver]);
            console.log('➕ Added new driver:', newDriver.firstName, newDriver.lastName);
          }
        }
        break;

      case 'UPDATE':
        if (newRecord) {
          const updatedDriver = transformDriverRecord(newRecord);
          
          setDrivers(prev => {
            const filtered = prev.filter(d => d.id !== updatedDriver.id);
            
            // Only add if driver should be shown and has location
            if (shouldShowDriver(updatedDriver) && updatedDriver.currentLatitude && updatedDriver.currentLongitude) {
              return [...filtered, updatedDriver];
            }
            
            return filtered;
          });
          
          console.log('🔄 Updated driver:', updatedDriver.firstName, updatedDriver.lastName, `(${updatedDriver.onlineStatus})`);
        }
        break;

      case 'DELETE':
        if (oldRecord) {
          setDrivers(prev => prev.filter(d => d.id !== oldRecord.id));
          console.log('➖ Removed driver:', oldRecord.id);
        }
        break;
    }
  };

  // Transform database record to our interface
  const transformDriverRecord = (record: any): DriverLocationData => ({
    id: record.id,
    firstName: record.first_name || '',
    lastName: record.last_name || '',
    email: record.email,
    onlineStatus: record.online_status || 'offline',
    currentLatitude: record.current_latitude,
    currentLongitude: record.current_longitude,
    locationUpdatedAt: record.location_updated_at,
    locationAccuracy: null, // Not stored in current schema
    lastOnlineAt: record.location_updated_at,
    profilePhotoUrl: record.profile_photo_url,
    organizationId: record.organization_id,
    organizationName: 'Organization' // Will be filled by join in initial fetch
  });

  // Check if driver should be shown based on filters
  const shouldShowDriver = (driver: DriverLocationData): boolean => {
    if (driver.onlineStatus === 'online' && filters.showOnline) return true;
    if (driver.onlineStatus === 'busy' && filters.showBusy) return true;
    return false;
  };

  // Initialize on mount
  useEffect(() => {
    fetchInitialDrivers();
    setupRealtimeSubscription();

    // Cleanup on unmount
    return () => {
      if (channelRef.current) {
        console.log('🧹 Cleaning up Realtime subscription...');
        supabase.removeChannel(channelRef.current);
      }
    };
  }, []);

  // Re-filter when filters change
  useEffect(() => {
    fetchInitialDrivers();
  }, [filters.showOnline, filters.showBusy]);

  return {
    drivers,
    loading,
    error,
    isConnected,
    lastUpdate
  };
}
