import dynamic from 'next/dynamic';

const TestBookingCreator = dynamic(() => import('./TestBookingCreator'), {
  ssr: false,
  loading: () => <div style={{ padding: '2rem' }}>Loading test creator...</div>,
});

export default function TestBookingCreatorPage() {
  return <TestBookingCreator />;
}
