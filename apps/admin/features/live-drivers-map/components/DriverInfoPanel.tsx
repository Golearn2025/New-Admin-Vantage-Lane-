/**
 * Driver Info Panel - Side panel with driver list
 * 
 * Shows online drivers in a list with click to focus on map
 */

'use client';

import { Avatar, Badge, LoadingState } from '@vantage-lane/ui-core';
import { MapPin, Users, User, Clock } from 'lucide-react';
import type { DriverLocationData } from '@entities/driver-location';
import styles from './DriverInfoPanel.module.css';

interface DriverInfoPanelProps {
  drivers: DriverLocationData[];
  loading: boolean;
  onDriverClick: (driver: DriverLocationData) => void;
  selectedDriverId: string | null;
}

export function DriverInfoPanel({ 
  drivers, 
  loading, 
  onDriverClick, 
  selectedDriverId 
}: DriverInfoPanelProps) {
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'success';
      case 'busy': return 'primary'; 
      case 'break': return 'warning';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'online': return 'Available';
      case 'busy': return 'On Trip';
      case 'break': return 'On Break';
      default: return 'Offline';
    }
  };

  const formatLastUpdate = (timestamp: string | null) => {
    if (!timestamp) return 'No data';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading && drivers.length === 0) {
    return (
      <div className={styles.driverInfoPanel}>
        <div className={styles.panelHeader}>
          <h3>Online Drivers</h3>
        </div>
        <div className={styles.panelLoading}>
          <LoadingState message="Loading drivers..." />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.driverInfoPanel}>
      {/* Panel Header */}
      <div className={styles.panelHeader}>
        <h3>Active Drivers</h3>
        <Badge variant="outline" size="sm">
          {drivers.length} active
        </Badge>
      </div>

      {/* Drivers List */}
      <div className={styles.driversList}>
        {drivers.length === 0 ? (
          <div className={styles.panelEmpty}>
            <User size={48} className={styles.emptyIcon} />
            <p>No drivers online</p>
            <small>Drivers will appear here when they go online</small>
          </div>
        ) : (
          drivers.map((driver) => (
            <div
              key={driver.id}
              className={`${styles.driverCard} ${selectedDriverId === driver.id ? styles.selected : ''}`}
              onClick={() => onDriverClick(driver)}
            >
              {/* Driver Avatar & Basic Info */}
              <div className={styles.driverAvatar}>
                <Avatar
                  src={driver.profilePhotoUrl || undefined}
                  name={`${driver.firstName || ''} ${driver.lastName || ''}`}
                  size="md"
                />
                
                <div className={styles.driverInfo}>
                  <div className={styles.driverName}>
                    {driver.firstName} {driver.lastName}
                  </div>
                  <div className={styles.driverMeta}>
                    {driver.organizationName || 'Independent'}
                  </div>
                </div>

                <Badge
                  variant={getStatusColor(driver.onlineStatus) as any}
                  size="sm"
                >
                  {getStatusLabel(driver.onlineStatus)}
                </Badge>
              </div>

              {/* Location Info */}
              <div className={styles.driverMeta}>
                <div className={styles.driverMeta}>
                  <MapPin size={14} />
                  <span>
                    {driver.currentLatitude && driver.currentLongitude
                      ? `${driver.currentLatitude.toFixed(4)}, ${driver.currentLongitude.toFixed(4)}`
                      : 'Location unavailable'
                    }
                  </span>
                </div>
                
                <div className={styles.driverLastUpdate}>
                  <Clock size={14} />
                  <span>
                    {formatLastUpdate(driver.locationUpdatedAt)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Refresh Status */}
      {loading && drivers.length > 0 && (
        <div className={styles.panelEmpty}>
          <div className={styles.driverLastUpdate}>
            <div></div>
            Updating...
          </div>
        </div>
      )}
    </div>
  );
}
