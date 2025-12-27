/**
 * Live Drivers Map Page - Main Orchestrator Component
 * 
 * Real-time map view of all online drivers with their current locations
 */

'use client';

import type { DriverLocationData, MapFilters } from '@entities/driver-location';
import { Badge, Button, Card } from '@vantage-lane/ui-core';
import { Activity, Car, CheckCircle, Clock, MapPin, RefreshCw } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useRealtimeDrivers } from '../hooks/useRealtimeDrivers';
import { DriverDetailsModal } from './DriverDetailsModal';
import { DriverInfoPanel } from './DriverInfoPanel';
import styles from './LiveDriversMapPage.module.css';
import { MapControls } from './MapControls';

export function LiveDriversMapPage() {
  // State management
  const [filters, setFilters] = useState<MapFilters>({
    showOnline: true,
    showBusy: true,
  });
  const [selectedDriver, setSelectedDriver] = useState<DriverLocationData | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch online drivers with filters
  const { 
    drivers, 
    loading, 
    error,
    isConnected,
    lastUpdate: lastUpdated
  } = useRealtimeDrivers(filters);

  // Manual refresh for realtime (will refetch initial data)
  const handleManualRefresh = () => {
    window.location.reload(); // Simple approach for now
  };

  // Event handlers
  const handleDriverClick = useCallback((driver: DriverLocationData) => {
    setSelectedDriver(driver);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedDriver(null);
  }, []);

  const handleFiltersChange = useCallback((newFilters: Partial<MapFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const handleRefreshToggle = useCallback(() => {
    setAutoRefresh(prev => !prev);
  }, []);

  // Calculate stats from realtime drivers
  const onlineCount = drivers.filter(d => d.onlineStatus === 'online').length;
  const busyCount = drivers.filter(d => d.onlineStatus === 'busy').length;  
  const totalCount = drivers.length;

  return (
    <div className={styles.premiumMapPage}>
      {/* Premium Header with Proper Spacing */}
      <div className={styles.premiumHeader}>
        <div className={styles.headerMain}>
          <div className={styles.titleSection}>
            <div className={styles.iconWrapper}>
              <MapPin className={styles.pageIcon} size={28} />
            </div>
            <div className={styles.titleContent}>
              <h1 className={styles.premiumTitle}>Live Drivers Map - DEBUG VERSION</h1>
              <p className={styles.premiumSubtitle}>Real-time driver locations and status tracking</p>
            </div>
          </div>
          
          <div className={styles.headerActions}>
            {/* Realtime Status Indicator */}
            <Badge 
              variant={isConnected ? 'solid' : 'outline'} 
              color={isConnected ? 'success' : 'neutral'}
              size="sm"
            >
              {isConnected ? '🔴 LIVE' : '⚫ Offline'}
            </Badge>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleManualRefresh}
              disabled={loading}
              className={styles.refreshButton}
            >
              <RefreshCw size={16} className={loading ? 'spin' : ''} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Premium Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.online}`}>
            <div className={styles.statIcon}>
              <CheckCircle size={20} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{onlineCount}</div>
              <div className={styles.statLabel}>Online</div>
            </div>
          </div>
          
          <div className={`${styles.statCard} ${styles.busy}`}>
            <div className={styles.statIcon}>
              <Car size={20} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{busyCount}</div>
              <div className={styles.statLabel}>Busy</div>
            </div>
          </div>
          
          <div className={`${styles.statCard} ${styles.total}`}>
            <div className={styles.statIcon}>
              <Activity size={20} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{totalCount}</div>
              <div className={styles.statLabel}>Total Active</div>
            </div>
          </div>
          
          {lastUpdated && (
            <div className={`${styles.statCard} ${styles.lastUpdated}`}>
              <div className={styles.statIcon}>
                <Clock size={20} />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>
                  {lastUpdated.toLocaleTimeString('en-GB', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </div>
                <div className={styles.statLabel}>Last Update</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Premium Map Layout - Mobile Responsive */}
      <div className={styles.premiumMapLayout}>
        {/* Main Map Container - Dark Theme */}
        <div className={styles.mapSection}>
          <Card className={styles.premiumMapCard}>
            <div className={styles.mapHeader}>
              <h3 className={styles.mapTitle}>Driver Locations</h3>
              <div className={styles.mapControlsMini}>
                <MapControls
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  autoRefresh={autoRefresh}
                  onRefreshToggle={handleRefreshToggle}
                  onManualRefresh={handleManualRefresh}
                  loading={loading}
                  compact={true}
                />
              </div>
            </div>
            <div className={styles.darkMapContainer}>
              <DriversMapView
                drivers={drivers}
                loading={loading}
                error={error}
                onDriverClick={handleDriverClick}
                darkMode={true}
              />
            </div>
          </Card>
        </div>

        {/* Side Panel - Collapsible on Mobile */}
        <div className={styles.infoSection}>
          <Card className={styles.premiumInfoCard}>
            <div className={styles.infoHeader}>
              <h3 className={styles.infoTitle}>Active Drivers</h3>
              <Badge variant="outline" className={styles.driverCountBadge}>
                {drivers.length} visible
              </Badge>
            </div>
            <div className={styles.infoContent}>
              <DriverInfoPanel
                drivers={drivers}
                loading={loading}
                onDriverClick={handleDriverClick}
                selectedDriverId={selectedDriver?.id || null}
              />
            </div>
          </Card>
        </div>
      </div>

      {/* Driver Details Modal */}
      {selectedDriver && (
        <DriverDetailsModal
          driver={selectedDriver}
          isOpen={!!selectedDriver}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
