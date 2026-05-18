import { api } from "./api";

export const sizeService = {
  async getSizes() {
    return api("/api/users/sizes");
  },

  async updateSizes(data) {
    return api("/api/users/sizes", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};