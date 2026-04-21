// Simulación de API de auth — reemplaza con tu backend real

export const authService = {
  async login({ email, password }) {
    // Simula delay de red
    await delay(800);

    // Simula usuario válido de prueba
    if (email === "test@gmail.com" && password === "Test@123") {
      return {
        token: "mock_token_" + Math.random().toString(36).substring(2),
        user: { id: 1, email, name: "Usuario Test" },
      };
    }

    // Simula error del servidor
    throw new Error("Credenciales incorrectas. Verifica tu email y contraseña.");
  },

  async register({ email, password }) {
    await delay(800);

    // Simula email ya registrado
    if (email === "test@gmail.com") {
      throw new Error("Este email ya está registrado.");
    }

    return {
      token: "mock_token_" + Math.random().toString(36).substring(2),
      user: { id: 2, email, name: email.split("@")[0] },
    };
  },
};

const delay = (ms) => new Promise((res) => setTimeout(res, ms));