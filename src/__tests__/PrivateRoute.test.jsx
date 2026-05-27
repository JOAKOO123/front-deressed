import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import * as UseAuthModule from "../hooks/useAuth";

// ── Helper: monta PrivateRoute con un contexto de auth controlado ─────
function renderPrivateRoute({ user = null, loading = false, serverVerified = false } = {}) {
  vi.spyOn(UseAuthModule, "useAuth").mockReturnValue({ user, loading, serverVerified });

  render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <div>Contenido protegido</div>
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<div>Página de login</div>} />
      </Routes>
    </MemoryRouter>
  );
}

// ── Tests ─────────────────────────────────────────────────────────────
describe("PrivateRoute", () => {
  it("muestra el spinner cuando loading es true", () => {
    renderPrivateRoute({ loading: true, user: null });
    // El spinner es un div con animate-spin, no hay texto visible
    const spinner = document.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
    expect(screen.queryByText("Contenido protegido")).not.toBeInTheDocument();
  });

  it("redirige a /login cuando no hay usuario autenticado", () => {
    renderPrivateRoute({ user: null, loading: false });
    expect(screen.getByText("Página de login")).toBeInTheDocument();
    expect(screen.queryByText("Contenido protegido")).not.toBeInTheDocument();
  });

  it("muestra el contenido protegido cuando hay usuario autenticado", () => {
    renderPrivateRoute({ user: { id: 1, name: "Test" }, loading: false, serverVerified: true });
    expect(screen.getByText("Contenido protegido")).toBeInTheDocument();
    expect(screen.queryByText("Página de login")).not.toBeInTheDocument();
  });

  it("no redirige si loading es true aunque no haya usuario", () => {
    renderPrivateRoute({ loading: true, user: null });
    expect(screen.queryByText("Página de login")).not.toBeInTheDocument();
  });
});