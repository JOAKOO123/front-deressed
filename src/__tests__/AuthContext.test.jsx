import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "../context/AuthContext";

// ── Helper: genera JWT con exp ────────────────────────────────────────
function makeJwt(expOffsetSeconds) {
  const exp = Math.floor(Date.now() / 1000) + expOffsetSeconds;
  const payload = btoa(JSON.stringify({ exp }));
  return `header.${payload}.signature`;
}

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
      captured.login({ id: 1, name: "Test", email: "test@test.com" }, "token_abc");
    });

    expect(captured.user).toMatchObject({ id: 1, name: "Test" });
    expect(localStorage.getItem("auth_token")).toBe("token_abc");
    expect(JSON.parse(localStorage.getItem("auth_user"))).toMatchObject({ name: "Test" });
  });

  it("logout limpia el usuario y localStorage", async () => {
    let captured;
    await act(async () => {
      renderWithAuth((v) => { captured = v; });
    });

    await act(async () => {
      captured.login({ id: 1, name: "Test", email: "t@t.com" }, "token_abc");
    });
    await act(async () => {
      captured.logout();
    });

    expect(captured.user).toBeNull();
    expect(localStorage.getItem("auth_token")).toBeNull();
    expect(localStorage.getItem("auth_user")).toBeNull();
  });

  it("restaura la sesión desde localStorage si el token no está expirado", async () => {
    const token = makeJwt(3600); // expira en 1 hora
    localStorage.setItem("auth_token", token);
    localStorage.setItem("auth_user", JSON.stringify({ id: 2, name: "Guardado" }));

    let captured;
    await act(async () => {
      renderWithAuth((v) => { captured = v; });
    });

    expect(captured.user).toMatchObject({ id: 2, name: "Guardado" });
  });

  it("limpia la sesión si el token JWT está expirado", async () => {
    const expiredToken = makeJwt(-100); // expiró hace 100 segundos
    localStorage.setItem("auth_token", expiredToken);
    localStorage.setItem("auth_user", JSON.stringify({ id: 3, name: "Viejo" }));

    let captured;
    await act(async () => {
      renderWithAuth((v) => { captured = v; });
    });

    expect(captured.user).toBeNull();
    expect(localStorage.getItem("auth_token")).toBeNull();
  });

  it("getToken devuelve el token almacenado", async () => {
    localStorage.setItem("auth_token", "mi_token_123");
    localStorage.setItem("auth_user", JSON.stringify({ id: 1, name: "x" }));

    // Token sin exp válido para esta prueba
    const tokenSinExp = `header.${btoa(JSON.stringify({}))}.sig`;
    localStorage.setItem("auth_token", tokenSinExp);

    let captured;
    await act(async () => {
      renderWithAuth((v) => { captured = v; });
    });

    expect(captured.getToken()).toBe(tokenSinExp);
  });

  it("updateUserProfile fusiona los campos nuevos con los existentes", async () => {
    let captured;
    await act(async () => {
      renderWithAuth((v) => { captured = v; });
    });

    await act(async () => {
      captured.login({ id: 1, name: "Juan", email: "j@j.com" }, "tok");
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
      captured.login({ id: 1, name: "Juan", email: "j@j.com" }, "tok");
    });
    await act(async () => {
      captured.updateUserProfile({ name: "Juan Actualizado" });
    });

    const stored = JSON.parse(localStorage.getItem("auth_user"));
    expect(stored.name).toBe("Juan Actualizado");
  });
});