"use client"

import { useState, useCallback, useEffect } from "react"
import type { User, LoginFormData, RegisterFormData } from "@/types/auth"
import { supabase } from "@/lib/supabase"
import { hashPassword, verifyPassword, validatePassword } from "@/lib/auth-utils"

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
      // Validar que el email sea de Gmail
      if (!data.email.endsWith("@gmail.com")) {
        throw new Error("Solo se permiten correos electrónicos de Gmail (@gmail.com)")
      }

      // Buscar usuario en la base de datos
      const { data: userData, error: dbError } = await supabase
        .from("users")
        .select("*")
        .eq("email", data.email)
        .eq("role", data.role)
        .eq("is_active", true)
        .single()

      if (dbError || !userData) {
        throw new Error("Credenciales incorrectas o usuario no encontrado")
      }

      // Verificar contraseña
      const isPasswordValid = await verifyPassword(data.password, userData.password_hash)
      if (!isPasswordValid) {
        throw new Error("Contraseña incorrecta")
      }

      // Actualizar último login
      await supabase.from("users").update({ last_login: new Date().toISOString() }).eq("id", userData.id)

      // Crear objeto de usuario sin la contraseña para el frontend
      const { password_hash, ...userWithoutPassword } = userData
      const authenticatedUser = userWithoutPassword as User

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

  const register = useCallback(async (data: RegisterFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      // Validar que el email sea de Gmail
      if (!data.email.endsWith("@gmail.com")) {
        throw new Error("Solo se permiten correos electrónicos de Gmail (@gmail.com)")
      }

      // Validar contraseña
      const passwordValidation = validatePassword(data.password)
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors.join(". "))
      }

      // Verificar si el email ya existe
      const { data: existingUser } = await supabase.from("users").select("email").eq("email", data.email).single()

      if (existingUser) {
        throw new Error("El correo electrónico ya está registrado")
      }

      // Hash de la contraseña
      const passwordHash = await hashPassword(data.password)

      // Crear nuevo usuario en la base de datos
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert([
          {
            name: data.name,
            email: data.email,
            role: data.role,
            password_hash: passwordHash,
            is_in_group: true,
          },
        ])
        .select()
        .single()

      if (insertError) {
        throw new Error("Error al crear la cuenta: " + insertError.message)
      }

      // Enviar correo de bienvenida
      try {
        const emailResponse = await fetch("/api/send-welcome-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
            name: data.name,
            role: data.role,
          }),
        })

        if (!emailResponse.ok) {
          console.warn("No se pudo enviar el correo de bienvenida")
        } else {
          const emailResult = await emailResponse.json()
          console.log("Correo enviado:", emailResult)
        }
      } catch (emailError) {
        console.warn("Error enviando correo de bienvenida:", emailError)
        // No fallar el registro si el correo no se puede enviar
      }

      // Crear objeto de usuario sin la contraseña para el frontend
      const { password_hash, ...userWithoutPassword } = newUser
      const authenticatedUser = userWithoutPassword as User

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
  }, [])

  // Función para redirigir a NotebookLM
  const redirectToNotebook = useCallback(() => {
    window.open("https://notebooklm.google.com/notebook/f2467de4-2ced-46bf-a3b7-33b8c51e9ff7", "_blank")
  }, [])

  // Agregar función para verificar el estado del grupo
  const checkGroupStatus = useCallback(async () => {
    if (!user) return false

    try {
      const { data: userData, error } = await supabase.from("users").select("is_in_group").eq("id", user.id).single()

      if (error) {
        console.error("Error verificando estado del grupo:", error)
        return false
      }

      // Actualizar el usuario local si el estado cambió
      if (userData.is_in_group !== user.is_in_group) {
        const updatedUser = { ...user, is_in_group: userData.is_in_group }
        setUser(updatedUser)
        localStorage.setItem("aisac_user", JSON.stringify(updatedUser))
      }

      return userData.is_in_group
    } catch (error) {
      console.error("Error verificando estado del grupo:", error)
      return false
    }
  }, [user])

  // Agregar checkGroupStatus al return del hook
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
    checkGroupStatus, // Agregar esta función
  }
}
