/**
 * Driver Details Modal - Detailed driver information popup
 * 
 * Shows comprehensive driver info when marker is clicked
 */

'use client';

import { Modal, Avatar, Badge } from '@vantage-lane/ui-core';
import { User, MapPin, Clock, Building, Mail, Phone } from 'lucide-react';
import type { DriverLocationData } from '@entities/driver-location';

interface DriverDetailsModalProps {
  driver: DriverLocationData;
  isOpen: boolean;
  onClose: () => void;
}

export function DriverDetailsModal({ driver, isOpen, onClose }: DriverDetailsModalProps) {
  
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

  const formatCoordinates = (lat: number | null, lng: number | null) => {
    if (!lat || !lng) return 'Location not available';
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleString();
  };

  const getLocationAccuracy = (accuracy: number | null) => {
    if (!accuracy) return 'Unknown';
    if (accuracy < 10) return 'High (GPS)';
    if (accuracy < 50) return 'Medium';
    return 'Low';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Driver Details"
      size="md"
    >
      <div className="driver-details-content">
        {/* Driver Header */}
        <div className="driver-header">
          <Avatar
            src={driver.profilePhotoUrl || undefined}
            name={`${driver.firstName || ''} ${driver.lastName || ''}`}
            size="lg"
          />
          
          <div className="driver-info">
            <h3 className="driver-name">
              {driver.firstName} {driver.lastName}
            </h3>
            
            <div className="driver-status">
              <Badge
                variant={getStatusColor(driver.onlineStatus) as any}
                size="md"
              >
                {getStatusLabel(driver.onlineStatus)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Driver Details Grid */}
        <div className="details-grid">
          {/* Contact Information */}
          <div className="detail-section">
            <h4 className="section-title">Contact</h4>
            
            <div className="detail-row">
              <Mail size={16} />
              <span className="detail-label">Email:</span>
              <span className="detail-value">{driver.email}</span>
            </div>

            {/* Note: Phone might not be in DriverLocationData - check if available */}
          </div>

          {/* Organization */}
          <div className="detail-section">
            <h4 className="section-title">Organization</h4>
            
            <div className="detail-row">
              <Building size={16} />
              <span className="detail-label">Company:</span>
              <span className="detail-value">
                {driver.organizationName || 'Independent Driver'}
              </span>
            </div>
          </div>

          {/* Location Information */}
          <div className="detail-section">
            <h4 className="section-title">Current Location</h4>
            
            <div className="detail-row">
              <MapPin size={16} />
              <span className="detail-label">Coordinates:</span>
              <span className="detail-value">
                {formatCoordinates(driver.currentLatitude, driver.currentLongitude)}
              </span>
            </div>

            <div className="detail-row">
              <Clock size={16} />
              <span className="detail-label">Last Update:</span>
              <span className="detail-value">
                {formatTimestamp(driver.locationUpdatedAt)}
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-icon">📍</span>
              <span className="detail-label">Accuracy:</span>
              <span className="detail-value">
                {getLocationAccuracy(driver.locationAccuracy)}
                {driver.locationAccuracy && ` (±${driver.locationAccuracy}m)`}
              </span>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="detail-section">
            <h4 className="section-title">Activity</h4>
            
            <div className="detail-row">
              <span className="detail-icon">🟢</span>
              <span className="detail-label">Last Online:</span>
              <span className="detail-value">
                {formatTimestamp(driver.lastOnlineAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="modal-actions">
          <div className="quick-actions">
            <small className="actions-note">
              Location updates every 30 seconds when driver is online
            </small>
          </div>
        </div>
      </div>
    </Modal>
  );
}
