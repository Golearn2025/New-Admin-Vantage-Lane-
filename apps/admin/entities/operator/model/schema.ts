/**
 * Operator Entity - Zod Schemas
 * 
 * Type-safe validation schemas
 */

import { z } from 'zod';

export const OperatorSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  // Add your fields here
});

export type Operator = z.infer<typeof OperatorSchema>;
