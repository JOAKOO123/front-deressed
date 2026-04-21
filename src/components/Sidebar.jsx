import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="w-1/5 bg-gray-50 p-6 border-r flex flex-col justify-between">
      {/* Parte superior */}
      <div>
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
          <p className="mt-3 text-sm font-semibold">
            {user ? user.name : "Profile & Preferences"}
          </p>
          {user && (
            <p className="text-xs text-gray-400 mt-1">{user.email}</p>
          )}
        </div>

        <nav className="space-y-4 text-gray-600">
          <p>My Style</p>
          <p>Clothing Preferences</p>
          <p>Size Adjustment</p>
          <p>Favorites</p>
          <p>Fit Settings</p>
        </nav>
      </div>

      {/* Parte inferior */}
      <div className="flex flex-col gap-2">
        {user ? (
          <button
            onClick={handleLogout}
            className="w-full border border-black text-black text-sm py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cerrar sesión
          </button>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-black text-white text-sm py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => navigate("/register")}
              className="w-full border border-black text-black text-sm py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Registrarse
            </button>
          </>
        )}
      </div>
    </aside>
  );
}