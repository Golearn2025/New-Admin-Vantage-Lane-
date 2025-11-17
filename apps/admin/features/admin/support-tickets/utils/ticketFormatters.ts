/**
 * Support Tickets Formatters
 * Centralized formatting functions for consistent display
 */

/**
 * Format ticket creation date
 */
export function formatTicketDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
}

/**
 * Format ticket status for display
 */
export function formatTicketStatus(status: string): string {
  switch (status) {
    case 'open':
      return 'Open';
    case 'in_progress':
      return 'In Progress';
    case 'resolved':
      return 'Resolved';
    case 'closed':
      return 'Closed';
    case 'sent':
      return 'Sent';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

/**
 * Format ticket priority for display
 */
export function formatTicketPriority(priority: string): string {
  switch (priority) {
    case 'critical':
      return 'Critical';
    case 'high':
      return 'High';
    case 'medium':
      return 'Medium';
    case 'low':
      return 'Low';
    default:
      return priority.charAt(0).toUpperCase() + priority.slice(1);
  }
}

/**
 * Format ticket category for display
 */
export function formatTicketCategory(category: string): string {
  switch (category) {
    case 'payment':
      return 'Payment';
    case 'technical':
      return 'Technical';
    case 'documents':
      return 'Documents';
    case 'operational':
      return 'Operational';
    case 'onboarding':
      return 'Onboarding';
    default:
      return category.charAt(0).toUpperCase() + category.slice(1);
  }
}

/**
 * Format user type for display
 */
export function formatUserType(userType: string): string {
  switch (userType) {
    case 'customer':
      return 'Customer';
    case 'driver':
      return 'Driver';
    case 'operator':
      return 'Operator';
    case 'admin':
      return 'Admin';
    default:
      return userType.charAt(0).toUpperCase() + userType.slice(1);
  }
}

/**
 * Generate ticket preview text
 */
export function formatTicketPreview(description: string, maxLength = 80): string {
  if (description.length <= maxLength) {
    return description;
  }
  return description.substring(0, maxLength).trim() + '...';
}

/**
 * Format ticket direction for display
 */
export function formatTicketDirection(direction: string): string {
  switch (direction) {
    case 'inbound':
      return 'Inbound';
    case 'outbound':
      return 'Outbound';
    default:
      return direction.charAt(0).toUpperCase() + direction.slice(1);
  }
}

/**
 * Get relative time string
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) {
    return 'Just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return formatTicketDate(dateString);
  }
}
