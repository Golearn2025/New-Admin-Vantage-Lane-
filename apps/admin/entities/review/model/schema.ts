/**
 * Review Entity Schemas
 * 
 * Zod validation schemas for runtime type checking.
 * Centralized validation logic.
 */

import { z } from 'zod';

export const RatingCategoriesSchema = z.object({
  punctuality: z.number().int().min(1).max(5).optional(),
  cleanliness: z.number().int().min(1).max(5).optional(),
  communication: z.number().int().min(1).max(5).optional(),
  drivingSkill: z.number().int().min(1).max(5).optional(),
  professionalism: z.number().int().min(1).max(5).optional(),
});

export const DriverReviewSchema = z.object({
  id: z.string().uuid(),
  driverId: z.string().uuid(),
  customerId: z.string().uuid(),
  bookingId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  reviewText: z.string().nullable(),
  categories: RatingCategoriesSchema.nullable(),
  isAnonymous: z.boolean(),
  isVerified: z.boolean(),
  createdAt: z.string(),
});

export const FeedbackTemplateSchema = z.object({
  id: z.string().uuid(),
  templateType: z.enum(['driver_to_client', 'client_to_driver', 'safety_report']),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(1).max(100),
  description: z.string().nullable(),
  isPositive: z.boolean(),
  sortOrder: z.number().int(),
  isActive: z.boolean(),
});

export const SafetyIncidentSchema = z.object({
  id: z.string().uuid(),
  reportedById: z.string().uuid(),
  reportedByType: z.enum(['driver', 'customer', 'admin']),
  reportedAgainstId: z.string().uuid(),
  reportedAgainstType: z.enum(['driver', 'customer']),
  bookingId: z.string().uuid().nullable(),
  incidentType: z.string().min(1),
  severityLevel: z.number().int().min(1).max(4),
  description: z.string().nullable(),
  adminInvestigationStatus: z.enum(['pending', 'investigating', 'resolved', 'dismissed']),
  adminNotes: z.string().nullable(),
  penaltyApplied: z.boolean(),
  penaltyType: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
