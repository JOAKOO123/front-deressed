const BASE_URL = import.meta.env.VITE_BFF_URL;

export const api = async (endpoint, options = {}) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Error en la solicitud");
  }

  if (res.status === 204) return null;
  return res.json();
};

export const authApi = (endpoint, token, options = {}) =>
  api(endpoint, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });