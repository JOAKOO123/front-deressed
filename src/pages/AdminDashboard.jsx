import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import AppLayout from "../components/AppLayout"
import Spinner from "../components/Spinner"
import { adminService } from "../services/adminService"

function StatCard({ label, value, sub, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm text-left transition-transform hover:-translate-y-0.5 hover:shadow-md"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-3xl font-semibold text-black">{value ?? "—"}</p>
        <span className="text-xs font-semibold text-gray-400">ver detalle →</span>
      </div>
      {sub && <p className="mt-2 text-sm text-gray-400">{sub}</p>}
    </button>
  )
}

function Badge({ active }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
        active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
      }`}
    >
      {active ? "Activo" : "Inactivo"}
    </span>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Cerrar modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
      />
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-black">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 hover:text-black"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  )
}

const CARD_DETAILS = (metrics, fmt) => ({
  usuarios: {
    title: "Usuarios registrados",
    content: (
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Total registrados</p>
          <p className="mt-2 text-2xl font-semibold text-black">{fmt(metrics?.totalUsers)}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Nuevos últimos 7 días</p>
          <p className="mt-2 text-2xl font-semibold text-black">{fmt(metrics?.newUsersLast7Days)}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Nuevos últimos 30 días</p>
          <p className="mt-2 text-2xl font-semibold text-black">{fmt(metrics?.newUsersLast30Days)}</p>
        </div>
      </div>
    ),
  },
  activos: {
    title: "Usuarios activos",
    content: (
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Total activos</p>
          <p className="mt-2 text-2xl font-semibold text-black">{fmt(metrics?.totalActiveUsers)}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Inactivos +7 días</p>
          <p className="mt-2 text-2xl font-semibold text-black">{fmt(metrics?.inactiveUsers7Days)}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Inactivos +30 días</p>
          <p className="mt-2 text-2xl font-semibold text-black">{fmt(metrics?.inactiveUsers30Days)}</p>
        </div>
      </div>
    ),
  },
  nuevos: {
    title: "Nuevos usuarios por día",
    content: (
      <div className="space-y-3">
        {metrics?.newUsersPerDay?.length > 0 ? (
          [...metrics.newUsersPerDay].reverse().map((entry) => (
            <div key={entry.date} className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
              <span className="text-sm font-medium text-gray-700">
                {new Date(entry.date).toLocaleDateString("es-CL")}
              </span>
              <span className="rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
                {entry.count}
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">Sin datos disponibles.</p>
        )}
      </div>
    ),
  },
  inactivos: {
    title: "Usuarios inactivos",
    content: (
      <div className="space-y-3">
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Sin actividad +7 días</p>
          <p className="mt-2 text-2xl font-semibold text-black">{fmt(metrics?.inactiveUsers7Days)}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Sin actividad +30 días</p>
          <p className="mt-2 text-2xl font-semibold text-black">{fmt(metrics?.inactiveUsers30Days)}</p>
        </div>
        <p className="text-sm text-gray-500">
          Un usuario se considera inactivo cuando no ha actualizado su perfil en el período indicado.
        </p>
      </div>
    ),
  },
})

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [metrics, setMetrics] = useState(null)
  const [users, setUsers] = useState([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(0)
  const [loadingMetrics, setLoadingMetrics] = useState(true)
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [error, setError] = useState("")
  const [activeModal, setActiveModal] = useState(null)

  useEffect(() => {
    adminService
      .getMetrics()
      .then(setMetrics)
      .catch(() => setError("No se pudieron cargar las métricas."))
      .finally(() => setLoadingMetrics(false))
  }, [])

  useEffect(() => {
    setLoadingUsers(true)
    adminService
      .getUsers({ page, size: 15 })
      .then((data) => {
        setUsers(data?.content ?? [])
        setTotalUsers(data?.totalElements ?? 0)
        setTotalPages(data?.totalPages ?? 0)
      })
      .catch(() => setError("No se pudieron cargar los usuarios."))
      .finally(() => setLoadingUsers(false))
  }, [page])

  const fmt = (n) => n?.toLocaleString("es-CL") ?? "—"
  const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("es-CL") : "—")
  const details = CARD_DETAILS(metrics, fmt)

  return (
    <AppLayout>
      {activeModal && details[activeModal] && (
        <Modal title={details[activeModal].title} onClose={() => setActiveModal(null)}>
          {details[activeModal].content}
        </Modal>
      )}

      <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
        <section className="rounded-3xl bg-black text-white p-6 shadow-lg shadow-black/10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">Panel de administración</p>
              <h1 className="mt-2 text-3xl font-semibold">Métricas y gestión de usuarios</h1>
              <p className="mt-2 text-sm text-gray-300">Vista interna para supervisar el estado de la plataforma.</p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Volver al dashboard
            </button>
          </div>
        </section>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {loadingMetrics ? (
            <div className="md:col-span-2 xl:col-span-4 rounded-3xl border border-dashed border-gray-200 bg-white p-10">
              <Spinner text="Cargando métricas..." />
            </div>
          ) : (
            <>
              <StatCard label="Usuarios" value={fmt(metrics?.totalUsers)} sub="Total registrados" onClick={() => setActiveModal("usuarios")} />
              <StatCard label="Activos" value={fmt(metrics?.totalActiveUsers)} sub="Usuarios con sesión activa" onClick={() => setActiveModal("activos")} />
              <StatCard label="Nuevos hoy" value={fmt(metrics?.newUsersToday)} sub="Altas del día" onClick={() => setActiveModal("nuevos")} />
              <StatCard label="Inactivos" value={fmt(metrics?.inactiveUsers7Days)} sub="Sin actividad en 7 días" onClick={() => setActiveModal("inactivos")} />
            </>
          )}
        </section>

        <section className="rounded-3xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="flex flex-col gap-2 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-black">Usuarios</h2>
              <p className="text-sm text-gray-400">{fmt(totalUsers)} registrados</p>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span>
                  Página {page + 1} de {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((current) => Math.max(0, current - 1))}
                    disabled={page === 0}
                    className="rounded-full border border-gray-200 px-3 py-1.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    ← Anterior
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage((current) => Math.min(totalPages - 1, current + 1))}
                    disabled={page === totalPages - 1}
                    className="rounded-full border border-gray-200 px-3 py-1.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Siguiente →
                  </button>
                </div>
              </div>
            )}
          </div>

          {loadingUsers ? (
            <div className="p-10">
              <Spinner text="Cargando usuarios..." />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100 text-left">
                <thead className="bg-gray-50/80 text-xs uppercase tracking-[0.18em] text-gray-400">
                  <tr>
                    <th className="px-5 py-4 font-semibold">ID</th>
                    <th className="px-5 py-4 font-semibold">Email</th>
                    <th className="px-5 py-4 font-semibold">Estado</th>
                    <th className="px-5 py-4 font-semibold">Rol</th>
                    <th className="px-5 py-4 font-semibold">Proveedor</th>
                    <th className="px-5 py-4 font-semibold">Creado</th>
                    <th className="px-5 py-4 font-semibold">Último acceso</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/70">
                      <td className="px-5 py-4 font-medium text-black">{user.id}</td>
                      <td className="px-5 py-4">{user.email}</td>
                      <td className="px-5 py-4">
                        <Badge active={user.active ?? true} />
                      </td>
                      <td className="px-5 py-4">{user.roles?.join(", ") || user.role || "user"}</td>
                      <td className="px-5 py-4">{user.oauthProvider ?? "email"}</td>
                      <td className="px-5 py-4">{fmtDate(user.createdAt)}</td>
                      <td className="px-5 py-4">{fmtDate(user.updatedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!users.length && <div className="p-6 text-sm text-gray-400">No hay usuarios para mostrar.</div>}
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  )
}