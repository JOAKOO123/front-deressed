import AppLayout from "../components/AppLayout";

export default function Privacy() {
  return (
    <AppLayout>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 32px" }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "#aaa", marginBottom: 12 }}>LEGAL</p>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111", marginBottom: 8 }}>Política de Privacidad</h1>
        <p style={{ fontSize: 13, color: "#aaa", marginBottom: 40 }}>Última actualización: enero 2025</p>
        {[
          { title: "1. Información que recopilamos", body: "Recopilamos información que nos proporcionas al registrarte: nombre, correo electrónico, medidas corporales y preferencias de estilo. También recopilamos datos de uso de la plataforma de forma anónima para mejorar el servicio." },
          { title: "2. Uso de la información", body: "Utilizamos tu información para personalizar las recomendaciones de outfits, enviarte comunicaciones relevantes y mejorar nuestro servicio. No vendemos ni compartimos tu información personal con terceros con fines comerciales." },
          { title: "3. Almacenamiento y seguridad", body: "Tu información se almacena en servidores seguros. Implementamos medidas técnicas y organizativas para proteger tus datos contra acceso no autorizado, pérdida o alteración." },
          { title: "4. Cookies", body: "Utilizamos cookies de sesión para mantenerte autenticado y mejorar tu experiencia. No utilizamos cookies de seguimiento ni publicidad de terceros." },
          { title: "5. Tus derechos", body: "Tienes derecho a acceder, rectificar y eliminar tus datos personales en cualquier momento. Para ejercer estos derechos, contáctanos en dressed968@gmail.com." },
          { title: "6. Cambios en esta política", body: "Podemos actualizar esta política periódicamente. Te notificaremos de cambios significativos por correo electrónico o mediante un aviso en la plataforma." },
        ].map(({ title, body }) => (
          <div key={title} style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111", marginBottom: 8 }}>{title}</h2>
            <p style={{ fontSize: 14, color: "#555", lineHeight: 1.75, margin: 0 }}>{body}</p>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}