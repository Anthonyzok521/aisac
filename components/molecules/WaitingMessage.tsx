"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Mail, ExternalLink, RefreshCw, LogOut } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

interface WaitingMessageProps {
  userEmail?: string
  userRole?: string
  onRefresh?: () => Promise<boolean>
}

export function WaitingMessage({ userEmail, userRole, onRefresh }: WaitingMessageProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null)
  const { logout } = useAuth()
  const router = useRouter()

  const handleRefresh = async () => {
    if (!onRefresh) return

    setIsRefreshing(true)
    setRefreshMessage(null)

    try {
      const isApproved = await onRefresh()

      if (isApproved) {
        setRefreshMessage("¡Tu cuenta ha sido aprobada! Redirigiendo...")
        setTimeout(() => {
          window.location.reload() // Recargar para aplicar los cambios
        }, 2000)
      } else {
        setRefreshMessage("Tu cuenta aún está pendiente de aprobación.")
      }
    } catch (error) {
      console.error("Error al verificar estado:", error)
      setRefreshMessage("Error al verificar el estado. Intenta de nuevo.")
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Clock className="h-16 w-16 text-orange-500" />
          </div>
          <CardTitle className="text-xl text-orange-700">Lista de Espera</CardTitle>
          <CardDescription>Tu cuenta está pendiente de aprobación</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-orange-800 font-medium text-center">
              Estás en la lista de espera para usar AISAC. El administrador confirmará tu inscripción. Intenta más
              tarde.
            </p>
          </div>

          {userEmail && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-800">Correo enviado</span>
              </div>
              <p className="text-sm text-blue-700">
                Hemos enviado una invitación a <strong>{userEmail}</strong> para unirte al grupo de Google.
              </p>
            </div>
          )}

          {refreshMessage && (
            <div
              className={`p-3 rounded-md text-center text-sm font-medium ${
                refreshMessage.includes("aprobada")
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-blue-100 text-blue-800 border border-blue-200"
              }`}
            >
              {refreshMessage}
            </div>
          )}

          <div className="space-y-2">
            <h4 className="font-medium">Mientras esperas:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Únete al grupo de Google AISAC-UNERG</li>
              <li>• Revisa tu correo electrónico</li>
              <li>• El administrador revisará tu solicitud</li>
              <li>• Recibirás acceso una vez aprobado</li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <a
                href="https://groups.google.com/g/aisac-unerg"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                Unirse al Grupo de Google
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>

            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing || !onRefresh}
              className="w-full flex items-center gap-2"
            >
              {isRefreshing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Verificar Estado
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Una vez que el administrador apruebe tu cuenta, tendrás acceso completo a AISAC.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
