"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { TeacherDashboard } from "@/components/organisms/TeacherDashboard"
import { useAuth } from "@/hooks/useAuth"
import { Loader2 } from "lucide-react"
import { UserProfile } from "@/components/molecules/UserProfile"

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, isInitialized } = useAuth()
  const [redirected, setRedirected] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Solo redirigir si:
    // 1. La autenticación está inicializada
    // 2. No estamos cargando
    // 3. El usuario NO está autenticado O no es profesor
    // 4. No hemos redirigido ya
    if (isInitialized && !isLoading && (!isAuthenticated || (user && user.role !== "teacher")) && !redirected) {
      setRedirected(true)

      if (!isAuthenticated) {
        router.push("/")
      } else {
        // Si está autenticado pero no es profesor, redirigir al chat
        router.push("/chat")
      }
    }
  }, [isAuthenticated, isLoading, isInitialized, redirected, router, user])

  // Mostrar un loader mientras se verifica la autenticación
  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Si no está autenticado o no es profesor, mostrar un loader mientras se redirige
  if (!isAuthenticated || !user || user.role !== "teacher") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b bg-card px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">AISAC - Panel de Profesor</h1>
          <div className="flex items-center gap-4">{user && <UserProfile userName={user.name} />}</div>
        </div>
      </header>
      <TeacherDashboard />
    </div>
  )
}
