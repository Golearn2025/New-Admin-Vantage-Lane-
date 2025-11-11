/* eslint-disable max-lines */
/**
 * Tests for /api/v1/notifications/send-to-driver
 * 
 * Testing:
 * - Authentication checks
 * - Authorization (admin role verification)
 * - Input validation (Zod schema)
 * - Success responses
 * - Error handling
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from './route';

// Mock Supabase
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

// Mock notification entity
vi.mock('@entities/notification', () => ({
  sendNotificationToDriver: vi.fn(),
}));

import { createClient } from '@/lib/supabase/server';
import { sendNotificationToDriver } from '@entities/notification';

interface MockSupabase {
  auth: {
    getUser: ReturnType<typeof vi.fn>;
  };
  from: ReturnType<typeof vi.fn>;
}

describe('POST /api/v1/notifications/send-to-driver', () => {
  let mockSupabase: MockSupabase;
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup mock Supabase client
    mockSupabase = {
      auth: {
        getUser: vi.fn(),
      },
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(),
          })),
        })),
        insert: vi.fn(),
      })),
    };
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(createClient).mockReturnValue(mockSupabase as any);
    vi.mocked(sendNotificationToDriver).mockResolvedValue({ success: true });
  });
  
  // ✅ TEST 1: Authentication - No user
  it('should return 401 if user is not authenticated', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: new Error('Not authenticated'),
    });
    
    const request = new NextRequest('http://localhost:3000/api/v1/notifications/send-to-driver', {
      method: 'POST',
      body: JSON.stringify({
        driverId: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Test',
        message: 'Test message',
      }),
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });
  
  // ✅ TEST 2: Authorization - Not an admin
  it('should return 403 if user is not an admin', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { 
        user: { 
          id: 'user-123', 
          email: 'user@test.com' 
        } 
      },
      error: null,
    });
    
    // Admin user not found
    mockSupabase.from.mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: new Error('Not found'),
          }),
        })),
      })),
      insert: vi.fn(),
    });
    
    const request = new NextRequest('http://localhost:3000/api/v1/notifications/send-to-driver', {
      method: 'POST',
      body: JSON.stringify({
        driverId: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Test',
        message: 'Test message',
      }),
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(403);
    expect(data.error).toBe('Forbidden');
  });
  
  // ✅ TEST 3: Authorization - Insufficient permissions
  it('should return 403 if user role is not admin/super_admin', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { 
        user: { 
          id: 'user-123', 
          email: 'user@test.com' 
        } 
      },
      error: null,
    });
    
    // User with wrong role
    mockSupabase.from.mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: {
              role: 'viewer',
              is_active: true,
            },
            error: null,
          }),
        })),
      })),
      insert: vi.fn(),
    });
    
    const request = new NextRequest('http://localhost:3000/api/v1/notifications/send-to-driver', {
      method: 'POST',
      body: JSON.stringify({
        driverId: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Test',
        message: 'Test message',
      }),
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(403);
    expect(data.error).toBe('Forbidden');
    expect(data.message).toBe('Insufficient permissions');
  });
  
  // ✅ TEST 4: Authorization - Inactive account
  it('should return 403 if admin account is inactive', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { 
        user: { 
          id: 'user-123', 
          email: 'admin@test.com' 
        } 
      },
      error: null,
    });
    
    // Inactive admin
    mockSupabase.from.mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: {
              role: 'admin',
              is_active: false,
            },
            error: null,
          }),
        })),
      })),
      insert: vi.fn(),
    });
    
    const request = new NextRequest('http://localhost:3000/api/v1/notifications/send-to-driver', {
      method: 'POST',
      body: JSON.stringify({
        driverId: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Test',
        message: 'Test message',
      }),
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(403);
    expect(data.message).toBe('Account is inactive');
  });
  
  // ✅ TEST 5: Validation - Invalid driver ID format
  it('should return 400 if driverId is not a valid UUID', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { 
        user: { 
          id: 'user-123', 
          email: 'admin@test.com' 
        } 
      },
      error: null,
    });
    
    mockSupabase.from.mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: {
              role: 'admin',
              is_active: true,
            },
            error: null,
          }),
        })),
      })),
      insert: vi.fn(),
    });
    
    const request = new NextRequest('http://localhost:3000/api/v1/notifications/send-to-driver', {
      method: 'POST',
      body: JSON.stringify({
        driverId: 'invalid-uuid',
        title: 'Test',
        message: 'Test message',
      }),
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation failed');
  });
  
  // ✅ TEST 6: Validation - Title too long
  it('should return 400 if title exceeds 100 characters', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { 
        user: { 
          id: 'user-123', 
          email: 'admin@test.com' 
        } 
      },
      error: null,
    });
    
    mockSupabase.from.mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: {
              role: 'admin',
              is_active: true,
            },
            error: null,
          }),
        })),
      })),
      insert: vi.fn(),
    });
    
    const request = new NextRequest('http://localhost:3000/api/v1/notifications/send-to-driver', {
      method: 'POST',
      body: JSON.stringify({
        driverId: '123e4567-e89b-12d3-a456-426614174000',
        title: 'A'.repeat(101), // 101 characters
        message: 'Test message',
      }),
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation failed');
  });
  
  // ✅ TEST 7: Success - Valid request
  it('should return 200 and send notification successfully', async () => {
    const mockUserId = 'user-123';
    const mockDriverId = '123e4567-e89b-12d3-a456-426614174000';
    
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { 
        user: { 
          id: mockUserId, 
          email: 'admin@test.com' 
        } 
      },
      error: null,
    });
    
    let insertCalled = false;
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === 'admin_users') {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({
                data: {
                  role: 'admin',
                  is_active: true,
                },
                error: null,
              }),
            })),
          })),
        };
      }
      if (table === 'audit_logs') {
        return {
          insert: vi.fn((data) => {
            insertCalled = true;
            expect(data.user_id).toBe(mockUserId);
            expect(data.action).toBe('send_notification_to_driver');
            return Promise.resolve({ data: {}, error: null });
          }),
        };
      }
      return {};
    });
    
    const request = new NextRequest('http://localhost:3000/api/v1/notifications/send-to-driver', {
      method: 'POST',
      body: JSON.stringify({
        driverId: mockDriverId,
        title: 'Test Notification',
        message: 'This is a test message',
        link: 'https://example.com',
      }),
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe('Notification sent successfully');
    expect(data.driverId).toBe(mockDriverId);
    
    // Verify notification function was called
    expect(sendNotificationToDriver).toHaveBeenCalledWith(
      mockDriverId,
      'Test Notification',
      'This is a test message',
      'https://example.com'
    );
    
    // Verify audit log was created
    expect(insertCalled).toBe(true);
  });
});
