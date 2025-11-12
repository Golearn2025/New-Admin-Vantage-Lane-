/**
 * Export Utilities
 * Reusable functions for exporting data to CSV/Excel
 * 
 * 100% Client-side, no external dependencies
 */

/**
 * Convert data array to CSV string
 */
export function convertToCSV<T extends Record<string, unknown>>(
  data: T[],
  headers?: string[]
): string {
  if (data.length === 0) return '';

  // Get headers from first object if not provided
  const firstRow = data[0];
  if (!firstRow) return '';
  
  const csvHeaders = headers || Object.keys(firstRow);
  
  // Create header row
  const headerRow = csvHeaders.join(',');
  
  // Create data rows
  const dataRows = data.map(row => {
    return csvHeaders.map(header => {
      const value = row[header];
      
      // Handle different value types
      if (value === null || value === undefined) {
        return '';
      }
      
      // Convert to string and escape quotes
      const stringValue = String(value).replace(/"/g, '""');
      
      // Wrap in quotes if contains comma, newline, or quote
      if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
        return `"${stringValue}"`;
      }
      
      return stringValue;
    }).join(',');
  });
  
  return [headerRow, ...dataRows].join('\n');
}

/**
 * Download CSV file
 */
export function downloadCSV(
  filename: string,
  csvContent: string
): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Export data to CSV file
 */
export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  headers?: string[]
): void {
  if (data.length === 0) {
    alert('No data to export');
    return;
  }
  
  const csvContent = convertToCSV(data, headers);
  const fileWithExtension = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  downloadCSV(fileWithExtension, csvContent);
}

/**
 * Convert data to Excel-compatible CSV format with UTF-8 BOM
 * This opens correctly in Excel without import wizard
 * Note: Exports as .csv (not binary .xlsx) for universal compatibility
 */
export function exportToExcel<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  headers?: string[]
): void {
  if (data.length === 0) {
    alert('No data to export');
    return;
  }
  
  const csvContent = convertToCSV(data, headers);
  
  // Add UTF-8 BOM for Excel compatibility
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { 
    type: 'text/csv;charset=utf-8;' 
  });
  
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    
    // Use .csv extension (not .xlsx) since we're exporting CSV format
    const fileWithExtension = filename.endsWith('.csv') 
      ? filename
      : `${filename}.csv`;
    
    link.setAttribute('download', fileWithExtension);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Format date for export (YYYY-MM-DD HH:mm:ss)
 */
export function formatDateForExport(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(d.getTime())) return '';
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Format currency for export (no symbols, just numbers)
 */
export function formatCurrencyForExport(amount: number, decimals = 2): string {
  return amount.toFixed(decimals);
}

/**
 * Sanitize filename (remove invalid characters)
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9-_\.]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '');
}
