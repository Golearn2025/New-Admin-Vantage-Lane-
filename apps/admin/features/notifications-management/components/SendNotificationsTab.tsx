import { User, CheckCircle, XCircle, Car } from 'lucide-react';
/**
 * Send Notifications Tab
 * Send notifications to users or groups
 */

'use client';
import React, { useState, useEffect } from 'react';
import { Button, Input } from '@vantage-lane/ui-core';
import {
  sendNotificationToAllAdmins,
  sendNotificationToAllOperators,
  sendNotificationToAllDrivers,
  sendNotificationToAllCustomers,
  sendNotificationToDriver,
  sendNotificationToOperator,
} from '@entities/notification';
import { createClient } from '@/lib/supabase/client';
import styles from './SendNotificationsTab.module.css';

type TargetType = 'all-admins' | 'all-operators' | 'all-drivers' | 'all-customers' | 'individual-driver' | 'individual-operator';

export function SendNotificationsTab() {
  const [target, setTarget] = useState<TargetType>('all-drivers');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [link, setLink] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; count?: number } | null>(null);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [drivers, setDrivers] = useState<Array<{ id: string; name: string }>>([]);
  const [operators, setOperators] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(false);

  // Fetch drivers and operators for individual selection
  useEffect(() => {
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
          setDrivers(data.map(d => ({ id: d.id, name: `${d.first_name} ${d.last_name}` })));
        }
      } else if (target === 'individual-operator') {
        const { data } = await supabase
          .from('organizations')
          .select('id, name')
          .eq('org_type', 'operator')
          .eq('is_active', true)
          .order('name');
        
        if (data) {
          setOperators(data.map(o => ({ id: o.id, name: o.name })));
        }
      }
    } catch (error) {
      console.error('Fetch users error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!title || !message) {
      alert('Please fill in title and message');
      return;
    }

    setSending(true);
    setResult(null);

    try {
      const payload = {
        type: 'admin_message',
        title,
        message,
        link: link || undefined,
      };

      let response;
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
          if (!selectedUserId) {
            alert('Please select a driver');
            setSending(false);
            return;
          }
          await sendNotificationToDriver(selectedUserId, title, message, link || undefined);
          response = { success: true, count: 1 };
          break;
        case 'individual-operator':
          if (!selectedUserId) {
            alert('Please select an operator');
            setSending(false);
            return;
          }
          await sendNotificationToOperator(selectedUserId, title, message, link || undefined);
          response = { success: true, count: 1 };
          break;
      }

      setResult(response);
      setTitle('');
      setMessage('');
      setLink('');
      setSelectedUserId('');
      alert(`✅ Notification sent${response.count ? ` to ${response.count} user(s)` : ''}!`);
    } catch (error) {
      console.error('Send notification error:', error);
      alert('❌ Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Target Audience</h3>
          <div className={styles.targetGrid}>
            <button
              className={`${styles.targetCard} ${target === 'all-admins' ? styles.active : ''}`}
              onClick={() => setTarget('all-admins')}
            >
              <div className={styles.targetIcon}>👨‍💼</div>
              <div className={styles.targetLabel}>All Admins</div>
            </button>
            <button
              className={`${styles.targetCard} ${target === 'all-operators' ? styles.active : ''}`}
              onClick={() => setTarget('all-operators')}
            >
              <div className={styles.targetIcon}>🏢</div>
              <div className={styles.targetLabel}>All Operators</div>
            </button>
            <button
              className={`${styles.targetCard} ${target === 'all-drivers' ? styles.active : ''}`}
              onClick={() => setTarget('all-drivers')}
            >
              <div className={styles.targetIcon}><Car size={18} strokeWidth={2} /></div>
              <div className={styles.targetLabel}>All Drivers</div>
            </button>
            <button
              className={`${styles.targetCard} ${target === 'all-customers' ? styles.active : ''}`}
              onClick={() => setTarget('all-customers')}
            >
              <div className={styles.targetIcon}>👥</div>
              <div className={styles.targetLabel}>All Customers</div>
            </button>
            <button
              className={`${styles.targetCard} ${target === 'individual-driver' ? styles.active : ''}`}
              onClick={() => setTarget('individual-driver')}
            >
              <div className={styles.targetIcon}><User size={18} strokeWidth={2} /></div>
              <div className={styles.targetLabel}>Specific Driver</div>
            </button>
            <button
              className={`${styles.targetCard} ${target === 'individual-operator' ? styles.active : ''}`}
              onClick={() => setTarget('individual-operator')}
            >
              <div className={styles.targetIcon}>🏪</div>
              <div className={styles.targetLabel}>Specific Operator</div>
            </button>
          </div>
        </div>

        {/* Individual User Selection */}
        {(target === 'individual-driver' || target === 'individual-operator') && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              Select {target === 'individual-driver' ? 'Driver' : 'Operator'}
            </h3>
            {loading ? (
              <div className={styles.loading}>Loading users...</div>
            ) : (
              <select
                className={styles.select}
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
              >
                <option value="">-- Select --</option>
                {target === 'individual-driver'
                  ? drivers.map((driver) => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name}
                      </option>
                    ))
                  : operators.map((operator) => (
                      <option key={operator.id} value={operator.id}>
                        {operator.name}
                      </option>
                    ))}
              </select>
            )}
          </div>
        )}

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Message</h3>
          <div className={styles.field}>
            <label className={styles.label}>Title *</label>
            <Input
              type="text"
              placeholder="Notification title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Message *</label>
            <textarea
              className={styles.textarea}
              placeholder="Notification message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Link (optional)</label>
            <Input
              type="text"
              placeholder="/admin/bookings"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.preview}>
          <h3 className={styles.sectionTitle}>Preview</h3>
          <div className={styles.previewCard}>
            <div className={styles.previewTitle}>{title || 'Notification Title'}</div>
            <div className={styles.previewMessage}>{message || 'Notification message will appear here...'}</div>
            {link && <div className={styles.previewLink}>🔗 {link}</div>}
          </div>
        </div>

        <div className={styles.actions}>
          <Button
            variant="primary"
            onClick={handleSend}
            disabled={sending || !title || !message}
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
