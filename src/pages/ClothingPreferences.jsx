import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { myStyleService } from "../services/myStyleService";
import AppLayout from "../components/AppLayout";
import Spinner from "../components/Spinner";

const CLOTHING_STYLES = [
  { id: "casual", label: "Casual", description: "Ropa cómoda y relajada para el día a día.", examples: "Jeans, poleras, zapatillas" },
  { id: "formal", label: "Formal", description: "Prendas elegantes para entornos profesionales.", examples: "Trajes, camisas, zapatos de vestir" },
  { id: "deportivo", label: "Deportivo", description: "Ropa deportiva que también funciona en lo cotidiano.", examples: "Leggings, poleras técnicas, zapatillas deportivas" },
  { id: "elegante", label: "Elegante", description: "Prendas sofisticadas para ocasiones especiales.", examples: "Vestidos de noche, accesorios finos, telas nobles" },
  { id: "streetwear", label: "Streetwear", description: "Inspirado en la cultura urbana y el skate.", examples: "Hoodies, sneakers, gorras, joggers" },
];

export default function ClothingPreferences() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMsg] = useState("");
  const [serverError, setServerError] = useState("");
  const [selectedStyles, setSelectedStyles] = useState([]);

  useEffect(() => {
    if (!user) { navigate("/login", { replace: true }); return; }
    myStyleService.get()
      .then((data) => {
        if (data) setSelectedStyles(data.styles || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const toggleStyle = (id) => {
    setSelectedStyles((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    setSaving(true); setServerError(""); setSuccessMsg("");
    try {
      await myStyleService.save(selectedStyles);
      setSuccessMsg("Preferencias guardadas correctamente");
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err) {
      setServerError(err.message || "Ocurrio un error al guardar.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex-1 flex items-center justify-center min-h-full">
          <Spinner text="Cargando preferencias..." />
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
              Preferencias de estilo
            </div>
          </div>

          <div className="p-8 flex flex-col gap-8">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold">Preferencias de vestimenta</h1>
              <p className="text-sm text-gray-500">Selecciona los estilos que mejor te representan.</p>
            </div>

            {serverError    && <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-500">{serverError}</div>}
            {successMessage && <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-3 text-sm text-green-600">{successMessage}</div>}

            <section className="flex flex-col gap-3">
              <div className="flex flex-col gap-0.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Estilos de vestimenta</label>
                <p className="text-xs text-gray-400">Puedes elegir varios estilos que te identifiquen.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CLOTHING_STYLES.map((style) => {
                  const isSelected = selectedStyles.includes(style.id);
                  return (
                    <button key={style.id} type="button" onClick={() => toggleStyle(style.id)}
                      className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${isSelected ? "border-black bg-black text-white shadow-sm" : "border-gray-200 hover:border-gray-400 text-black"}`}>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-sm font-semibold">{style.label}</span>
                        <span className={`text-xs mt-0.5 ${isSelected ? "text-gray-300" : "text-gray-500"}`}>{style.description}</span>
                        <span className={`text-xs mt-1 italic ${isSelected ? "text-gray-400" : "text-gray-400"}`}>Ej: {style.examples}</span>
                      </div>
                      {isSelected && <span className="ml-auto text-white font-bold text-base shrink-0">OK</span>}
                    </button>
                  );
                })}
              </div>
              {selectedStyles.length > 0 && (
                <p className="text-xs text-gray-400">
                  {selectedStyles.length} estilo{selectedStyles.length > 1 ? "s" : ""} seleccionado{selectedStyles.length > 1 ? "s" : ""}
                </p>
              )}
            </section>

            <button type="button" onClick={handleSave}
              disabled={saving || selectedStyles.length === 0}
              className="mt-2 py-3 rounded-lg font-semibold text-sm bg-black text-white hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              {saving ? "Guardando..." : "Guardar preferencias"}
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}