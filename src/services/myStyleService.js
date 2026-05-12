// Servicio de estilo personal
// Extraído de MyStyle.jsx y Profile.jsx — única fuente de verdad

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

let mockMyStyle = null;

export const myStyleService = {
  async get(token) {
    await delay(500);
    // const res = await fetch("/api/profile/style", {
    //   headers: { Authorization: `Bearer ${token}` },
    // });
    // if (!res.ok) throw new Error("No se pudo cargar el estilo.");
    // return res.json();

    return mockMyStyle || null;
  },

  async save(token, data) {
    await delay(700);
    // const res = await fetch("/api/profile/style", {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${token}`,
    //   },
    //   body: JSON.stringify(data),
    // });
    // if (!res.ok) throw new Error("No se pudo guardar el estilo.");
    // return res.json();

    mockMyStyle = { ...data };
    return mockMyStyle;
  },
};