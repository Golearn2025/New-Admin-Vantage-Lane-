/**
 * Admin Entity - Zod Schemas
 * 
 * Type-safe validation schemas
 */

import { z } from 'zod';

export const AdminSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  // Add your fields here
});

export type Admin = z.infer<typeof AdminSchema>;
