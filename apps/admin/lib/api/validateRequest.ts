/**
 * API Request Validation Helper
 * Validates incoming API requests using Zod schemas
 * Ver 3.4 - Add Zod validation to all API routes
 */

import { z } from 'zod';
import type { NextRequest } from 'next/server';

/**
 * Validation result interface
 */
export interface ValidationResult<T> {
  success: true;
  data: T;
  error?: never;
}

export interface ValidationError {
  success: false;
  data?: never;
  error: {
    message: string;
    issues: z.ZodIssue[];
  };
}

export type ValidatedData<T> = ValidationResult<T> | ValidationError;

/**
 * Validates request body against Zod schema
 * @param request - Next.js request object
 * @param schema - Zod schema to validate against
 * @returns Validated data or error
 */
export async function validateRequest<T>(
  request: Request | NextRequest,
  schema: z.ZodSchema<T>
): Promise<ValidatedData<T>> {
  try {
    // Parse request body
    const body = await request.json();

    // Validate with Zod schema
    const result = schema.safeParse(body);

    if (!result.success) {
      return {
        success: false,
        error: {
          message: 'Validation failed',
          issues: result.error.issues,
        },
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    // Handle JSON parse errors
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Invalid JSON',
        issues: [],
      },
    };
  }
}

/**
 * Validates URL search params against Zod schema
 * @param request - Next.js request object
 * @param schema - Zod schema to validate against
 * @returns Validated data or error
 */
export function validateSearchParams<T>(
  request: Request | NextRequest,
  schema: z.ZodSchema<T>
): ValidatedData<T> {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());

    // Validate with Zod schema
    const result = schema.safeParse(params);

    if (!result.success) {
      return {
        success: false,
        error: {
          message: 'Validation failed',
          issues: result.error.issues,
        },
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Invalid search params',
        issues: [],
      },
    };
  }
}
