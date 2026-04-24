import { describe, it, expect } from "vitest";
import { calculateCompletion } from "../services/completionService";

// ── Helpers ─────────────────────────────────────────────────────────
const fullProfile = {
  firstName: "Juan",
  lastName: "Pérez",
  phone: "+56912345678",
  birthDate: "1995-05-20",
  city: "Santiago",
  country: "Chile",
  bio: "Me gusta la moda.",
};

const fullSizes = {
  clothingSize: "M",
  shoeSize: "42",
  jeanSize: "32",
  fitPreference: "Regular",
  height: "175",
  weight: "70",
};

const fullMyStyle = {
  skinTone: "medio",
  palette: "otono",
  favoriteColors: ["negro", "azul"],
};

const fullPreferences = {
  styles: ["casual", "streetwear"],
  occasions: ["diario", "trabajo"],
};

// ── Tests ────────────────────────────────────────────────────────────
describe("calculateCompletion", () => {
  it("devuelve 0% cuando todos los datos son null", () => {
    const { percent, doneFields } = calculateCompletion(null, null, null, null);
    expect(percent).toBe(0);
    expect(doneFields).toBe(0);
  });

  it("devuelve 100% cuando todos los campos están completos", () => {
    const { percent, doneFields, totalFields } = calculateCompletion(
      fullProfile,
      fullSizes,
      fullMyStyle,
      fullPreferences
    );
    expect(percent).toBe(100);
    expect(doneFields).toBe(totalFields);
  });

  it("el total de campos es 18 (7 perfil + 6 tallas + 3 estilo + 2 preferencias)", () => {
    const { totalFields } = calculateCompletion(null, null, null, null);
    expect(totalFields).toBe(18);
  });

  it("cuenta correctamente solo los campos de perfil completados", () => {
    const partial = { firstName: "Juan", lastName: "Pérez" };
    const { doneFields } = calculateCompletion(partial, null, null, null);
    expect(doneFields).toBe(2);
  });

  it("ignora strings vacíos como incompletos", () => {
    const profile = { firstName: "", lastName: "Pérez" };
    const { doneFields } = calculateCompletion(profile, null, null, null);
    expect(doneFields).toBe(1);
  });

  it("favoriteColors requiere al menos 1 elemento para estar completo", () => {
    const styleVacio = { skinTone: "claro", palette: "verano", favoriteColors: [] };
    const styleConColor = { skinTone: "claro", palette: "verano", favoriteColors: ["negro"] };

    const { doneFields: sin } = calculateCompletion(null, null, styleVacio, null);
    const { doneFields: con } = calculateCompletion(null, null, styleConColor, null);

    expect(sin).toBe(2);
    expect(con).toBe(3);
  });

  it("styles y occasions requieren al menos 1 elemento para estar completos", () => {
    const prefVacia = { styles: [], occasions: [] };
    const prefLlena = { styles: ["casual"], occasions: ["trabajo"] };

    const { doneFields: sin } = calculateCompletion(null, null, null, prefVacia);
    const { doneFields: con } = calculateCompletion(null, null, null, prefLlena);

    expect(sin).toBe(0);
    expect(con).toBe(2);
  });

  it("el porcentaje se redondea al entero más cercano", () => {
    // Solo firstName completo = 1/18 ≈ 5.55% → 6%
    const { percent } = calculateCompletion({ firstName: "Juan" }, null, null, null);
    expect(percent).toBe(6);
  });

  it("retorna las 4 secciones siempre", () => {
    const { sections } = calculateCompletion(null, null, null, null);
    expect(sections).toHaveLength(4);
    expect(sections.map((s) => s.id)).toEqual(["profile", "sizes", "style", "preferences"]);
  });

  it("cada sección tiene los campos done=false cuando los datos son null", () => {
    const { sections } = calculateCompletion(null, null, null, null);
    sections.forEach((section) => {
      section.fields.forEach((field) => {
        expect(field.done).toBe(false);
      });
    });
  });

  it("perfil completo + sin el resto = ~39% (7/18)", () => {
    const { percent } = calculateCompletion(fullProfile, null, null, null);
    expect(percent).toBe(39);
  });
});