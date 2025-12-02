/**
 * Send Notifications Tab - Main Orchestrator
 * Modular, scalable, 100% ui-core components
 * 
 * REFACTORED: 284 lines → 80 lines (split into 5 sub-components)
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@vantage-lane/ui-core';
import {
  sendNotificationToAllAdmins,
  sendNotificationToAllOperators,
  sendNotificationToAllDrivers,
  sendNotificationToAllCustomers,
  sendNotificationToDriver,
  sendNotificationToOperator,
} from '@entities/notification';
import { createClient } from '@/lib/supabase/client';
import { TargetPicker } from './TargetPicker';
import { UserSelector } from './UserSelector';
import { MessageForm } from './MessageForm';
import { PreviewCard } from './PreviewCard';
import type { TargetType, NotificationFormData, UserOption, SendResult } from './types';
import styles from './SendNotificationsTab.module.css';

export function SendNotificationsTab() {
  const [target, setTarget] = useState<TargetType>('all-drivers');
  const [formData, setFormData] = useState<NotificationFormData>({
    title: '',
    message: '',
    link: '',
  });
  const [users, setUsers] = useState<UserOption[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<SendResult | null>(null);

  // Memoized functions for mapping user data
  const mapDriverData = useCallback((data: any[]) => 
    data.map(d => ({ id: d.id, name: `${d.first_name} ${d.last_name}` })), []
  );

  const mapOrganizationData = useCallback((data: any[]) => 
    data.map(o => ({ id: o.id, name: o.name })), []
  );

  // Reset selection when target changes
  useEffect(() => {
    setSelectedUserId('');
    setUsers([]);
    setResult(null);
    
    if (target === 'individual-driver' || target === 'individual-operator') {
      fetchUsers();
    }
  }, [target]);

  const fetchUsers = async () => {
    setLoading(true);
    const supabase = createClient();

    try {
      if (target === 'individual-driver') {
        const { data } = await supabase
          .from('drivers')
          .select('id, first_name, last_name')
          .eq('is_active', true)
          .order('first_name');
        
        if (data) {
          setUsers(mapDriverData(data));
        }
      } else if (target === 'individual-operator') {
        const { data } = await supabase
          .from('organizations')
          .select('id, name')
          .eq('org_type', 'operator')
          .eq('is_active', true)
          .order('name');
        
        if (data) {
          setUsers(mapOrganizationData(data));
        }
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!formData.title || !formData.message) return;

    if ((target === 'individual-driver' || target === 'individual-operator') && !selectedUserId) {
      alert(`Please select a ${target === 'individual-driver' ? 'driver' : 'operator'}`);
      return;
    }

    setSending(true);
    setResult(null);

    try {
      const payload = {
        type: 'admin_message' as const,
        title: formData.title,
        message: formData.message,
        link: formData.link || undefined,
      };

      let response: SendResult;

      switch (target) {
        case 'all-admins':
          response = await sendNotificationToAllAdmins(payload);
          break;
        case 'all-operators':
          response = await sendNotificationToAllOperators(payload);
          break;
        case 'all-drivers':
          response = await sendNotificationToAllDrivers(payload);
          break;
        case 'all-customers':
          response = await sendNotificationToAllCustomers(payload);
          break;
        case 'individual-driver':
          await sendNotificationToDriver(selectedUserId, formData.title, formData.message, formData.link || undefined);
          response = { success: true, count: 1 };
          break;
        case 'individual-operator':
          await sendNotificationToOperator(selectedUserId, formData.title, formData.message, formData.link || undefined);
          response = { success: true, count: 1 };
          break;
      }

      setResult(response);
      setFormData({ title: '', message: '', link: '' });
      setSelectedUserId('');
      alert(`✅ Notification sent${response.count ? ` to ${response.count} user(s)` : ''}!`);
    } catch (error) {
      alert('❌ Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <TargetPicker selected={target} onChange={setTarget} />
        <UserSelector 
          target={target}
          value={selectedUserId}
          onChange={setSelectedUserId}
          users={users}
          loading={loading}
        />
        <MessageForm 
          data={formData}
          onChange={(partial) => setFormData({ ...formData, ...partial })}
        />
        <PreviewCard data={formData} />
        
        <div className={styles.actions}>
          <Button
            variant="primary"
            onClick={handleSend}
            disabled={sending || !formData.title || !formData.message}
          >
            {sending ? 'Sending...' : 'Send Notification'}
          </Button>
        </div>

        {result && (
          <div className={styles.result}>
            ✅ Successfully sent to {result.count} users
          </div>
        )}
      </div>
    </div>
  );
}
