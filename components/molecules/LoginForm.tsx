"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RoleSelector } from "@/components/atoms/RoleSelector"
import { EmailVerificationForm } from "./EmailVerificationForm"
import { ForgotPasswordForm } from "./ForgotPasswordForm"
import { useAuth } from "@/hooks/useAuth"
import type { UserRole, LoginFormData, RegisterFormData } from "@/types/auth"
import { CAREERS, SEMESTERS } from "@/types/auth"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"

interface LoginFormProps {
  onSuccess?: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register" | "forgot">("login")
  const [selectedRole, setSelectedRole] = useState<UserRole>("student")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Estados para verificación de email
  const [showEmailVerification, setShowEmailVerification] = useState(false)
  const [pendingTeacherData, setPendingTeacherData] = useState<RegisterFormData | null>(null)

  // Estados del formulario de login
  const [loginData, setLoginData] = useState<LoginFormData>({
    email: "",
    password: "",
    role: "student",
  })

  // Estados del formulario de registro
  const [registerData, setRegisterData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    role: "student",
    career: "",
    semester: "",
  })

  const [confirmPassword, setConfirmPassword] = useState("")

  const { login, register, sendVerificationCode } = useAuth()

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role)
    setLoginData((prev) => ({ ...prev, role }))
    setRegisterData((prev) => ({ ...prev, role }))
    setError(null)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      await login(loginData)
      setSuccess("¡Inicio de sesión exitoso!")
      setTimeout(() => {
       window.location.reload()
      }, 1000)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al iniciar sesión")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Validaciones básicas
      if (registerData.password !== confirmPassword) {
        throw new Error("Las contraseñas no coinciden")
      }

      if (registerData.role === "student" && (!registerData.career || !registerData.semester)) {
        throw new Error("Los estudiantes deben seleccionar carrera y semestre")
      }

      // Si es profesor, enviar código de verificación primero
      if (registerData.role === "teacher") {
        setPendingTeacherData(registerData)
        await sendVerificationCode(registerData.email, registerData.name)
        setShowEmailVerification(true)
        setSuccess("Código de verificación enviado a tu correo institucional")
        return
      }

      // Si es estudiante, registrar directamente
      await register(registerData)
      setSuccess("¡Registro exitoso! Bienvenido a AISAC")
      setTimeout(() => {
       window.location.reload()
      }, 1500)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al registrarse")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEmailVerified = async () => {
    if (!pendingTeacherData) return

    setIsSubmitting(true)
    try {
      await register({ ...pendingTeacherData, isVerified: true })
      setSuccess("¡Registro exitoso! Bienvenido al equipo de profesores AISAC")
      setShowEmailVerification(false)
      setPendingTeacherData(null)
      setTimeout(() => {
       window.location.reload()
      }, 1500)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al completar el registro")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBackFromVerification = () => {
    setShowEmailVerification(false)
    setPendingTeacherData(null)
    setError(null)
    setSuccess(null)
  }

  if (showEmailVerification && pendingTeacherData) {
    return (
      <EmailVerificationForm
        email={pendingTeacherData.email}
        name={pendingTeacherData.name}
        onVerified={handleEmailVerified}
        onBack={handleBackFromVerification}
      />
    )
  }

  if (activeTab === "forgot") {
    return <ForgotPasswordForm onBack={() => setActiveTab("login")} />
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">AISAC</CardTitle>
        <CardDescription>Servicio de Inteligencia Artificial para Consultas Académicas</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
            <TabsTrigger value="register">Registrarse</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <RoleSelector selectedRole={selectedRole} onRoleSelect={handleRoleChange} />

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder={selectedRole === "teacher" ? "profesor@unerg.edu.ve" : "estudiante@gmail.com"}
                    value={loginData.email}
                    onChange={(e) => setLoginData((prev) => ({ ...prev, email: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Tu contraseña"
                    value={loginData.password}
                    onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50 text-green-800">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>

              <div className="text-center">
                <Button type="button" variant="link" className="text-sm" onClick={() => setActiveTab("forgot")}>
                  ¿Olvidaste tu contraseña?
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <RoleSelector selectedRole={selectedRole} onRoleSelect={handleRoleChange} />

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-name">Nombre Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="Tu nombre completo"
                    value={registerData.name}
                    onChange={(e) => setRegisterData((prev) => ({ ...prev, name: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-email"
                    type="email"
                    placeholder={selectedRole === "teacher" ? "profesor@unerg.edu.ve" : "estudiante@gmail.com"}
                    value={registerData.email}
                    onChange={(e) => setRegisterData((prev) => ({ ...prev, email: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {selectedRole === "teacher"
                    ? "Usa tu correo institucional de UNERG"
                    : "Usa tu cuenta personal de Gmail"}
                </p>
              </div>

              {selectedRole === "student" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="career">Carrera</Label>
                    <Select
                      value={registerData.career}
                      onValueChange={(value) => setRegisterData((prev) => ({ ...prev, career: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu carrera" />
                      </SelectTrigger>
                      <SelectContent>
                        {CAREERS.map((career) => (
                          <SelectItem key={career} value={career}>
                            {career}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="semester">Semestre/Año</Label>
                    <Select
                      value={registerData.semester}
                      onValueChange={(value) => setRegisterData((prev) => ({ ...prev, semester: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu semestre" />
                      </SelectTrigger>
                      <SelectContent>
                        {SEMESTERS.map((semester) => (
                          <SelectItem key={semester} value={semester}>
                            {semester}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              
              {selectedRole === "teacher" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="career">Carrera</Label>
                    <Select
                      value={registerData.career}
                      onValueChange={(value) => setRegisterData((prev) => ({ ...prev, career: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona la carrera" />
                      </SelectTrigger>
                      <SelectContent>
                        {CAREERS.map((career) => (
                          <SelectItem key={career} value={career}>
                            {career}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>                  
              )}

              <div className="space-y-2">
                <Label htmlFor="register-password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Crea una contraseña segura"
                    value={registerData.password}
                    onChange={(e) => setRegisterData((prev) => ({ ...prev, password: e.target.value }))}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirma tu contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50 text-green-800">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Registrando..." : "Registrarse"}
              </Button>

              {selectedRole === "teacher" && (
                <div className="text-center text-sm text-muted-foreground">
                  <p>Al registrarte como profesor, recibirás un código de verificación en tu correo institucional</p>
                </div>
              )}
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
