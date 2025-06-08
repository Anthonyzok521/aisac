"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { StudentDashboard } from "@/components/organisms/StudentDashboard"
import { useAuth } from "@/hooks/useAuth"
import { Loader2 } from "lucide-react"
import { WaitingMessage } from "@/components/molecules/WaitingMessage"
import { UserProfile } from "@/components/molecules/UserProfile"

export default function StudentPage() {
  const { user, isAuthenticated, isLoading, isInitialized, checkGroupStatus } = useAuth()
  const [redirected, setRedirected] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (isInitialized && !isLoading && (!isAuthenticated || (user && user.role !== "student")) && !redirected) {
      setRedirected(true)

      if (!isAuthenticated) {
        router.push("/")
      } else {
        // Si está autenticado pero no es estudiante, redirigir al dashboard
        router.push("/dashboard")
      }
    }
  }, [isAuthenticated, isLoading, isInitialized, redirected, router, user])

  const handleRefreshStatus = async () => {
    try {
      const isInGroup = await checkGroupStatus()
      return isInGroup
    } catch (error) {
      console.error("Error al verificar estado:", error)
      return false
    }
  }

  // Mostrar un loader mientras se verifica la autenticación
  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Si no está autenticado o no es estudiante, mostrar un loader mientras se redirige
  if (!isAuthenticated || !user || user.role !== "student") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Si es estudiante pero no está en el grupo, mostrar mensaje de espera
  if (!user.is_in_group) {
    return <WaitingMessage userEmail={user.email} userRole={user.role} onRefresh={handleRefreshStatus} />
  }

  // Si es estudiante aprobado, mostrar el dashboard con header
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-card/80 backdrop-blur-sm px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">AISAC - Portal del Estudiante</h1>
          <div className="flex items-center gap-4">{user && <UserProfile userName={user.name} />}</div>
        </div>
      </header>
      <StudentDashboard />
    </div>
  )
}
