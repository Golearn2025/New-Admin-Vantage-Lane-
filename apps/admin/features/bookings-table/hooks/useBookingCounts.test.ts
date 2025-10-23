/**
 * useBookingCounts Hook Tests
 * 
 * Tests booking counts fetching, loading states, and error handling
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useBookingCounts } from './useBookingCounts';

// Mock fetch
global.fetch = vi.fn();

describe('useBookingCounts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should start with loading state', () => {
    (global.fetch as any).mockImplementation(() => new Promise(() => {})); // Never resolves
    
    const { result } = renderHook(() => useBookingCounts());
    
    expect(result.current.isLoading).toBe(true);
    expect(result.current.counts).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should fetch and return booking counts', async () => {
    const mockCounts = {
      all: 100,
      pending: 25,
      active: 15,
      completed: 50,
      cancelled: 10,
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ counts: mockCounts }),
    });

    const { result } = renderHook(() => useBookingCounts());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.counts).toEqual(mockCounts);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch errors', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useBookingCounts());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.counts).toBeNull();
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Network error');
  });

  it('should handle non-ok responses', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      statusText: 'Internal Server Error',
    });

    const { result } = renderHook(() => useBookingCounts());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.counts).toBeNull();
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toContain('Failed to fetch');
  });

  it('should provide refetch function', async () => {
    const mockCounts = {
      all: 100,
      pending: 25,
      active: 15,
      completed: 50,
      cancelled: 10,
    };

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ counts: mockCounts }),
    });

    const { result } = renderHook(() => useBookingCounts());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);

    // Call refetch
    await result.current.refetch();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  it('should handle refetch errors', async () => {
    // First call succeeds
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ counts: { all: 100, pending: 25, active: 15, completed: 50, cancelled: 10 } }),
    });

    const { result } = renderHook(() => useBookingCounts());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Second call (refetch) fails
    (global.fetch as any).mockRejectedValueOnce(new Error('Refetch error'));

    await result.current.refetch();

    await waitFor(() => {
      expect(result.current.error?.message).toBe('Refetch error');
    });
  });

  it('should call correct API endpoint', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ counts: { all: 0, pending: 0, active: 0, completed: 0, cancelled: 0 } }),
    });

    renderHook(() => useBookingCounts());

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/bookings/counts');
    });
  });
});
