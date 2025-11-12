/**
 * ProfileTab Component
 *
 * Driver profile information with edit capabilities
 */

import type { DocumentData, DriverProfileData } from '@entities/driver';
import { Avatar, Badge, Card } from '@vantage-lane/ui-core';
import { Award, Calendar, Mail, Phone, Star } from 'lucide-react';
import styles from '../driver-profile.module.css';

interface ProfileTabProps {
  driver: DriverProfileData;
  documents?: DocumentData[]; // License info comes from here
  onUpdate: () => void;
}

/**
 * Calculate days until license expiry
 */
function getDaysUntilExpiry(expiryDate: string): number {
  const expiry = new Date(expiryDate);
  const now = new Date();
  return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Format date for display
 */
function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Extract license document from documents array
 */
function getLicenseDocument(documents?: DocumentData[]): DocumentData | null {
  if (!documents) return null;
  return (
    documents.find((d) => d.documentType === 'license' || d.documentType === 'driving_licence') ||
    null
  );
}

export function ProfileTab({ driver, documents }: ProfileTabProps) {
  const licenseDoc = getLicenseDocument(documents);
  const licenseExpiring = licenseDoc?.expiryDate
    ? getDaysUntilExpiry(licenseDoc.expiryDate) <= 30
    : false;
  const pcoExpiring = driver.pcoLicenseExpiry
    ? getDaysUntilExpiry(driver.pcoLicenseExpiry) <= 30
    : false;

  return (
    <div className={styles.profileTab}>
      <Card>
        <div className={styles.profileHeader}>
          {driver.profileImageUrl ? (
            <Avatar
              src={driver.profileImageUrl}
              alt={`${driver.firstName} ${driver.lastName}`}
              size="xl"
            />
          ) : (
            <Avatar alt={`${driver.firstName} ${driver.lastName}`} size="xl" />
          )}
          <div className={styles.profileInfo}>
            <h2 className={styles.profileName}>
              {driver.firstName} {driver.lastName}
            </h2>
            <div className={styles.rating}>
              <Star size={16} fill="currentColor" />
              <span>{driver.ratingAverage.toFixed(1)}</span>
              <span className={styles.ratingCount}>({driver.ratingCount} reviews)</span>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className={styles.sectionTitle}>Contact Information</h3>
        <div className={styles.infoRow}>
          <div className={styles.infoLabel}>
            <Mail size={16} />
            <span>Email</span>
          </div>
          <span className={styles.value}>{driver.email}</span>
        </div>
        <div className={styles.infoRow}>
          <div className={styles.infoLabel}>
            <Phone size={16} />
            <span>Phone</span>
          </div>
          <span className={styles.value}>{driver.phone || '—'}</span>
        </div>
        <div className={styles.infoRow}>
          <div className={styles.infoLabel}>
            <Calendar size={16} />
            <span>Member Since</span>
          </div>
          <span className={styles.value}>{formatDate(driver.createdAt)}</span>
        </div>
      </Card>

      <Card>
        <h3 className={styles.sectionTitle}>License Information</h3>
        {licenseDoc ? (
          <div className={styles.infoRow}>
            <div className={styles.infoLabel}>
              <Award size={16} />
              <span>Driver License</span>
            </div>
            <div className={styles.licenseInfo}>
              <Badge color={licenseDoc.status === 'approved' ? 'success' : 'warning'} size="sm">
                {licenseDoc.status}
              </Badge>
              {licenseDoc.expiryDate && (
                <div className={styles.licenseExpiry}>
                  <span className={styles.expiryLabel}>Expires:</span>
                  <span className={styles.expiryDate}>{formatDate(licenseDoc.expiryDate)}</span>
                  {licenseExpiring && (
                    <Badge color="danger" size="sm">
                      Expiring Soon
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className={styles.noData}>No license document uploaded</p>
        )}
        {driver.pcoLicenseNumber && (
          <div className={styles.infoRow}>
            <div className={styles.infoLabel}>
              <Award size={16} />
              <span>PCO License</span>
            </div>
            <div className={styles.licenseInfo}>
              <span className={styles.value}>{driver.pcoLicenseNumber}</span>
              {driver.pcoLicenseExpiry && (
                <div className={styles.licenseExpiry}>
                  <span className={styles.expiryLabel}>Expires:</span>
                  <span className={styles.expiryDate}>{formatDate(driver.pcoLicenseExpiry)}</span>
                  {pcoExpiring && (
                    <Badge color="danger" size="sm">
                      Expiring Soon
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </Card>

      {driver.rejectionReason && (
        <Card>
          <h3 className={styles.sectionTitle}>Rejection Reason</h3>
          <p className={styles.rejectionReason}>{driver.rejectionReason}</p>
        </Card>
      )}
    </div>
  );
}
