import { createContext, useCallback, useEffect, useState } from "react"
import { api, registerUnauthorizedHandler } from "../services/api"

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null)

const USER_KEY = "dressed_user_display"

function saveUser(userData) {
  localStorage.setItem(USER_KEY, JSON.stringify(userData))
}

function clearUser() {
  localStorage.removeItem(USER_KEY)
}

function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    registerUnauthorizedHandler(() => {
      clearUser()
      setUser(null)
      if (import.meta.env.MODE !== "test") {
        try {
          window.location.href = "/login"
        } catch {
          // En entornos sin navegación completa, solo limpiamos la sesión.
        }
      }
    })

    const savedUser = getStoredUser()

    if (savedUser) {
      setUser(savedUser)
    }

    api("/api/auth/me")
      .then((data) => {
        if (data) {
          const updated = {
            ...savedUser,
            id: data.id,
            email: data.email,
            name: data.name ?? savedUser?.name,
          }
          saveUser(updated)
          setUser(updated)
        } else {
          clearUser()
          setUser(null)
        }
      })
      .catch(() => {
        clearUser()
        setUser(null)
      })
      .finally(() => setLoading(false))

    return () => {
      registerUnauthorizedHandler(null)
    }
  }, [])

  const login = useCallback((userData) => {
    saveUser(userData)
    setUser(userData)
  }, [])

  const logout = useCallback(async () => {
    try {
      await api("/api/auth/logout", { method: "POST" })
    } catch {
      // Ignorar errores del logout en el BFF
    } finally {
      clearUser()
      setUser(null)
    }
  }, [])

  const updateUserProfile = useCallback((updatedFields) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedFields }
      saveUser(next)
      return next
    })
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  )
}