import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiClient from "../api/client";

export interface User {
  username: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isHydrated: boolean;
  setHydrated: () => void;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, _get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isHydrated: false,

      setHydrated: () => set({ isHydrated: true }),

      setToken: (token) => set({ token, isAuthenticated: !!token }),

      setUser: (user) => set({ user }),

      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const formData = new URLSearchParams();
          formData.append("username", username);
          formData.append("password", password);

          const response = await apiClient.post<{ access_token: string }>(
            "/api/v1/auth/login",
            formData,
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          );

          const token = response.data.access_token;

          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify({ username }));

          set({
            token,
            user: { username },
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          let errorMessage = "Login failed";
          const err = error as { response?: { data?: { detail?: string } }; message?: string };
          if (err.response?.data?.detail) {
            errorMessage = err.response.data.detail;
          } else if (err.message) {
            errorMessage = err.message;
          }
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        error: state.error,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);

export default useAuthStore;
