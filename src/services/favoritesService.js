// Servicio de outfits favoritos
// Conecta con la tabla favorite_outfits (id, user_id, outfit_id, saved_at)
// Reemplaza los mocks con tu backend real cuando esté disponible
import { delay } from "./utils";

// Mock de favoritos en memoria
let mockFavorites = [
  {
    id: 1,
    user_id: 1,
    outfit_id: 1,
    saved_at: "2025-05-01T10:00:00Z",
    outfit: {
      id: 1,
      name: "Casual Streetwear",
      description: "Fit for You",
      image: "https://via.placeholder.com/150",
    },
  },
  {
    id: 2,
    user_id: 1,
    outfit_id: 2,
    saved_at: "2025-05-03T14:30:00Z",
    outfit: {
      id: 2,
      name: "Winter Style",
      description: "Warm & Comfortable",
      image: "https://via.placeholder.com/150",
    },
  },
];

export const favoritesService = {
  async getFavorites(token) {
    await delay(700);
    // Llamada real al backend:
    // const res = await fetch("/api/favorites", {
    //   headers: { Authorization: `Bearer ${token}` },
    // });
    // if (!res.ok) throw new Error("No se pudieron cargar los favoritos.");
    // return res.json();

    return mockFavorites;
  },

  async removeFavorite(token, favoriteId) {
    await delay(500);
    // Llamada real al backend:
    // const res = await fetch(`/api/favorites/${favoriteId}`, {
    //   method: "DELETE",
    //   headers: { Authorization: `Bearer ${token}` },
    // });
    // if (!res.ok) throw new Error("No se pudo eliminar el favorito.");

    mockFavorites = mockFavorites.filter((f) => f.id !== favoriteId);
    return { success: true };
  },
};