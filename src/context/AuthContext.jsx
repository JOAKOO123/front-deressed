import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

// ── Helpers de localStorage ─────────────────────────────────────────
const TOKEN_KEY = "auth_token";
const USER_KEY  = "auth_user";

function saveSession(token, userData) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(userData));
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ── Validación de expiración JWT (criterio 60) ──────────────────────
function isTokenExpired(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (!payload.exp) return false;
    return Date.now() / 1000 > payload.exp;
  } catch {
    return false;
  }
}

// ────────────────────────────────────────────────────────────────────

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getStoredToken();
    const savedUser = getStoredUser();

    if (token && savedUser) {
      if (isTokenExpired(token)) {
        clearSession();
      } else {
        setUser(savedUser);
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    saveSession(token, userData);
    setUser(userData);
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  const updateUserProfile = (updatedFields) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedFields };
      localStorage.setItem(USER_KEY, JSON.stringify(next));
      return next;
    });
  };

  const getToken = () => getStoredToken();

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUserProfile, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

