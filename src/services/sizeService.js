import { authApi } from "./api";

export const sizeService = {
  async getSizes(token) {
    return authApi("/api/users/sizes", token);
  },

  async updateSizes(token, data) {
    return authApi("/api/users/sizes", token, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};