import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "./useAuth"

/**
 * Devuelve una función `requireAuth(action)`.
 * Si el usuario tiene sesión, ejecuta `action()` directamente.
 * Si no, redirige a login con la ruta actual como `?redirect=`
 * para volver después de autenticarse.
 */
export function useRequireAuth() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  function requireAuth(action) {
    if (loading) return
    if (user) {
      action()
    } else {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`, { replace: false })
    }
  }

  return requireAuth
}
