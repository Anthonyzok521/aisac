"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Mail, Shield } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

interface EmailVerificationFormProps {
  email: string
  name: string
  onVerified: () => void
  onBack: () => void
}

export function EmailVerificationForm({ email, name, onVerified, onBack }: EmailVerificationFormProps) {
  const [code, setCode] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isResending, setIsResending] = useState(false)

  const { verifyCode, sendVerificationCode } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      if (code.length !== 6) {
        throw new Error("El código debe tener 6 dígitos")
      }

      await verifyCode({ email, code })
      onVerified()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al verificar el código")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendCode = async () => {
    setIsResending(true)
    setError(null)

    try {
      await sendVerificationCode(email, name)
      setError(null)
      // Mostrar mensaje de éxito temporalmente
      setError("Código reenviado exitosamente")
      setTimeout(() => setError(null), 3000)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al reenviar el código")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-2xl font-bold">Verificar Email</CardTitle>
          <CardDescription>Hemos enviado un código de verificación a tu correo institucional</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{email}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verification-code">Código de Verificación</Label>
              <Input
                id="verification-code"
                type="text"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="text-center text-lg font-mono tracking-widest"
                maxLength={6}
                required
              />
              <p className="text-xs text-muted-foreground text-center">
                Ingresa el código de 6 dígitos que recibiste por correo
              </p>
            </div>

            {error && (
              <Alert variant={error.includes("exitosamente") ? "default" : "destructive"}>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting || code.length !== 6}>
              {isSubmitting ? "Verificando..." : "Verificar Código"}
            </Button>
          </form>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">¿No recibiste el código?</p>
            <Button
              type="button"
              variant="outline"
              onClick={handleResendCode}
              disabled={isResending}
              className="w-full bg-transparent"
            >
              {isResending ? "Reenviando..." : "Reenviar Código"}
            </Button>
          </div>

          <Button type="button" variant="ghost" onClick={onBack} className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Registro
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
