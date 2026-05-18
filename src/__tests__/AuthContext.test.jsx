import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import { AuthProvider } from "../context/AuthContext";
import { useAuth } from "../hooks/useAuth";

// ── Componente auxiliar para leer el contexto en tests ────────────────
function AuthConsumer({ onValue }) {
  const auth = useAuth();
  onValue(auth);
  return null;
}

function renderWithAuth(onValue) {
  render(
    <AuthProvider>
      <AuthConsumer onValue={onValue} />
    </AuthProvider>
  );
}

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn(async (url) => {
    if (String(url).includes("/api/auth/me")) {
      return {
        ok: false,
        status: 401,
        json: async () => ({ error: "Unauthorized" }),
      };
    }

    if (String(url).includes("/api/auth/logout")) {
      return {
        ok: true,
        status: 204,
        json: async () => ({}),
      };
    }

    return {
      ok: true,
      status: 200,
      json: async () => ({ id: 1, email: "test@test.com" }),
    };
  }));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

// ── Tests ─────────────────────────────────────────────────────────────
describe("AuthContext", () => {
  it("inicia con user=null y loading=false cuando no hay sesión guardada", async () => {
    let captured;
    await act(async () => {
      renderWithAuth((v) => { captured = v; });
    });
    expect(captured.user).toBeNull();
    expect(captured.loading).toBe(false);
  });

  it("login guarda el usuario en el estado y en localStorage", async () => {
    let captured;
    await act(async () => {
      renderWithAuth((v) => { captured = v; });
    });

    await act(async () => {
      captured.login({ id: 1, name: "Test", email: "test@test.com" });
    });

    expect(captured.user).toMatchObject({ id: 1, name: "Test" });
    expect(JSON.parse(localStorage.getItem("auth_user"))).toMatchObject({ name: "Test" });
  });

  it("logout limpia el usuario y localStorage", async () => {
    let captured;
    await act(async () => {
      renderWithAuth((v) => { captured = v; });
    });

    await act(async () => {
      captured.login({ id: 1, name: "Test", email: "t@t.com" });
    });
    await act(async () => {
      captured.logout();
    });

    expect(captured.user).toBeNull();
    expect(localStorage.getItem("auth_user")).toBeNull();
  });

  it("restaura la sesión desde localStorage si existe usuario guardado", async () => {
    localStorage.setItem("auth_user", JSON.stringify({ id: 2, name: "Guardado" }));

    globalThis.fetch.mockImplementationOnce(async () => ({
      ok: true,
      status: 200,
      json: async () => ({ id: 2, email: "guardado@test.com", name: "Guardado" }),
    }));

    let captured;
    await act(async () => {
      renderWithAuth((v) => { captured = v; });
    });

    expect(captured.user).toMatchObject({ id: 2, name: "Guardado" });
  });

  it("limpia la sesión si el backend rechaza la cookie", async () => {
    localStorage.setItem("auth_user", JSON.stringify({ id: 3, name: "Viejo" }));

    let captured;
    await act(async () => {
      renderWithAuth((v) => { captured = v; });
    });

    expect(captured.user).toBeNull();
  });

  it("updateUserProfile fusiona los campos nuevos con los existentes", async () => {
    let captured;
    await act(async () => {
      renderWithAuth((v) => { captured = v; });
    });

    await act(async () => {
      captured.login({ id: 1, name: "Juan", email: "j@j.com" });
    });
    await act(async () => {
      captured.updateUserProfile({ name: "Juan Pérez" });
    });

    expect(captured.user.name).toBe("Juan Pérez");
    expect(captured.user.email).toBe("j@j.com");
  });

  it("updateUserProfile persiste los cambios en localStorage", async () => {
    let captured;
    await act(async () => {
      renderWithAuth((v) => { captured = v; });
    });

    await act(async () => {
      captured.login({ id: 1, name: "Juan", email: "j@j.com" });
    });
    await act(async () => {
      captured.updateUserProfile({ name: "Juan Actualizado" });
    });

    const stored = JSON.parse(localStorage.getItem("auth_user"));
    expect(stored.name).toBe("Juan Actualizado");
  });
});