/**
 * Invoices Bulk Actions Configuration
 * 
 * Configuration for bulk actions on selected invoices - focused on action definitions
 */

export interface BulkActionHandlers {
  handleExportSelected: (format: 'excel' | 'csv') => void;
  handleSendEmails: () => void;
  handleDelete: () => void;
}

export function createInvoicesBulkActions(
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
      id: 'send-email',
      label: 'Email Selected',
      onClick: handlers.handleSendEmails,
    },
    {
      id: 'delete',
      label: 'Delete Selected',
      onClick: handlers.handleDelete,
      destructive: true,
    },
  ];
}
