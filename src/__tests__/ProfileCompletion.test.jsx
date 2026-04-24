import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProfileCompletion from "../components/ProfileCompletion";
import { calculateCompletion } from "../services/completionService";

// ── Helper ────────────────────────────────────────────────────────────
function renderCompletion(completionData, loading = false) {
  render(
    <MemoryRouter>
      <ProfileCompletion completion={completionData} loading={loading} />
    </MemoryRouter>
  );
}

// ── Tests ─────────────────────────────────────────────────────────────
describe("ProfileCompletion", () => {
  it("muestra skeleton de carga cuando loading=true", () => {
    const empty = calculateCompletion(null, null, null, null);
    renderCompletion(empty, true);
    // En estado loading hay divs con animate-pulse pero no el porcentaje
    expect(screen.queryByText(/\d+%/)).not.toBeInTheDocument();
    expect(document.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("muestra 0% cuando no hay datos completados", () => {
    const completion = calculateCompletion(null, null, null, null);
    renderCompletion(completion);
    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("muestra 100% cuando todo está completo", () => {
    const completion = calculateCompletion(
      { firstName: "Juan", lastName: "Pérez", phone: "+569", birthDate: "1995-01-01", city: "Santiago", country: "Chile", bio: "Hola" },
      { clothingSize: "M", shoeSize: "42", jeanSize: "32", fitPreference: "Slim", height: "175", weight: "70" },
      { skinTone: "medio", palette: "otono", favoriteColors: ["negro"] },
      { styles: ["casual"], occasions: ["trabajo"] }
    );
    renderCompletion(completion);
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("muestra el mensaje '¡Perfil completo!' cuando es 100%", () => {
    const completion = calculateCompletion(
      { firstName: "Juan", lastName: "Pérez", phone: "+569", birthDate: "1995-01-01", city: "Santiago", country: "Chile", bio: "Hola" },
      { clothingSize: "M", shoeSize: "42", jeanSize: "32", fitPreference: "Slim", height: "175", weight: "70" },
      { skinTone: "medio", palette: "otono", favoriteColors: ["negro"] },
      { styles: ["casual"], occasions: ["trabajo"] }
    );
    renderCompletion(completion);
    expect(screen.getByText(/¡Perfil completo!/)).toBeInTheDocument();
  });

  it("muestra 'Recién comenzando' cuando el porcentaje es bajo", () => {
    const completion = calculateCompletion(null, null, null, null);
    renderCompletion(completion);
    expect(screen.getByText("Recién comenzando")).toBeInTheDocument();
  });

  it("muestra el conteo de campos completados sobre el total", () => {
    const completion = calculateCompletion(
      { firstName: "Juan", lastName: "Pérez" },
      null, null, null
    );
    renderCompletion(completion);
    expect(screen.getByText("2 de 18 campos completados")).toBeInTheDocument();
  });

  it("muestra las secciones pendientes como botones clicables", () => {
    const completion = calculateCompletion(null, null, null, null);
    renderCompletion(completion);
    // Las 4 secciones deben aparecer como pendientes
    expect(screen.getByText("Perfil personal")).toBeInTheDocument();
    expect(screen.getByText("Tallas")).toBeInTheDocument();
    expect(screen.getByText("Mi estilo")).toBeInTheDocument();
    expect(screen.getByText("Preferencias")).toBeInTheDocument();
  });

  it("no muestra secciones pendientes cuando el perfil está completo", () => {
    const completion = calculateCompletion(
      { firstName: "Juan", lastName: "Pérez", phone: "+569", birthDate: "1995-01-01", city: "Santiago", country: "Chile", bio: "Hola" },
      { clothingSize: "M", shoeSize: "42", jeanSize: "32", fitPreference: "Slim", height: "175", weight: "70" },
      { skinTone: "medio", palette: "otono", favoriteColors: ["negro"] },
      { styles: ["casual"], occasions: ["trabajo"] }
    );
    renderCompletion(completion);
    expect(screen.queryByText("Perfil personal")).not.toBeInTheDocument();
    expect(screen.getByText(/Tienes toda la información completa/)).toBeInTheDocument();
  });

  it("muestra los campos pendientes de cada sección", () => {
    const completion = calculateCompletion(
      { firstName: "Juan" }, // Solo firstName completo, faltan 6
      null, null, null
    );
    renderCompletion(completion);
    // Debe aparecer "Apellido" como pendiente en la sección de perfil
    expect(screen.getByText(/Apellido/)).toBeInTheDocument();
  });

  it("muestra 'En progreso' entre 30% y 59%", () => {
    // 7/18 = 39%
    const completion = calculateCompletion(
      { firstName: "Juan", lastName: "Pérez", phone: "+569", birthDate: "1995-01-01", city: "Santiago", country: "Chile", bio: "Hola" },
      null, null, null
    );
    renderCompletion(completion);
    expect(screen.getByText("En progreso")).toBeInTheDocument();
  });
});