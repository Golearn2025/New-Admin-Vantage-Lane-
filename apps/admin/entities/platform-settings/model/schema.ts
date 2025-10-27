/**
 * Platform Settings Entity - Zod Schemas
 */

import { z } from 'zod';

export const CommissionRatesSchema = z.object({
  platform_commission_pct: z.number().min(0).max(100),
  default_operator_commission_pct: z.number().min(0).max(100),
});

export const UpdateCommissionRatesSchema = z.object({
  platformCommissionPct: z.number().min(0).max(100),
  defaultOperatorCommissionPct: z.number().min(0).max(100),
  updatedBy: z.string().uuid(),
});
