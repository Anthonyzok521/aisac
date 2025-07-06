"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginPage } from "@/components/organisms/LoginPage"
import { useAuth } from "@/hooks/useAuth"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"

export default function HomePage() {
  const [isTermsAccepted, setIsTermsAccepted] = useState(false)
  const [isTermsDialogOpen, setIsTermsDialogOpen] = useState(false)
  const [isTermsChecked, setIsTermsChecked] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [redirected, setRedirected] = useState(false) // Para evitar redirecciones múltiples
  const { isAuthenticated, isLoading, isInitialized, user } = useAuth()
  const router = useRouter()

  // Efecto para manejar la carga inicial y los términos
  useEffect(() => {
    setMounted(true)
    const termsAccepted = localStorage.getItem("terms_accepted") === "true"

    if (termsAccepted) {
      setIsTermsAccepted(true)
    } else {
      setIsTermsDialogOpen(true)
    }
  }, [])

  // Efecto separado para manejar la redirección
  useEffect(() => {
    // Solo redirigir si:
    // 1. El componente está montado
    // 2. La autenticación está inicializada
    // 3. No estamos cargando
    // 4. El usuario está autenticado
    // 5. No hemos redirigido ya
    if (mounted && isInitialized && !isLoading && isAuthenticated && user && !redirected) {
      setRedirected(true) // Marcar como redirigido para evitar múltiples redirecciones

      // Redirigir según el rol
      if (user.role === "student") {
        // Estudiantes van a la página de chat (que manejará el estado de aprobación)
        router.push("/chat")
      } else if (user.role === "teacher") {
        // Profesores van al dashboard
        router.push("/dashboard")
      }
    }
  }, [mounted, isInitialized, isLoading, isAuthenticated, user, redirected, router])

  if (!mounted || isLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Si ya está autenticado y redirigido, mostrar un loader
  if (isAuthenticated && redirected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">
            {user?.role === "student" ? "Redirigiendo al portal del estudiante..." : "Redirigiendo al dashboard..."}
          </p>
        </div>
      </div>
    )
  }

  const handleAcceptTerms = () => {
    if (!isTermsChecked) return

    localStorage.setItem("terms_accepted", "true")
    setIsTermsAccepted(true)
    setIsTermsDialogOpen(false)
  }

  // Función que previene el cierre del dialog
  const handleOpenChange = (open: boolean) => {
    // No permitir cerrar el dialog si no se han aceptado los términos
    if (!isTermsAccepted) {
      return
    }
    setIsTermsDialogOpen(open)
  }

  return (
    <>
      <Dialog
        open={isTermsDialogOpen}
        onOpenChange={handleOpenChange}
        // Prevenir cierre con Escape
        modal={true}
      >
        <DialogContent
          className="sm:max-w-md"
          // Prevenir cierre haciendo clic fuera
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-center">Términos y Condiciones de AISAC</DialogTitle>
          </DialogHeader>
          <div className="max-h-[40vh] overflow-y-auto space-y-4 py-4">
            <div className="text-sm text-gray-700 space-y-3">
              <h3 className="font-semibold text-base">Bienvenido a AISAC</h3>
              <p>
                AISAC (Servicio de Inteligencia Artificial para Consultas Académicas) es una plataforma educativa
                desarrollada para estudiantes y profesores de la Universidad Nacional Experimental Rómulo Gallegos
                (UNERG).
              </p>

              <h4 className="font-medium">Uso Académico</h4>
              <p>
                Esta plataforma está diseñada exclusivamente para fines educativos y académicos. El uso de AISAC debe
                ser responsable y ético, respetando las políticas académicas de la institución.
              </p>

              <h4 className="font-medium">Privacidad y Datos</h4>
              <p>
                Nos comprometemos a proteger tu información personal. Los datos proporcionados serán utilizados
                únicamente para mejorar la experiencia educativa y no serán compartidos con terceros sin tu
                consentimiento.
              </p>

              <h4 className="font-medium">Responsabilidad del Usuario</h4>
              <p>
                Los usuarios son responsables del contenido que comparten y de usar la plataforma de manera apropiada.
                Está prohibido el uso para actividades ilegales o que violen las normas académicas.
              </p>

              <h4 className="font-medium">Modificaciones</h4>
              <p>
                Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán
                notificados a través de la plataforma.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3 mt-4 p-4 bg-blue-50 rounded-lg">
            <Checkbox
              id="terms"
              checked={isTermsChecked}
              onCheckedChange={(checked) => setIsTermsChecked(checked === true)}
              className="mt-1"
            />
            <label htmlFor="terms" className="text-sm text-black font-medium leading-relaxed cursor-pointer">
              He leído y acepto los términos y condiciones de uso de AISAC. Entiendo que esta plataforma es para uso
              académico y me comprometo a utilizarla de manera responsable.
            </label>
          </div>
          <DialogFooter className="mt-6">
            <Button onClick={handleAcceptTerms} disabled={!isTermsChecked} className="w-full">
              {isTermsChecked ? "Continuar a AISAC" : "Debes aceptar los términos para continuar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isTermsAccepted && !isAuthenticated && <LoginPage />}
    </>
  )
}
