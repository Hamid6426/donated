import { create } from "zustand";
import axiosInstance from "../api/axiosInstance"; // we'll define this next

const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: false,

  // Fetch user on app load or after login
  fetchUser: async () => {
    try {
      set({ loading: true });
      const res = await axiosInstance.get("/user/profile");
      set({ user: res.data.user, isAuthenticated: true });
    } catch (err) {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ loading: false });
    }
  },

  // Login
  login: async (email, password) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.post("/auth/login", { email, password });
      await get().fetchUser(); // refresh user state
      return res;
    } catch (err) {
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // Logout
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },
}));

export default useAuthStore;
