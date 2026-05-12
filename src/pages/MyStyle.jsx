import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../components/AppLayout";
import Spinner from "../components/Spinner";
import { myStyleService } from "../services/myStyleService";

// ── Datos de tono de piel ────────────────────────────────────────────
const SKIN_TONES = [
  { id: "muy_claro",    label: "Muy claro",    hex: "#FDDBB4", desc: "Piel muy clara, se quema fácilmente" },
  { id: "claro",        label: "Claro",        hex: "#F5C18A", desc: "Piel clara con algo de rosado" },
  { id: "medio_claro",  label: "Medio claro",  hex: "#E8A876", desc: "Piel media con tono cálido" },
  { id: "medio",        label: "Medio",        hex: "#C68642", desc: "Piel olivácea o castaña media" },
  { id: "medio_oscuro", label: "Medio oscuro", hex: "#8D5524", desc: "Piel castaña oscura o marrón" },
  { id: "oscuro",       label: "Oscuro",       hex: "#4A2912", desc: "Piel muy oscura o ébano" },
];

// ── Paletas de colores por temporada/subtono ─────────────────────────
const COLOR_PALETTES = [
  {
    id: "primavera",
    label: "Primavera",
    subtitle: "Cálido y claro",
    description: "Colores frescos y luminosos que realzan pieles cálidas y claras.",
    colors: ["#FFD700","#FF8C69","#98FB98","#87CEEB","#FFB347","#DDA0DD","#F0E68C","#FF6B6B"],
  },
  {
    id: "verano",
    label: "Verano",
    subtitle: "Frío y claro",
    description: "Tonos suaves y empolvados ideales para pieles frías y claras.",
    colors: ["#B0C4DE","#DDA0DD","#F08080","#98D8C8","#C3B1E1","#FFB6C1","#A8D8EA","#E8D5B7"],
  },
  {
    id: "otono",
    label: "Otoño",
    subtitle: "Cálido y profundo",
    description: "Tonos tierra y ricos que favorecen pieles cálidas y oscuras.",
    colors: ["#8B4513","#CD853F","#D2691E","#556B2F","#B8860B","#A0522D","#6B8E23","#8B0000"],
  },
  {
    id: "invierno",
    label: "Invierno",
    subtitle: "Frío y profundo",
    description: "Colores intensos y contrastantes para pieles frías y oscuras.",
    colors: ["#000080","#8B0000","#006400","#4B0082","#2F4F4F","#800000","#191970","#FFFFFF"],
  },
  {
    id: "neutro",
    label: "Neutro",
    subtitle: "Versátil",
    description: "Paleta equilibrada que funciona con cualquier tono de piel.",
    colors: ["#808080","#A9A9A9","#D3D3D3","#4A4A4A","#C0A882","#8B7355","#F5F5DC","#2C2C2C"],
  },
];

// ── Colores disponibles ───────────────────────────────────────────────
const AVAILABLE_COLORS = [
  { id: "negro",    label: "Negro",    hex: "#1a1a1a" },
  { id: "blanco",   label: "Blanco",   hex: "#f5f5f5" },
  { id: "gris",     label: "Gris",     hex: "#9E9E9E" },
  { id: "beige",    label: "Beige",    hex: "#C8A882" },
  { id: "marron",   label: "Marrón",   hex: "#795548" },
  { id: "rojo",     label: "Rojo",     hex: "#E53935" },
  { id: "rosa",     label: "Rosa",     hex: "#F48FB1" },
  { id: "naranja",  label: "Naranja",  hex: "#FF7043" },
  { id: "amarillo", label: "Amarillo", hex: "#FDD835" },
  { id: "verde",    label: "Verde",    hex: "#43A047" },
  { id: "azul",     label: "Azul",     hex: "#1E88E5" },
  { id: "celeste",  label: "Celeste",  hex: "#81D4FA" },
  { id: "morado",   label: "Morado",   hex: "#8E24AA" },
  { id: "lila",     label: "Lila",     hex: "#CE93D8" },
  { id: "dorado",   label: "Dorado",   hex: "#FFD600" },
  { id: "plateado", label: "Plateado", hex: "#B0BEC5" },
];

