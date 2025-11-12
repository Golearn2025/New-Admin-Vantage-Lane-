/**
 * Admin Realtime Hook - Production Ready
 * Gestionează toate evenimentele Supabase Realtime pentru Admin Dashboard
 * NU face fetchAll() - update local de state pentru performanță maximă
 * 
 * Features:
 * - Single subscription (nu resubscribe la fiecare render)
 * - Fixed channel name (mai puțin zgomot în Supabase)
 * - Proper TypeScript types (BookingLite, NotificationLite)
 * - useRef pentru callbacks (evită stale closures)
 * - Early returns pentru protecție
 * - Sunet DOAR la INSERT (nu la UPDATE/DELETE)
 * 
 * RLS Note: User-ul logat trebuie să aibă SELECT rights pe rândul modificat
 * pentru ca evenimentele UPDATE/DELETE să fie primite.
 */

'use client';

import { useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

// Tipuri minime pentru siguranță TypeScript
type EntityWithId = { id: string };

interface UseAdminRealtimeProps<
  TBooking extends EntityWithId = any,
  TNotification extends EntityWithId = any,
  TDriverDoc extends EntityWithId = any
> {
  // Bookings
  setBookings?: React.Dispatch<React.SetStateAction<TBooking[]>>;
  playNewJobSound?: () => void;
  fetchSingleBooking?: (id: string) => Promise<TBooking>;
  
  // Notifications
  setNotifications?: React.Dispatch<React.SetStateAction<TNotification[]>>;
  
  // Driver Documents
  setDriverDocuments?: React.Dispatch<React.SetStateAction<TDriverDoc[]>>;
  
  // Optional: enable/disable specific subscriptions
  enableBookings?: boolean;
  enableNotifications?: boolean;
  enableDriverDocuments?: boolean;
}

export function useAdminRealtime<
  TBooking extends EntityWithId = any,
  TNotification extends EntityWithId = any,
  TDriverDoc extends EntityWithId = any
>(opts: UseAdminRealtimeProps<TBooking, TNotification, TDriverDoc>) {
  const {
    setBookings,
    playNewJobSound,
    fetchSingleBooking,
    setNotifications,
    setDriverDocuments,
    enableBookings = true,
    enableNotifications = true,
    enableDriverDocuments = true,
  } = opts;

  const channelRef = useRef<RealtimeChannel | null>(null);
  
  // useRef pentru callbacks ca să evităm stale closures
  const setBookingsRef = useRef(setBookings);
  const playNewJobSoundRef = useRef(playNewJobSound);
  const fetchSingleBookingRef = useRef(fetchSingleBooking);
  const setNotificationsRef = useRef(setNotifications);
  const setDriverDocumentsRef = useRef(setDriverDocuments);

  // Update refs când se schimbă callbacks
  useEffect(() => {
    setBookingsRef.current = setBookings;
    playNewJobSoundRef.current = playNewJobSound;
    fetchSingleBookingRef.current = fetchSingleBooking;
    setNotificationsRef.current = setNotifications;
    setDriverDocumentsRef.current = setDriverDocuments;
  });

  useEffect(() => {
    const supabase = createClient();
    
    // 🔴 Nume fix de canal (nu Date.now())
    const channel = supabase.channel('admin-realtime');

    console.log('🔄 Setting up Admin Realtime subscription...');

    // ============================================
    // 📊 BOOKINGS REALTIME
    // ============================================
    if (enableBookings) {
      // INSERT - Booking nou
      channel.on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'bookings' },
        async (payload) => {
          // 🔴 Protecție early return
          if (!setBookingsRef.current) return;
          
          console.log('🆕 NEW BOOKING (INSERT):', payload.new);

          const newBooking = payload.new as TBooking;

          // 1. Adaugă INSTANT în listă
          setBookingsRef.current((prev) => [newBooking, ...prev]);

          // 2. Play sound DOAR la INSERT (nu la UPDATE!)
          if (playNewJobSoundRef.current) {
            try {
              playNewJobSoundRef.current();
              console.log('🔊 Sound played for new booking');
            } catch (error) {
              console.error('❌ Sound play error:', error);
            }
          }

          // 3. Fetch DOAR booking-ul nou pentru date complete (opțional, non-blocking)
          if (fetchSingleBookingRef.current) {
            try {
              const completeBooking = await fetchSingleBookingRef.current(newBooking.id);
              
              // Replace în listă cu datele complete
              setBookingsRef.current((prev) =>
                prev.map((b) => (b.id === completeBooking.id ? completeBooking : b))
              );
              
              console.log('✅ Booking updated with complete data');
            } catch (error) {
              console.error('❌ Failed to fetch complete booking:', error);
              // Nu blocăm UI-ul, booking-ul deja e în listă
            }
          }
        }
      );

      // UPDATE - Status schimbat, preț modificat, etc. (NU sunet!)
      channel.on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'bookings' },
        (payload) => {
          // 🔴 Protecție early return
          if (!setBookingsRef.current) return;
          
          console.log('✏️ BOOKING UPDATED:', payload.new);

          const updatedBooking = payload.new as TBooking;

          // Înlocuiește în listă booking-ul cu același id
          setBookingsRef.current((prev) =>
            prev.map((b) => (b.id === updatedBooking.id ? { ...b, ...updatedBooking } : b))
          );
        }
      );

      // DELETE - Booking șters (din admin sau manual din Supabase)
      channel.on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'bookings' },
        (payload) => {
          // 🔴 Protecție early return
          if (!setBookingsRef.current) return;
          
          console.log('🗑️ BOOKING DELETED:', payload.old);

          const deletedId = (payload.old as TBooking)?.id;
          if (deletedId) {
            setBookingsRef.current((prev) => prev.filter((b) => b.id !== deletedId));
          }
        }
      );
    }

    // ============================================
    // 🔔 NOTIFICATIONS REALTIME
    // ============================================
    if (enableNotifications) {
      channel.on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          // 🔴 Protecție early return
          if (!setNotificationsRef.current) return;
          
          console.log('🔔 NEW NOTIFICATION:', payload.new);

          const newNotification = payload.new as TNotification;

          // Adaugă INSTANT la începutul listei
          setNotificationsRef.current((prev) => [newNotification, ...prev]);
        }
      );
    }

    // ============================================
    // 📄 DRIVER DOCUMENTS REALTIME
    // ============================================
    if (enableDriverDocuments) {
      // INSERT - Document nou uploadat
      channel.on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'driver_documents' },
        (payload) => {
          // 🔴 Protecție early return
          if (!setDriverDocumentsRef.current) return;
          
          console.log('📄 NEW DRIVER DOCUMENT:', payload.new);

          const newDoc = payload.new as TDriverDoc;

          // Adaugă în listă
          setDriverDocumentsRef.current((prev) => [newDoc, ...prev]);
        }
      );

      // UPDATE - Document aprobat/respins
      channel.on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'driver_documents' },
        (payload) => {
          // 🔴 Protecție early return
          if (!setDriverDocumentsRef.current) return;
          
          console.log('✅ DRIVER DOCUMENT UPDATED:', payload.new);

          const updatedDoc = payload.new as TDriverDoc;

          // Înlocuiește în listă
          setDriverDocumentsRef.current((prev) =>
            prev.map((doc) => (doc.id === updatedDoc.id ? { ...doc, ...updatedDoc } : doc))
          );
        }
      );
    }

    // Subscribe
    channelRef.current = channel.subscribe((status, err) => {
      console.log('🔔 Admin Realtime status:', status);
      if (err) {
        console.error('❌ Admin Realtime error:', err);
      }
      if (status === 'SUBSCRIBED') {
        console.log('✅ Admin Realtime connected successfully!');
      }
    });

    // ✅ Cleanup (oprește canale zombie)
    return () => {
      if (channelRef.current) {
        console.log('🔌 Cleaning up Admin Realtime subscription');
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
    };
  }, []); // 🔴 Dependencies GOL - subscribe o singură dată!
}
