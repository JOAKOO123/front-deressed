import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import * as AuthContextModule from "../context/AuthContext";

// ── Helper ────────────────────────────────────────────────────────────
function renderSidebar({ user = null, path = "/" } = {}) {
  const logout = vi.fn();
  vi.spyOn(AuthContextModule, "useAuth").mockReturnValue({ user, logout });

  render(
    <MemoryRouter initialEntries={[path]}>
      <Sidebar />
    </MemoryRouter>
  );

  return { logout };
}

// ── Tests ─────────────────────────────────────────────────────────────
describe("Sidebar", () => {
  describe("sin usuario autenticado", () => {
    it("muestra 'Profile & Preferences' como texto del avatar", () => {
      renderSidebar({ user: null });
      expect(screen.getByText("Profile & Preferences")).toBeInTheDocument();
    });

    it("muestra botones de Iniciar sesión y Registrarse", () => {
      renderSidebar({ user: null });
      expect(screen.getByText("Iniciar sesión")).toBeInTheDocument();
      expect(screen.getByText("Registrarse")).toBeInTheDocument();
    });

    it("no muestra el botón Cerrar sesión", () => {
      renderSidebar({ user: null });
      expect(screen.queryByText("Cerrar sesión")).not.toBeInTheDocument();
    });
  });

  describe("con usuario autenticado", () => {
    const user = { id: 1, name: "Juan Pérez", email: "juan@test.com" };

    it("muestra el nombre del usuario", () => {
      renderSidebar({ user });
      expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
    });

    it("muestra el email del usuario", () => {
      renderSidebar({ user });
      expect(screen.getByText("juan@test.com")).toBeInTheDocument();
    });

    it("muestra el botón Cerrar sesión", () => {
      renderSidebar({ user });
      expect(screen.getByText("Cerrar sesión")).toBeInTheDocument();
    });

    it("llama a logout al hacer click en Cerrar sesión", () => {
      const { logout } = renderSidebar({ user });
      fireEvent.click(screen.getByText("Cerrar sesión"));
      expect(logout).toHaveBeenCalledTimes(1);
    });
  });

  describe("ítem activo según ruta", () => {
    const user = { id: 1, name: "Test", email: "t@t.com" };

    it("marca Ropa como activo en /products", () => {
      renderSidebar({ user, path: "/products" });
      const btn = screen.getByText("Ropa");
      expect(btn).toHaveClass("bg-black");
      expect(btn).toHaveClass("text-white");
    });

    it("marca My Style como activo en /my-style", () => {
      renderSidebar({ user, path: "/my-style" });
      const btn = screen.getByText("My Style");
      expect(btn).toHaveClass("bg-black");
    });

    it("marca Clothing Preferences como activo en /clothing-preferences", () => {
      renderSidebar({ user, path: "/clothing-preferences" });
      const btn = screen.getByText("Clothing Preferences");
      expect(btn).toHaveClass("bg-black");
    });

    it("marca Size Adjustment como activo en /size-adjustment", () => {
      renderSidebar({ user, path: "/size-adjustment" });
      const btn = screen.getByText("Size Adjustment");
      expect(btn).toHaveClass("bg-black");
    });

    it("no marca Ropa como activo cuando la ruta es /my-style", () => {
      renderSidebar({ user, path: "/my-style" });
      const btn = screen.getByText("Ropa");
      expect(btn).not.toHaveClass("bg-black");
    });

    it("Favorites y Fit Settings aparecen como texto no clicable", () => {
      renderSidebar({ user, path: "/" });
      // Son <p> no <button>, por eso no tienen onClick
      const favorites = screen.getByText("Favorites");
      const fitSettings = screen.getByText("Fit Settings");
      expect(favorites.tagName).toBe("P");
      expect(fitSettings.tagName).toBe("P");
    });
  });
});