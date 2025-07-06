import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { hashPassword, validatePassword } from "@/lib/auth-utils"

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json()

    if (!token || !newPassword) {
      return NextResponse.json({ success: false, error: "Token y nueva contraseña requeridos" }, { status: 400 })
    }

    // Validar contraseña
    const passwordValidation = validatePassword(newPassword)
    if (!passwordValidation.isValid) {
      return NextResponse.json({ success: false, error: passwordValidation.errors.join(". ") }, { status: 400 })
    }

    // Verificar token
    const { data: tokenData, error: tokenError } = await supabase
      .from("password_reset_tokens")
      .select("*")
      .eq("token", token)
      .eq("used", false)
      .single()

    if (tokenError || !tokenData) {
      return NextResponse.json({ success: false, error: "Token inválido o expirado" }, { status: 400 })
    }

    // Verificar si el token ha expirado
    if (new Date() > new Date(tokenData.expires_at)) {
      return NextResponse.json({ success: false, error: "El token ha expirado" }, { status: 400 })
    }

    // Hash de la nueva contraseña
    const passwordHash = await hashPassword(newPassword)

    // Actualizar contraseña del usuario
    const { error: updateError } = await supabase
      .from("users")
      .update({ password_hash: passwordHash })
      .eq("id", tokenData.user_id)

    if (updateError) {
      console.error("Error actualizando contraseña:", updateError)
      return NextResponse.json({ success: false, error: "Error actualizando contraseña" }, { status: 500 })
    }

    // Marcar token como usado
    await supabase.from("password_reset_tokens").update({ used: true }).eq("id", tokenData.id)

    return NextResponse.json({
      success: true,
      message: "Contraseña actualizada correctamente",
    })
  } catch (error) {
    console.error("Error en reset-password:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}

export const runtime = "nodejs"
