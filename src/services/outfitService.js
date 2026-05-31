import { api } from "./api"

export const outfitService = {
  async generateOutfit() {
    return api("/api/outfits/generate", { method: "POST" })
  },

  async getMyOutfits() {
    return api("/api/outfits")
  },
}