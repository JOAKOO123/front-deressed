import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer style={{ borderTop: "1px solid rgba(0,0,0,0.07)", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, background: "#fff" }}>
      <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.2em", color: "#111" }}>DRESSED</span>
      <p style={{ fontSize: 11.5, color: "#aaa", margin: 0 }}>© {new Date().getFullYear()} Dressed. Todos los derechos reservados.</p>
      <div style={{ display: "flex", gap: 20 }}>
        {[{ label: "Términos", path: "/terms" }, { label: "Privacidad", path: "/privacy" }, { label: "Contacto", path: "/contact" }].map(({ label, path }) => (
          <button key={label} onClick={() => navigate(path)}
            style={{ fontSize: 11.5, color: "#999", cursor: "pointer", background: "none", border: "none", fontFamily: "inherit", padding: 0 }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#111"}
            onMouseLeave={(e) => e.currentTarget.style.color = "#999"}>
            {label}
          </button>
        ))}
      </div>
    </footer>
  );
}