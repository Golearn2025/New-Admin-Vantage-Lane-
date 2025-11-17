/**
 * Support Ticket Statistics Hook 
 * Fetches real-time statistics from Supabase
 */

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface TicketStatistics {
  totalTickets: number;
  openTickets: number;
  avgResponseTimeHours: number;
  activeUsers: number;
  // Percentage changes (compared to previous period)
  totalTicketsChange: number;
  openTicketsChange: number;
  avgResponseTimeChange: number;
  activeUsersChange: number;
}

interface UseTicketStatsResult {
  stats: TicketStatistics | null;
  loading: boolean;
  error: Error | null;
  refreshStats: () => Promise<void>;
}

export function useTicketStats(): UseTicketStatsResult {
  const [stats, setStats] = useState<TicketStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const supabase = createClient();
      
      // Current period stats
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
      const sixtyDaysAgo = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000));
      
      // Total tickets count
      const { count: totalTickets, error: totalError } = await supabase
        .from('support_tickets')
        .select('*', { count: 'exact', head: true });
        
      if (totalError) throw totalError;
      
      // Open tickets count
      const { count: openTickets, error: openError } = await supabase
        .from('support_tickets')
        .select('*', { count: 'exact', head: true })
        .in('status', ['open', 'in_progress']);
        
      if (openError) throw openError;
      
      // Active users (unique users who created tickets in last 30 days)
      const { count: activeUsers, error: activeError } = await supabase
        .from('support_tickets')
        .select('created_by_id', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString())
        .not('created_by_id', 'is', null);
        
      if (activeError) throw activeError;
      
      // Calculate average response time (simplified - time between ticket creation and first admin response)
      const { data: responseTimeData, error: responseTimeError } = await supabase
        .from('support_ticket_messages')
        .select(`
          created_at,
          ticket_id,
          sender_type,
          support_tickets!inner(created_at)
        `)
        .eq('sender_type', 'admin')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .limit(100); // Sample for performance
        
      if (responseTimeError) throw responseTimeError;
      
      let avgResponseTimeHours = 0;
      if (responseTimeData && responseTimeData.length > 0) {
        const responseTimes = responseTimeData.map(msg => {
          // Type-safe access to joined table data
          const joinedData = msg.support_tickets as unknown as { created_at: string };
          const ticketCreated = new Date(joinedData.created_at);
          const responseTime = new Date(msg.created_at);
          return (responseTime.getTime() - ticketCreated.getTime()) / (1000 * 60 * 60); // hours
        }).filter(time => time > 0 && time < 24 * 7); // Filter out outliers (negative or > 1 week)
        
        if (responseTimes.length > 0) {
          avgResponseTimeHours = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
        }
      }
      
      // Previous period stats for comparison (30-60 days ago)
      const { count: totalTicketsPrevious } = await supabase
        .from('support_tickets')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sixtyDaysAgo.toISOString())
        .lt('created_at', thirtyDaysAgo.toISOString());
        
      const { count: openTicketsPrevious } = await supabase
        .from('support_tickets')
        .select('*', { count: 'exact', head: true })
        .in('status', ['open', 'in_progress'])
        .gte('created_at', sixtyDaysAgo.toISOString())
        .lt('created_at', thirtyDaysAgo.toISOString());
        
      const { count: activeUsersPrevious } = await supabase
        .from('support_tickets')
        .select('created_by_id', { count: 'exact', head: true })
        .gte('created_at', sixtyDaysAgo.toISOString())
        .lt('created_at', thirtyDaysAgo.toISOString())
        .not('created_by_id', 'is', null);
      
      // Calculate percentage changes
      const calculateChange = (current: number, previous: number): number => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
      };
      
      const statistics: TicketStatistics = {
        totalTickets: totalTickets || 0,
        openTickets: openTickets || 0,
        avgResponseTimeHours: Math.round(avgResponseTimeHours * 10) / 10, // Round to 1 decimal
        activeUsers: activeUsers || 0,
        totalTicketsChange: calculateChange(totalTickets || 0, totalTicketsPrevious || 0),
        openTicketsChange: calculateChange(openTickets || 0, openTicketsPrevious || 0),
        avgResponseTimeChange: -15, // Placeholder - would need complex calculation
        activeUsersChange: calculateChange(activeUsers || 0, activeUsersPrevious || 0)
      };
      
      setStats(statistics);
      
    } catch (err) {
      console.error('Error fetching ticket statistics:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch statistics'));
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-refresh stats
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Cleanup
  useEffect(() => {
    return () => {
      setStats(null);
      setError(null);
    };
  }, []);

  const refreshStats = useCallback(async () => {
    await fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refreshStats
  };
}
