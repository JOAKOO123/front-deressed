import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { profileService } from "../services/profileService"
import ProfileCompletion from "../components/ProfileCompletion"
import AppLayout from "../components/AppLayout"

const QUICK_ACTIONS = [
  {
    label: "Ver ropa",
    description: "Explorar catálogo personalizado",
    path: "/products",
    accent: true,
  },
  {
    label: "Mi estilo",
    description: "Colores y tonos de piel",
    path: "/my-style",
    accent: false,
  },
  {
    label: "Favoritos",
    description: "Outfits guardados",
    path: "/favorites",
    accent: false,
  },
  {
    label: "Mi perfil",
    description: "Editar información personal",
    path: "/profile",
    accent: false,
  },
]

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [completion, setCompletion] = useState(null)
  const [loadingCompletion, setLoadingCompletion] = useState(true)

  useEffect(() => {
    profileService.getCompleteness()
      .then((data) => setCompletion(data))
      .catch(() => setCompletion(null))
      .finally(() => setLoadingCompletion(false))
  }, [])

  const initial = user?.name?.charAt(0).toUpperCase() ?? "?"

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto w-full">

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-4">
          <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0 select-none">
            {initial}
          </div>
          <div className="flex flex-col gap-0.5">
            <h1 className="text-lg font-bold leading-tight">
              Hola, {user?.name ?? "bienvenido"}
            </h1>
            <p className="text-sm text-gray-400">{user?.email}</p>
          </div>
        </div>

        <ProfileCompletion completion={completion} loading={loadingCompletion} />

        <div className="grid grid-cols-2 gap-4">
          {QUICK_ACTIONS.map(({ label, description, path, accent }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`rounded-2xl p-5 flex flex-col gap-2 text-left transition-colors
                ${accent
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-white border border-gray-100 shadow-sm hover:border-gray-300 text-black"
                }`}
            >
              <p className="font-semibold text-sm">{label}</p>
              <p className={`text-xs ${accent ? "text-gray-400" : "text-gray-400"}`}>
                {description}
              </p>
            </button>
          ))}
        </div>

      </div>
    </AppLayout>
  )
}