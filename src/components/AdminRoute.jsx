import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import Spinner from "./Spinner"

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Spinner text="Verificando permisos..." />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  if (user.role !== "admin") return <Navigate to="/dashboard" replace />

  return children
}