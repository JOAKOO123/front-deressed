const BASE_URL = import.meta.env.VITE_BFF_URL;

let onUnauthorized = null;

export function registerUnauthorizedHandler(fn) {
  onUnauthorized = fn;
}

// Mensajes genéricos por código HTTP — nunca exponemos detalles del servidor
const HTTP_ERROR_MESSAGES = {
  400: "Los datos enviados no son válidos.",
  401: "No autenticado.",
  403: "No tienes permiso para realizar esta acción.",
  404: "El recurso solicitado no existe.",
  409: "Ya existe un registro con esos datos.",
  422: "Los datos enviados no pudieron ser procesados.",
  429: "Demasiados intentos. Espera unos minutos e inténtalo de nuevo.",
  500: "Ocurrió un error en el servidor. Intenta más tarde.",
  502: "El servicio no está disponible en este momento.",
  503: "El servicio no está disponible en este momento.",
}

function getPublicMessage(status) {
  return HTTP_ERROR_MESSAGES[status] ?? "Ocurrió un error inesperado. Intenta de nuevo."
}

export const api = async (endpoint, options = {}) => {
  let res;

  try {
    res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  } catch {
    // Error de red — el servidor no respondió
    throw new Error("No se pudo conectar con el servidor. Verifica tu conexión.")
  }

  if (res.status === 401) {
    if (endpoint !== "/api/auth/me" && onUnauthorized) {
      onUnauthorized();
    }
    throw new Error(getPublicMessage(401))
  }

  if (!res.ok) {
    // Consumimos el body del error pero nunca lo mostramos al usuario
    await res.json().catch(() => {})
    throw new Error(getPublicMessage(res.status))
  }

  if (res.status === 204) return null;
  const text = await res.text();
  if (!text) return null;
  return JSON.parse(text);
};