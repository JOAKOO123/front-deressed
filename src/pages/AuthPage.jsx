import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";

const dominiosPermitidos = [
  "gmail.com","googlemail.com","hotmail.com","hotmail.cl","hotmail.es",
  "outlook.com","outlook.cl","outlook.es","live.com","live.cl","msn.com",
  "yahoo.com","yahoo.es","yahoo.cl","icloud.com","me.com","mac.com",
  "protonmail.com","proton.me","zoho.com","duocuc.cl","uc.cl","usach.cl",
  "uchile.cl","utem.cl","udd.cl","udp.cl","uai.cl","pucv.cl","uv.cl","ufro.cl",
];

const emailValidation = z.string().min(1, "El email es requerido").refine((val) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(val)) return false;
  return dominiosPermitidos.includes(val.split("@")[1]?.toLowerCase());
}, "Ingresa un correo válido (Gmail, Outlook, Hotmail, DuocUC, etc.)");

const passwordValidation = z.string()
  .min(8, "Mínimo 8 caracteres")
  .refine((val) => /[A-Z]/.test(val), "Debe tener al menos una mayúscula")
  .refine((val) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(val), "Debe tener al menos un carácter especial (!@#$%...)");

const loginSchema = z.object({ email: emailValidation, password: passwordValidation, rememberMe: z.boolean().optional() });
const registerSchema = z.object({ email: emailValidation, password: passwordValidation, confirmPassword: z.string() })
  .refine((d) => d.password === d.confirmPassword, { message: "Las contraseñas no coinciden", path: ["confirmPassword"] });

function Field({ label, error, isLogin, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className={`text-xs font-semibold uppercase tracking-wide ${isLogin ? "text-gray-400" : "text-gray-500"}`}>{label}</label>
      <input className={`border rounded-lg px-4 py-2.5 text-sm outline-none transition-colors
        ${isLogin ? "bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-gray-400" : "bg-white border-gray-200 text-black placeholder-gray-400 focus:border-black"}
        ${error ? "border-red-500" : ""}`} {...props} />
      {error && <p className="text-xs text-red-400 flex items-center gap-1"><span>⚠</span> {error}</p>}
    </div>
  );
}

export default function AuthPage({ defaultTab = "login" }) {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const isLogin = defaultTab === "login";
  const [serverError, setServerError] = useState("");

  useEffect(() => { if (user) navigate("/dashboard", { replace: true }); }, [user, navigate]);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({ resolver: zodResolver(isLogin ? loginSchema : registerSchema) });

  useEffect(() => { reset(); setServerError(""); }, [defaultTab, reset]);

  const onSubmit = async (data) => {
    setServerError("");
    try {
      const result = isLogin
        ? await authService.login(data.email, data.password)
        : await authService.register(data.email, data.password);
      login({ id: result.id, email: result.email }, result.token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setServerError(err.message || "Ocurrió un error inesperado. Intenta de nuevo.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* DRESSED arriba */}
      <header className="h-14 flex items-center justify-center border-b border-gray-200 bg-gray-100">
        <button onClick={() => navigate("/")} className="text-xl font-black tracking-[0.25em] uppercase hover:opacity-60 transition-opacity">
          DRESSED
        </button>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className={`w-full max-w-md rounded-2xl shadow-xl overflow-hidden transition-colors duration-300 ${isLogin ? "bg-black text-white" : "bg-white text-black"}`}>
          {/* Tabs */}
          <div className={`flex border-b ${isLogin ? "border-gray-800" : "border-gray-200"}`}>
            <button onClick={() => navigate("/login")} className={`flex-1 py-4 text-sm font-semibold transition-colors ${isLogin ? "text-white border-b-2 border-white" : "text-gray-400 hover:text-gray-600"}`}>
              Iniciar sesión
            </button>
            <button onClick={() => navigate("/register")} className={`flex-1 py-4 text-sm font-semibold transition-colors ${!isLogin ? "text-black border-b-2 border-black" : "text-gray-500 hover:text-gray-300"}`}>
              Registrarse
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 flex flex-col gap-5">
            <h1 className="text-2xl font-bold">{isLogin ? "Bienvenido de vuelta" : "Crear cuenta"}</h1>

            {serverError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-400 flex items-center gap-2">
                <span>✕</span>{serverError}
              </div>
            )}

            <Field label="Email" type="email" placeholder="tu@email.com" isLogin={isLogin} error={errors.email?.message} {...register("email")} />
            <Field label="Contraseña" type="password" placeholder="••••••••" isLogin={isLogin} error={errors.password?.message} {...register("password")} />
            {!isLogin && <Field label="Confirmar contraseña" type="password" placeholder="••••••••" isLogin={isLogin} error={errors.confirmPassword?.message} {...register("confirmPassword")} />}

            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer select-none">
                  <input type="checkbox" className="w-4 h-4 accent-white rounded" {...register("rememberMe")} />
                  Guardar sesión
                </label>
                <button type="button" onClick={() => navigate("/forgot-password")} className="text-xs text-gray-400 hover:text-gray-200 transition-colors underline underline-offset-2">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            <button type="submit" disabled={isSubmitting} className={`mt-2 py-3 rounded-lg font-semibold text-sm transition-all ${isLogin ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"} disabled:opacity-50 disabled:cursor-not-allowed`}>
              {isSubmitting ? "Cargando..." : isLogin ? "Iniciar sesión" : "Crear cuenta"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}