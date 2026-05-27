import { api } from "./api"

export const favoritesService = {
  async getFavorites() {
    try {
      return await api("/api/favorites")
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "El backend de favoritos aún no está disponible")
    }
  },

  async removeFavorite(favoriteId) {
    try {
      return await api(`/api/favorites/${favoriteId}`, {
        method: "DELETE",
      })
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "El backend de favoritos aún no está disponible")
    }
  },

  async addFavorite(outfitId) {
    try {
      return await api("/api/favorites", {
        method: "POST",
        body: JSON.stringify({ outfitId }),
      })
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "El backend de favoritos aún no está disponible")
    }
  },
}