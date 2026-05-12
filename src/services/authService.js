// Simulación de API de auth — reemplaza con tu backend real
import { delay } from "./utils";

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

  async forgotPassword(email) {
    await delay(800);
    // Aquí va tu llamada real al backend, por ejemplo:
    // const res = await fetch("/api/auth/forgot-password", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ email }),
    // });
    // if (!res.ok) throw new Error("Error al enviar el correo.");

    // Simulación: siempre devuelve éxito (por seguridad no revelar si el email existe)
    return { success: true };
  },

  async resetPassword(token, newPassword) {
    await delay(800);
    // Aquí va tu llamada real al backend, por ejemplo:
    // const res = await fetch("/api/auth/reset-password", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ token, newPassword }),
    // });
    // if (!res.ok) throw new Error("El enlace expiró o es inválido.");

    // Simulación: token inválido si no empieza con "reset_"
    if (!token.startsWith("reset_")) {
      throw new Error("El enlace de recuperación es inválido o ha expirado.");
    }
    return { success: true };
  },
};
