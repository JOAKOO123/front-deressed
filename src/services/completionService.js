import { authApi } from "./api";

export const completionService = {
  async getCompleteness(token) {
    return authApi("/api/users/profile/completeness", token);
  },
};