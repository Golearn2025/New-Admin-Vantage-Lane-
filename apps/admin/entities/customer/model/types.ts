/**
 * Customer Entity - Type Definitions
 */

export interface CustomerData {
  id: string;
  createdAt: string;
  updatedAt: string;
  // Add your fields here
}

export interface CreateCustomerPayload {
  // Add required fields for creation
}

export interface UpdateCustomerPayload {
  // Add optional fields for update
}
