/**
 * Notification API Client
 * 
 * Client-side wrappers for secure API routes
 * Calls /api/v1/notifications/* endpoints with proper error handling
 */

interface SendNotificationResponse {
  success: boolean;
  message: string;
  driverId: string;
}

/**
 * Send notification to a specific driver (via secure API route)
 * 
 * @param driverId - UUID of the driver
 * @param title - Notification title
 * @param message - Notification message
 * @param link - Optional link URL
 * @returns Promise with success status
 */
export async function sendNotificationToDriverClient(
  driverId: string,
  title: string,
  message: string,
  link?: string
): Promise<SendNotificationResponse> {
  
  const response = await fetch('/api/v1/notifications/send-to-driver', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ driverId, title, message, link })
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || data.message || 'Failed to send notification');
  }
  
  return data;
}
