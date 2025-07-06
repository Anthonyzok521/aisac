"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminPanel } from "@/components/organisms/AdminPanel"
import { useAuth } from "@/hooks/useAuth"
import { Loader2 } from "lucide-react"

export default function AdminPage() {
  const { user, isAuthenticated, isLoading, isInitialized } = useAuth()
  const [redirected, setRedirected] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (isInitialized && !isLoading && (!isAuthenticated || (user && user.role !== "teacher")) && !redirected) {
      setRedirected(true)
      router.push("/")
    }
  }, [isAuthenticated, isLoading, isInitialized, redirected, router, user])

  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuthenticated || !user || user.role !== "teacher") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-card px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">AISAC - Administración</h1>
          <div className="flex items-center gap-4">{/* Aquí podrías añadir más controles de navegación */}</div>
        </div>
      </header>
      <AdminPanel />
    </div>
  )
}
