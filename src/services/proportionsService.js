import { api } from "./api";

export const proportionsService = {
  async getProportions() {
    return api("/api/users/proportions");
  },

  async updateProportions(data) {
    return api("/api/users/proportions", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};
