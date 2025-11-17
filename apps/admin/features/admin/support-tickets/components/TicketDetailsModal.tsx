/**
 * Ticket Details Modal - Domain-Specific Component
 * Modal for viewing and editing support ticket details with proper UI-core integration
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { 
  Modal, 
  Button, 
  Badge, 
  Select,
  Textarea
} from '@vantage-lane/ui-core';
import { 
  MessageSquare, 
  Calendar, 
  User as UserIcon, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Trash2,
  Send
} from 'lucide-react';
import { SupportTicket } from '../hooks/useSupportTickets';
import { useTicketActions } from '../hooks/useTicketActions';
import { formatTicketDate, formatTicketStatus, formatTicketPriority } from '../utils/ticketFormatters';
import styles from './TicketDetailsModal.module.css';

interface TicketDetailsModalProps {
  isOpen: boolean;
  ticket: SupportTicket | null;
  onClose: () => void;
  onUpdate: () => void;
  onDelete: (ticketId: string) => void;
}

export function TicketDetailsModal({ 
  isOpen, 
  ticket, 
  onClose, 
  onUpdate,
  onDelete 
}: TicketDetailsModalProps) {
  const [status, setStatus] = useState<string>('');
  const [newMessage, setNewMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const { 
    loading: actionsLoading, 
    error: actionsError,
    updateTicketStatus,
    addTicketMessage,
    deleteTicket
  } = useTicketActions();

  // Reset form when ticket changes
  useEffect(() => {
    if (ticket) {
      setStatus(ticket.status);
      setNewMessage('');
      setShowDeleteConfirm(false);
    }
  }, [ticket]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setStatus('');
      setNewMessage('');
      setShowDeleteConfirm(false);
    };
  }, []);

  const handleStatusChange = useCallback(async () => {
    if (!ticket || status === ticket.status) return;
    
    try {
      await updateTicketStatus(ticket.id, status);
      onUpdate(); // Refresh the ticket list
    } catch (error) {
      // Error is handled by the hook and displayed in console
      console.error('Status update failed:', error);
    }
  }, [ticket, status, updateTicketStatus, onUpdate]);

  const handleAddMessage = useCallback(async () => {
    if (!ticket || !newMessage.trim()) return;
    
    try {
      await addTicketMessage(ticket.id, newMessage);
      setNewMessage(''); // Clear the message input
      onUpdate(); // Refresh the ticket data
    } catch (error) {
      // Error is handled by the hook and displayed in console  
      console.error('Add message failed:', error);
    }
  }, [ticket, newMessage, addTicketMessage, onUpdate]);

  const handleDelete = useCallback(async () => {
    if (!ticket) return;
    
    try {
      await deleteTicket(ticket.id);
      console.log('✅ Ticket deleted successfully from modal:', ticket.id);
      setShowDeleteConfirm(false);
      onClose(); // Close modal first
      onUpdate(); // Then refresh the list
      // Also call onDelete for any additional cleanup
      onDelete(ticket.id);
    } catch (error) {
      console.error('❌ Failed to delete ticket from modal:', error);
      // Keep modal open on error so user can retry
    }
  }, [ticket, deleteTicket, onClose, onUpdate, onDelete]);

  const getStatusIcon = useCallback((status: string) => {
    switch (status) {
      case 'open': return <AlertTriangle size={16} />;
      case 'in_progress': return <Clock size={16} />;
      case 'resolved': return <CheckCircle size={16} />;
      case 'closed': return <CheckCircle size={16} />;
      default: return <MessageSquare size={16} />;
    }
  }, []);

  const getStatusBadgeColor = useCallback((status: string): 'success' | 'warning' | 'danger' | 'info' | 'neutral' => {
    switch (status) {
      case 'open': return 'warning';
      case 'in_progress': return 'info';
      case 'resolved': return 'success';
      case 'closed': return 'neutral';
      default: return 'neutral';
    }
  }, []);

  const getPriorityBadgeColor = useCallback((priority: string): 'success' | 'warning' | 'danger' | 'info' | 'neutral' => {
    switch (priority) {
      case 'critical': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'neutral';
      default: return 'neutral';
    }
  }, []);

  if (!ticket) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Ticket ${ticket.ticket_number}`}
      size="lg"
    >
      <div className={styles.container}>
        {/* Header Info */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.statusRow}>
              {getStatusIcon(ticket.status)}
              <Badge 
                color={getStatusBadgeColor(ticket.status)}
                size="sm"
              >
                {formatTicketStatus(ticket.status)}
              </Badge>
              <Badge 
                color={getPriorityBadgeColor(ticket.priority)}
                size="sm"
              >
                {formatTicketPriority(ticket.priority)}
              </Badge>
            </div>
            <h3 className={styles.subject}>{ticket.subject}</h3>
            <div className={styles.metaInfo}>
              <div className={styles.metaItem}>
                <UserIcon size={14} />
                <span>{ticket.user_name}</span>
              </div>
              <div className={styles.metaItem}>
                <Calendar size={14} />
                <span>{formatTicketDate(ticket.created_at)}</span>
              </div>
            </div>
          </div>
          <div className={styles.headerRight}>
            <Button
              variant="danger"
              size="sm"
              leftIcon={<Trash2 size={14} />}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowDeleteConfirm(true);
              }}
            >
              Delete
            </Button>
          </div>
        </div>

        {/* Description */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Description</h4>
          <div className={styles.description}>
            {ticket.description}
          </div>
        </div>

        {/* Status Update */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Update Status</h4>
          <div className={styles.statusUpdate}>
            <Select
              value={status}
              onChange={(value) => setStatus(String(value))}
              options={[
                { value: 'open', label: 'Open' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'resolved', label: 'Resolved' },
                { value: 'closed', label: 'Closed' }
              ]}
            />
            <Button
              variant="primary"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleStatusChange();
              }}
              disabled={actionsLoading || status === ticket.status}
            >
              {actionsLoading ? 'Updating...' : 'Update Status'}
            </Button>
          </div>
        </div>

        {/* Add Message */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Add Message</h4>
          <div className={styles.messageForm}>
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Add a message to this ticket..."
              rows={3}
            />
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Send size={14} />}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddMessage();
              }}
              disabled={actionsLoading || !newMessage.trim()}
            >
              {actionsLoading ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </div>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className={styles.deleteConfirm}>
            <div className={styles.deleteMessage}>
              <AlertTriangle size={16} />
              <span>Are you sure you want to delete this ticket? This action cannot be undone.</span>
            </div>
            <div className={styles.deleteActions}>
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowDeleteConfirm(false);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDelete();
                }}
                disabled={actionsLoading}
              >
                {actionsLoading ? 'Deleting...' : 'Delete Ticket'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
