import { authApi } from "./api";

export const myStyleService = {
  async get(token) {
    return authApi("/api/users/profile/styles", token);
  },

  async save(token, data) {
    return authApi("/api/users/profile/styles", token, {
      method: "PUT",
      body: JSON.stringify({ styles: data.styles || [] }),
    });
  },
};