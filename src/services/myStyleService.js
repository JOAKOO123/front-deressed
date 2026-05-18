import { api } from "./api";

export const myStyleService = {
  async get() {
    return api("/api/users/profile/styles");
  },

  async save(styles) {
    return api("/api/users/profile/styles", {
      method: "PUT",
      body: JSON.stringify({ styles }),
    });
  },
};