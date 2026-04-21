// Servicio de tallas — reemplaza las simulaciones con tu backend real

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Datos simulados en memoria (tu backend los persistirá)
let mockSizes = null;

export const sizeService = {
  async getSizes(token) {
    await delay(600);
    // Aquí va tu llamada real al backend, por ejemplo:
    // const res = await fetch("/api/profile/sizes", {
    //   headers: { Authorization: `Bearer ${token}` },
    // });
    // if (!res.ok) throw new Error("No se pudo cargar las tallas.");
    // return res.json();

    return mockSizes || null;
  },

  async updateSizes(token, sizesData) {
    await delay(800);
    // Aquí va tu llamada real al backend, por ejemplo:
    // const res = await fetch("/api/profile/sizes", {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${token}`,
    //   },
    //   body: JSON.stringify(sizesData),
    // });
    // if (!res.ok) throw new Error("No se pudo guardar las tallas.");
    // return res.json();

    mockSizes = { ...sizesData };
    return mockSizes;
  },
};