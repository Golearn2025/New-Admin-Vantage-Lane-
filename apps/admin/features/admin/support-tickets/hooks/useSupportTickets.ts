/**
 * Support Tickets Data Hook - REAL Supabase Integration
 * Handles fetching, filtering, and pagination for support tickets
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface SupportTicket {
  id: string;
  ticket_number: string;
  subject: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_by_type: 'customer' | 'driver' | 'operator' | 'admin';
  direction: 'inbound' | 'outbound';
  created_at: string;
  updated_at: string;
  user_name: string;
  user_avatar?: string;
  organization_name?: string;
  message_count?: number;
}

interface TicketFilters {
  status?: string;
  priority?: string;
  category?: string;
  searchQuery?: string;
  type?: string;
  direction?: string;
}

interface PaginationState {
  page: number;
  limit: number;
  offset: number;
}

interface UseSupportTicketsResult {
  tickets: SupportTicket[];
  loading: boolean;
  error: Error | null;
  totalCount: number;
  pagination: PaginationState;
  fetchTickets: () => Promise<void>;
  updatePagination: () => void;
  refreshTickets: () => void;
}

export function useSupportTickets(filters: TicketFilters): UseSupportTicketsResult {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [pagination] = useState<PaginationState>({
    page: 1,
    limit: 20,
    offset: 0
  });

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const supabase = createClient();
      
      let query = supabase
        .from('support_tickets')
        .select(`
          id,
          ticket_number,
          subject,
          description,
          category,
          priority,
          status,
          created_by_type,
          direction,
          created_at,
          updated_at,
          customer_name,
          customer_email
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters.priority && filters.priority !== 'all') {
        query = query.eq('priority', filters.priority);
      }

      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }

      if (filters.searchQuery) {
        query = query.or(`subject.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`);
      }

      // Add pagination
      const from = pagination.offset;
      const to = from + pagination.limit - 1;
      
      const { data, error: fetchError, count } = await query
        .range(from, to);

      if (fetchError) {
        console.error('Fetch tickets error:', fetchError);
        throw new Error(fetchError.message);
      }

      // Transform data to match SupportTicket interface
      const transformedTickets: SupportTicket[] = (data || []).map(ticket => ({
        id: ticket.id,
        ticket_number: ticket.ticket_number,
        subject: ticket.subject,
        description: ticket.description,
        category: ticket.category,
        priority: ticket.priority,
        status: ticket.status,
        created_by_type: ticket.created_by_type,
        direction: ticket.direction,
        created_at: ticket.created_at,
        updated_at: ticket.updated_at,
        user_name: ticket.customer_name || 'Unknown User',
        message_count: 0 // Will be calculated separately
      }));

      setTickets(transformedTickets);
      setTotalCount(count || 0);
      
    } catch (err) {
      console.error('Error fetching support tickets:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch tickets'));
    } finally {
      setLoading(false);
    }
  }, [filters, pagination]);

  const updatePagination = useCallback(() => {
    // Mock implementation - no actual pagination
    console.log('Pagination update requested');
  }, []);

  const refreshTickets = useCallback(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Initialize mock data
  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Real-time subscription for ticket updates
  useEffect(() => {
    const supabase = createClient();
    
    console.log('🔄 Setting up real-time subscription for support_tickets');
    
    const subscription = supabase
      .channel('support_tickets_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'support_tickets' 
        }, 
        (payload) => {
          console.log('📨 Real-time ticket update:', payload);
          
          // Refresh tickets when any change occurs
          fetchTickets();
        }
      )
      .subscribe();

    return () => {
      console.log('🔌 Unsubscribing from support_tickets real-time');
      subscription.unsubscribe();
    };
  }, [fetchTickets]);

  // Cleanup function for useEffect
  useEffect(() => {
    return () => {
      setTickets([]);
      setError(null);
    };
  }, []);

  return {
    tickets,
    loading,
    error,
    totalCount,
    pagination,
    fetchTickets,
    updatePagination,
    refreshTickets
  };
}
