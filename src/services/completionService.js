// Servicio de completitud de perfil
// Agrega aquí las llamadas reales a tu backend cuando estén disponibles.
// Por ahora centraliza la lógica de qué campos cuentan como "completos".

/**
 * Calcula el estado de completitud del perfil unificando
 * los datos de perfil, tallas y estilo.
 *
 * @param {object} profile  - datos de profileService.getProfile()
 * @param {object} sizes    - datos de sizeService.getSizes()
 * @param {object} myStyle  - datos de myStyleService.get()
 * @param {object} preferences - datos de preferencesService.get()
 * @returns {{ sections: Section[], percent: number }}
 */
export function calculateCompletion(profile, sizes, myStyle, preferences) {
  const sections = [
    {
      id: "profile",
      label: "Perfil personal",
      path: "/profile",
      emoji: "👤",
      fields: [
        { key: "firstName",  label: "Nombre",               done: !!profile?.firstName },
        { key: "lastName",   label: "Apellido",             done: !!profile?.lastName  },
        { key: "phone",      label: "Teléfono",             done: !!profile?.phone     },
        { key: "birthDate",  label: "Fecha de nacimiento",  done: !!profile?.birthDate },
        { key: "city",       label: "Ciudad",               done: !!profile?.city      },
        { key: "country",    label: "País",                 done: !!profile?.country   },
        { key: "bio",        label: "Sobre mí",             done: !!profile?.bio       },
      ],
    },
    {
      id: "sizes",
      label: "Tallas",
      path: "/size-adjustment",
      emoji: "📏",
      fields: [
        { key: "clothingSize",  label: "Talla de ropa",     done: !!sizes?.clothingSize  },
        { key: "shoeSize",      label: "Talla de zapatos",  done: !!sizes?.shoeSize      },
        { key: "jeanSize",      label: "Talla de jeans",    done: !!sizes?.jeanSize      },
        { key: "fitPreference", label: "Fit preferido",     done: !!sizes?.fitPreference },
        { key: "height",        label: "Altura",            done: !!sizes?.height        },
        { key: "weight",        label: "Peso",              done: !!sizes?.weight        },
      ],
    },
    {
      id: "style",
      label: "Mi estilo",
      path: "/my-style",
      emoji: "🎨",
      fields: [
        { key: "skinTone",       label: "Tono de piel",          done: !!myStyle?.skinTone                          },
        { key: "palette",        label: "Paleta de colores",      done: !!myStyle?.palette                           },
        { key: "favoriteColors", label: "Colores favoritos",      done: (myStyle?.favoriteColors?.length ?? 0) > 0   },
      ],
    },
    {
      id: "preferences",
      label: "Preferencias",
      path: "/clothing-preferences",
      emoji: "👗",
      fields: [
        { key: "styles",    label: "Estilos de vestimenta", done: (preferences?.styles?.length ?? 0) > 0    },
        { key: "occasions", label: "Ocasiones",             done: (preferences?.occasions?.length ?? 0) > 0 },
      ],
    },
  ];

  const totalFields = sections.reduce((acc, s) => acc + s.fields.length, 0);
  const doneFields  = sections.reduce((acc, s) => acc + s.fields.filter((f) => f.done).length, 0);
  const percent     = totalFields === 0 ? 0 : Math.round((doneFields / totalFields) * 100);

  return { sections, percent, doneFields, totalFields };
}