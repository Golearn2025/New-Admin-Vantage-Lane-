/**
 * Review Entity Types
 * 
 * TypeScript types for bidirectional rating system.
 * Zero any types, complete type safety.
 */

import { z } from 'zod';

// Base review types
export interface DriverReview {
  id: string;
  driverId: string;
  customerId: string;
  bookingId: string;
  rating: number; // 1-5
  reviewText: string | null;
  categories: RatingCategories | null;
  isAnonymous: boolean;
  isVerified: boolean;
  createdAt: string;
  
  // Populated fields
  driverName?: string;
  customerName?: string;
  bookingNumber?: string;
}

export interface CustomerReview {
  id: string;
  customerId: string;
  driverId: string;
  bookingId: string;
  rating: number; // 1-5
  reviewText: string | null;
  createdAt: string;
  
  // Populated fields
  customerName?: string;
  driverName?: string;
}

export interface RatingCategories {
  punctuality?: number; // 1-5
  cleanliness?: number; // 1-5
  communication?: number; // 1-5
  drivingSkill?: number; // 1-5
  professionalism?: number; // 1-5
}

export interface FeedbackTemplate {
  id: string;
  templateType: 'driver_to_client' | 'client_to_driver' | 'safety_report';
  rating: number;
  title: string;
  description: string | null;
  isPositive: boolean;
  sortOrder: number;
  isActive: boolean;
}

export interface SafetyIncident {
  id: string;
  reportedById: string;
  reportedByType: 'driver' | 'customer' | 'admin';
  reportedAgainstId: string;
  reportedAgainstType: 'driver' | 'customer';
  bookingId: string | null;
  incidentType: string;
  severityLevel: 1 | 2 | 3 | 4;
  description: string | null;
  adminInvestigationStatus: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  adminNotes: string | null;
  penaltyApplied: boolean;
  penaltyType: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RatingBreakdown {
  fiveStars: number;
  fourStars: number;
  threeStars: number;
  twoStars: number;
  oneStar: number;
  totalRatings: number;
  averageRating: number;
}
