import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CLOTHING_STYLES = [
  {
    id: "casual",
    label: "Casual",
    emoji: "👕",
    description: "Ropa cómoda y relajada para el día a día.",
    examples: "Jeans, poleras, zapatillas",
  },
  {
    id: "formal",
    label: "Formal",
    emoji: "👔",
    description: "Prendas elegantes para entornos profesionales o eventos.",
    examples: "Trajes, camisas, zapatos de vestir",
  },
  {
    id: "smart_casual",
    label: "Smart Casual",
    emoji: "🧥",
    description: "Equilibrio entre formal y casual, versátil para muchas ocasiones.",
    examples: "Chinos, camisas sin corbata, blazer",
  },
  {
    id: "streetwear",
    label: "Streetwear",
    emoji: "🧢",
    description: "Inspirado en la cultura urbana y el skate.",
    examples: "Hoodies, sneakers, gorras, joggers",
  },
  {
    id: "minimalista",
    label: "Minimalista",
    emoji: "⬜",
    description: "Prendas simples, paleta neutra y líneas limpias.",
    examples: "Básicos de calidad, tonos tierra y neutros",
  },
  {
    id: "deportivo",
    label: "Deportivo / Athleisure",
    emoji: "🏃",
    description: "Ropa deportiva que también funciona en lo cotidiano.",
    examples: "Leggings, poleras técnicas, zapatillas deportivas",
  },
  {
    id: "bohemio",
    label: "Bohemio",
    emoji: "🌸",
    description: "Estilo libre, fluido y con influencias étnicas o artísticas.",
    examples: "Vestidos largos, estampados, accesorios naturales",
  },
  {
    id: "vintage",
    label: "Vintage / Retro",
    emoji: "🕶️",
    description: "Inspirado en décadas pasadas con un toque moderno.",
    examples: "Prendas de segunda mano, estampados retro, denim",
  },
  {
    id: "preppy",
    label: "Preppy",
    emoji: "🎽",
    description: "Estilo clásico y pulido con influencia universitaria.",
    examples: "Polos, chinos, mocasines, colores pastel",
  },
  {
    id: "rock",
    label: "Rock / Edgy",
    emoji: "🖤",
    description: "Estilo oscuro y atrevido con actitud.",
    examples: "Cuero, negro, cadenas, botas, graphics tees",
  },
  {
    id: "elegant",
    label: "Elegante",
    emoji: "✨",
    description: "Prendas sofisticadas para ocasiones especiales.",
    examples: "Vestidos de noche, accesorios finos, telas nobles",
  },
  {
    id: "outdoor",
    label: "Outdoor / Aventura",
    emoji: "🏔️",
    description: "Ropa funcional para actividades al aire libre.",
    examples: "Chaquetas técnicas, pantalones cargo, botas de trekking",
  },
];

const OCCASIONS = [
  { id: "trabajo",      label: "Trabajo / Oficina",  emoji: "💼" },
  { id: "casual_dia",   label: "Casual diario",       emoji: "☀️" },
  { id: "salida_noche", label: "Salida de noche",     emoji: "🌙" },
  { id: "deporte",      label: "Deporte",             emoji: "🏋️" },
  { id: "eventos",      label: "Eventos / Fiestas",   emoji: "🎉" },
  { id: "viaje",        label: "Viaje",               emoji: "✈️" },
  { id: "cita",         label: "Cita",                emoji: "💕" },
  { id: "playa",        label: "Playa / Verano",      emoji: "🏖️" },
];

let mockPreferences = null;
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const preferencesService = {
  async get(token)        { await delay(500); return mockPreferences || null; },
  async save(token, data) { await delay(700); mockPreferences = { ...data }; return mockPreferences; },
};

const Header = ({ navigate }) => (
  <header className="h-14 flex items-center justify-center border-b border-gray-200 bg-gray-100">
    <button onClick={() => navigate("/")} className="text-xl font-black tracking-[0.25em] uppercase hover:opacity-60 transition-opacity">
      DRESSED
    </button>
  </header>
);

