import { type NextRequest, NextResponse } from "next/server"
import { verifyPassword } from "@/lib/auth-utils"

export async function POST(request: NextRequest) {
  try {
    const { password, hash } = await request.json()

    if (!password || !hash) {
      return NextResponse.json({ valid: false, error: "Faltan parámetros" }, { status: 400 })
    }

    const isValid = await verifyPassword(password, hash)

    return NextResponse.json({ valid: isValid })
  } catch (error) {
    console.error("Error verificando contraseña:", error)
    return NextResponse.json({ valid: false, error: "Error interno del servidor" }, { status: 500 })
  }
}
