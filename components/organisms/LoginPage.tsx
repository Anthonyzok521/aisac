"use client"

import { LoginForm } from "@/components/molecules/LoginForm"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sección de imagen/branding */}
      <div className="flex-1 bg-primary/10 p-6 flex flex-col justify-center items-center">
        <div className="max-w-md text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative w-24 h-24">
              <Image
                src="/aisac-logo.png"
                alt="AISAC Logo"
                width={96}
                height={96}
                className="w-full h-full object-contain"
                priority
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">AISAC</h1>
          <p className="text-lg mb-6">Servicio de Inteligencia Artificial para Consultas Académicas.</p>
          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
            <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg">
              <h3 className="font-medium">Para profesores</h3>
              <p className="text-sm text-muted-foreground">
                Crea contenido educativo y entrena a la Inteligencia Artificial
              </p>
            </div>
            <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg">
              <h3 className="font-medium">Para estudiantes</h3>
              <p className="text-sm text-muted-foreground">Haz Consultas Académicas y resuelve todas tus dudas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de formulario */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
