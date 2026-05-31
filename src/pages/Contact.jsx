import { useState } from "react";
import AppLayout from "../components/AppLayout";
import { api } from "../services/api";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Por favor completa todos los campos."); return;
    }
    setSending(true); setError("");
    try {
      await api("/api/contact", { method: "POST", body: JSON.stringify(form) });
      setSuccess(true);
      setForm({ name: "", email: "", message: "" });
    } catch {
      setError("No se pudo enviar el mensaje. Intenta de nuevo.");
    } finally {
      setSending(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "11px 14px", borderRadius: 10,
    border: "1.5px solid rgba(0,0,0,0.12)", fontSize: 14,
    fontFamily: "inherit", outline: "none", boxSizing: "border-box",
  };

  return (
    <AppLayout>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 32px" }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "#aaa", marginBottom: 12 }}>SOPORTE</p>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111", marginBottom: 8 }}>Contacto</h1>
        <p style={{ fontSize: 14, color: "#777", marginBottom: 40, lineHeight: 1.6 }}>
          ¿Tienes alguna pregunta o sugerencia? Escríbenos y te responderemos a la brevedad.
        </p>

        {success ? (
          <div style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 14, padding: "28px 24px", textAlign: "center" }}>
            <p style={{ fontSize: 28, marginBottom: 12 }}>✓</p>
            <p style={{ fontWeight: 700, fontSize: 16, color: "#111", marginBottom: 6 }}>Mensaje enviado</p>
            <p style={{ fontSize: 13, color: "#555" }}>Gracias por contactarnos. Te responderemos pronto.</p>
            <button onClick={() => setSuccess(false)} style={{ marginTop: 20, padding: "9px 22px", borderRadius: 999, border: "1.5px solid rgba(0,0,0,0.15)", background: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              Enviar otro mensaje
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6, display: "block" }}>Nombre</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Tu nombre" style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = "#111"} onBlur={(e) => e.target.style.borderColor = "rgba(0,0,0,0.12)"} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6, display: "block" }}>Correo electrónico</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="tu@correo.com" style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = "#111"} onBlur={(e) => e.target.style.borderColor = "rgba(0,0,0,0.12)"} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6, display: "block" }}>Mensaje</label>
              <textarea name="message" value={form.message} onChange={handleChange} placeholder="Escribe tu mensaje aquí..." rows={6}
                style={{ ...inputStyle, resize: "vertical", minHeight: 130 }}
                onFocus={(e) => e.target.style.borderColor = "#111"} onBlur={(e) => e.target.style.borderColor = "rgba(0,0,0,0.12)"} />
            </div>
            {error && <p style={{ fontSize: 13, color: "#dc2626", margin: 0 }}>{error}</p>}
            <button onClick={handleSubmit} disabled={sending}
              style={{ padding: "12px 28px", borderRadius: 999, background: sending ? "#555" : "#111", color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: sending ? "not-allowed" : "pointer", fontFamily: "inherit", alignSelf: "flex-start" }}>
              {sending ? "Enviando..." : "Enviar mensaje →"}
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}