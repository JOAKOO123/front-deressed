import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Al cargar la app, revisar si hay sesión guardada en cookie
  useEffect(() => {
    const token = getCookie("auth_token");
    const savedUser = getCookie("auth_user");
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        clearSession();
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token, rememberMe) => {
    const maxAge = rememberMe ? 60 * 60 * 24 * 7 : null;
    setCookie("auth_token", token, maxAge);
    setCookie("auth_user", JSON.stringify(userData), maxAge);
    setUser(userData);
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  // Actualiza campos del usuario en estado y cookie (ej: nombre desde perfil)
  const updateUserProfile = (updatedFields) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedFields };
      setCookie("auth_user", JSON.stringify(next), null);
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// ── Helpers de cookies ──────────────────────────────────────────────
function setCookie(name, value, maxAge) {
  let cookie = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Strict`;
  if (maxAge) cookie += `; max-age=${maxAge}`;
  document.cookie = cookie;
}

function getCookie(name) {
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

function clearSession() {
  document.cookie = "auth_token=; path=/; max-age=0";
  document.cookie = "auth_user=; path=/; max-age=0";
}