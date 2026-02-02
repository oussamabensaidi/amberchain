import { create } from "zustand";
import storage from "@/lib/storage";

const useAuthStore = create((set) => ({
  user: storage.getUser() || null,
  token: storage.getToken() || null,

  setAuth: (user, token) => {
    set({ user, token });
    storage.setUser(user);
    storage.setToken(token);
  },

  logout: () => {
    set({ user: null, token: null });
    storage.clearAuth();
  },
}));

export default useAuthStore;
