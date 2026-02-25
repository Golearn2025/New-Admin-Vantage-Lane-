/**
 * Review Templates Management
 * 
 * Feedback templates retrieval and management operations
 */

import { createClient } from '@/lib/supabase/client';

/**
 * Get feedback templates
 */
export async function getFeedbackTemplates(templateType?: string) {
  try {
    const supabase = createClient();
    let query = supabase
      .from('feedback_templates')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (templateType) {
      query = query.eq('template_type', templateType);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data || [];

  } catch (error) {
    console.error('Error fetching feedback templates:', error);
    throw new Error('Failed to fetch feedback templates');
  }
}
