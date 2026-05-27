import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

export default function PrivateRoute({ children }) {
  const { user, loading, serverVerified } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return serverVerified && user ? children : <Navigate to="/login" replace />
}