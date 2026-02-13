import { create } from "zustand";
import { persist } from "zustand/middleware";

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

          const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Invalid username or password");
          }

          const data = await response.json();
          const token = data.access_token;

          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify({ username }));

          set({
            token,
            user: { username },
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Login failed",
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
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);

export default useAuthStore;
