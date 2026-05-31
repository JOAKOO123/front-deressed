import AppLayout from "../components/AppLayout";

export default function Terms() {
  return (
    <AppLayout>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 32px" }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "#aaa", marginBottom: 12 }}>LEGAL</p>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111", marginBottom: 8 }}>Términos y Condiciones</h1>
        <p style={{ fontSize: 13, color: "#aaa", marginBottom: 40 }}>Última actualización: enero 2025</p>
        {[
          { title: "1. Aceptación de los términos", body: "Al acceder y utilizar Dressed, aceptas quedar vinculado por estos Términos y Condiciones. Si no estás de acuerdo con alguna parte de estos términos, no podrás acceder al servicio." },
          { title: "2. Descripción del servicio", body: "Dressed es una plataforma de recomendación de outfits que utiliza tus preferencias de estilo, medidas y tallas para sugerirte combinaciones de ropa. El servicio es de carácter informativo y no garantiza la disponibilidad de los productos mostrados." },
          { title: "3. Cuenta de usuario", body: "Para acceder a las funciones personalizadas debes crear una cuenta. Eres responsable de mantener la confidencialidad de tus credenciales y de todas las actividades que ocurran bajo tu cuenta." },
          { title: "4. Propiedad intelectual", body: "Todo el contenido de Dressed, incluyendo textos, gráficos, logotipos e imágenes, es propiedad de Dressed o de sus proveedores de contenido y está protegido por las leyes de propiedad intelectual aplicables." },
          { title: "5. Limitación de responsabilidad", body: "Dressed no se hace responsable de inexactitudes en precios o disponibilidad de productos de terceros. Los links a tiendas externas son responsabilidad de cada comercio." },
          { title: "6. Modificaciones", body: "Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigor al momento de su publicación en la plataforma." },
          { title: "7. Contacto", body: "Si tienes preguntas sobre estos términos, puedes escribirnos a dressed968@gmail.com." },
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