/**
 * Reviews Route - Admin Dashboard
 * 
 * Rating și review management pentru platform.
 * Zero business logic - doar routing.
 */

import dynamic from 'next/dynamic';

const ReviewsManagementPage = dynamic(
  () => import('@features/admin/reviews-management').then(mod => ({ default: mod.ReviewsManagementPage })),
  { 
    loading: () => <div style={{ padding: '2rem', textAlign: 'center' }}>Loading reviews...</div>,
    ssr: false 
  }
);

export default function ReviewsRoute() {
  return <ReviewsManagementPage />;
}
