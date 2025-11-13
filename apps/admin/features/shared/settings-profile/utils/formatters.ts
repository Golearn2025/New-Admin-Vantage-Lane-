/**
 * Profile Formatters
 * 
 * Pure utility functions for formatting profile data.
 * Zero logic, zero state - pure functions only.
 */

export function formatDate(date: string | null): string {
  if (!date) return 'Never';
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatDateTime(date: string | null): string {
  if (!date) return 'Never';
  return new Date(date).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getRoleLabel(role: 'super_admin' | 'admin' | 'support'): string {
  switch (role) {
    case 'super_admin':
      return 'Super Administrator';
    case 'admin':
      return 'Administrator';
    case 'support':
      return 'Support';
    default:
      return role;
  }
}

export function getRoleVariant(role: 'super_admin' | 'admin' | 'support'): 'primary' | 'secondary' | 'tertiary' {
  switch (role) {
    case 'super_admin':
      return 'primary';
    case 'admin':
      return 'secondary';
    case 'support':
      return 'tertiary';
    default:
      return 'secondary';
  }
}
