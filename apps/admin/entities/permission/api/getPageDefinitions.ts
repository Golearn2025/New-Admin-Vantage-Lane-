/**
 * Get Page Definitions API
 */

import { createClient } from '@/lib/supabase/client';
import type { PageDefinition } from '../model/types';

export async function getPageDefinitions(): Promise<PageDefinition[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('page_definitions')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Get page definitions error:', error);
    throw new Error(`Failed to fetch page definitions: ${error.message}`);
  }

  return (data || []).map((d) => ({
    id: d.id,
    pageKey: d.page_key,
    label: d.label,
    icon: d.icon,
    href: d.href,
    parentKey: d.parent_key,
    displayOrder: d.display_order,
    description: d.description,
    isActive: d.is_active,
    createdAt: d.created_at,
    updatedAt: d.updated_at,
  }));
}
