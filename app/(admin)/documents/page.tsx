/**
 * Documents Approval Page
 * Admin reviews and approves driver/operator documents
 * 
 * MODERN & PREMIUM - ZERO logic in app/ (RULES.md compliant)
 */

import dynamic from 'next/dynamic';

const DocumentsApprovalTable = dynamic(
  () => import('@features/shared/documents-approval').then(mod => ({ default: mod.DocumentsApprovalTable })),
  { 
    loading: () => <div style={{ padding: '2rem', textAlign: 'center' }}>Loading documents...</div>,
    ssr: false 
  }
);

export default function DocumentsPage() {
  return <DocumentsApprovalTable />;
}
