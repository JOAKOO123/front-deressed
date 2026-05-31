import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import AppLayout from "../components/AppLayout"
import { outfitService } from "../services/outfitService"
import { useAuth } from "../hooks/useAuth"

/* ─── Badge de estilo sobre cada card ─── */
const STYLE_LABELS = ["CASUAL", "TOP", "RELAXED"]

function OutfitCard({ outfit, onSave, saved, size }) {
  const isCenter = size === "lg"
  const top    = outfit.garments?.find((g) => g.role === "top")
  const bottom = outfit.garments?.find((g) => g.role === "bottom")
  const main   = top || bottom

  const card = {
    sm: { w: 220, imgH: 200, tilt: "perspective(800px) rotateY(6deg) translateX(-8px)" },
    lg: { w: 280, imgH: 260, tilt: "none" },
    rg: { w: 220, imgH: 200, tilt: "perspective(800px) rotateY(-6deg) translateX(8px)" },
  }[size] ?? { w: 220, imgH: 200, tilt: "none" }

  return (
    <div
      style={{
        width: card.w,
        background: "#FAF8F4",
        borderRadius: 22,
        overflow: "hidden",
        position: "relative",
        transform: card.tilt,
        opacity: isCenter ? 1 : 0.82,
        boxShadow: isCenter
          ? "0 16px 48px rgba(0,0,0,0.13)"
          : "0 6px 20px rgba(0,0,0,0.07)",
      }}
    >
      {/* Parte superior */}
      <div style={{ height: card.imgH, background: "#FAF8F4", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {top ? (
          <a
            href={top.productLink || top.link || "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}
          >
            <img
              src={top.imageUrl}
              alt={top.name}
              style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "bottom", transition: "transform 0.18s ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.07)" }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)" }}
            />
          </a>
        ) : (
          <span style={{ fontSize: 36, color: "#ccc" }}>👕</span>
        )}
      </div>

      {/* Divisor */}
      <div style={{ height: 1, background: "rgba(0,0,0,0.07)", margin: "0 20px" }} />

      {/* Parte inferior */}
      <div style={{ height: card.imgH, background: "#FAF8F4", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {bottom ? (
          <a
            href={bottom.productLink || bottom.link || "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}
          >
            <img
              src={bottom.imageUrl}
              alt={bottom.name}
              style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "top", transition: "transform 0.18s ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.07)" }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)" }}
            />
          </a>
        ) : (
          <span style={{ fontSize: 36, color: "#ccc" }}>👖</span>
        )}
      </div>

      {/* Info (solo card central) */}
      {isCenter && main && (
        <div style={{ padding: "10px 14px 44px" }}>
          <p style={{ fontSize: 12.5, fontWeight: 600, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{main.name}</p>
          <p style={{ fontSize: 13, fontWeight: 700, margin: "2px 0 0" }}>${Number(main.price).toLocaleString("es-CL")}</p>
        </div>
      )}

      {/* Badge TOP en card central */}
      {isCenter && (
        <span style={{
          position: "absolute", top: 12, left: 12,
          background: "#fff", color: "#333",
          fontSize: 10, fontWeight: 700, letterSpacing: "0.05em",
          padding: "3px 9px", borderRadius: 999,
          border: "1px solid rgba(0,0,0,0.1)",
        }}>TOP</span>
      )}

      {/* Botón guardar */}
      <button
        onClick={(e) => { e.stopPropagation(); onSave() }}
        style={{
          position: "absolute", bottom: 12, right: 12,
          display: "flex", alignItems: "center", gap: 5,
          padding: "5px 11px", borderRadius: 999,
          fontSize: 11.5, fontWeight: 600,
          border: "none", cursor: "pointer",
          background: saved ? "#111" : "rgba(255,255,255,0.92)",
          color: saved ? "#fff" : "#333",
          boxShadow: saved ? "none" : "0 2px 8px rgba(0,0,0,0.1)",
          fontFamily: "inherit",
        }}
      >
        {saved ? "♥ Guardado" : "♡ Guardar"}
      </button>
    </div>
  )
}

const SIZES = ["sm", "lg", "rg"]

export default function Home() {
  const { user }    = useAuth()
  const navigate    = useNavigate()
  const [outfits, setOutfits]       = useState([])
  const [loading, setLoading]       = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError]           = useState("")
  const [activeIdx, setActiveIdx]   = useState(0)
  const [savedIds, setSavedIds]     = useState(() => {
    try {
      const raw = localStorage.getItem("saved_outfits")
      return new Set(raw ? JSON.parse(raw) : [])
    } catch { return new Set() }
  })

  useEffect(() => {
    if (!user) return
    setLoading(true)
    outfitService.getMyOutfits()
      .then((data) => {
        setOutfits(data)
        localStorage.setItem("all_outfits", JSON.stringify(data))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  const handleGenerate = async () => {
    if (!user) { navigate("/login"); return }
    setGenerating(true)
    setError("")
    try {
      const newOutfit = await outfitService.generateOutfit()
      setOutfits((prev) => {
        const next = [newOutfit, ...prev]
        localStorage.setItem("all_outfits", JSON.stringify(next))
        return next
      })
      setActiveIdx(0)
    } catch (e) {
      setError(e.message || "No se pudo generar el outfit. Asegúrate de tener tallas registradas.")
    } finally {
      setGenerating(false)
    }
  }

  const handleSave = (outfitId) => {
    setSavedIds((prev) => {
      const next = new Set(prev)
      next.has(outfitId) ? next.delete(outfitId) : next.add(outfitId)
      localStorage.setItem("saved_outfits", JSON.stringify([...next]))
      return next
    })
  }

  /* Agrupa outfits en páginas de 3 */
  const page      = outfits.slice(activeIdx * 3, activeIdx * 3 + 3)
  const totalDots = Math.max(1, Math.ceil(outfits.length / 3))

  return (
    <AppLayout>
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 40px 32px", position: "relative" }}>

        {error && (
          <div style={{ background: "#fff0f0", border: "1px solid #ffc9c9", borderRadius: 12, padding: "10px 16px", fontSize: 13, color: "#d63031", marginBottom: 24 }}>
            {error}
          </div>
        )}

        {/* Sin sesión */}
        {!user && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 80, gap: 16 }}>
            <span style={{ fontSize: 48 }}></span>
            <p style={{ fontWeight: 600, color: "#333" }}>Descubre tu estilo personalizado</p>
            <p style={{ fontSize: 13, color: "#999", textAlign: "center", maxWidth: 320 }}>
              Crea una cuenta o inicia sesión para que generemos outfits a tu medida.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <button onClick={() => navigate("/register")}
                style={{ background: "#111", color: "#fff", border: "none", borderRadius: 999, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                Crear cuenta
              </button>
              <button onClick={() => navigate("/login")}
                style={{ background: "none", color: "#444", border: "1.5px solid rgba(0,0,0,0.15)", borderRadius: 999, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                Iniciar sesión
              </button>
            </div>
          </div>
        )}

        {/* Cargando */}
        {user && loading && (
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}>
            <span style={{ width: 32, height: 32, border: "2.5px solid #111", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
          </div>
        )}

        {/* Sin outfits */}
        {user && !loading && outfits.length === 0 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 80, gap: 12 }}>
            <span style={{ fontSize: 48 }}>✨</span>
            <p style={{ fontWeight: 600, color: "#333" }}>Aún no tienes outfits</p>
            <p style={{ fontSize: 13, color: "#999", textAlign: "center", maxWidth: 320 }}>
              Presiona "Generar outfit" para crear tu primer look personalizado.
            </p>
          </div>
        )}

        {/* Grid de outfits */}
        {user && !loading && outfits.length > 0 && (
          <>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
              {page.map((outfit, i) => {
                const globalI  = activeIdx * 3 + i
                const isLatest = globalI === 0
                const sizeKey  = page.length === 1 ? "lg" : SIZES[i] ?? "sm"
                const label    = STYLE_LABELS[i] ?? "CASUAL"

                return (
                  <div key={outfit.outfitId} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    {/* Badge estilo */}
                    {isLatest
                      ? <span style={{ background: "#111", color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", padding: "3px 10px", borderRadius: 999 }}>RECIENTE</span>
                      : <span style={{ background: "#fff", color: "#333", fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", padding: "3px 10px", borderRadius: 999, border: "1px solid rgba(0,0,0,0.1)" }}>{label}</span>
                    }
                    <OutfitCard
                      outfit={outfit}
                      onSave={() => handleSave(outfit.outfitId)}
                      saved={savedIds.has(outfit.outfitId)}
                      size={sizeKey}
                    />
                  </div>
                )
              })}
            </div>

            {/* Botón generar — siempre visible */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
              <button
                onClick={handleGenerate}
                disabled={generating}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "#111", color: "#fff",
                  border: "none", borderRadius: 999,
                  padding: "10px 20px", fontSize: 13, fontWeight: 600,
                  cursor: generating ? "not-allowed" : "pointer",
                  opacity: generating ? 0.5 : 1,
                  fontFamily: "inherit",
                }}
              >
                {generating
                  ? <><span style={{ width: 14, height: 14, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} /> Generando...</>
                  : "✨ Generar nuevo outfit"
                }
              </button>
            </div>

            {/* Navegación de páginas */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 24 }}>
              <button
                onClick={() => setActiveIdx((i) => Math.max(0, i - 1))}
                disabled={activeIdx === 0}
                style={{
                  width: 32, height: 32, borderRadius: "50%", border: "1.5px solid rgba(0,0,0,0.15)",
                  background: "#fff", cursor: activeIdx === 0 ? "not-allowed" : "pointer",
                  opacity: activeIdx === 0 ? 0.3 : 1,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, fontWeight: 600, color: "#111",
                }}
              >
                ←
              </button>

              <div style={{ display: "flex", gap: 7 }}>
                {Array.from({ length: totalDots }).map((_, di) => (
                  <button
                    key={di}
                    onClick={() => setActiveIdx(di)}
                    style={{
                      width: 8, height: 8, borderRadius: "50%", border: "none", cursor: "pointer", padding: 0,
                      background: di === activeIdx ? "#111" : "rgba(0,0,0,0.2)",
                    }}
                  />
                ))}
              </div>

              <button
                onClick={() => setActiveIdx((i) => Math.min(totalDots - 1, i + 1))}
                disabled={activeIdx === totalDots - 1}
                style={{
                  width: 32, height: 32, borderRadius: "50%", border: "1.5px solid rgba(0,0,0,0.15)",
                  background: "#fff", cursor: activeIdx === totalDots - 1 ? "not-allowed" : "pointer",
                  opacity: activeIdx === totalDots - 1 ? 0.3 : 1,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, fontWeight: 600, color: "#111",
                }}
              >
                →
              </button>
            </div>
          </>
        )}

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </AppLayout>
  )
}