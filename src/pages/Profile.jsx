import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../context/AuthContext";
import { profileService } from "../services/profileService";

const profileSchema = z.object({
  firstName:  z.string().min(2, "Mínimo 2 caracteres").max(50, "Máximo 50 caracteres"),
  lastName:   z.string().min(2, "Mínimo 2 caracteres").max(50, "Máximo 50 caracteres"),
  phone:      z.string().regex(/^\+?[\d\s\-()]{7,15}$/, "Número de teléfono inválido").or(z.literal("")),
  birthDate:  z.string().optional(),
  city:       z.string().max(60).optional(),
  country:    z.string().max(60).optional(),
  bio:        z.string().max(200, "Máximo 200 caracteres").optional(),
});

function Field({ label, error, hint, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</label>
      {props.as === "textarea"
        ? <textarea rows={3} className={`border rounded-lg px-4 py-2.5 text-sm outline-none transition-colors resize-none bg-white border-gray-200 text-black placeholder-gray-400 focus:border-black ${error ? "border-red-500" : ""}`} {...props} />
        : <input className={`border rounded-lg px-4 py-2.5 text-sm outline-none transition-colors bg-white border-gray-200 text-black placeholder-gray-400 focus:border-black ${error ? "border-red-500" : ""}`} {...props} />
      }
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
      {error && <p className="text-xs text-red-400 flex items-center gap-1"><span>⚠</span> {error}</p>}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5 py-2 border-b border-gray-100 last:border-0">
      <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</span>
      <span className="text-sm text-black">{value || <span className="text-gray-300 italic">Sin completar</span>}</span>
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateUserProfile, getToken } = useAuth();

  const [loading, setLoading]         = useState(true);
  const [editing, setEditing]         = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccess]  = useState("");
  const [savedData, setSavedData]     = useState(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } = useForm({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (!user) { navigate("/login", { replace: true }); return; }
    profileService.getProfile(getToken())
      .then((data) => {
        if (data) { setSavedData(data); reset(data); }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, navigate, reset, getToken]);

  const handleEdit = () => {
    reset(savedData || {});
    setServerError("");
    setEditing(true);
  };

  const handleCancel = () => {
    reset(savedData || {});
    setServerError("");
    setEditing(false);
  };

  const onSubmit = async (data) => {
    setServerError(""); setSuccess("");
    try {
      const saved = await profileService.updateProfile(getToken(), data);
      updateUserProfile({ name: `${saved.firstName} ${saved.lastName}` });
      setSavedData(saved);
      reset(saved);
      setSuccess("¡Perfil actualizado correctamente!");
      setEditing(false);
      setTimeout(() => setSuccess(""), 3500);
    } catch (err) {
      setServerError(err.message || "Ocurrió un error al guardar. Intenta de nuevo.");
    }
  };

  const Header = () => (
    <header className="h-14 flex items-center justify-center border-b border-gray-200 bg-gray-100">
      <button onClick={() => navigate("/")} className="text-xl font-black tracking-[0.25em] uppercase hover:opacity-60 transition-opacity">DRESSED</button>
    </header>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-gray-400">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
            <p className="text-sm">Cargando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-2xl shadow-xl overflow-hidden bg-white text-black">
          <div className="flex border-b border-gray-200">
            <div className="flex-1 py-4 text-sm font-semibold text-black border-b-2 border-black text-center">Mi perfil</div>
          </div>
          <div className="p-8 flex flex-col gap-5">

            {/* Avatar + botón editar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl text-gray-400 shrink-0">👤</div>
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
                  ✏️ Editar
                </button>
              )}
            </div>

            {serverError    && <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-500 flex items-center gap-2"><span>✕</span>{serverError}</div>}
            {successMessage && <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-3 text-sm text-green-600 flex items-center gap-2"><span>✓</span>{successMessage}</div>}

            {/* Modo vista */}
            {!editing && (
              <div className="flex flex-col">
                <div className="grid grid-cols-2 gap-x-6">
                  <InfoRow label="Nombre"   value={savedData?.firstName} />
                  <InfoRow label="Apellido" value={savedData?.lastName}  />
                </div>
                <InfoRow label="Teléfono"            value={savedData?.phone}     />
                <InfoRow label="Fecha de nacimiento" value={savedData?.birthDate} />
                <div className="grid grid-cols-2 gap-x-6">
                  <InfoRow label="Ciudad" value={savedData?.city}    />
                  <InfoRow label="País"   value={savedData?.country} />
                </div>
                <InfoRow label="Sobre mí" value={savedData?.bio} />
                {!savedData && (
                  <p className="text-sm text-gray-400 text-center mt-4">
                    Aún no has completado tu perfil.{" "}
                    <button onClick={handleEdit} className="underline text-black font-semibold">Completar ahora</button>
                  </p>
                )}
              </div>
            )}

            {/* Modo edición */}
            {editing && (
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Nombre"   type="text" placeholder="Juan"  error={errors.firstName?.message} {...register("firstName")} />
                  <Field label="Apellido" type="text" placeholder="Pérez" error={errors.lastName?.message}  {...register("lastName")}  />
                </div>
                <Field label="Teléfono" type="tel" placeholder="+56 9 1234 5678" error={errors.phone?.message} {...register("phone")} />
                <Field label="Fecha de nacimiento" type="date" error={errors.birthDate?.message} {...register("birthDate")} />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Ciudad" type="text" placeholder="Santiago" error={errors.city?.message}    {...register("city")}    />
                  <Field label="País"   type="text" placeholder="Chile"    error={errors.country?.message} {...register("country")} />
                </div>
                <Field as="textarea" label="Sobre mí" placeholder="Cuéntanos algo sobre tu estilo..." hint="Máximo 200 caracteres" error={errors.bio?.message} {...register("bio")} />
                <div className="flex gap-3 mt-2">
                  <button type="button" onClick={handleCancel} className="flex-1 py-3 rounded-lg font-semibold text-sm border border-gray-300 text-gray-600 hover:bg-gray-50 transition-all">
                    Cancelar
                  </button>
                  <button type="submit" disabled={isSubmitting || !isDirty} className="flex-1 py-3 rounded-lg font-semibold text-sm bg-black text-white hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                    {isSubmitting ? "Guardando..." : "Guardar cambios"}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}