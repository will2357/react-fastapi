import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      error: null,
      isLoading: false,

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
          set({
            token: result.access_token,
            user: { username: 'admin' },
            isAuthenticated: true,
            isLoading: false,
          });
          return result;
        } catch (error) {
          set({
            error: error.message || 'Login failed',
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
    }
  )
);

export default useAuthStore;
