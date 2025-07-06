"use client"

import { useState, useCallback, useEffect } from "react"
import type { User, LoginFormData, RegisterFormData, EmailVerificationData } from "@/types/auth"
import { validatePassword } from "@/lib/auth-utils"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem("aisac_user")
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser)
          setUser(parsedUser)
        }
      } catch (e) {
        console.error("Error parsing saved user:", e)
        localStorage.removeItem("aisac_user")
      } finally {
        setIsLoading(false)
        setIsInitialized(true)
      }
    }

    loadUser()
  }, [])

  const login = useCallback(async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      // Validar dominio de email según el rol
      if (data.role === "teacher" && !data.email.endsWith("@unerg.edu.ve")) {
        throw new Error("Los profesores deben usar correos institucionales (@unerg.edu.ve)")
      }

      if (data.role === "student" && !data.email.endsWith("@gmail.com")) {
        throw new Error("Los estudiantes deben usar correos de Gmail (@gmail.com)")
      }

      // Usar la API para hacer login (servidor)
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Error al iniciar sesión")
      }

      const authenticatedUser = result.user

      // Guardar en localStorage
      localStorage.setItem("aisac_user", JSON.stringify(authenticatedUser))
      setUser(authenticatedUser)

      return authenticatedUser
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
      } else {
        setError("Error desconocido durante el inicio de sesión")
      }
      throw e
    } finally {
      setIsLoading(false)
    }
  }, [])

  const sendVerificationCode = useCallback(async (email: string, name: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-verification-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Error al enviar código de verificación")
      }

      return result
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
      } else {
        setError("Error desconocido al enviar código")
      }
      throw e
    } finally {
      setIsLoading(false)
    }
  }, [])

  const verifyCode = useCallback(async (data: EmailVerificationData) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/verify-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Código de verificación incorrecto")
      }

      return result
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
      } else {
        setError("Error desconocido al verificar código")
      }
      throw e
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(async (data: RegisterFormData & { isVerified?: boolean }) => {
    setIsLoading(true)
    setError(null)

    try {
      // Validar dominio de email según el rol
      if (data.role === "teacher" && !data.email.endsWith("@unerg.edu.ve")) {
        throw new Error("Los profesores deben usar correos institucionales (@unerg.edu.ve)")
      }

      if (data.role === "student" && !data.email.endsWith("@gmail.com")) {
        throw new Error("Los estudiantes deben usar correos de Gmail (@gmail.com)")
      }

      // Validar contraseña
      const passwordValidation = validatePassword(data.password)
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors.join(". "))
      }

      // Usar la API para crear el usuario
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Error al crear la cuenta")
      }

      const authenticatedUser = result.user

      // Guardar en localStorage
      localStorage.setItem("aisac_user", JSON.stringify(authenticatedUser))
      setUser(authenticatedUser)

      return authenticatedUser
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
      } else {
        setError("Error desconocido durante el registro")
      }
      throw e
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("aisac_user")
    setUser(null)
    setError(null)
    window.location.href = "/"
  }, [])

  // Función para redirigir a NotebookLM
  const redirectToNotebook = useCallback(() => {
    window.open("https://notebooklm.google.com/notebook/f2467de4-2ced-46bf-a3b7-33b8c51e9ff7", "_blank")
  }, [])

  // Agregar función para verificar el estado del grupo
  const checkGroupStatus = useCallback(async () => {
    if (!user) return false

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/check-group-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      })

      const result = await response.json()

      if (result.success) {
        // Actualizar el usuario local si el estado cambió
        if (result.isInGroup !== user.is_in_group) {
          const updatedUser = { ...user, is_in_group: result.isInGroup }
          setUser(updatedUser)
          localStorage.setItem("aisac_user", JSON.stringify(updatedUser))
        }
        return result.isInGroup
      }

      return false
    } catch (error) {
      console.error("Error verificando estado del grupo:", error)
      return false
    }
  }, [user])

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    isInitialized,
    error,
    login,
    register,
    logout,
    redirectToNotebook,
    checkGroupStatus,
    sendVerificationCode,
    verifyCode,
  }
}
