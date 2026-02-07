/**
 * TanStack Table - Public API
 *
 * Generic, reusable table built on @tanstack/react-table.
 * Drop-in replacement for EnterpriseDataTable across the project.
 */

// Main component
export { TanStackDataTable } from './TanStackDataTable';

// Sub-components (for advanced customization)
export { TanStackTableBody } from './TanStackTableBody';
export { TanStackTableHeader } from './TanStackTableHeader';

// Utilities
export { toTanStackColumns } from './toTanStackColumns';

// Types
export type { TanStackTableProps } from './tanstack.types';

// Re-export useful TanStack types for consumers
export type { ColumnDef, ColumnResizeMode, SortingState } from '@tanstack/react-table';

