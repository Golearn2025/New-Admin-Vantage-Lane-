/**
 * Disputes Bulk Actions Configuration
 * 
 * Configuration for bulk actions on selected disputes - focused on action definitions
 */

export interface BulkActionHandlers {
  handleExportSelected: (format: 'excel' | 'csv') => void;
  handleDeleteSelected: () => void;
}

export function createDisputesBulkActions(
  selectedCount: number,
  handlers: BulkActionHandlers
) {
  return [
    {
      id: 'export-excel',
      label: 'Export Selected (Excel)',
      onClick: () => handlers.handleExportSelected('excel'),
    },
    {
      id: 'export-csv',
      label: 'Export Selected (CSV)',
      onClick: () => handlers.handleExportSelected('csv'),
    },
    {
      id: 'delete',
      label: 'Delete Selected',
      onClick: handlers.handleDeleteSelected,
      destructive: true,
    },
  ];
}
