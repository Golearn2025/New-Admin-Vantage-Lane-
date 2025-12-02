/**
 * Review Templates Management
 * 
 * Feedback templates retrieval and management operations
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Get feedback templates
 */
export async function getFeedbackTemplates(templateType?: string) {
  try {
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
