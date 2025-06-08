"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { StudentDashboard } from "@/components/organisms/StudentDashboard"
import { useAuth } from "@/hooks/useAuth"
import { Loader2 } from "lucide-react"
import { WaitingMessage } from "@/components/molecules/WaitingMessage"

export default function ChatPage() {
  const { user, isAuthenticated, isLoading, isInitialized, checkGroupStatus } = useAuth()
  const [redirected, setRedirected] = useState(false)
  const [isCheckingGroup, setIsCheckingGroup] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (isInitialized && !isLoading && !isAuthenticated && !redirected) {
      setRedirected(true)
      router.push("/")
    }
  }, [isAuthenticated, isLoading, isInitialized, redirected, router])

  const handleRefreshStatus = async () => {
    setIsCheckingGroup(true)
    try {
      const isInGroup = await checkGroupStatus()
      return isInGroup
    } finally {
      setIsCheckingGroup(false)
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

  // Si no está autenticado, mostrar un loader mientras se redirige
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Si es estudiante pero no está en el grupo, mostrar mensaje de espera
  if (user.role === "student" && !user.is_in_group) {
    return <WaitingMessage userEmail={user.email} userRole={user.role} onRefresh={handleRefreshStatus} />
  }

  // Si es estudiante aprobado, mostrar el dashboard de estudiante
  if (user.role === "student" && user.is_in_group) {
    return <StudentDashboard />
  }

  // Si es profesor, redirigir al dashboard (esto no debería pasar normalmente)
  if (user.role === "teacher") {
    router.push("/dashboard")
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return null
}
