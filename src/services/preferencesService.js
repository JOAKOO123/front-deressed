// Servicio de preferencias de vestimenta
// Extraído de ClothingPreferences.jsx

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

let mockPreferences = null;

export const preferencesService = {
  async get(token) {
    await delay(500);
    // const res = await fetch("/api/profile/preferences", {
    //   headers: { Authorization: `Bearer ${token}` },
    // });
    // if (!res.ok) throw new Error("No se pudieron cargar las preferencias.");
    // return res.json();

    return mockPreferences || null;
  },

  async save(token, data) {
    await delay(700);
    // const res = await fetch("/api/profile/preferences", {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${token}`,
    //   },
    //   body: JSON.stringify(data),
    // });
    // if (!res.ok) throw new Error("No se pudieron guardar las preferencias.");
    // return res.json();

    mockPreferences = { ...data };
    return mockPreferences;
  },
};