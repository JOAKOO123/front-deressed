import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../context/AuthContext";
import { profileService } from "../services/profileService";

// Coincide con profiles: { name, birth_date, gender, skin_tone, color_palette }
const profileSchema = z.object({
  name:          z.string().min(2, "Mínimo 2 caracteres").max(100, "Máximo 100 caracteres"),
  birth_date:    z.string().optional(),
  gender:        z.string().optional(),
  skin_tone:     z.string().optional(),
  color_palette: z.string().optional(),
});

const GENDER_OPTIONS    = ["Masculino", "Femenino", "No binario", "Prefiero no decir"];
const SKIN_TONE_OPTIONS = ["Muy claro", "Claro", "Medio", "Oscuro", "Muy oscuro"];
const PALETTE_OPTIONS   = ["Cálida", "Fría", "Neutra", "Tierra", "Pastel", "Vibrante"];

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

function SelectField({ label, options, error, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</label>
      <select className={`border rounded-lg px-4 py-2.5 text-sm outline-none transition-colors bg-white border-gray-200 text-black focus:border-black ${error ? "border-red-500" : ""}`} {...props}>
        <option value="">Seleccionar...</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      {error && <p className="text-xs text-red-400 flex items-center gap-1"><span>⚠</span> {error}</p>}
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } = useForm({ resolver: zodResolver(profileSchema) });

  useEffect(() => {
    if (!user) { navigate("/login", { replace: true }); return; }
    profileService.getProfile(getCookie("auth_token"))
      .then((data) => { if (data) reset(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, navigate, reset]);

  const onSubmit = async (data) => {
    setServerError(""); setSuccessMessage("");
    try {
      const saved = await profileService.updateProfile(getCookie("auth_token"), data);
      updateUserProfile({ name: saved.name });
      reset(saved);
      setSuccessMessage("¡Perfil guardado correctamente!");
      setTimeout(() => setSuccessMessage(""), 3500);
    } catch (err) {
      setServerError(err.message || "Ocurrió un error al guardar. Intenta de nuevo.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <header className="h-14 flex items-center justify-center border-b border-gray-200 bg-gray-100">
          <button onClick={() => navigate("/")} className="text-xl font-black tracking-[0.25em] uppercase hover:opacity-60 transition-opacity">DRESSED</button>
        </header>
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
      <header className="h-14 flex items-center justify-center border-b border-gray-200 bg-gray-100">
        <button onClick={() => navigate("/")} className="text-xl font-black tracking-[0.25em] uppercase hover:opacity-60 transition-opacity">DRESSED</button>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-2xl shadow-xl overflow-hidden bg-white text-black">
          <div className="flex border-b border-gray-200">
            <div className="flex-1 py-4 text-sm font-semibold text-black border-b-2 border-black text-center">Mi perfil</div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold">Datos personales</h1>
              <p className="text-sm text-gray-500">{user?.email} — completa tu perfil para una mejor experiencia.</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl text-gray-400 shrink-0">👤</div>
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-semibold">{user?.name || "Sin nombre"}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
            </div>

            {serverError && <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-500 flex items-center gap-2"><span>✕</span>{serverError}</div>}
            {successMessage && <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-3 text-sm text-green-600 flex items-center gap-2"><span>✓</span>{successMessage}</div>}

            {/* name → profiles.name */}
            <Field label="Nombre completo" type="text" placeholder="Juan Pérez" error={errors.name?.message} {...register("name")} />

            {/* birth_date → profiles.birth_date */}
            <Field label="Fecha de nacimiento" type="date" error={errors.birth_date?.message} {...register("birth_date")} />

            {/* gender → profiles.gender */}
            <SelectField label="Género" options={GENDER_OPTIONS} error={errors.gender?.message} {...register("gender")} />

            {/* skin_tone → profiles.skin_tone */}
            <SelectField label="Tono de piel" options={SKIN_TONE_OPTIONS} error={errors.skin_tone?.message} {...register("skin_tone")} />

            {/* color_palette → profiles.color_palette */}
            <SelectField label="Paleta de colores preferida" options={PALETTE_OPTIONS} error={errors.color_palette?.message} {...register("color_palette")} />

            <button type="submit" disabled={isSubmitting || !isDirty} className="mt-2 py-3 rounded-lg font-semibold text-sm bg-black text-white hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              {isSubmitting ? "Guardando..." : "Guardar cambios"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function getCookie(name) {
  const match = document.cookie.split("; ").find((r) => r.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}