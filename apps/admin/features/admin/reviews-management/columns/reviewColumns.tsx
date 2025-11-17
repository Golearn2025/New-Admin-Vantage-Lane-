/**
 * Review Columns - EnterpriseDataTable Configuration  
 * 
 * Centralized column definitions pentru reviews management.
 * 100% reusable, zero inline logic.
 */

'use client';

import React from 'react';
import { 
  RatingDisplay, 
  SafetyBadge, 
  Badge,
  Avatar
} from '@vantage-lane/ui-core';
import { formatInvestigationStatus } from '@entities/review';
import type { DriverReview, SafetyIncident } from '@entities/review';
import type { Column } from '@vantage-lane/ui-core';

// Driver Reviews Table Columns
export const driverReviewColumns: Column<DriverReview>[] = [
  {
    id: 'driver',
    header: 'Driver',
    accessor: (row) => row.driverName || 'Unknown',
    cell: (row) => (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 'var(--spacing-2)' 
      }}>
        <Avatar
          size="sm"
          name={row.driverName || 'Driver'}
        />
        <div>
          <div style={{ 
            fontWeight: 'var(--font-medium)',
            color: 'var(--color-text-primary)'
          }}>
            {row.driverName || 'Unknown Driver'}
          </div>
          <div style={{ 
            fontSize: 'var(--font-xs)',
            color: 'var(--color-text-tertiary)'
          }}>
            ID: {row.driverId}
          </div>
        </div>
      </div>
    ),
    sortable: true,
    width: '200px',
  },
  {
    id: 'customer',
    header: 'Customer',
    accessor: (row) => row.customerName || 'Unknown',
    cell: (row) => (
      <div>
        <div style={{ 
          fontWeight: 'var(--font-medium)',
          color: 'var(--color-text-primary)'
        }}>
          {row.customerName || 'Unknown Customer'}
        </div>
        <div style={{ 
          fontSize: 'var(--font-xs)',
          color: 'var(--color-text-tertiary)'
        }}>
          ID: {row.customerId}
        </div>
      </div>
    ),
    sortable: true,
    width: '180px',
  },
  {
    id: 'rating',
    header: 'Rating',
    accessor: (row) => row.rating,
    cell: (row) => (
      <RatingDisplay
        rating={row.rating}
        size="sm"
        showCount={false}
      />
    ),
    sortable: true,
    width: '120px',
  },
  {
    id: 'booking',
    header: 'Booking',
    accessor: (row) => row.bookingId,
    cell: (row) => (
      <div>
        <div style={{ 
          fontWeight: 'var(--font-medium)',
          color: 'var(--color-text-primary)'
        }}>
          #{row.bookingNumber || row.bookingId}
        </div>
        <div style={{ 
          fontSize: 'var(--font-xs)',
          color: 'var(--color-text-tertiary)'
        }}>
          {new Date(row.createdAt).toLocaleDateString()}
        </div>
      </div>
    ),
    sortable: true,
    width: '140px',
  },
  {
    id: 'review',
    header: 'Review Text',
    accessor: (row) => row.reviewText || '',
    cell: (row) => (
      <div style={{ 
        maxWidth: '280px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        color: 'var(--color-text-secondary)'
      }}>
        {row.reviewText || (
          <span style={{ 
            fontStyle: 'italic',
            color: 'var(--color-text-tertiary)'
          }}>
            No comment
          </span>
        )}
      </div>
    ),
    sortable: false,
    width: '300px',
  },
  {
    id: 'verified',
    header: 'Status',
    accessor: (row) => row.isVerified ? 'verified' : 'pending',
    cell: (row) => (
      <Badge
        color={row.isVerified ? 'success' : 'warning'}
        variant="soft"
        size="sm"
      >
        {row.isVerified ? 'Verified' : 'Pending'}
      </Badge>
    ),
    sortable: true,
    width: '100px',
  },
];

// Safety Incidents Table Columns
export const safetyIncidentColumns: Column<SafetyIncident>[] = [
  {
    id: 'reportedBy',
    header: 'Reported By',
    accessor: (row) => row.reportedByType,
    cell: (row) => (
      <div>
        <div style={{ 
          fontWeight: 'var(--font-medium)',
          color: 'var(--color-text-primary)',
          textTransform: 'capitalize'
        }}>
          {row.reportedByType}
        </div>
        <div style={{ 
          fontSize: 'var(--font-xs)',
          color: 'var(--color-text-tertiary)'
        }}>
          {new Date(row.createdAt).toLocaleDateString()}
        </div>
      </div>
    ),
    sortable: true,
    width: '150px',
  },
  {
    id: 'incidentType',
    header: 'Type',
    accessor: (row) => row.incidentType,
    cell: (row) => (
      <div style={{ 
        fontWeight: 'var(--font-medium)',
        color: 'var(--color-text-primary)'
      }}>
        {row.incidentType}
      </div>
    ),
    sortable: true,
    width: '180px',
  },
  {
    id: 'severity',
    header: 'Severity',
    accessor: (row) => row.severityLevel,
    cell: (row) => (
      <SafetyBadge
        severity={row.severityLevel}
      />
    ),
    sortable: true,
    width: '120px',
  },
  {
    id: 'status',
    header: 'Investigation Status',
    accessor: (row) => row.adminInvestigationStatus,
    cell: (row) => (
      <SafetyBadge
        status={row.adminInvestigationStatus}
      />
    ),
    sortable: true,
    width: '160px',
  },
  {
    id: 'description',
    header: 'Description',
    accessor: (row) => row.description || '',
    cell: (row) => (
      <div style={{ 
        maxWidth: '230px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        color: 'var(--color-text-secondary)'
      }}>
        {row.description || (
          <span style={{ 
            fontStyle: 'italic',
            color: 'var(--color-text-tertiary)'
          }}>
            No description
          </span>
        )}
      </div>
    ),
    sortable: false,
    width: '250px',
  },
  {
    id: 'penalty',
    header: 'Penalty',
    accessor: (row) => row.penaltyApplied ? 'applied' : 'none',
    cell: (row) => (
      <Badge
        color={row.penaltyApplied ? 'danger' : 'neutral'}
        variant="soft"
        size="sm"
      >
        {row.penaltyApplied ? 'Applied' : 'None'}
      </Badge>
    ),
    sortable: true,
    width: '100px',
  },
];
