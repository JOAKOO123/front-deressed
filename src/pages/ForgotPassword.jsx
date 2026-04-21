import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authService } from "../services/authService";

const dominiosPermitidos = [
  "gmail.com","googlemail.com","hotmail.com","hotmail.cl","hotmail.es",
  "outlook.com","outlook.cl","outlook.es","live.com","live.cl","msn.com",
  "yahoo.com","yahoo.es","yahoo.cl","icloud.com","me.com","mac.com",
  "protonmail.com","proton.me","zoho.com","duocuc.cl","uc.cl","usach.cl",
  "uchile.cl","utem.cl","udd.cl","udp.cl","uai.cl","pucv.cl","uv.cl","ufro.cl",
];

const schema = z.object({
  email: z.string().min(1, "El email es requerido").refine((val) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(val)) return false;
    return dominiosPermitidos.includes(val.split("@")[1]?.toLowerCase());
  }, "Ingresa un correo válido (Gmail, Outlook, Hotmail, DuocUC, etc.)"),
});

function Field({ label, error, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</label>
      <input className={`border rounded-lg px-4 py-2.5 text-sm outline-none transition-colors bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-gray-400 ${error ? "border-red-500" : ""}`} {...props} />
      {error && <p className="text-xs text-red-400 flex items-center gap-1"><span>⚠</span> {error}</p>}
    </div>
  );
}

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setServerError(""); setSuccessMessage("");
    try {
      await authService.forgotPassword(data.email);
      setSuccessMessage("Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.");
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
        <div className="w-full max-w-md rounded-2xl shadow-xl overflow-hidden bg-black text-white">
          <div className="flex border-b border-gray-800">
            <button onClick={() => navigate("/login")} className="flex-1 py-4 text-sm font-semibold text-gray-500 hover:text-gray-300 transition-colors">Iniciar sesión</button>
            <button onClick={() => navigate("/register")} className="flex-1 py-4 text-sm font-semibold text-gray-500 hover:text-gray-300 transition-colors">Registrarse</button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold">¿Olvidaste tu contraseña?</h1>
              <p className="text-sm text-gray-400">Ingresa tu email y te enviaremos un enlace para restablecerla.</p>
            </div>
            {serverError && <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-400 flex items-center gap-2"><span>✕</span>{serverError}</div>}
            {successMessage && <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-3 text-sm text-green-400 flex items-center gap-2"><span>✓</span>{successMessage}</div>}
            <Field label="Email" type="email" placeholder="tu@email.com" error={errors.email?.message} {...register("email")} />
            <button type="submit" disabled={isSubmitting || !!successMessage} className="mt-2 py-3 rounded-lg font-semibold text-sm bg-white text-black hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              {isSubmitting ? "Enviando..." : "Enviar enlace"}
            </button>
            <button type="button" onClick={() => navigate("/login")} className="text-sm text-gray-400 hover:text-gray-200 transition-colors text-center">
              ← Volver al inicio de sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}