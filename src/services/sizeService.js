// Serializa/deserializa entre el formato del form y el formato real de la BD:
// user_sizes → [{ type: "clothing", value: "M" }, ...]
// user_measurements → { shoulders_cm, chest_cm, waist_cm, hips_cm, torso_length_cm, leg_length_cm }

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

let mockSizes = null;

// Convierte la respuesta del backend al formato que usa el formulario
function deserialize(raw) {
  if (!raw) return null;
  const { sizes = [], measurements = {} } = raw;
  const sizesMap = Object.fromEntries(sizes.map((s) => [s.type, s.value]));
  return {
    clothingSize:    sizesMap["clothing"]    ?? "",
    shoeSize:        sizesMap["shoe"]        ?? "",
    jeanSize:        sizesMap["jean"]        ?? "",
    fitPreference:   sizesMap["fit"]         ?? "",
    shoulders_cm:    measurements.shoulders_cm    ? String(measurements.shoulders_cm)    : "",
    chest_cm:        measurements.chest_cm        ? String(measurements.chest_cm)        : "",
    waist_cm:        measurements.waist_cm        ? String(measurements.waist_cm)        : "",
    hips_cm:         measurements.hips_cm         ? String(measurements.hips_cm)         : "",
    torso_length_cm: measurements.torso_length_cm ? String(measurements.torso_length_cm) : "",
    leg_length_cm:   measurements.leg_length_cm   ? String(measurements.leg_length_cm)   : "",
  };
}

// Convierte el formulario al formato que espera el backend
function serialize(formData) {
  const { clothingSize, shoeSize, jeanSize, fitPreference, ...rest } = formData;
  return {
    sizes: [
      { type: "clothing", value: clothingSize },
      { type: "shoe",     value: shoeSize     },
      { type: "jean",     value: jeanSize     },
      { type: "fit",      value: fitPreference },
    ],
    measurements: {
      shoulders_cm:    rest.shoulders_cm    ? Number(rest.shoulders_cm)    : null,
      chest_cm:        rest.chest_cm        ? Number(rest.chest_cm)        : null,
      waist_cm:        rest.waist_cm        ? Number(rest.waist_cm)        : null,
      hips_cm:         rest.hips_cm         ? Number(rest.hips_cm)         : null,
      torso_length_cm: rest.torso_length_cm ? Number(rest.torso_length_cm) : null,
      leg_length_cm:   rest.leg_length_cm   ? Number(rest.leg_length_cm)   : null,
    },
  };
}

export const sizeService = {
  async getSizes(token) {
    await delay(600);
    // Reemplazar con la llamada real:
    // const [sizesRes, measRes] = await Promise.all([
    //   fetch("/api/profile/sizes",        { headers: { Authorization: `Bearer ${token}` } }),
    //   fetch("/api/profile/measurements", { headers: { Authorization: `Bearer ${token}` } }),
    // ]);
    // if (!sizesRes.ok || !measRes.ok) throw new Error("No se pudo cargar las tallas.");
    // const sizes       = await sizesRes.json();
    // const measurements = await measRes.json();
    // return deserialize({ sizes, measurements });

    return deserialize(mockSizes);
  },

  async updateSizes(token, formData) {
    await delay(800);
    const payload = serialize(formData);
    // Reemplazar con la llamada real:
    // const [sizesRes, measRes] = await Promise.all([
    //   fetch("/api/profile/sizes",        { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(payload.sizes)        }),
    //   fetch("/api/profile/measurements", { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(payload.measurements) }),
    // ]);
    // if (!sizesRes.ok || !measRes.ok) throw new Error("No se pudo guardar las tallas.");

    mockSizes = payload;
    return deserialize(mockSizes);
  },
};