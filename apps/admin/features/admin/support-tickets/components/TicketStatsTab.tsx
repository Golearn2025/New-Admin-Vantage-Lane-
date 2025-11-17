/**
 * Ticket Stats Tab
 * Real-time statistics and analytics from Supabase
 */

'use client';

import React, { useMemo } from 'react';
import { Card } from '@vantage-lane/ui-core';
import { BarChart3, TrendingUp, Clock, Users, Loader2 } from 'lucide-react';
import { useTicketStats } from '../hooks/useTicketStats';
import styles from './TicketStatsTab.module.css';

export function TicketStatsTab() {
  const { stats, loading, error } = useTicketStats();

  const formattedStats = useMemo(() => {
    if (!stats) return [];
    
    const formatChange = (change: number): string => {
      const sign = change >= 0 ? '+' : '';
      return `${sign}${Math.round(change)}%`;
    };

    const formatResponseTime = (hours: number): string => {
      if (hours < 1) {
        return `${Math.round(hours * 60)}m`;
      }
      return `${hours}h`;
    };

    return [
      {
        title: 'Total Tickets',
        value: stats.totalTickets.toString(),
        icon: BarChart3,
        change: formatChange(stats.totalTicketsChange),
        positive: stats.totalTicketsChange >= 0
      },
      {
        title: 'Open Tickets',
        value: stats.openTickets.toString(),
        icon: Clock,
        change: formatChange(stats.openTicketsChange),
        positive: stats.openTicketsChange <= 0 // Fewer open tickets is positive
      },
      {
        title: 'Avg Response Time',
        value: formatResponseTime(stats.avgResponseTimeHours),
        icon: TrendingUp,
        change: formatChange(stats.avgResponseTimeChange),
        positive: stats.avgResponseTimeChange <= 0 // Lower response time is positive
      },
      {
        title: 'Active Users',
        value: stats.activeUsers.toString(),
        icon: Users,
        change: formatChange(stats.activeUsersChange),
        positive: stats.activeUsersChange >= 0
      }
    ];
  }, [stats]);

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <Clock size={24} />
          <p>Failed to load statistics</p>
          <small>{error.message}</small>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.statsGrid}>
        {loading ? (
          <div className={styles.loading}>
            <Loader2 size={24} className={styles.spinner} />
            <p>Loading statistics...</p>
          </div>
        ) : (
          formattedStats.map((stat) => (
            <Card key={stat.title}>
              <div className={styles.statCard}>
                <div className={styles.statHeader}>
                  <stat.icon size={20} />
                  <span className={styles.statTitle}>{stat.title}</span>
                </div>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={`${styles.statChange} ${stat.positive ? styles.positive : styles.negative}`}>
                  {stat.change}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <div className={styles.placeholder}>
        <BarChart3 size={48} />
        <h3>Detailed Analytics</h3>
        <p>Charts and insights coming soon</p>
      </div>
    </div>
  );
}
