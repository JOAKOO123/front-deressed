import { api } from "./api";

export const authService = {
  async login(email, password) {
    return api("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  async register(email, password) {
    return api("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  async forgotPassword(email) {
    return api("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  async resetPassword(token, newPassword) {
    return api("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, newPassword }),
    });
  },
};
