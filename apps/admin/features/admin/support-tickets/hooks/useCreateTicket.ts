/**
 * Create Ticket Hook - REAL Supabase Integration
 */

import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

interface CreateTicketData {
  targetUserId: string;
  targetUserType: 'driver' | 'operator' | 'customer';
  subject: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface UseCreateTicketResult {
  createTicket: (data: CreateTicketData) => Promise<void>;
  loading: boolean;
  error: Error | null;
}

export function useCreateTicket(): UseCreateTicketResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createTicket = useCallback(async (data: CreateTicketData): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const supabase = createClient();
      
      // Generate ticket number (format: TKT-YYYY-NNNN)
      const now = new Date();
      const year = now.getFullYear();
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const ticketNumber = `TKT-${year}-${randomNum.toString().padStart(4, '0')}`;
      
      // Get current admin user (created_by_user_id)
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('Authentication required');
      }
      
      // Insert support ticket
      const { data: ticketData, error: insertError } = await supabase
        .from('support_tickets')
        .insert({
          ticket_number: ticketNumber,
          subject: data.subject,
          description: data.description,
          category: data.category,
          priority: data.priority,
          status: 'open',
          created_by_type: 'admin',
          direction: 'outbound', // Admin creating ticket for user
          created_by_id: user.id,
          target_user_id: data.targetUserId,
          customer_name: `${data.targetUserType} User`, // Will be updated with real name
          created_at: now.toISOString(),
          updated_at: now.toISOString()
        })
        .select('id')
        .single();

      if (insertError) {
        console.error('Insert ticket error:', insertError);
        throw new Error(insertError.message);
      }

      if (!ticketData) {
        throw new Error('Failed to create ticket');
      }

      // Create initial message
      const { error: messageError } = await supabase
        .from('support_ticket_messages')
        .insert({
          ticket_id: ticketData.id,
          sender_id: user.id,
          sender_type: 'admin',
          message: data.description,
          is_internal: false,
          created_at: now.toISOString(),
          updated_at: now.toISOString()
        });

      if (messageError) {
        console.error('Insert message error:', messageError);
        // Don't throw here as ticket was created successfully
      }

      console.log(' Ticket created successfully:', ticketNumber);
      
    } catch (err) {
      console.error('Create ticket error:', err);
      setError(err instanceof Error ? err : new Error('Failed to create ticket'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createTicket,
    loading,
    error
  };
}
