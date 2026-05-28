import { api } from "./api"

export const adminService = {
  async getMetrics() {
    return api("/api/admin/metrics")
  },

  async getUsers({ page = 0, size = 20 } = {}) {
    return api(`/api/admin/users?page=${page}&size=${size}`)
  },
}