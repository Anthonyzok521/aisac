import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { hashPassword, validatePassword } from "@/lib/auth-utils"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { name, email, password, role, career, semester, isVerified } = data

    // Validar dominio de email según el rol
    if (role === "teacher" && !email.endsWith("@unerg.edu.ve")) {
      return NextResponse.json(
        { success: false, error: "Los profesores deben usar correos institucionales (@unerg.edu.ve)" },
        { status: 400 },
      )
    }

    if (role === "student" && !email.endsWith("@gmail.com")) {
      return NextResponse.json(
        { success: false, error: "Los estudiantes deben usar correos de Gmail (@gmail.com)" },
        { status: 400 },
      )
    }

    // Para profesores, verificar que el email esté verificado
    if (role === "teacher" && !isVerified) {
      return NextResponse.json(
        { success: false, error: "Debes verificar tu correo institucional antes de registrarte" },
        { status: 400 },
      )
    }

    // Validar contraseña
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      return NextResponse.json({ success: false, error: passwordValidation.errors.join(". ") }, { status: 400 })
    }

    // Verificar si el email ya existe
    const { data: existingUser } = await supabase.from("users").select("email").eq("email", email).single()

    if (existingUser) {
      return NextResponse.json({ success: false, error: "El correo electrónico ya está registrado" }, { status: 400 })
    }

    // Hash de la contraseña
    const passwordHash = await hashPassword(password)

    // Crear nuevo usuario en la base de datos
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          name,
          email,
          role,
          password_hash: passwordHash,
          career: role === "student" ? career : null,
          semester: role === "student" ? semester : null,
          is_active: true,
          is_in_group: true,
        },
      ])
      .select()
      .single()

    if (insertError) {
      console.error("Error insertando usuario:", insertError)
      return NextResponse.json(
        { success: false, error: "Error al crear la cuenta: " + insertError.message },
        { status: 500 },
      )
    }

    // Enviar correo de bienvenida solo para estudiantes (los profesores ya recibieron el de verificación)
    if (role === "student") {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-welcome-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            name,
            role,
          }),
        })
      } catch (emailError) {
        console.warn("Error enviando correo de bienvenida:", emailError)
      }
    }

    // Crear objeto de usuario sin la contraseña para el frontend
    const { password_hash, ...userWithoutPassword } = newUser

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Error en registro:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}
