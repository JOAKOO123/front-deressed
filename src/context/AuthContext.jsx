import { createContext, useContext, useState, useEffect } from "react"
import { api } from "../services/api"

export const AuthContext = createContext(null)

const USER_KEY  = "auth_user"

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

function isTokenExpired(token) {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return false
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")))
    if (!payload.exp) return false
    return Date.now() / 1000 > payload.exp
  } catch {
    return false
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = getStoredUser()

    if (savedUser) {
      setUser(savedUser)
    }

    api("/api/auth/me")
      .then((data) => {
        if (data) {
          const updated = { id: data.id, email: data.email, name: data.name ?? savedUser?.name }
          saveUser(updated)
          setUser(updated)
        }
      })
      .catch(() => {
        clearUser()
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (userData) => {
    saveUser(userData)
    setUser(userData)
  }

  const logout = async () => {
    try {
      await api("/api/auth/logout", { method: "POST" })
    } catch {
      // Ignorar errores del logout en el BFF
    } finally {
      clearUser()
      setUser(null)
    }
  }

  const updateUserProfile = (updatedFields) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedFields }
      localStorage.setItem(USER_KEY, JSON.stringify(next))
      return next
    })
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  )
}