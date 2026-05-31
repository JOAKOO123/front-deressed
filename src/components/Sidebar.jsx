import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const NAV_ITEMS = [
  { label: "Ropa",             path: "/products"             },
  { label: "Mi Estilo",        path: "/my-style"             },
  { label: "Preferencias",     path: "/clothing-preferences" },
  { label: "Ajuste de Tallas", path: "/size-adjustment"      },
  { label: "Generar Outfit",   path: "/"                     },
  { label: "Mis Outfits",      path: "/outfits"              },
  { label: "Favoritos",        path: "/favorites"            },
];

export default function Sidebar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const navItems = [
    ...NAV_ITEMS,
    ...(user?.role === "admin"
      ? [{ label: "⚙ Admin", path: "/admin" }]
      : []),
  ];

  return (
    <aside className="w-1/6 bg-gray-50 p-6 border-r flex flex-col justify-between">
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
          {navItems.map(({ label, path }) => {
            const isActive = path && location.pathname === path;
            const isAdmin  = path === "/admin";
            return (
              <button
                key={label}
                onClick={() => navigate(path)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                  ${isActive
                    ? "bg-black text-white font-semibold"
                    : isAdmin
                    ? "text-gray-500 hover:bg-gray-200 hover:text-black border-t border-gray-200 mt-2 pt-3"
                    : "text-gray-600 hover:bg-gray-200 hover:text-black"
                  }`}
              >
                {label}
              </button>
            );
          })}
        </nav>
      </div>

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