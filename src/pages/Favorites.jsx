import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import Spinner from "../components/Spinner";
import OutfitCard from "../components/OutfitCard";
import { favoritesService } from "../services/favoritesService";

export default function Favorites() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    favoritesService
      .getFavorites()
      .then((data) => setFavorites(data))
      .catch(() => setError("No se pudieron cargar los favoritos. Intenta de nuevo."))
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (favoriteId) => {
    try {
      await favoritesService.removeFavorite(favoriteId);
      setFavorites((prev) => prev.filter((f) => f.id !== favoriteId));
    } catch {
      setError("No se pudo eliminar el favorito.");
    }
  };

  return (
    <AppLayout>
      <div className="p-6 flex flex-col items-center justify-center min-h-full">
        <h2 className="text-xl font-semibold mb-6">Your Favorite Outfits</h2>

        {loading && (
          <div className="flex flex-col items-center gap-3 text-gray-400 py-20">
            <Spinner text="Cargando favoritos..." />
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center gap-3 py-20">
            <p className="text-gray-500 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-sm font-semibold underline underline-offset-2"
            >
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && favorites.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <p className="text-4xl">🤍</p>
            <p className="font-semibold text-gray-700">Aún no tienes favoritos</p>
            <p className="text-sm text-gray-400">
              Explora los outfits y guarda los que más te gusten.
            </p>
          </div>
        )}

        {!loading && !error && favorites.length > 0 && (
          <div className="flex gap-4 flex-wrap justify-center">
            {favorites.map((fav) => (
              <div key={fav.id} className="relative group">
                <OutfitCard outfit={fav.outfit} />
                <button
                  onClick={() => handleRemove(fav.id)}
                  className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center
                             text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  title="Quitar de favoritos"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => navigate("/products")}
          className="mt-6 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Explorar outfits
        </button>
      </div>
    </AppLayout>
  );
}