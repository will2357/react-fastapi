import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useAuthStore from '../src/store/useAuthStore';

describe('useAuthStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.getState().logout();
  });

  it('should have initial state', () => {
    const { result } = renderHook(() => useAuthStore());
    expect(result.current.token).toBeNull();
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('should set token', () => {
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      result.current.setToken('test-token');
    });
    
    expect(result.current.token).toBe('test-token');
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should set user', () => {
    const { result } = renderHook(() => useAuthStore());
    const testUser = { username: 'admin', email: 'admin@example.com' };
    
    act(() => {
      result.current.setUser(testUser);
    });
    
    expect(result.current.user).toEqual(testUser);
  });

  it('should login successfully', async () => {
    const { result } = renderHook(() => useAuthStore());
    const mockLogin = vi.fn().mockResolvedValue({ access_token: 'test-token' });
    
    await act(async () => {
      await result.current.login(mockLogin);
    });
    
    expect(mockLogin).toHaveBeenCalled();
    expect(result.current.token).toBe('test-token');
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle login error', async () => {
    const { result } = renderHook(() => useAuthStore());
    const mockLogin = vi.fn().mockRejectedValue(new Error('Login failed'));
    
    await act(async () => {
      try {
        await result.current.login(mockLogin);
      } catch (e) {
        // Expected to throw
      }
    });
    
    expect(result.current.error).toBe('Login failed');
    expect(result.current.isLoading).toBe(false);
  });

  it('should logout', () => {
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      result.current.setToken('test-token');
      result.current.setUser({ username: 'admin' });
    });
    
    act(() => {
      result.current.logout();
    });
    
    expect(result.current.token).toBeNull();
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should clear error', () => {
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      result.current.setToken('test-token');
    });
    
    act(() => {
      result.current.clearError();
    });
    
    expect(result.current.error).toBeNull();
  });
});
