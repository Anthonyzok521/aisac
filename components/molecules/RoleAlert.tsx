"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { UserRole } from "@/types/auth"
import { BookOpen, GraduationCap } from "lucide-react"

interface RoleAlertProps {
  role: UserRole
}

export function RoleAlert({ role }: RoleAlertProps) {
  if (role === "teacher") {
    return (
      <Alert>
        <GraduationCap className="h-4 w-4" />
        <AlertTitle>Modo Profesor</AlertTitle>
        <AlertDescription>
          Tienes acceso a funciones avanzadas para crear contenido educativo y evaluar a tus estudiantes.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert>
      <BookOpen className="h-4 w-4" />
      <AlertTitle>Modo Estudiante</AlertTitle>
      <AlertDescription>Puedes hacer preguntas, recibir explicaciones y practicar con ejercicios.</AlertDescription>
    </Alert>
  )
}
