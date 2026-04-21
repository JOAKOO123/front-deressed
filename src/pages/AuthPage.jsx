import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// ── Esquemas de validación ──────────────────────────────────────────
const emailValidation = z
  .string()
  .min(1, "El email es requerido")
  .refine((val) => {
    const dominiosPermitidos = [
      // Genéricos
      "gmail.com",
      "googlemail.com",
      // Microsoft
      "hotmail.com",
      "hotmail.cl",
      "hotmail.es",
      "outlook.com",
      "outlook.cl",
      "outlook.es",
      "live.com",
      "live.cl",
      "msn.com",
      // Yahoo
      "yahoo.com",
      "yahoo.es",
      "yahoo.cl",
      // Otros populares
      "icloud.com",
      "me.com",
      "mac.com",
      "protonmail.com",
      "proton.me",
      "zoho.com",
      // Chile
      "duocuc.cl",
      "uc.cl",
      "usach.cl",
      "uchile.cl",
      "utem.cl",
      "udd.cl",
      "udp.cl",
      "uai.cl",
      "pucv.cl",
      "uv.cl",
      "ufro.cl",
    ];
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(val)) return false;
    const dominio = val.split("@")[1]?.toLowerCase();
    return dominiosPermitidos.includes(dominio);
  }, "Ingresa un correo válido (Gmail, Outlook, Hotmail, DuocUC, etc.)");

const passwordValidation = z
  .string()
  .min(6, "Mínimo 6 caracteres")
  .refine((val) => /[A-Z]/.test(val), "Debe tener al menos una mayúscula")
  .refine(
    (val) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(val),
    "Debe tener al menos un carácter especial (!@#$%...)"
  );

const loginSchema = z.object({
  email: emailValidation,
  password: passwordValidation,
});

const registerSchema = z
  .object({
    email: emailValidation,
    password: passwordValidation,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

// ── Componente reutilizable para campo de formulario ────────────────
function Field({ label, error, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </label>
      <input
        className={`border rounded-lg px-4 py-2.5 text-sm outline-none transition-colors
          focus:border-black
          ${error ? "border-red-400 bg-red-50" : "border-gray-200"}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ── Página principal ────────────────────────────────────────────────
export default function AuthPage({ defaultTab = "login" }) {
  const navigate = useNavigate();
  const isLogin = defaultTab === "login";

  const schema = isLogin ? loginSchema : registerSchema;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ resolver: zodResolver(schema) });

  // Resetear el form al cambiar de tab
  useEffect(() => {
    reset();
  }, [defaultTab, reset]);

  const onSubmit = (data) => {
    console.log("Form data:", data);
    // Aquí conectas con tu backend
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div
        className={`w-full max-w-md rounded-2xl shadow-xl overflow-hidden transition-colors duration-300
          ${isLogin ? "bg-black text-white" : "bg-white text-black"}`}
      >
        {/* Toggle tabs */}
        <div className={`flex border-b ${isLogin ? "border-gray-700" : "border-gray-200"}`}>
          <button
            onClick={() => navigate("/login")}
            className={`flex-1 py-4 text-sm font-semibold transition-colors
              ${isLogin
                ? "text-white border-b-2 border-white"
                : "text-gray-400 hover:text-gray-600"
              }`}
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => navigate("/register")}
            className={`flex-1 py-4 text-sm font-semibold transition-colors
              ${!isLogin
                ? "text-black border-b-2 border-black"
                : "text-gray-500 hover:text-gray-300"
              }`}
          >
            Registrarse
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 flex flex-col gap-5">
          <h1 className="text-2xl font-bold mb-2">
            {isLogin ? "Bienvenido de vuelta" : "Crear cuenta"}
          </h1>

          <Field
            label="Email"
            type="email"
            placeholder="tu@email.com"
            error={errors.email?.message}
            {...register("email")}
            className={`border rounded-lg px-4 py-2.5 text-sm outline-none transition-colors
              focus:border-${isLogin ? "white" : "black"}
              ${isLogin ? "bg-gray-900 border-gray-700 text-white placeholder-gray-500" : "border-gray-200"}
              ${errors.email ? "border-red-400" : ""}`}
          />

          <Field
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
            className={`border rounded-lg px-4 py-2.5 text-sm outline-none transition-colors
              ${isLogin ? "bg-gray-900 border-gray-700 text-white placeholder-gray-500" : "border-gray-200"}
              ${errors.password ? "border-red-400" : ""}`}
          />

          {!isLogin && (
            <Field
              label="Confirmar contraseña"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`mt-2 py-3 rounded-lg font-semibold text-sm transition-colors
              ${isLogin
                ? "bg-white text-black hover:bg-gray-200"
                : "bg-black text-white hover:bg-gray-800"
              }
              disabled:opacity-50`}
          >
            {isSubmitting
              ? "Cargando..."
              : isLogin
              ? "Iniciar sesión"
              : "Crear cuenta"}
          </button>
        </form>
      </div>
    </div>
  );
}