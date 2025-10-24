/**
 * Operator Entity - Zod Schema
 * 
 * Operators are organizations with org_type = 'operator'
 */

import { z } from 'zod';

export const OperatorSchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  name: z.string(),
  contactEmail: z.string().email().nullable(),
  contactPhone: z.string().nullable(),
  city: z.string().nullable(),
  isActive: z.boolean(),
  ratingAverage: z.number().nullable(),
  createdAt: z.string(),
});

export type Operator = z.infer<typeof OperatorSchema>;
