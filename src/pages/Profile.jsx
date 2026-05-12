import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAuth } from "../hooks/useAuth"
import { profileService } from "../services/profileService"
import { completionService } from "../services/completionService"
import ProfileCompletion from "../components/ProfileCompletion"
import AppLayout from "../components/AppLayout"
import Spinner from "../components/Spinner"

const profileSchema = z.object({
  name: z.string().min(2, "Minimo 2 caracteres").max(100, "Maximo 100 caracteres"),
  birthDate: z.string().optional(),
  gender: z.string().optional(),
})

function Field({ label, error, hint, as, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</label>
      {as === "select" ? (
        <select
          className={`border rounded-lg px-4 py-2.5 text-sm outline-none transition-colors bg-white border-gray-200 text-black focus:border-black ${error ? "border-red-500" : ""}`}
          {...props}
        >
          {props.children}
        </select>
      ) : (
        <input
          className={`border rounded-lg px-4 py-2.5 text-sm outline-none transition-colors bg-white border-gray-200 text-black placeholder-gray-400 focus:border-black ${error ? "border-red-500" : ""}`}
          {...props}
        />
      )}
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
      {error && <p className="text-xs text-red-400 flex items-center gap-1"><span>aviso</span> {error}</p>}
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5 py-2 border-b border-gray-100 last:border-0">
      <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</span>
      <span className="text-sm text-black">{value || <span className="text-gray-300 italic">Sin completar</span>}</span>
    </div>
  )
}

export default function Profile() {
  const navigate = useNavigate()
  const { user, updateUserProfile, getToken } = useAuth()

  const [loading, setLoading]         = useState(true)
  const [editing, setEditing]         = useState(false)
  const [serverError, setServerError] = useState("")
  const [successMessage, setSuccess]  = useState("")
  const [savedData, setSavedData]     = useState(null)

  const [completionLoading, setCompletionLoading] = useState(true)
  const [completion, setCompletion]               = useState(null)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } = useForm({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    if (!user) { navigate("/login", { replace: true }); return }
    profileService.getProfile(getToken())
      .then((data) => {
        if (data) { setSavedData(data); reset(data) }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user, navigate, reset, getToken])

  useEffect(() => {
    if (!user) return
    completionService.getCompleteness(getToken())
      .then((data) => setCompletion(data))
      .catch(() => {})
      .finally(() => setCompletionLoading(false))
  }, [user, getToken])

  const refreshCompletion = async () => {
    const data = await completionService.getCompleteness(getToken())
    setCompletion(data)
  }

  const handleEdit = () => {
    reset(savedData || {})
    setServerError("")
    setEditing(true)
  }

  const handleCancel = () => {
    reset(savedData || {})
    setServerError("")
    setEditing(false)
  }

  const onSubmit = async (data) => {
    setServerError(""); setSuccess("")
    try {
      const saved = await profileService.updateProfile(getToken(), data)
      updateUserProfile({ name: saved.name })
      setSavedData(saved)
      reset(saved)
      setSuccess("Perfil actualizado correctamente")
      setEditing(false)
      setTimeout(() => setSuccess(""), 3500)
      await refreshCompletion()
    } catch (err) {
      setServerError(err.message || "Ocurrio un error al guardar. Intenta de nuevo.")
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex-1 flex items-center justify-center min-h-full">
          <Spinner text="Cargando perfil..." />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="flex items-center justify-center p-4 min-h-full">
        <div className="w-full max-w-lg flex flex-col gap-4">

          <ProfileCompletion
            completion={completion ?? { sections: [], percent: 0, doneFields: 0, totalFields: 0 }}
            loading={completionLoading}
          />

          <div className="rounded-2xl shadow-xl overflow-hidden bg-white text-black">
            <div className="flex border-b border-gray-200">
              <div className="flex-1 py-4 text-sm font-semibold text-black border-b-2 border-black text-center">
                Mi perfil
              </div>
            </div>
            <div className="p-8 flex flex-col gap-5">

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold text-gray-600">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-semibold">{user?.name || "Sin nombre"}</p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                  </div>
                </div>
                {!editing && (
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-black text-sm font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Editar
                  </button>
                )}
              </div>

              {serverError    && <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-500">{serverError}</div>}
              {successMessage && <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-3 text-sm text-green-600">{successMessage}</div>}

              {!editing && (
                <div className="flex flex-col">
                  <InfoRow label="Nombre"               value={savedData?.name}      />
                  <InfoRow label="Fecha de nacimiento"  value={savedData?.birthDate} />
                  <InfoRow label="Genero"               value={savedData?.gender}    />
                  {!savedData && (
                    <p className="text-sm text-gray-400 text-center mt-4">
                      Aun no has completado tu perfil.{" "}
                      <button onClick={handleEdit} className="underline text-black font-semibold">
                        Completar ahora
                      </button>
                    </p>
                  )}
                </div>
              )}

              {editing && (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                  <Field
                    label="Nombre completo"
                    type="text"
                    placeholder="Juan Perez"
                    error={errors.name?.message}
                    {...register("name")}
                  />
                  <Field
                    label="Fecha de nacimiento"
                    type="date"
                    error={errors.birthDate?.message}
                    {...register("birthDate")}
                  />
                  <Field
                    as="select"
                    label="Genero"
                    error={errors.gender?.message}
                    {...register("gender")}
                  >
                    <option value="">Seleccionar</option>
                    <option value="MALE">Masculino</option>
                    <option value="FEMALE">Femenino</option>
                    <option value="OTHER">Otro</option>
                    <option value="PREFER_NOT_TO_SAY">Prefiero no decir</option>
                  </Field>
                  <div className="flex gap-3 mt-2">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 py-3 rounded-lg font-semibold text-sm border border-gray-300 text-gray-600 hover:bg-gray-50 transition-all"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !isDirty}
                      className="flex-1 py-3 rounded-lg font-semibold text-sm bg-black text-white hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      {isSubmitting ? "Guardando..." : "Guardar cambios"}
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}