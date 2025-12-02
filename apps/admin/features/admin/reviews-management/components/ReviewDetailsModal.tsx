/**
 * Review Details Modal
 * 
 * Modal pentru afișarea completă a review-urilor cu toate detaliile.
 * UI-Core Modal cu RatingDisplay și badges.
 */

'use client';

import React, { useMemo } from 'react';
import { 
  Modal,
  RatingDisplay,
  Badge,
  Button
} from '@vantage-lane/ui-core';
import { Calendar, User, MapPin, MessageSquare, Shield } from 'lucide-react';
import type { DriverReview } from '@entities/review';
import styles from './ReviewDetailsModal.module.css';

export interface ReviewDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: DriverReview | null;
}

export function ReviewDetailsModal({
  isOpen,
  onClose,
  review
}: ReviewDetailsModalProps) {
  const handleClose = () => {
    onClose();
  };

  // Memoize category items to prevent re-creation on every render  
  const categoryItems = useMemo(() => 
    review?.categories ? Object.entries(review.categories).map(([category, rating]) => (
      <div key={category} className={styles.categoryItem}>
        <span className={styles.categoryName}>
          {category.replace(/([A-Z])/g, ' $1').trim()}
        </span>
        <RatingDisplay rating={rating as number} size="sm" />
      </div>
    )) : [],
    [review?.categories]
  );

  if (!review) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Review Details"
      size="lg"
      closeOnOverlayClick={true}
      closeOnEscape={true}
    >
      <div className={styles.reviewDetails}>
        {/* Header cu rating */}
        <div className={styles.reviewHeader}>
          <div className={styles.ratingSection}>
            <RatingDisplay
              rating={review.rating}
              size="lg"
              showStars={true}
            />
            <span className={styles.ratingText}>
              {review.rating}/5 stars
            </span>
          </div>
          
          <div className={styles.statusBadge}>
            <Badge 
              color={review.isVerified ? 'success' : 'warning'} 
              variant="solid"
            >
              {review.isVerified ? 'Verified' : 'Unverified'}
            </Badge>
          </div>
        </div>

        {/* Participants info */}
        <div className={styles.participants}>
          <div className={styles.participant}>
            <User size={16} />
            <div className={styles.participantInfo}>
              <span className={styles.participantLabel}>Driver</span>
              <span className={styles.participantName}>{review.driverName}</span>
            </div>
          </div>
          
          <div className={styles.participant}>
            <User size={16} />
            <div className={styles.participantInfo}>
              <span className={styles.participantLabel}>Customer</span>
              <span className={styles.participantName}>{review.customerName}</span>
            </div>
          </div>

          {review.bookingNumber && (
            <div className={styles.participant}>
              <MapPin size={16} />
              <div className={styles.participantInfo}>
                <span className={styles.participantLabel}>Booking</span>
                <span className={styles.participantName}>{review.bookingNumber}</span>
              </div>
            </div>
          )}

          <div className={styles.participant}>
            <Calendar size={16} />
            <div className={styles.participantInfo}>
              <span className={styles.participantLabel}>Date</span>
              <span className={styles.participantName}>{formatDate(review.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Review text */}
        {review.reviewText && (
          <div className={styles.reviewTextSection}>
            <div className={styles.sectionHeader}>
              <MessageSquare size={16} />
              <span>Review Message</span>
            </div>
            <div className={styles.reviewText}>
              {review.reviewText}
            </div>
          </div>
        )}

        {/* Categories breakdown if available */}
        {review.categories && (
          <div className={styles.categoriesSection}>
            <div className={styles.sectionHeader}>
              <span>Rating Categories</span>
            </div>
            <div className={styles.categoriesGrid}>
              {categoryItems}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className={styles.actions}>
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
          
          <Button
            variant={review.isVerified ? 'outline' : 'primary'}
          >
            {review.isVerified ? 'Unverify Review' : 'Verify Review'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

ReviewDetailsModal.displayName = 'ReviewDetailsModal';
