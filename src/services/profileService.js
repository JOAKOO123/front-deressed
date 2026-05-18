import { api } from "./api";

export const profileService = {
  async getProfile() {
    return api("/api/users/profile");
  },

  async updateProfile(data) {
    return api("/api/users/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async updateSkin(data) {
    return api("/api/users/profile/skin", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async getCompleteness() {
    return api("/api/users/profile/completeness");
  },
};