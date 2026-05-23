const SECTION_DEFINITIONS = [
  {
    id: "profile",
    label: "Perfil personal",
    emoji: "👤",
    path: "/profile",
    fields: [
      { key: "firstName", label: "Nombre" },
      { key: "lastName", label: "Apellido" },
      { key: "phone", label: "Teléfono" },
      { key: "birthDate", label: "Fecha de nacimiento" },
      { key: "city", label: "Ciudad" },
      { key: "country", label: "País" },
      { key: "bio", label: "Biografía" },
    ],
  },
  {
    id: "sizes",
    label: "Tallas",
    emoji: "📏",
    path: "/size-adjustment",
    fields: [
      { key: "clothingSize", label: "Talla de ropa" },
      { key: "shoeSize", label: "Talla de zapatos" },
      { key: "jeanSize", label: "Talla de jeans" },
      { key: "fitPreference", label: "Preferencia de ajuste" },
      { key: "height", label: "Altura" },
      { key: "weight", label: "Peso" },
    ],
  },
  {
    id: "style",
    label: "Mi estilo",
    emoji: "🎨",
    path: "/my-style",
    fields: [
      { key: "skinTone", label: "Tono de piel" },
      { key: "palette", label: "Paleta" },
      { key: "favoriteColors", label: "Colores favoritos" },
    ],
  },
  {
    id: "preferences",
    label: "Preferencias",
    emoji: "✨",
    path: "/clothing-preferences",
    fields: [
      { key: "styles", label: "Estilos" },
      { key: "occasions", label: "Ocasiones" },
    ],
  },
];

function isCompleteValue(value) {
  if (Array.isArray(value)) return value.length > 0;
  return value !== undefined && value !== null && String(value).trim() !== "";
}

export function calculateCompletion(profile, sizes, myStyle, preferences) {
  const sources = {
    profile: profile || {},
    sizes: sizes || {},
    style: myStyle || {},
    preferences: preferences || {},
  };

  const sections = SECTION_DEFINITIONS.map((section) => {
    const fields = section.fields.map((field) => ({
      label: field.label,
      done: isCompleteValue(sources[section.id][field.key]),
    }));

    return {
      id: section.id,
      label: section.label,
      emoji: section.emoji,
      path: section.path,
      fields,
    };
  });

  const totalFields = SECTION_DEFINITIONS.reduce((sum, section) => sum + section.fields.length, 0);
  const doneFields = sections.reduce((sum, section) => sum + section.fields.filter((field) => field.done).length, 0);
  const percent = totalFields === 0 ? 0 : Math.round((doneFields / totalFields) * 100);

  return { sections, percent, doneFields, totalFields };
}
