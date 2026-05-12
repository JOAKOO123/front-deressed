// Servicio de perfil — reemplaza las simulaciones con tu backend real
import { delay } from "./utils";

// Datos simulados en memoria (se pierden al recargar — tu backend los persistirá)
let mockProfile = null;

export const profileService = {
  async getProfile(token) {
    await delay(600);
    // Aquí va tu llamada real al backend, por ejemplo:
    // const res = await fetch("/api/profile", {
    //   headers: { Authorization: `Bearer ${token}` },
    // });
    // if (!res.ok) throw new Error("No se pudo cargar el perfil.");
    // return res.json();

    return mockProfile || null;
  },

  async updateProfile(token, profileData) {
    await delay(800);
    // Aquí va tu llamada real al backend, por ejemplo:
    // const res = await fetch("/api/profile", {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${token}`,
    //   },
    //   body: JSON.stringify(profileData),
    // });
    // if (!res.ok) throw new Error("No se pudo guardar el perfil.");
    // return res.json();

    mockProfile = { ...profileData };
    return mockProfile;
  },
};