export default function ClothingPreferences() {
  const navigate = useNavigate();
  const { user, getToken } = useAuth();

  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(false);
  const [successMessage, setSuccessMsg] = useState("");
  const [serverError, setServerError]   = useState("");
  const [selectedStyles,    setSelectedStyles]    = useState([]);
  const [selectedOccasions, setSelectedOccasions] = useState([]);

  useEffect(() => {
    if (!user) { navigate("/login", { replace: true }); return; }
    preferencesService.get(getToken())
      .then((data) => {
        if (data) {
          setSelectedStyles(data.styles || []);
          setSelectedOccasions(data.occasions || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, navigate, getToken]);

  const toggleItem = (id, list, setList) => {
    setList(list.includes(id) ? list.filter((i) => i !== id) : [...list, id]);
  };

  const hasSelection = selectedStyles.length > 0 || selectedOccasions.length > 0;

  const handleSave = async () => {
    setSaving(true); setServerError(""); setSuccessMsg("");
    try {
      await preferencesService.save(getToken(), { styles: selectedStyles, occasions: selectedOccasions });
      setSuccessMsg("¡Preferencias guardadas correctamente!");
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err) {
      setServerError(err.message || "Ocurrió un error al guardar.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Header navigate={navigate} />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-gray-400">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
            <p className="text-sm">Cargando preferencias...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header navigate={navigate} />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden bg-white text-black">

          <div className="flex border-b border-gray-200">
            <div className="flex-1 py-4 text-sm font-semibold text-black border-b-2 border-black text-center">
              Clothing Preferences
            </div>
          </div>

          <div className="p-8 flex flex-col gap-8">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold">Preferencias de estilo</h1>
              <p className="text-sm text-gray-500">
                Selecciona los estilos y ocasiones que mejor te representan para recibir recomendaciones personalizadas.
              </p>
            </div>

            {serverError    && <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-500 flex items-center gap-2"><span>✕</span>{serverError}</div>}
            {successMessage && <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-3 text-sm text-green-600 flex items-center gap-2"><span>✓</span>{successMessage}</div>}

            {/* Estilos */}
            <section className="flex flex-col gap-3">
              <div className="flex flex-col gap-0.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Estilos de vestimenta</label>
                <p className="text-xs text-gray-400">Puedes elegir varios estilos que te identifiquen.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CLOTHING_STYLES.map((style) => {
                  const isSelected = selectedStyles.includes(style.id);
                  return (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => toggleItem(style.id, selectedStyles, setSelectedStyles)}
                      className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all
                        ${isSelected ? "border-black bg-black text-white shadow-sm" : "border-gray-200 hover:border-gray-400 text-black"}`}
                    >
                      <span className="text-2xl shrink-0">{style.emoji}</span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold">{style.label}</span>
                        <span className={`text-xs mt-0.5 ${isSelected ? "text-gray-300" : "text-gray-500"}`}>{style.description}</span>
                        <span className={`text-xs mt-1 italic ${isSelected ? "text-gray-400" : "text-gray-400"}`}>Ej: {style.examples}</span>
                      </div>
                      {isSelected && <span className="ml-auto text-white font-bold text-base shrink-0">✓</span>}
                    </button>
                  );
                })}
              </div>
              {selectedStyles.length > 0 && (
                <p className="text-xs text-gray-400">{selectedStyles.length} estilo{selectedStyles.length > 1 ? "s" : ""} seleccionado{selectedStyles.length > 1 ? "s" : ""}</p>
              )}
            </section>

            {/* Ocasiones */}
            <section className="flex flex-col gap-3">
              <div className="flex flex-col gap-0.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Ocasiones principales</label>
                <p className="text-xs text-gray-400">¿Para qué situaciones buscas outfits más seguido?</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {OCCASIONS.map((occ) => {
                  const isSelected = selectedOccasions.includes(occ.id);
                  return (
                    <button
                      key={occ.id}
                      type="button"
                      onClick={() => toggleItem(occ.id, selectedOccasions, setSelectedOccasions)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all
                        ${isSelected ? "border-black bg-black text-white shadow-sm" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}
                    >
                      <span>{occ.emoji}</span>
                      {occ.label}
                    </button>
                  );
                })}
              </div>
              {selectedOccasions.length > 0 && (
                <p className="text-xs text-gray-400">{selectedOccasions.length} ocasión{selectedOccasions.length > 1 ? "es" : ""} seleccionada{selectedOccasions.length > 1 ? "s" : ""}</p>
              )}
            </section>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !hasSelection}
              className="mt-2 py-3 rounded-lg font-semibold text-sm bg-black text-white hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {saving ? "Guardando..." : "Guardar preferencias"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}