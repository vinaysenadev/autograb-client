import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useVehicleUpload } from './useVehicleUpload';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch as unknown as typeof fetch;

describe('useVehicleUpload', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('initial state is correct', () => {
    const { result } = renderHook(() => useVehicleUpload());
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.data).toBe(null);
  });

  it('handles successful upload', async () => {
    const mockResponse = {
      success: true,
      vehicle: { make: 'Ford', model: 'Everest', badge: 'Titanium' },
      logbook: 'file-content'
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useVehicleUpload());

    await act(async () => {
      await result.current.uploadVehicle({
        make: 'Ford',
        model: 'Everest',
        badge: 'Titanium',
        fileContent: 'file-content'
      });
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.data).toEqual(mockResponse);
  });

  it('handles failed upload with server error message', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Invalid details' }),
    });

    const { result } = renderHook(() => useVehicleUpload());

    await act(async () => {
      try {
        await result.current.uploadVehicle({
          make: 'Ford',
          model: 'Everest',
          badge: '',
          fileContent: null
        });
      } catch (e) {
        // Catching the explicitly thrown error
      }
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Invalid details');
  });

  it('handles network error and captures message', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Failed to fetch'));

    const { result } = renderHook(() => useVehicleUpload());

    await act(async () => {
      try {
        await result.current.uploadVehicle({
          make: 'Ford',
          model: 'Everest',
          badge: '',
          fileContent: null
        });
      } catch (e) {
        // Catching the explicitly thrown error
      }
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Failed to fetch');
  });
});
