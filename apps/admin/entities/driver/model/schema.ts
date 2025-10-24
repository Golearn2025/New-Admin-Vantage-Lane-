/**
 * Driver Entity - Zod Schemas
 * 
 * Type-safe validation schemas
 */

import { z } from 'zod';

export const DriverSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  phone: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
});

export type Driver = z.infer<typeof DriverSchema>;
