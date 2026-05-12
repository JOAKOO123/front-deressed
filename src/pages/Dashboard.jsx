import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import AppLayout from "../components/AppLayout"

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <AppLayout>
      <div className="flex-1 flex items-center justify-center p-4 min-h-full">
        <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center gap-4 max-w-sm w-full">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-2xl font-bold">Hola, {user?.name}</h1>
          <p className="text-gray-500 text-sm">{user?.email}</p>
          <p className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">
            Sesion activa
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full mt-2 py-2.5 border border-black rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Ir al inicio
          </button>
        </div>
      </div>
    </AppLayout>
  )
}