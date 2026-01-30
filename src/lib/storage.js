// src/lib/storage.js
// Wrapper to centralize storage (defaults to sessionStorage for better security)
const isBrowser = typeof window !== "undefined";
const store = isBrowser && window.sessionStorage ? window.sessionStorage : {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
};

const storage = {
  getItem: (key) => {
    try {
      return store.getItem(key);
    } catch (e) {
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      store.setItem(key, value);
    } catch (e) {
      // ignore
    }
  },
  removeItem: (key) => {
    try {
      store.removeItem(key);
    } catch (e) {
      // ignore
    }
  },

  // JSON helpers
  getJSON: (key) => {
    const v = storage.getItem(key);
    if (!v) return null;
    try {
      return JSON.parse(v);
    } catch (e) {
      return null;
    }
  },
  setJSON: (key, obj) => {
    storage.setItem(key, JSON.stringify(obj));
  },

  // Auth helpers
  getToken: () => storage.getItem("token") || storage.getItem("jwt") || null,
  setToken: (token) => {
    storage.setItem("token", token);
    // keep jwt for backward compat where code expects it
    storage.setItem("jwt", token);
  },
  removeToken: () => {
    storage.removeItem("token");
    storage.removeItem("jwt");
  },
  getUser: () => storage.getJSON("user") || storage.getJSON("user_data") || null,
  setUser: (user) => {
    try {
      storage.setJSON("user", user);
      storage.setJSON("user_data", user);
    } catch (e) {}
  },
  removeUser: () => {
    storage.removeItem("user");
    storage.removeItem("user_data");
  },
  clearAuth: () => {
    storage.removeToken();
    storage.removeUser();
  }
};

export default storage;
