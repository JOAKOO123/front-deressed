import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { label: "Ropa",                 path: "/products"            },
  { label: "My Style",             path: "/my-style"            },
  { label: "Clothing Preferences", path: "/clothing-preferences"},
  { label: "Size Adjustment",      path: "/size-adjustment"     },
  { label: "Favorites",            path: null                   },
  { label: "Fit Settings",         path: null                   },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
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
          <button
            onClick={() => navigate(user ? "/profile" : "/login")}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-16 h-16 bg-gray-300 rounded-full group-hover:ring-2 group-hover:ring-black transition-all" />
            <p className="mt-3 text-sm font-semibold group-hover:underline underline-offset-2 transition-all">
              {user ? user.name : "Profile & Preferences"}
            </p>
          </button>
          {user && (
            <p className="text-xs text-gray-400 mt-1">{user.email}</p>
          )}
        </div>

        <nav className="space-y-1">
          {NAV_ITEMS.map(({ label, path }) => {
            const isActive    = path && location.pathname === path;
            const isClickable = !!path;
            return isClickable ? (
              <button
                key={label}
                onClick={() => navigate(path)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                  ${isActive
                    ? "bg-black text-white font-semibold"
                    : "text-gray-600 hover:bg-gray-200 hover:text-black"
                  }`}
              >
                {label}
              </button>
            ) : (
              <p key={label} className="px-3 py-2 text-sm text-gray-400 cursor-default">
                {label}
              </p>
            );
          })}
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