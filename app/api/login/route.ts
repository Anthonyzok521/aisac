import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import bcrypt from "bcryptjs"
import { hashPassword } from "@/lib/auth-utils"

// Crear cliente de Supabase con service role para acceso completo
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json()

    console.log("=== LOGIN ATTEMPT ===")
    console.log("Email:", email)
    console.log("Role:", role)

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

    // Buscar usuario en la base de datos
    const { data: userData, error: dbError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("role", role)
      .eq("is_active", true)
      .single()

    if (dbError || !userData) {
      console.log("Usuario no encontrado:", dbError)
      return NextResponse.json({ success: false, error: "Credenciales incorrectas" }, { status: 401 })
    }

    console.log("Usuario encontrado:", userData.name)
    // Verificar contraseña
    const isValidPassword = await hashPassword(password) == userData.password_hash;

    if (!isValidPassword) {
      console.log("Contraseña incorrecta")
      return NextResponse.json({ success: false, error: "Credenciales incorrectas" }, { status: 401 })
    }

    // Actualizar último login
    await supabaseAdmin.from("users").update({ last_login: new Date().toISOString() }).eq("id", userData.id)

    // Crear objeto de usuario sin la contraseña para el frontend
    const { password_hash, ...userWithoutPassword } = userData

    console.log("Login exitoso para:", userWithoutPassword.name)

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Error en login:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}

export const runtime = "nodejs"
