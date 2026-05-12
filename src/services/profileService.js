import { authApi } from "./api";

export const profileService = {
  async getProfile(token) {
    return authApi("/api/users/profile", token);
  },

  async updateProfile(token, data) {
    return authApi("/api/users/profile", token, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async updateSkin(token, data) {
    return authApi("/api/users/profile/skin", token, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async getCompleteness(token) {
    return authApi("/api/users/profile/completeness", token);
  },
};