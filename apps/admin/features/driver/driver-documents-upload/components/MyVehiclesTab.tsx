/**
 * My Vehicles Tab
 * 
 * Lists driver's vehicles with document management per vehicle
 * Zero logic - delegates to hook
 */

'use client';

import React from 'react';
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
  } = useMyVehicles();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>My Vehicles</h2>
          <p className={styles.subtitle}>
            Manage your vehicles and their documents
          </p>
        </div>
        <Button
          onClick={handleAddVehicle}
          variant="primary"
          size="md"
          leftIcon={<Plus size={16} />}
        >
          Add Vehicle
        </Button>
      </div>

      {vehicles.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>No vehicles added yet</p>
          <p className={styles.emptySubtext}>
            Click "Add Vehicle" to register your first vehicle
          </p>
        </div>
      ) : (
        <div className={styles.grid}>
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onUploadDocument={handleUploadDocument}
            />
          ))}
        </div>
      )}

      <AddVehicleModal
        isOpen={addVehicleModalOpen}
        onClose={handleCloseAddVehicle}
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
