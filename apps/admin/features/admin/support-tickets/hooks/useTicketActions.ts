/**
 * Support Ticket Actions Hook
 * Real Supabase operations for ticket management
 */

import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

interface UseTicketActionsResult {
  loading: boolean;
  error: Error | null;
  updateTicketStatus: (ticketId: string, status: string) => Promise<void>;
  addTicketMessage: (ticketId: string, message: string) => Promise<void>;
  deleteTicket: (ticketId: string) => Promise<void>;
}

export function useTicketActions(): UseTicketActionsResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateTicketStatus = useCallback(async (ticketId: string, status: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const supabase = createClient();
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('Not authenticated');
      }
      
      // Update ticket status
      const { error: updateError } = await supabase
        .from('support_tickets')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', ticketId);
        
      if (updateError) {
        throw new Error(updateError.message);
      }
      
      console.log('✅ Ticket status updated successfully:', { ticketId, status });
      
    } catch (err) {
      console.error('❌ Failed to update ticket status:', err);
      setError(err instanceof Error ? err : new Error('Failed to update status'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addTicketMessage = useCallback(async (ticketId: string, message: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const supabase = createClient();
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('Not authenticated');
      }
      
      // Insert new message
      const { error: insertError } = await supabase
        .from('support_ticket_messages')
        .insert({
          ticket_id: ticketId,
          sender_id: user.id,
          sender_type: 'admin',
          message: message.trim(),
          is_internal: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        
      if (insertError) {
        throw new Error(insertError.message);
      }
      
      // Update ticket updated_at timestamp
      const { error: updateError } = await supabase
        .from('support_tickets')
        .update({ 
          updated_at: new Date().toISOString()
        })
        .eq('id', ticketId);
        
      if (updateError) {
        console.warn('Failed to update ticket timestamp:', updateError);
      }
      
      console.log('✅ Message added successfully:', { ticketId, messageLength: message.length });
      
    } catch (err) {
      console.error('❌ Failed to add message:', err);
      setError(err instanceof Error ? err : new Error('Failed to add message'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTicket = useCallback(async (ticketId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const supabase = createClient();
      
      // First delete all messages associated with the ticket
      const { error: messagesError } = await supabase
        .from('support_ticket_messages')
        .delete()
        .eq('ticket_id', ticketId);
        
      if (messagesError) {
        console.warn('Failed to delete ticket messages:', messagesError);
        // Continue with ticket deletion even if messages deletion fails
      }
      
      // Delete the ticket
      const { error: deleteError } = await supabase
        .from('support_tickets')
        .delete()
        .eq('id', ticketId);
        
      if (deleteError) {
        throw new Error(deleteError.message);
      }
      
      console.log('✅ Ticket deleted successfully:', { ticketId });
      
    } catch (err) {
      console.error('❌ Failed to delete ticket:', err);
      setError(err instanceof Error ? err : new Error('Failed to delete ticket'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    updateTicketStatus,
    addTicketMessage,
    deleteTicket
  };
}
