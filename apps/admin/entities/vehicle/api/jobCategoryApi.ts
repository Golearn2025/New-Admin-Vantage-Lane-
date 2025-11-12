/**
 * Job Category API
 * Business logic for job categories and driver job types
 * Zero any types - TypeScript strict
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import type { JobCategory, DriverJobType } from '../types';

/**
 * List all job categories (uses RPC to bypass RLS)
 */
export async function listJobCategories(): Promise<JobCategory[]> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .rpc('admin_list_job_categories');
    
    if (error) {
      throw new Error(`Failed to fetch job categories: ${error.message}`);
    }
    
    return (data || []).map((cat: {
      id: string;
      name: string;
      description: string | null;
      price_multiplier: number;
      color: string;
      icon: string;
      is_active: boolean;
      created_at: string;
    }) => ({
      id: cat.id,
      name: cat.name,
      description: cat.description,
      priceMultiplier: cat.price_multiplier,
      color: cat.color,
      icon: cat.icon,
      isActive: cat.is_active,
      createdAt: cat.created_at,
    }));
  } catch (error) {
    console.error('listJobCategories error:', error);
    throw error;
  }
}

/**
 * Get driver job types (uses RPC to bypass RLS)
 */
export async function getDriverJobTypes(driverId: string): Promise<DriverJobType[]> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .rpc('admin_get_driver_job_types', { p_driver_id: driverId });
    
    if (error) {
      throw new Error(`Failed to fetch driver job types: ${error.message}`);
    }
    
    return (data || []).map((djt: {
      id: string;
      driver_id: string;
      job_category_id: string;
      category_name: string;
      category_description: string | null;
      is_allowed: boolean;
      configured_at: string;
    }) => ({
      id: djt.id,
      driverId: djt.driver_id,
      jobCategoryId: djt.job_category_id,
      categoryName: djt.category_name,
      categoryDescription: djt.category_description,
      isAllowed: djt.is_allowed,
      configuredAt: djt.configured_at,
    }));
  } catch (error) {
    console.error('getDriverJobTypes error:', error);
    throw error;
  }
}

/**
 * Update driver job types (admin configures which job types driver can accept)
 */
export async function updateDriverJobTypes(
  driverId: string,
  adminId: string,
  allowedCategoryIds: string[]
): Promise<void> {
  try {
    const supabase = createClient();
    
    // Get all categories
    const categories = await listJobCategories();
    
    // Delete existing entries
    await supabase
      .from('driver_job_types')
      .delete()
      .eq('driver_id', driverId);
    
    // Insert new entries
    const entries = categories.map(cat => ({
      driver_id: driverId,
      job_category_id: cat.id,
      is_allowed: allowedCategoryIds.includes(cat.id),
      configured_by: adminId,
    }));
    
    const { error } = await supabase
      .from('driver_job_types')
      .insert(entries);
    
    if (error) {
      throw new Error(`Failed to update driver job types: ${error.message}`);
    }
  } catch (error) {
    console.error('updateDriverJobTypes error:', error);
    throw error;
  }
}
