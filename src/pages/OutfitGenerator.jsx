import { useEffect, useState } from "react"
import AppLayout from "../components/AppLayout"

const STYLE_LABELS = ["CASUAL", "TOP", "RELAXED"]

function OutfitCard({ outfit, onUnsave, size }) {
  const isCenter = size === "lg"
  const top = outfit.garments?.find((g) => g.role === "top")
  const bottom = outfit.garments?.find((g) => g.role === "bottom")
  const main = top || bottom

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
      <div style={{ height: card.imgH, background: "#FAF8F4", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {top
          ? <img src={top.imageUrl} alt={top.name} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "bottom" }} />
          : <span style={{ fontSize: 36, color: "#ccc" }}>👕</span>
        }
      </div>

      <div style={{ height: 1, background: "rgba(0,0,0,0.07)", margin: "0 20px" }} />

      <div style={{ height: card.imgH, background: "#FAF8F4", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {bottom
          ? <img src={bottom.imageUrl} alt={bottom.name} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "top" }} />
          : <span style={{ fontSize: 36, color: "#ccc" }}>👖</span>
        }
      </div>

      {isCenter && main && (
        <div style={{ padding: "10px 14px 44px" }}>
          <p style={{ fontSize: 12.5, fontWeight: 600, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{main.name}</p>
          <p style={{ fontSize: 13, fontWeight: 700, margin: "2px 0 0" }}>${Number(main.price).toLocaleString("es-CL")}</p>
        </div>
      )}

      {isCenter && (
        <span style={{
          position: "absolute", top: 12, left: 12,
          background: "#fff", color: "#333",
          fontSize: 10, fontWeight: 700, letterSpacing: "0.05em",
          padding: "3px 9px", borderRadius: 999,
          border: "1px solid rgba(0,0,0,0.1)",
        }}>GUARDADO</span>
      )}

      <button
        onClick={(e) => { e.stopPropagation(); onUnsave() }}
        style={{
          position: "absolute", bottom: 12, right: 12,
          display: "flex", alignItems: "center", gap: 5,
          padding: "5px 11px", borderRadius: 999,
          fontSize: 11.5, fontWeight: 600,
          border: "none", cursor: "pointer",
          background: "rgba(255,255,255,0.92)",
          color: "#333",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          fontFamily: "inherit",
        }}
      >
        ✕ Quitar
      </button>
    </div>
  )
}

const SIZES = ["sm", "lg", "rg"]

export default function OutfitGenerator() {
  const [allOutfits, setAllOutfits] = useState([])
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const raw = localStorage.getItem("saved_outfits")
      return new Set(raw ? JSON.parse(raw) : [])
    } catch { return new Set() }
  })
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    const raw = localStorage.getItem("all_outfits")
    if (raw) {
      try { setAllOutfits(JSON.parse(raw)) } catch { /* ignore */ }
    }
  }, [])

  const handleUnsave = (outfitId) => {
    setSavedIds((prev) => {
      const next = new Set(prev)
      next.delete(outfitId)
      localStorage.setItem("saved_outfits", JSON.stringify([...next]))
      return next
    })
  }

  const savedOutfits = allOutfits.filter((o) => savedIds.has(o.outfitId ?? o.id))
  const page = savedOutfits.slice(activeIdx * 3, activeIdx * 3 + 3)
  const totalDots = Math.max(1, Math.ceil(savedOutfits.length / 3))

  return (
    <AppLayout>
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 40px 32px", position: "relative" }}>

        {savedOutfits.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 80, gap: 16 }}>
            <span style={{ fontSize: 48 }}>♡</span>
            <p style={{ fontWeight: 600, color: "#333" }}>Aún no tienes outfits guardados</p>
            <p style={{ fontSize: 13, color: "#999", textAlign: "center", maxWidth: 320 }}>
              Guarda outfits desde la pantalla principal para verlos aquí.
            </p>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
              {page.map((outfit, i) => {
                const outfitId = outfit.outfitId ?? outfit.id
                const sizeKey = page.length === 1 ? "lg" : SIZES[i] ?? "sm"
                const label = STYLE_LABELS[i] ?? "CASUAL"

                return (
                  <div key={outfitId} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <span style={{ background: "#fff", color: "#333", fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", padding: "3px 10px", borderRadius: 999, border: "1px solid rgba(0,0,0,0.1)" }}>{label}</span>
                    <OutfitCard
                      outfit={outfit}
                      onUnsave={() => handleUnsave(outfitId)}
                      size={sizeKey}
                    />
                  </div>
                )
              })}
            </div>

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