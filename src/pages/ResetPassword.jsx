import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authService } from "../services/authService";

const passwordValidation = z.string()
  .min(8, "Mínimo 8 caracteres")
  .refine((val) => /[A-Z]/.test(val), "Debe tener al menos una mayúscula")
  .refine((val) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(val), "Debe tener al menos un carácter especial (!@#$%...)");

const schema = z.object({ password: passwordValidation, confirmPassword: z.string() })
  .refine((d) => d.password === d.confirmPassword, { message: "Las contraseñas no coinciden", path: ["confirmPassword"] });

function Field({ label, error, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</label>
      <input className={`border rounded-lg px-4 py-2.5 text-sm outline-none transition-colors bg-white border-gray-200 text-black placeholder-gray-400 focus:border-black ${error ? "border-red-500" : ""}`} {...props} />
      {error && <p className="text-xs text-red-400 flex items-center gap-1"><span>⚠</span> {error}</p>}
    </div>
  );
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setServerError(""); setSuccessMessage("");
    if (!token) { setServerError("El enlace de recuperación es inválido o ha expirado."); return; }
    try {
      await authService.resetPassword(token, data.password);
      setSuccessMessage("¡Contraseña actualizada! Redirigiendo al inicio de sesión...");
      setTimeout(() => navigate("/login", { replace: true }), 2500);
    } catch (err) {
      setServerError(err.message || "Ocurrió un error inesperado. Intenta de nuevo.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="h-14 flex items-center justify-center border-b border-gray-200 bg-gray-100">
        <button onClick={() => navigate("/")} className="text-xl font-black tracking-[0.25em] uppercase hover:opacity-60 transition-opacity">
          DRESSED
        </button>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl shadow-xl overflow-hidden bg-white text-black">
          <div className="flex border-b border-gray-200">
            <button onClick={() => navigate("/login")} className="flex-1 py-4 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors">Iniciar sesión</button>
            <button onClick={() => navigate("/register")} className="flex-1 py-4 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors">Registrarse</button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold">Nueva contraseña</h1>
              <p className="text-sm text-gray-500">Debe tener al menos 8 caracteres, una mayúscula y un carácter especial.</p>
            </div>
            {!token && <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-500 flex items-center gap-2"><span>✕</span>El enlace de recuperación es inválido o ha expirado.</div>}
            {serverError && <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-500 flex items-center gap-2"><span>✕</span>{serverError}</div>}
            {successMessage && <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-3 text-sm text-green-600 flex items-center gap-2"><span>✓</span>{successMessage}</div>}
            <Field label="Nueva contraseña" type="password" placeholder="••••••••" error={errors.password?.message} {...register("password")} />
            <Field label="Confirmar contraseña" type="password" placeholder="••••••••" error={errors.confirmPassword?.message} {...register("confirmPassword")} />
            <button type="submit" disabled={isSubmitting || !!successMessage || !token} className="mt-2 py-3 rounded-lg font-semibold text-sm bg-black text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              {isSubmitting ? "Guardando..." : "Cambiar contraseña"}
            </button>
            <button type="button" onClick={() => navigate("/login")} className="text-sm text-gray-400 hover:text-gray-700 transition-colors text-center">
              ← Volver al inicio de sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}