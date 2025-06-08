"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RoleSelector } from "@/components/atoms/RoleSelector"
import type { UserRole, LoginFormData, RegisterFormData } from "@/types/auth"
import { useAuth } from "@/hooks/useAuth"
import { Loader2, Mail, CheckCircle, Eye, EyeOff, ExternalLink, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { validatePassword } from "@/lib/auth-utils"

interface LoginFormProps {
  onSuccess?: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [name, setName] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [emailStatus, setEmailStatus] = useState<"success" | "warning" | "error" | null>(null)
  const [emailMessage, setEmailMessage] = useState("")
  const { login, register, isLoading, error, user } = useAuth()
  const router = useRouter()

  // Validar email en tiempo real
  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError("")
      return
    }

    if (!email.endsWith("@gmail.com")) {
      setEmailError("Solo se permiten correos electrónicos de Gmail (@gmail.com)")
    } else {
      setEmailError("")
    }
  }

  // Validar contraseña en tiempo real
  const validatePasswordField = (password: string) => {
    if (!password && !isRegisterMode) {
      setPasswordError("")
      return
    }

    if (isRegisterMode) {
      const validation = validatePassword(password)
      if (!validation.isValid) {
        setPasswordError(validation.errors.join(". "))
      } else {
        setPasswordError("")
      }
    }
  }

  // Validar confirmación de contraseña
  const validateConfirmPassword = (confirmPass: string) => {
    if (!confirmPass) {
      setConfirmPasswordError("")
      return
    }

    if (confirmPass !== password) {
      setConfirmPasswordError("Las contraseñas no coinciden")
    } else {
      setConfirmPasswordError("")
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value
    setEmail(newEmail)
    validateEmail(newEmail)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    validatePasswordField(newPassword)
    if (confirmPassword) {
      validateConfirmPassword(confirmPassword)
    }
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newConfirmPassword = e.target.value
    setConfirmPassword(newConfirmPassword)
    validateConfirmPassword(newConfirmPassword)
  }

  // Función para llenar datos de demo
  const fillDemoData = (role: UserRole) => {
    setSelectedRole(role)
    if (role === "teacher") {
      setEmail("profesor@gmail.com")
      setName("Profesor Demo")
    } else {
      setEmail("estudiante@gmail.com")
      setName("Estudiante Demo")
    }
    setPassword("demo123")
    setConfirmPassword("demo123")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedRole) {
      return
    }

    if (emailError || passwordError || (isRegisterMode && confirmPasswordError)) {
      return
    }

    const formData: LoginFormData = {
      email,
      password,
      role: selectedRole,
    }

    try {
      if (isRegisterMode) {
        if (password !== confirmPassword) {
          setConfirmPasswordError("Las contraseñas no coinciden")
          return
        }

        const registerData: RegisterFormData = { ...formData, name }
        await register(registerData)

        // Intentar enviar correo de bienvenida
        try {
          console.log("Enviando correo de bienvenida...")
          const emailResponse = await fetch("/api/send-welcome-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email,
              name: name,
              role: selectedRole,
            }),
          })

          const emailResult = await emailResponse.json()
          console.log("Resultado del correo:", emailResult)

          if (emailResult.success) {
            setEmailStatus("success")
            setEmailMessage("Correo de bienvenida enviado exitosamente")
          } else if (emailResult.warning) {
            setEmailStatus("warning")
            setEmailMessage(emailResult.message || "El correo no se pudo enviar, pero tu cuenta fue creada")
          } else {
            setEmailStatus("error")
            setEmailMessage("No se pudo enviar el correo de bienvenida")
          }
        } catch (emailError) {
          console.warn("Error enviando correo de bienvenida:", emailError)
          setEmailStatus("warning")
          setEmailMessage("Tu cuenta fue creada, pero el correo no se pudo enviar")
        }

        setRegistrationSuccess(true)

        // Mostrar mensaje de éxito por unos segundos antes de redirigir
        setTimeout(() => {
          if (onSuccess) {
            onSuccess()
          }

          // Redirigir según el rol
          if (selectedRole === "student") {
            router.push("/chat")
          } else {
            router.push("/dashboard")
          }
        }, 4000) // Aumentado a 4 segundos para leer el mensaje
      } else {
        await login(formData)

        if (onSuccess) {
          onSuccess()
        }

        // Redirigir según el rol
        if (selectedRole === "student") {
          router.push("/chat")
        } else {
          router.push("/dashboard")
        }
      }
    } catch (error) {
      console.error("Error en autenticación:", error)
    }
  }

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode)
    setPassword("")
    setConfirmPassword("")
    setPasswordError("")
    setConfirmPasswordError("")
    setEmailStatus(null)
    setEmailMessage("")
  }

  if (registrationSuccess) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-green-700">¡Registro Exitoso!</h2>
          <p className="text-muted-foreground">Tu cuenta ha sido creada correctamente.</p>

          {/* Estado del correo */}
          {emailStatus === "success" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">Correo enviado</span>
              </div>
              <p className="text-sm text-green-700">
                {emailMessage}. Revisa tu bandeja de entrada en <strong>{email}</strong>
              </p>
            </div>
          )}

          {emailStatus === "warning" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span className="font-medium text-yellow-800">Nota sobre el correo</span>
              </div>
              <p className="text-sm text-yellow-700">{emailMessage}</p>
            </div>
          )}

          {emailStatus === "error" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="font-medium text-red-800">Error con el correo</span>
              </div>
              <p className="text-sm text-red-700">{emailMessage}</p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-800">Únete al Grupo AISAC</span>
            </div>
            <p className="text-sm text-blue-700 mb-3">
              Para mantenerte conectado con la comunidad AISAC-UNERG y recibir actualizaciones importantes.
            </p>
            <a
              href="https://groups.google.com/g/aisac-unerg"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Acceder al Grupo de Google
            </a>
          </div>

          {selectedRole === "student" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
              <div className="flex items-center gap-2 mb-2">
                <ExternalLink className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">Portal del Estudiante</span>
              </div>
              <p className="text-sm text-green-700">
                Serás redirigido al portal del estudiante donde podrás acceder a AISAC.
              </p>
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {selectedRole === "student"
            ? "Serás redirigido al portal del estudiante en unos segundos..."
            : "Serás redirigido al dashboard en unos segundos..."}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">{isRegisterMode ? "Crear cuenta" : "Iniciar sesión"}</h1>
        <p className="text-muted-foreground">
          {isRegisterMode ? "Crea una cuenta para acceder a AISAC" : "Ingresa tus credenciales para acceder a AISAC"}
        </p>
        {isRegisterMode && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
            <p className="text-sm text-blue-700">
              <strong>Nota:</strong> Solo se permiten correos electrónicos de Gmail (@gmail.com)
            </p>
          </div>
        )}
      </div>

      <RoleSelector selectedRole={selectedRole} onRoleSelect={setSelectedRole} />

      {/* Botones de demo para facilitar pruebas */}
      <div className="flex gap-2 text-xs">
        <Button type="button" variant="outline" size="sm" onClick={() => fillDemoData("teacher")}>
          Demo Profesor
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => fillDemoData("student")}>
          Demo Estudiante
        </Button>
      </div>

      {isRegisterMode && (
        <div className="space-y-2">
          <Label htmlFor="name">Nombre completo</Label>
          <Input
            id="name"
            placeholder="Nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Correo electrónico</Label>
        <Input
          id="email"
          type="email"
          placeholder="usuario@gmail.com"
          value={email}
          onChange={handleEmailChange}
          className={emailError ? "border-red-500" : ""}
          required
        />
        {emailError && <p className="text-sm text-red-600">{emailError}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={handlePasswordChange}
            className={passwordError ? "border-red-500 pr-10" : "pr-10"}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
        {isRegisterMode && !passwordError && (
          <p className="text-xs text-muted-foreground">
            La contraseña debe tener al menos 6 caracteres, incluir letras y números
          </p>
        )}
      </div>

      {isRegisterMode && (
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className={confirmPasswordError ? "border-red-500 pr-10" : "pr-10"}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {confirmPasswordError && <p className="text-sm text-red-600">{confirmPasswordError}</p>}
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={
          isLoading ||
          !selectedRole ||
          !!emailError ||
          !!passwordError ||
          (isRegisterMode && (!name.trim() || !!confirmPasswordError))
        }
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isRegisterMode ? "Creando cuenta..." : "Iniciando sesión..."}
          </>
        ) : isRegisterMode ? (
          "Crear cuenta"
        ) : (
          "Iniciar sesión"
        )}
      </Button>

      <div className="text-center">
        <Button type="button" variant="link" onClick={toggleMode}>
          {isRegisterMode ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate"}
        </Button>
      </div>
    </form>
  )
}
