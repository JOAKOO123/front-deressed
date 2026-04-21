import { useState } from "react";

export default function Assistant() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Panel del asistente */}
      <div
        style={{
          position: "fixed",
          bottom: "90px",
          right: "24px",
          width: "320px",
          background: "white",
          borderRadius: "20px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          transformOrigin: "bottom right",
          transform: isOpen ? "scale(1)" : "scale(0.7)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "all" : "none",
          transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease",
          zIndex: 100,
          maxHeight: "480px",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "black",
            color: "white",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                background: "#e0e7ff",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
              }}
            >
              ✨
            </div>
            <span style={{ fontWeight: 600, fontSize: "15px" }}>Style Assistant</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: "none",
              border: "none",
              color: "white",
              fontSize: "20px",
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Mensajes */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            background: "#f9fafb",
          }}
        >
          <div
            style={{
              background: "#e5e7eb",
              padding: "10px 14px",
              borderRadius: "16px 16px 16px 4px",
              fontSize: "13px",
              maxWidth: "80%",
            }}
          >
            Hi! How can I help you find your style today?
          </div>

          <div
            style={{
              background: "black",
              color: "white",
              padding: "10px 14px",
              borderRadius: "16px 16px 4px 16px",
              fontSize: "13px",
              maxWidth: "80%",
              alignSelf: "flex-end",
            }}
          >
            I need a winter outfit recommendation
          </div>
        </div>

        {/* Input */}
        <div
          style={{
            display: "flex",
            borderTop: "1px solid #e5e7eb",
            background: "white",
          }}
        >
          <input
            type="text"
            placeholder="Ask me anything..."
            style={{
              flex: 1,
              border: "none",
              padding: "12px 16px",
              fontSize: "13px",
              outline: "none",
            }}
          />
          <button
            style={{
              background: "black",
              color: "white",
              border: "none",
              padding: "12px 16px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            →
          </button>
        </div>
      </div>

      {/* Burbuja flotante */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "black",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontSize: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          zIndex: 101,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow = "0 6px 28px rgba(0,0,0,0.35)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.25)";
        }}
        title="Style Assistant"
      >
        {isOpen ? "×" : "✨"}
      </button>
    </>
  );
}