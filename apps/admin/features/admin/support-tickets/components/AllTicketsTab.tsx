/**
 * All Tickets Tab
 * DataTable-based view for all support tickets
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { 
  EnterpriseDataTable, 
  Badge, 
  Button
} from '@vantage-lane/ui-core';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Eye,
  Send
} from 'lucide-react';
import { useSupportTickets, type SupportTicket } from '../hooks/useSupportTickets';
import { useTicketActions } from '../hooks/useTicketActions';
import { formatTicketDate, formatTicketStatus, formatTicketPriority } from '../utils/ticketFormatters';
import { CreateTicketModal } from './CreateTicketModal';
import { TicketDetailsModal } from './TicketDetailsModal';
import styles from './AllTicketsTab.module.css';

interface AllTicketsTabProps {
  highlightId?: string | null;
}

export function AllTicketsTab({ highlightId }: AllTicketsTabProps) {
  const [filters] = useState({
    status: 'all',
    priority: 'all',
    searchQuery: ''
  });
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const { 
    tickets, 
    loading,
    refreshTickets
  } = useSupportTickets(filters);
  
  const { deleteTicket } = useTicketActions();

  const handleViewTicket = useCallback((ticketId: string) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket) {
      setSelectedTicket(ticket);
      setIsDetailsModalOpen(true);
    }
  }, [tickets]);

  const handleCreateTicket = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  const handleCloseCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  const handleTicketCreated = useCallback(() => {
    refreshTickets();
  }, [refreshTickets]);

  const handleCloseDetailsModal = useCallback(() => {
    setIsDetailsModalOpen(false);
    setSelectedTicket(null);
  }, []);

  const handleTicketUpdated = useCallback(() => {
    refreshTickets();
  }, [refreshTickets]);

  const handleTicketDeleted = useCallback(async (ticketId: string) => {
    try {
      await deleteTicket(ticketId);
      refreshTickets(); // Refresh the list after deletion
      console.log('✅ Ticket deleted successfully:', ticketId);
    } catch (error) {
      console.error('❌ Failed to delete ticket:', error);
      // Could show a toast notification here
    }
  }, [deleteTicket, refreshTickets]);

  const getStatusBadgeColor = useCallback((status: string): 'theme' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' => {
    switch (status) {
      case 'open': return 'warning';
      case 'in_progress': return 'info';
      case 'resolved': return 'success';
      case 'closed': return 'neutral';
      default: return 'neutral';
    }
  }, []);

  const getPriorityBadgeColor = useCallback((priority: string): 'theme' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' => {
    switch (priority) {
      case 'critical': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'neutral';
      default: return 'neutral';
    }
  }, []);

  const renderTicketNumber = useCallback((row: SupportTicket) => (
    <div className={styles.ticketNumber}>
      <MessageSquare size={16} />
      <span>{row.ticket_number}</span>
    </div>
  ), []);

  const renderSubject = useCallback((row: SupportTicket) => (
    <div className={styles.subject}>
      <span className={styles.subjectTitle}>{row.subject}</span>
      <span className={styles.subjectPreview}>
        {row.description?.substring(0, 80) || ''}...
      </span>
      {/* Mobile-only info since other columns are hidden */}
      <div className={styles.mobileInfo}>
        <span className={styles.mobileUser}>{row.user_name}</span>
        <Badge 
          color={getPriorityBadgeColor(row.priority)}
          size="sm"
        >
          {formatTicketPriority(row.priority)}
        </Badge>
      </div>
    </div>
  ), [getPriorityBadgeColor]);

  const renderUser = useCallback((row: SupportTicket) => (
    <div className={styles.userInfo}>
      <div className={styles.userAvatar}>
        {row.user_name?.charAt(0) || 'U'}
      </div>
      <div>
        <div className={styles.userName}>{row.user_name}</div>
        <div className={styles.userType}>{row.created_by_type}</div>
      </div>
    </div>
  ), []);

  const renderPriority = useCallback((row: SupportTicket) => (
    <Badge color={getPriorityBadgeColor(row.priority)}>
      {formatTicketPriority(row.priority)}
    </Badge>
  ), [getPriorityBadgeColor]);

  const renderStatus = useCallback((row: SupportTicket) => (
    <Badge color={getStatusBadgeColor(row.status)}>
      {formatTicketStatus(row.status)}
    </Badge>
  ), [getStatusBadgeColor]);

  const renderActions = useCallback((row: SupportTicket) => (
    <div className={styles.actions}>
      <Button
        variant="secondary"
        size="sm"
        leftIcon={<Eye size={16} />}
        onClick={() => handleViewTicket(row.id)}
      >
        View
      </Button>
    </div>
  ), [handleViewTicket]);

  const columns = useMemo(() => [
    {
      id: 'ticket_number',
      header: 'Ticket #',
      accessor: (row: SupportTicket) => row.ticket_number,
      cell: renderTicketNumber,
      width: '120px'
    },
    {
      id: 'subject',
      header: 'Subject',
      accessor: (row: SupportTicket) => row.subject,
      cell: renderSubject,
      width: '300px'
    },
    {
      id: 'user',
      header: 'From',
      accessor: (row: SupportTicket) => row.user_name,
      cell: renderUser,
      width: '200px',
      hideOnMobile: true // Hide on mobile to save space
    },
    {
      id: 'priority',
      header: 'Priority',
      accessor: (row: SupportTicket) => row.priority,
      cell: renderPriority,
      width: '100px',
      hideOnMobile: true // Hide on mobile - status is more important
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row: SupportTicket) => row.status,
      cell: renderStatus,
      width: '120px'
    },
    {
      id: 'created_at',
      header: 'Created',
      accessor: (row: SupportTicket) => row.created_at,
      cell: (row: SupportTicket) => formatTicketDate(row.created_at),
      width: '140px',
      hideOnMobile: true // Hide on mobile - can be seen in modal
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: () => '',
      cell: renderActions,
      width: '120px'
    }
  ], [renderTicketNumber, renderSubject, renderUser, renderPriority, renderStatus, renderActions]);


  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          <MessageSquare size={20} />
          <h2>All Support Tickets</h2>
        </div>
        <Button
          variant="primary"
          leftIcon={<MessageSquare size={16} />}
          onClick={handleCreateTicket}
        >
          Create Ticket
        </Button>
      </div>

      <EnterpriseDataTable
        data={tickets}
        columns={columns}
        loading={loading}
      />

      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSuccess={handleTicketCreated}
      />

      <TicketDetailsModal
        isOpen={isDetailsModalOpen}
        ticket={selectedTicket}
        onClose={handleCloseDetailsModal}
        onUpdate={handleTicketUpdated}
        onDelete={handleTicketDeleted}
      />
    </div>
  );
}
