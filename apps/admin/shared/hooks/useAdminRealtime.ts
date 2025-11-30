/**
 * Admin Realtime Hook - SIMPLIFIED
 * SCOPE: DOAR driver_documents și support tickets (infrastructure only)
 * 
 * 🚨 BOOKINGS & NOTIFICATIONS AU FOST MUTATE:
 * - Bookings: handled by useBookingsList.ts (single source of truth)
 * - Notifications: handled by NotificationsProvider.tsx (single source of truth)
 * 
 * Features:
 * - Single subscription (nu resubscribe la fiecare render)  
 * - Fixed channel name (mai puțin zgomot în Supabase)
 * - useRef pentru callbacks (evită stale closures)
 * - Early returns pentru protecție
 * 
 * RLS Note: User-ul logat trebuie să aibă SELECT rights pe rândul modificat
 */

'use client';

import { useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

// Tipuri minime pentru siguranță TypeScript
type EntityWithId = { id: string };

interface UseAdminRealtimeProps<
  TDriverDoc extends EntityWithId = any
> {
  // Driver Documents (ONLY infrastructure realtime now)
  setDriverDocuments?: React.Dispatch<React.SetStateAction<TDriverDoc[]>>;
  
  // Optional: enable/disable specific subscriptions
  enableDriverDocuments?: boolean;
}

export function useAdminRealtime<
  TDriverDoc extends EntityWithId = any
>(opts: UseAdminRealtimeProps<TDriverDoc>) {
  const {
    setDriverDocuments,
    enableDriverDocuments = true,
  } = opts;

  const channelRef = useRef<RealtimeChannel | null>(null);
  
  // useRef pentru callbacks ca să evităm stale closures (DOAR pentru driver documents)
  const setDriverDocumentsRef = useRef(setDriverDocuments);

  // Update refs când se schimbă callbacks
  useEffect(() => {
    setDriverDocumentsRef.current = setDriverDocuments;
  });

  useEffect(() => {
    const supabase = createClient();
    
    // 🔴 Nume fix de canal (nu Date.now())
    const channel = supabase.channel('admin-realtime');

    console.log('🔄 Setting up Admin Realtime subscription (driver_documents only)...');

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
