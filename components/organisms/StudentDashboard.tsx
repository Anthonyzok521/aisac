"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, BookOpen, MessageSquare, Users, Clock, CheckCircle, LogOut } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import Image from "next/image"

export function StudentDashboard() {
  const { user, redirectToNotebook, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header de bienvenida */}
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                    <Image
                        src="/aisac-logo.png"
                        alt="AISAC Logo"
                        width={96}
                        height={96}
                        className="w-full h-full object-contain"
                        priority
                    />
                </div>
                <div className="absolute -bottom-2 -right-2">
                  <Badge className="bg-green-500 text-white">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Aprobado
                  </Badge>
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">¡Bienvenido a AISAC, {user?.name}!</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Tu asistente de Inteligencia Artificial para Consultas Académicas está listo para ayudarte
            </p>
          </div>

          {/* Tarjeta principal de acceso */}
          <Card className="border-2 border-blue-200 shadow-xl bg-white backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl text-blue-800 flex items-center justify-center gap-2">
                <MessageSquare className="h-6 w-6" />
                Acceso a AISAC
              </CardTitle>
              <CardDescription className="text-lg text-black">
                Haz clic en el botón para acceder a tu asistente de IA personalizado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <Button
                  onClick={redirectToNotebook}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <ExternalLink className="mr-3 h-6 w-6" />
                  Ir a Chat AISAC
                </Button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <BookOpen className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800 mb-1">¿Qué puedes hacer con AISAC?</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Hacer preguntas académicas sobre cualquier tema</li>
                      <li>• Obtener explicaciones detalladas y ejemplos</li>
                      <li>• Resolver dudas de tareas y proyectos</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información adicional */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                                  <span className="text-blue-800">Comunidad AISAC</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Únete a nuestra comunidad de estudiantes y profesores en Google Groups.
                </p>
                <Button variant="outline" asChild className="w-full">
                  <a
                    href="https://groups.google.com/g/aisac-unerg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Users className="h-4 w-4" />
                    Unirse al Grupo
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                    <span className="text-blue-800">Disponibilidad</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  AISAC está disponible 24/7 para ayudarte con tus consultas académicas.
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-700">Sistema activo</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Consejos de uso */}
          <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
            <CardHeader>
              <CardTitle className="text-lg text-indigo-800">💡 Consejos para usar AISAC</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-indigo-700 mb-2">Preguntas efectivas:</h4>
                  <ul className="space-y-1 text-indigo-600">
                    <li>• Sé específico en tus consultas</li>
                    <li>• Proporciona contexto cuando sea necesario</li>
                    <li>• Pregunta por ejemplos prácticos</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-indigo-700 mb-2">Mejores resultados:</h4>
                  <ul className="space-y-1 text-indigo-600">
                    <li>• Divide preguntas complejas en partes</li>
                    <li>• Pide explicaciones paso a paso</li>
                    <li>• Solicita recursos adicionales</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botón de cerrar sesión */}
          <div className="text-center">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
