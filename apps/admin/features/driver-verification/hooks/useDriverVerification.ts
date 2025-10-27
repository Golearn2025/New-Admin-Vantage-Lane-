'use client';
import { useState, useEffect } from 'react';
import type { DriverVerificationData, DriverDoc } from '../types';

const mockDriver: DriverVerificationData = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+44 7700 900123',
  profilePhoto: null,
  documents: [
    { id: '1', type: 'license', url: '/docs/license.pdf', verified: true, uploadedAt: new Date().toISOString() },
    { id: '2', type: 'insurance', url: '/docs/insurance.pdf', verified: true, uploadedAt: new Date().toISOString() },
    { id: '3', type: 'registration', url: '/docs/reg.pdf', verified: false, uploadedAt: new Date().toISOString() },
    { id: '4', type: 'mot', url: '/docs/mot.pdf', verified: true, uploadedAt: new Date().toISOString() },
    { id: '5', type: 'pco', url: '/docs/pco.pdf', verified: false, uploadedAt: new Date().toISOString() },
    { id: '6', type: 'photo', url: '/docs/photo.jpg', verified: true, uploadedAt: new Date().toISOString() },
  ],
  vehicleCategory: [],
  status: 'pending',
  operatorId: null,
  createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
};

export function useDriverVerification(driverId: string) {
  const [driver, setDriver] = useState<DriverVerificationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 500));
      setDriver(mockDriver);
      setLoading(false);
    };
    fetch();
  }, [driverId]);

  const verifyDriver = async (categories: string[]) => {
    console.log('Activating driver with categories:', categories);
    await new Promise((r) => setTimeout(r, 500));
    alert(`✅ Driver activated with categories: ${categories.join(', ')}`);
    window.location.href = '/users/drivers/pending';
  };

  const rejectDriver = async () => {
    if (!confirm('Are you sure you want to reject this driver?')) return;
    console.log('Rejecting driver');
    await new Promise((r) => setTimeout(r, 500));
    alert('❌ Driver rejected');
    window.location.href = '/users/drivers/pending';
  };

  const assignToOperator = async (operatorId: string) => {
    console.log('Assigning to operator:', operatorId);
    await new Promise((r) => setTimeout(r, 500));
    alert('✅ Driver assigned to operator');
  };

  return {
    driver,
    loading,
    verifyDriver,
    rejectDriver,
    assignToOperator,
  };
}
