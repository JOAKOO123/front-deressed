import { useNavigate } from "react-router-dom";

/**
 * Barra de completitud del perfil.
 * Recibe el resultado de calculateCompletion() como prop.
 */
export default function ProfileCompletion({ completion, loading }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="h-4 w-40 rounded bg-gray-100 animate-pulse mb-4" />
        <div className="h-3 w-full rounded-full bg-gray-100 animate-pulse" />
      </div>
    );
  }

  if (!completion) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="h-4 w-40 rounded bg-gray-100 animate-pulse mb-4" />
        <div className="h-3 w-full rounded-full bg-gray-100 animate-pulse" />
      </div>
    )
  }

  const { sections = [], percent = 0, doneFields = 0, totalFields = 0 } = completion

  // Color dinámico de la barra según porcentaje
  const barColor =
    percent === 100
      ? "bg-green-500"
      : percent >= 60
      ? "bg-black"
      : percent >= 30
      ? "bg-amber-500"
      : "bg-red-400";

  const statusLabel =
    percent === 100
      ? "¡Perfil completo! 🎉"
      : percent >= 60
      ? "Casi listo, sigue así"
      : percent >= 30
      ? "En progreso"
      : "Recién comenzando";

  // Campos pendientes de TODAS las secciones
  const pendingBySection = sections
    .map((s) => ({
      ...s,
      pending: s.fields.filter((f) => !f.done),
    }))
    .filter((s) => s.pending.length > 0);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      {/* Encabezado */}
      <div className="px-6 pt-6 pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-700">
            Completitud del perfil
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">{statusLabel}</p>
        </div>
        <span
          className={`text-2xl font-black tabular-nums ${
            percent === 100 ? "text-green-500" : "text-black"
          }`}
        >
          {percent}%
        </span>
      </div>

      {/* Barra de progreso */}
      <div className="px-6 pb-5">
        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1.5 text-right">
          {doneFields} de {totalFields} campos completados
        </p>
      </div>

      {/* Secciones con pendientes */}
      {pendingBySection.length > 0 && (
        <div className="border-t border-gray-100">
          <p className="px-6 pt-4 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Qué te falta completar
          </p>
          <div className="flex flex-col divide-y divide-gray-50">
            {pendingBySection.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => navigate(section.path)}
                className="flex items-start gap-3 px-6 py-3 hover:bg-gray-50 transition-colors text-left group"
              >
                {/* Ícono sección */}
                <span className="text-lg shrink-0 mt-0.5">{section.emoji}</span>

                {/* Contenido */}
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-xs font-semibold text-gray-700 group-hover:text-black transition-colors">
                    {section.label}
                  </span>
                  <span className="text-xs text-gray-400 mt-0.5 leading-snug">
                    Falta:{" "}
                    {section.pending.map((f) => f.label).join(", ")}
                  </span>
                </div>

                {/* Contador + flecha */}
                <div className="flex items-center gap-2 shrink-0 mt-0.5">
                  <span className="text-xs bg-gray-100 text-gray-500 font-semibold px-2 py-0.5 rounded-full">
                    {section.pending.length} pendiente{section.pending.length > 1 ? "s" : ""}
                  </span>
                  <span className="text-gray-300 group-hover:text-black transition-colors text-sm">
                    →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Estado completo */}
      {percent === 100 && (
        <div className="border-t border-gray-100 px-6 py-4">
          <p className="text-xs text-green-600 text-center font-medium">
            ✓ Tienes toda la información completa. ¡Las recomendaciones serán más precisas!
          </p>
        </div>
      )}
    </div>
  );
}