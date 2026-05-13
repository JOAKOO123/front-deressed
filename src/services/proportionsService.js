import { api } from "./api";

export const proportionsService = {
  getProportions: (token) =>
    api.get("/api/users/proportions", token),

  updateProportions: (token, data) =>
    api.put("/api/users/proportions", data, token),
};
