/**
 * Create Ticket Modal
 * Modal for creating new outbound support tickets
 */

'use client';

import React, { useState, useCallback } from 'react';
import { 
  Modal, 
  Button, 
  Input, 
  Textarea, 
  Select
} from '@vantage-lane/ui-core';
import { Send, User as UserIcon, Search } from 'lucide-react';
import { useCreateTicket } from '../hooks/useCreateTicket';
import { useUserSearch, type User } from '../hooks/useUserSearch';
import styles from './CreateTicketModal.module.css';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateTicketModal({ isOpen, onClose, onSuccess }: CreateTicketModalProps) {
  const [formData, setFormData] = useState({
    targetUserId: '',
    targetUserType: 'driver' as 'driver' | 'operator' | 'customer',
    subject: '',
    description: '',
    category: 'general',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical'
  });

  const [searchQuery, setSearchQuery] = useState('');

  const { users, loading: searchLoading, searchUsers, clearUsers } = useUserSearch();
  const { createTicket, loading: createLoading } = useCreateTicket();

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleUserSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      await searchUsers(query, formData.targetUserType);
    }
  }, [formData.targetUserType, searchUsers]);

  const handleSelectUser = useCallback((user: User) => {
    setFormData(prev => ({ ...prev, targetUserId: user.id }));
    setSearchQuery(`${user.name} (${user.email})`);
    // Clear users list to hide dropdown
    clearUsers();
  }, [clearUsers]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.targetUserId || !formData.subject || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      await createTicket(formData);
      
      // Reset form
      setFormData({
        targetUserId: '',
        targetUserType: 'driver',
        subject: '',
        description: '',
        category: 'general',
        priority: 'medium'
      });
      setSearchQuery('');
      
      // Close modal and refresh data
      onClose();
      onSuccess();
    } catch (error) {
      // Error is handled by the hook and displayed in UI
      console.error('Submit error:', error);
    }
  }, [createTicket, formData, onSuccess, onClose]);

  const categoryOptions = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'technical', label: 'Technical Issue' },
    { value: 'payment', label: 'Payment Issue' },
    { value: 'documents', label: 'Documents' },
    { value: 'operational', label: 'Operational' },
    { value: 'onboarding', label: 'Onboarding' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
  ];

  const userTypeOptions = [
    { value: 'driver', label: 'Driver' },
    { value: 'operator', label: 'Operator' },
    { value: 'customer', label: 'Customer' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Support Ticket"
      size="lg"
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>
            Send to <span className={styles.required}>*</span>
          </label>
          <div className={styles.userSelection}>
            <Select
              value={formData.targetUserType}
              onChange={(value) => handleInputChange('targetUserType', value as string)}
              options={userTypeOptions}
            />
            <div className={styles.userSearch}>
              <Input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => handleUserSearch(e.target.value)}
                leftIcon={<Search size={16} />}
                className={styles.searchInput}
              />
              {users.length > 0 && (
                <div className={styles.userResults}>
                  {users.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      className={styles.userResult}
                      onClick={() => handleSelectUser(user)}
                    >
                      <UserIcon size={16} />
                      <div>
                        <div className={styles.userName}>{user.name}</div>
                        <div className={styles.userEmail}>{user.email}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Category <span className={styles.required}>*</span>
          </label>
          <Select
            value={formData.category}
            onChange={(value) => handleInputChange('category', value as string)}
            options={categoryOptions}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Priority <span className={styles.required}>*</span>
          </label>
          <Select
            value={formData.priority}
            onChange={(value) => handleInputChange('priority', value as string)}
            options={priorityOptions}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Subject <span className={styles.required}>*</span>
          </label>
          <Input
            type="text"
            value={formData.subject}
            onChange={(e) => handleInputChange('subject', e.target.value)}
            placeholder="Brief description of the issue"
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Message <span className={styles.required}>*</span>
          </label>
          <Textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Detailed description of the message"
            rows={6}
            required
          />
        </div>

        <div className={styles.actions}>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={createLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            leftIcon={<Send size={16} />}
            loading={createLoading}
            disabled={!formData.targetUserId || !formData.subject || !formData.description}
          >
            Send Ticket
          </Button>
        </div>
      </form>
    </Modal>
  );
}
