/**
 * Business Intelligence Page
 *
 * ARCHITECTURE COMPLIANT - DOAR import + render
 * File: < 200 lines (RULES.md compliant)
 */

import { Metadata } from 'next';
import { BusinessIntelligencePage } from '@features/business-intelligence';

export const metadata: Metadata = {
  title: 'Business Intelligence | Vantage Lane Admin',
  description: 'AI-powered analytics and insights dashboard',
};

export default function Page() {
  return <BusinessIntelligencePage />;
}
