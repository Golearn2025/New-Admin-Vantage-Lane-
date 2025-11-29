/**
 * My Vehicles Tab
 * 
 * Lists driver's vehicles with document management per vehicle
 * Zero logic - delegates to hook
 */

'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@vantage-lane/ui-core';
import { Plus } from 'lucide-react';
import { VehicleCard } from './VehicleCard';
import { AddVehicleModal } from './AddVehicleModal';
import { DocumentUploadModal } from './DocumentUploadModal';
import { useMyVehicles } from '../hooks/useMyVehicles';
import styles from './MyVehiclesTab.module.css';

export function MyVehiclesTab() {
  const {
    vehicles,
    isLoading,
    addVehicleModalOpen,
    uploadModalOpen,
    selectedDocumentType,
    handleAddVehicle,
    handleCloseAddVehicle,
    handleAddVehicleSubmit,
    handleUploadDocument,
    handleCloseUploadModal,
    handleUploadFile,
    reloadVehicles
  } = useMyVehicles();

  const [showAddModal, setShowAddModal] = useState(false);

  // Memoize vehicle cards to prevent re-creation on every render
  const vehicleCards = useMemo(() => 
    vehicles.map((vehicle) => (
      <VehicleCard
        key={vehicle.id}
        vehicle={vehicle}
        onUploadDocument={(vehicleId, docType) => handleUploadDocument(vehicleId, docType)}
      />
    )), 
    [vehicles, handleUploadDocument]
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>My Vehicles</h2>
        <Button
          onClick={() => setShowAddModal(true)}
          variant="primary"
          size="md"
        >
          <Plus size={16} />
          Add Vehicle
        </Button>
      </div>

      {vehicles.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🚗</div>
          <h3>No Vehicles Registered</h3>
          <p>Add your first vehicle to start uploading documents</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {vehicleCards}
        </div>
      )}

      <AddVehicleModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddVehicleSubmit}
      />

      <DocumentUploadModal
        isOpen={uploadModalOpen}
        onClose={handleCloseUploadModal}
        documentType={selectedDocumentType}
        onUpload={handleUploadFile}
      />
    </div>
  );
}
