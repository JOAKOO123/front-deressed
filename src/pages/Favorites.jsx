import { useEffect, useState } from "react"
import AppLayout from "../components/AppLayout"
import Spinner from "../components/Spinner"
import { outfitService } from "../services/outfitService"
import { useAuth } from "../hooks/useAuth"

function OutfitMannequin({ garments, onUnsave }) {
  const top = garments.find((g) => g.role === "top")
  const bottom = garments.find((g) => g.role === "bottom")
  const main = top || bottom

  return (
    <div className="relative w-full max-w-xs overflow-hidden rounded-[24px] bg-[#F5F0E8] shadow-sm">
      {/* TOP */}
      <div className="h-[170px] overflow-hidden bg-[#F5F0E8]">
        {top ? (
          <img
            src={top.imageUrl}
            alt={top.name}
            className="h-full w-full object-contain object-bottom"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[32px] text-gray-300">
            👕
          </div>
        )}
      </div>

      {/* DIVISOR */}
      <div className="mx-6 h-px bg-black/10" />

      {/* BOTTOM */}
      <div className="h-[170px] overflow-hidden bg-[#F5F0E8]">
        {bottom ? (
          <img
            src={bottom.imageUrl}
            alt={bottom.name}
            className="h-full w-full object-contain object-top"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[32px] text-gray-300">
            👖
          </div>
        )}
      </div>

      {/* INFO */}
      {main && (
        <div className="px-4 pb-12 pt-3">
          <p className="truncate text-[13px] font-semibold text-gray-900">{main.name}</p>
          <p className="mt-0.5 text-[13px] font-bold text-gray-900">
            ${Number(main.price).toLocaleString("es-CL")}
          </p>
        </div>
      )}

      {/* BOTÓN QUITAR */}
      <button
        onClick={onUnsave}
        className="absolute bottom-3 right-3 rounded-full bg-black px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-gray-800"
      >
        ♥ Guardado
      </button>
    </div>
  )
}

export default function Favorites() {
  const { user } = useAuth()
  const [allOutfits, setAllOutfits] = useState([])
  const [loading, setLoading] = useState(true)
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const raw = localStorage.getItem("saved_outfits")
      return new Set(raw ? JSON.parse(raw) : [])
    } catch {
      return new Set()
    }
  })

  useEffect(() => {
    if (!user) return
    outfitService
      .getMyOutfits()
      .then((data) => setAllOutfits(Array.isArray(data) ? data : data?.content ?? data?.outfits ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  const savedOutfits = allOutfits.filter((o) => savedIds.has(o.outfitId))

  const handleUnsave = (outfitId) => {
    setSavedIds((prev) => {
      const next = new Set(prev)
      next.delete(outfitId)
      localStorage.setItem("saved_outfits", JSON.stringify([...next]))
      return next
    })
  }

  return (
    <AppLayout>
      <div className="min-h-full p-6 pt-10 flex flex-col items-center justify-center">
        <div className="w-full max-w-6xl">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-900">Favoritos</h2>
            <p className="mt-1 text-sm text-gray-500">Tus outfits guardados</p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center gap-3 text-gray-400 py-20">
              <Spinner text="Cargando favoritos..." />
            </div>
          ) : savedOutfits.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
              <p className="text-4xl">♡</p>
              <p className="font-semibold text-gray-700">No tienes favoritos aún</p>
              <p className="text-sm text-gray-400">
                Guarda outfits desde la página principal para verlos aquí.
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-6">
              {savedOutfits.map((outfit) => (
                <div key={outfit.outfitId} className="relative flex flex-col items-center gap-3">
                  <OutfitMannequin
                    garments={outfit.garments ?? []}
                    onUnsave={() => handleUnsave(outfit.outfitId)}
                  />
                  <p className="text-xs text-gray-400">
                    {outfit.generatedAt ? new Date(outfit.generatedAt).toLocaleDateString("es-CL") : "Fecha no disponible"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}