// ── Header ────────────────────────────────────────────────────────────
// ── Componente principal ──────────────────────────────────────────────
export default function MyStyle() {
  const navigate = useNavigate();
  const { user, getToken } = useAuth();

  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(false);
  const [successMessage, setSuccessMsg] = useState("");
  const [serverError, setServerError]   = useState("");

  const [skinTone,       setSkinTone]       = useState("");
  const [palette,        setPalette]        = useState("");
  const [favoriteColors, setFavoriteColors] = useState([]);
  const [avoidColors,    setAvoidColors]    = useState([]);

  useEffect(() => {
    if (!user) { navigate("/login", { replace: true }); return; }
    myStyleService.get(getToken())
      .then((data) => {
        if (data) {
          setSkinTone(data.skinTone || "");
          setPalette(data.palette || "");
          setFavoriteColors(data.favoriteColors || []);
          setAvoidColors(data.avoidColors || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, navigate, getToken]);

  const toggleColor = (id, list, setList, otherList, setOtherList) => {
    if (list.includes(id)) {
      setList(list.filter((c) => c !== id));
    } else {
      setList([...list, id]);
      if (otherList.includes(id)) setOtherList(otherList.filter((c) => c !== id));
    }
  };

  const handleSave = async () => {
    setSaving(true); setServerError(""); setSuccessMsg("");
    try {
      await myStyleService.save(getToken(), { skinTone, palette, favoriteColors, avoidColors });
      setSuccessMsg("¡Estilo guardado correctamente!");
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err) {
      setServerError(err.message || "Ocurrió un error al guardar.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex-1 flex items-center justify-center min-h-full">
          <Spinner text="Cargando tu estilo..." />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex items-center justify-center p-4 min-h-full">
        <div className="w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden bg-white text-black">

          <div className="flex border-b border-gray-200">
            <div className="flex-1 py-4 text-sm font-semibold text-black border-b-2 border-black text-center">
              My Style
            </div>
          </div>

          <div className="p-8 flex flex-col gap-8">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold">Tono de piel y colores</h1>
              <p className="text-sm text-gray-500">
                Esta información nos ayuda a recomendarte outfits que realmente te favorezcan.
              </p>
            </div>

            {serverError    && <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-500 flex items-center gap-2"><span>✕</span>{serverError}</div>}
            {successMessage && <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-3 text-sm text-green-600 flex items-center gap-2"><span>✓</span>{successMessage}</div>}

            {/* Tono de piel */}
            <section className="flex flex-col gap-3">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Tono de piel</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {SKIN_TONES.map((tone) => (
                  <button
                    key={tone.id}
                    type="button"
                    title={tone.desc}
                    onClick={() => setSkinTone(skinTone === tone.id ? "" : tone.id)}
                    className={`flex flex-col items-center gap-2 p-2 rounded-xl border-2 transition-all
                      ${skinTone === tone.id ? "border-black shadow-md scale-105" : "border-gray-200 hover:border-gray-400"}`}
                  >
                    <span className="w-10 h-10 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: tone.hex }} />
                    <span className="text-xs font-medium text-center leading-tight">{tone.label}</span>
                  </button>
                ))}
              </div>
              {skinTone && (
                <p className="text-xs text-gray-400 mt-1">{SKIN_TONES.find((t) => t.id === skinTone)?.desc}</p>
              )}
            </section>

            {/* Paleta */}
            <section className="flex flex-col gap-3">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Paleta de colores que te favorece</label>
              <div className="flex flex-col gap-3">
                {COLOR_PALETTES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPalette(palette === p.id ? "" : p.id)}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left
                      ${palette === p.id ? "border-black bg-gray-50 shadow-sm" : "border-gray-200 hover:border-gray-400"}`}
                  >
                    <div className="flex gap-1 shrink-0">
                      {p.colors.map((hex) => (
                        <span key={hex} className="w-5 h-5 rounded-full border border-black/10" style={{ backgroundColor: hex }} />
                      ))}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-semibold">
                        {p.label} <span className="text-xs font-normal text-gray-400">— {p.subtitle}</span>
                      </span>
                      <span className="text-xs text-gray-500 truncate">{p.description}</span>
                    </div>
                    {palette === p.id && <span className="ml-auto text-black font-bold text-lg shrink-0">✓</span>}
                  </button>
                ))}
              </div>
            </section>

            {/* Colores favoritos */}
            <section className="flex flex-col gap-3">
              <div className="flex flex-col gap-0.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Colores que te gustan</label>
                <p className="text-xs text-gray-400">Selecciona los colores que disfrutas usar.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_COLORS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleColor(c.id, favoriteColors, setFavoriteColors, avoidColors, setAvoidColors)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all
                      ${favoriteColors.includes(c.id) ? "border-black bg-black text-white shadow-sm" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}
                  >
                    <span className="w-3 h-3 rounded-full border border-black/20 shrink-0" style={{ backgroundColor: c.hex }} />
                    {c.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Colores a evitar */}
            <section className="flex flex-col gap-3">
              <div className="flex flex-col gap-0.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Colores que prefieres evitar</label>
                <p className="text-xs text-gray-400">El sistema no te sugerirá outfits con estos colores.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_COLORS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleColor(c.id, avoidColors, setAvoidColors, favoriteColors, setFavoriteColors)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all
                      ${avoidColors.includes(c.id) ? "border-red-400 bg-red-50 text-red-600 shadow-sm" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}
                  >
                    <span className="w-3 h-3 rounded-full border border-black/20 shrink-0" style={{ backgroundColor: c.hex }} />
                    {c.label}
                  </button>
                ))}
              </div>
            </section>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving || (!skinTone && !palette && favoriteColors.length === 0 && avoidColors.length === 0)}
              className="mt-2 py-3 rounded-lg font-semibold text-sm bg-black text-white hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {saving ? "Guardando..." : "Guardar estilo"}
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}