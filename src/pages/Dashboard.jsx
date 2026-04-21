import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="h-14 flex items-center justify-center border-b border-gray-200 bg-gray-100">
        <button onClick={() => navigate("/")} className="text-xl font-black tracking-[0.25em] uppercase hover:opacity-60 transition-opacity">
          DRESSED
        </button>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center gap-4 max-w-sm w-full">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white text-2xl">👤</div>
          <h1 className="text-2xl font-bold">¡Hola, {user?.name}!</h1>
          <p className="text-gray-500 text-sm">{user?.email}</p>
          <p className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">✓ Sesión activa</p>
          <button onClick={() => navigate("/")} className="w-full mt-2 py-2.5 border border-black rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
            Ir al inicio
          </button>
          <button onClick={handleLogout} className="w-full py-2.5 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors">
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}