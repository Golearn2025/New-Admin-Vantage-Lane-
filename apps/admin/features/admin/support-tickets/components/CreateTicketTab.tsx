/**
 * Create Ticket Tab - Functional Implementation
 */

'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@vantage-lane/ui-core';
import { Plus } from 'lucide-react';
import { CreateTicketModal } from './CreateTicketModal';
import styles from './CreateTicketTab.module.css';

interface CreateTicketTabProps {
  onTicketCreated?: () => void;
}

export function CreateTicketTab({ onTicketCreated }: CreateTicketTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleTicketCreated = useCallback(() => {
    onTicketCreated?.();
  }, [onTicketCreated]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.placeholder}>
          <Plus size={48} />
          <h3>Create Outbound Ticket</h3>
          <p>Send tickets directly to drivers, operators, or customers</p>
          <Button 
            variant="primary"
            onClick={handleOpenModal}
          >
            Create New Ticket
          </Button>
        </div>

        <CreateTicketModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSuccess={handleTicketCreated}
        />
      </div>
    </div>
  );
}
