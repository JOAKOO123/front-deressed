const BASE_URL = import.meta.env.VITE_BFF_URL;

let onUnauthorized = null;

export function registerUnauthorizedHandler(fn) {
  onUnauthorized = fn;
}

export const api = async (endpoint, options = {}) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (res.status === 401) {
    // /api/auth/me verifica si hay sesión activa — un 401 aquí
    // significa "no hay sesión", no "sesión expirada". No redirigir.
    if (endpoint !== "/api/auth/me" && onUnauthorized) {
      onUnauthorized();
    }
    throw new Error("No autenticado");
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || error.error || "Error en la solicitud");
  }

  if (res.status === 204) return null;
  const text = await res.text();
  if (!text) return null;
  return JSON.parse(text);
};