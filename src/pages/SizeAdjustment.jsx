import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../hooks/useAuth";
import { sizeService } from "../services/sizeService";
import AppLayout from "../components/AppLayout";
import Spinner from "../components/Spinner";

const CLOTHING_SIZES = ["XS","S","M","L","XL","XXL","XXXL"];
const SHOE_SIZES_CL  = ["35","36","37","38","39","40","41","42","43","44","45","46"];
const JEAN_SIZES     = ["28","29","30","31","32","33","34","36","38","40"];
const FIT_TYPES      = ["Slim","Regular","Relaxed","Oversize"];

const sizeSchema = z.object({
  clothingSize:  z.string().min(1, "Selecciona una talla"),
  shoeSize:      z.string().min(1, "Selecciona un número"),
  jeanSize:      z.string().min(1, "Selecciona una talla"),
  fitPreference: z.string().min(1, "Selecciona un tipo de fit"),
  chest:  z.string().regex(/^\d{2,3}$/, "Ingresa cm (ej: 95)").or(z.literal("")),
  waist:  z.string().regex(/^\d{2,3}$/, "Ingresa cm (ej: 80)").or(z.literal("")),
  hips:   z.string().regex(/^\d{2,3}$/, "Ingresa cm (ej: 95)").or(z.literal("")),
  height: z.string().regex(/^\d{3}$/, "Ingresa cm (ej: 175)").or(z.literal("")),
  weight: z.string().regex(/^\d{2,3}$/, "Ingresa kg (ej: 70)").or(z.literal("")),
});

function Field({ label, error, hint, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</label>
      <input className={`border rounded-lg px-4 py-2.5 text-sm outline-none transition-colors bg-white border-gray-200 text-black placeholder-gray-400 focus:border-black ${error ? "border-red-500" : ""}`} {...props} />
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
      {error && <p className="text-xs text-red-400 flex items-center gap-1"><span>⚠</span> {error}</p>}
    </div>
  );
}

function SizeSelector({ label, options, value, onChange, error }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button key={opt} type="button" onClick={() => onChange(opt)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${value === opt ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"}`}>
            {opt}
          </button>
        ))}
      </div>
      {error && <p className="text-xs text-red-400 flex items-center gap-1"><span>⚠</span> {error}</p>}
    </div>
  );
}

export default function SizeAdjustment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting, isDirty } } = useForm({ resolver: zodResolver(sizeSchema) });

  const watchedClothing = watch("clothingSize");
  const watchedShoe     = watch("shoeSize");
  const watchedJean     = watch("jeanSize");
  const watchedFit      = watch("fitPreference");

  useEffect(() => {
    if (!user) { navigate("/login", { replace: true }); return; }
    sizeService.getSizes(getCookie("auth_token"))
      .then((data) => { if (data) reset(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, navigate, reset]);

  const onSubmit = async (data) => {
    setServerError(""); setSuccessMessage("");
    try {
      const saved = await sizeService.updateSizes(getCookie("auth_token"), data);
      reset(saved);
      setSuccessMessage("¡Tallas guardadas correctamente!");
      setTimeout(() => setSuccessMessage(""), 3500);
    } catch (err) {
      setServerError(err.message || "Ocurrió un error al guardar. Intenta de nuevo.");
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex-1 flex items-center justify-center min-h-full">
          <Spinner text="Cargando tallas..." />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex items-center justify-center p-4 min-h-full">
        <div className="w-full max-w-lg rounded-2xl shadow-xl overflow-hidden bg-white text-black">
          <div className="flex border-b border-gray-200">
            <div className="flex-1 py-4 text-sm font-semibold text-black border-b-2 border-black text-center">Mis tallas</div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold">Ajuste de tallas</h1>
              <p className="text-sm text-gray-500">Guarda tus medidas para que podamos recomendarte outfits perfectos.</p>
            </div>

            {serverError && <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-500 flex items-center gap-2"><span>✕</span>{serverError}</div>}
            {successMessage && <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-3 text-sm text-green-600 flex items-center gap-2"><span>✓</span>{successMessage}</div>}

            <SizeSelector label="Talla de ropa" options={CLOTHING_SIZES} value={watchedClothing} onChange={(v) => setValue("clothingSize", v, { shouldDirty: true })} error={errors.clothingSize?.message} />
            <SizeSelector label="Talla de zapatos (CL)" options={SHOE_SIZES_CL} value={watchedShoe} onChange={(v) => setValue("shoeSize", v, { shouldDirty: true })} error={errors.shoeSize?.message} />
            <SizeSelector label="Talla de jeans (cintura)" options={JEAN_SIZES} value={watchedJean} onChange={(v) => setValue("jeanSize", v, { shouldDirty: true })} error={errors.jeanSize?.message} />
            <SizeSelector label="Fit preferido" options={FIT_TYPES} value={watchedFit} onChange={(v) => setValue("fitPreference", v, { shouldDirty: true })} error={errors.fitPreference?.message} />

            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Medidas corporales (cm/kg) — opcionales</p>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Pecho"   type="number" placeholder="95"  hint="en cm" error={errors.chest?.message}  {...register("chest")}  />
                <Field label="Cintura" type="number" placeholder="80"  hint="en cm" error={errors.waist?.message}  {...register("waist")}  />
                <Field label="Cadera"  type="number" placeholder="95"  hint="en cm" error={errors.hips?.message}   {...register("hips")}   />
                <Field label="Altura"  type="number" placeholder="175" hint="en cm" error={errors.height?.message} {...register("height")} />
              </div>
              <Field label="Peso" type="number" placeholder="70" hint="en kg" error={errors.weight?.message} {...register("weight")} />
            </div>

            <button type="submit" disabled={isSubmitting || !isDirty} className="mt-2 py-3 rounded-lg font-semibold text-sm bg-black text-white hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              {isSubmitting ? "Guardando..." : "Guardar tallas"}
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}

function getCookie(name) {
  const match = document.cookie.split("; ").find((r) => r.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}