import { createContext, useCallback, useEffect, useState } from "react"
import { api, registerUnauthorizedHandler } from "../services/api"

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null)

const USER_KEY = "dressed_user_display"

// Solo guardamos datos de display (no sensibles) en localStorage.
// La sesión real la maneja el BFF via cookie HttpOnly.
const DISPLAY_FIELDS = ["name", "email"]

function saveDisplayCache(userData) {
  const safe = {}
  for (const key of DISPLAY_FIELDS) {
    if (userData[key] !== undefined) safe[key] = userData[key]
  }
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(safe))
  } catch {
    // localStorage puede estar bloqueado (modo privado estricto)
  }
}

function clearUser() {
  try {
    localStorage.removeItem(USER_KEY)
  } catch {
    // ignorar
  }
}

function getDisplayCache() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  // serverVerified = true solo cuando /api/auth/me responde OK
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [serverVerified, setServerVerified] = useState(false)

  useEffect(() => {
    registerUnauthorizedHandler(() => {
      clearUser()
      setUser(null)
      setServerVerified(false)
      if (import.meta.env.MODE !== "test") {
        try {
          window.location.href = "/login"
        } catch {
          // En entornos sin navegación completa, solo limpiamos la sesión.
        }
      }
    })

    // Precargamos solo el caché de display para mostrar nombre/email
    // mientras llega la verificación del servidor — nunca para autorizar acceso.
    const displayCache = getDisplayCache()
    if (displayCache) {
      setUser(displayCache)
    }

    api("/api/auth/me")
      .then((data) => {
        if (data) {
          const verified = {
            id: data.id,
            email: data.email,
            name: data.name ?? displayCache?.name,
            role: data.role ?? "user",
          }
          saveDisplayCache(verified)
          setUser(verified)
          setServerVerified(true)
        } else {
          clearUser()
          setUser(null)
          setServerVerified(false)
        }
      })
      .catch(() => {
        clearUser()
        setUser(null)
        setServerVerified(false)
      })
      .finally(() => setLoading(false))

    return () => {
      registerUnauthorizedHandler(null)
    }
  }, [])

  const login = useCallback((userData) => {
    const safe = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      role: userData.role ?? "user",
    }
    saveDisplayCache(safe)
    setUser(safe)
    setServerVerified(true)
  }, [])

  const logout = useCallback(async () => {
    try {
      await api("/api/auth/logout", { method: "POST" })
    } catch {
      // Ignorar errores del logout en el BFF
    } finally {
      clearUser()
      setUser(null)
      setServerVerified(false)
    }
  }, [])

  const updateUserProfile = useCallback((updatedFields) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedFields }
      saveDisplayCache(next)
      return next
    })
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, serverVerified, login, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  )
}