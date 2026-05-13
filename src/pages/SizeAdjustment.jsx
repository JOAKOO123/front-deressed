import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-request";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../hooks/useAuth";
import { sizeService } from "../services/sizeService";
import { proportionsService } from "../services/proportionsService";
import AppLayout from "../components/AppLayout";
import Spinner from "../components/Spinner";

const CLOTHING_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const SHOE_SIZES     = ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"];
const BOTTOM_SIZES   = ["28", "29", "30", "31", "32", "33", "34", "36", "38", "40"];

const sizeSchema = z.object({
  top:    z.string().min(1, "Selecciona una talla"),
  bottom: z.string().min(1, "Selecciona una talla"),
  shoes:  z.string().min(1, "Selecciona un numero"),
});

const measureSchema = z.object({
  heightCm:      z.coerce.number().min(100).max(230).optional(),
  shouldersCm:   z.coerce.number().min(30).max(200).optional(),
  chestCm:       z.coerce.number().min(30).max(200).optional(),
  waistCm:       z.coerce.number().min(30).max(200).optional(),
  hipsCm:        z.coerce.number().min(30).max(200).optional(),
  torsoLengthCm: z.coerce.number().min(20).max(120).optional(),
  legLengthCm:   z.coerce.number().min(30).max(150).optional(),
});

function SizeSelector({ label, options, value, onChange, error }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
              value === opt
                ? "bg-black text-white border-black"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

function MeasureField({ label, hint, error, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </label>
      <input
        type="number"
        className={`border rounded-lg px-4 py-2.5 text-sm outline-none transition-colors bg-white border-gray-200 text-black placeholder-gray-400 focus:border-black ${
          error ? "border-red-500" : ""
        }`}
        {...props}
      />
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

export default function SizeAdjustment() {
  const navigate        = useNavigate();
  const { user, getToken } = useAuth();
  const [loading, setLoading]               = useState(true);
  const [serverError, setServerError]       = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    handleSubmit: handleSizeSubmit,
    watch,
    setValue,
    reset: resetSizes,
    formState: { errors: sizeErrors, isSubmitting: sizeSaving, isDirty: sizeDirty },
  } = useForm({ resolver: zodResolver(sizeSchema) });

  const {
    register,
    handleSubmit: handleMeasureSubmit,
    reset: resetMeasures,
    formState: { errors: measureErrors, isSubmitting: measureSaving, isDirty: measureDirty },
  } = useForm({ resolver: zodResolver(measureSchema) });

  const watchedTop    = watch("top");
  const watchedBottom = watch("bottom");
  const watchedShoes  = watch("shoes");

  useEffect(() => {
    if (!user) { navigate("/login", { replace: true }); return; }
    const token = getToken();
    Promise.all([
      sizeService.getSizes(token),
      proportionsService.getProportions(token),
    ])
      .then(([sizes, measures]) => {
        if (sizes)   resetSizes(sizes);
        if (measures) resetMeasures(measures);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, navigate, getToken, resetSizes, resetMeasures]);

  const onSizeSubmit = async (data) => {
    setServerError(""); setSuccessMessage("");
    try {
      await sizeService.updateSizes(getToken(), data);
      setSuccessMessage("Tallas guardadas correctamente");
      setTimeout(() => setSuccessMessage(""), 3500);
    } catch (err) {
      setServerError(err.message || "Error al guardar tallas.");
    }
  };

  const onMeasureSubmit = async (data) => {
    setServerError(""); setSuccessMessage("");
    try {
      await proportionsService.updateProportions(getToken(), data);
      setSuccessMessage("Medidas guardadas correctamente");
      setTimeout(() => setSuccessMessage(""), 3500);
    } catch (err) {
      setServerError(err.message || "Error al guardar medidas.");
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
        <div className="w-full max-w-lg flex flex-col gap-6">

          {serverError    && <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-500">{serverError}</div>}
          {successMessage && <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-3 text-sm text-green-600">{successMessage}</div>}

          {/* Tallas */}
          <div className="rounded-2xl shadow-xl overflow-hidden bg-white text-black">
            <div className="border-b border-gray-200 py-4 text-sm font-semibold text-center">
              Mis tallas
            </div>
            <form onSubmit={handleSizeSubmit(onSizeSubmit)} className="p-8 flex flex-col gap-6">
              <SizeSelector
                label="Talla superior (top)"
                options={CLOTHING_SIZES}
                value={watchedTop}
                onChange={(v) => setValue("top", v, { shouldDirty: true })}
                error={sizeErrors.top?.message}
              />
              <SizeSelector
                label="Talla inferior (bottom)"
                options={BOTTOM_SIZES}
                value={watchedBottom}
                onChange={(v) => setValue("bottom", v, { shouldDirty: true })}
                error={sizeErrors.bottom?.message}
              />
              <SizeSelector
                label="Talla de zapatos"
                options={SHOE_SIZES}
                value={watchedShoes}
                onChange={(v) => setValue("shoes", v, { shouldDirty: true })}
                error={sizeErrors.shoes?.message}
              />
              <button
                type="submit"
                disabled={sizeSaving || !sizeDirty}
                className="py-3 rounded-lg font-semibold text-sm bg-black text-white hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {sizeSaving ? "Guardando..." : "Guardar tallas"}
              </button>
            </form>
          </div>

          {/* Medidas corporales */}
          <div className="rounded-2xl shadow-xl overflow-hidden bg-white text-black">
            <div className="border-b border-gray-200 py-4 text-sm font-semibold text-center">
              Medidas corporales
            </div>
            <form onSubmit={handleMeasureSubmit(onMeasureSubmit)} className="p-8 flex flex-col gap-4">
              <p className="text-sm text-gray-500">
                Ingresa tus medidas en centimetros para recomendaciones mas precisas.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <MeasureField label="Altura"        hint="cm (100-230)" placeholder="175" error={measureErrors.heightCm?.message}      {...register("heightCm")}      />
                <MeasureField label="Hombros"       hint="cm (30-200)"  placeholder="45"  error={measureErrors.shouldersCm?.message}    {...register("shouldersCm")}   />
                <MeasureField label="Pecho"         hint="cm (30-200)"  placeholder="95"  error={measureErrors.chestCm?.message}        {...register("chestCm")}       />
                <MeasureField label="Cintura"       hint="cm (30-200)"  placeholder="80"  error={measureErrors.waistCm?.message}        {...register("waistCm")}       />
                <MeasureField label="Cadera"        hint="cm (30-200)"  placeholder="95"  error={measureErrors.hipsCm?.message}         {...register("hipsCm")}        />
                <MeasureField label="Largo de torso" hint="cm (20-120)" placeholder="60"  error={measureErrors.torsoLengthCm?.message}  {...register("torsoLengthCm")} />
              </div>
              <MeasureField label="Largo de pierna" hint="cm (30-150)"  placeholder="80"  error={measureErrors.legLengthCm?.message}   {...register("legLengthCm")}   />
              <button
                type="submit"
                disabled={measureSaving || !measureDirty}
                className="mt-2 py-3 rounded-lg font-semibold text-sm bg-black text-white hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {measureSaving ? "Guardando..." : "Guardar medidas"}
              </button>
            </form>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}