/**
 * Business Intelligence Page
 *
 * ARCHITECTURE COMPLIANT - DOAR import + render
 * File: < 200 lines (RULES.md compliant)
 */

import { Metadata } from 'next';
import dynamic from 'next/dynamic';

const BusinessIntelligencePage = dynamic(
  () => import('@features/business-intelligence').then(mod => ({ default: mod.BusinessIntelligencePage })),
  { 
    loading: () => <div style={{ padding: '2rem', textAlign: 'center' }}>Loading analytics...</div>,
    ssr: false 
  }
);

export const metadata: Metadata = {
  title: 'Business Intelligence | Vantage Lane Admin',
  description: 'AI-powered analytics and insights dashboard',
};

export default function Page() {
  return <BusinessIntelligencePage />;
}
