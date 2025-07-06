import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Crear cliente de Supabase con service role para acceso completo
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ success: false, error: "ID de usuario requerido" }, { status: 400 })
    }

    const { data: userData, error } = await supabaseAdmin.from("users").select("is_in_group").eq("id", userId).single()

    if (error) {
      console.error("Error verificando estado del grupo:", error)
      return NextResponse.json({ success: false, error: "Error al verificar estado" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      isInGroup: userData.is_in_group,
    })
  } catch (error) {
    console.error("Error en check-group-status:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}

export const runtime = "nodejs"
