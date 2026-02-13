import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  username: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  isLoading: boolean;
  isHydrated: boolean;
  setHydrated: () => void;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  login: (loginFn: () => Promise<{ access_token: string }>) => Promise<{ access_token: string }>;
  logout: () => void;
  clearError: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      error: null,
      isLoading: false,
      isHydrated: false,

      setHydrated: () => {
        set({ isHydrated: true });
      },

      setToken: (token) => {
        set({ token, isAuthenticated: !!token });
      },

      setUser: (user) => {
        set({ user });
      },

      login: async (loginFn) => {
        set({ isLoading: true, error: null });
        try {
          const result = await loginFn();
          localStorage.setItem('token', result.access_token);
          localStorage.setItem('user', JSON.stringify({ username: 'admin' }));
          set({
            token: result.access_token,
            user: { username: 'admin' },
            isAuthenticated: true,
            isLoading: false,
          });
          return result;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          error: null,
        });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);

export default useAuthStore;
