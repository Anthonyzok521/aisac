import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()

    // Verificar que el código existe y no ha expirado
    const verificationCodes = global.verificationCodes || new Map()
    const storedData = verificationCodes.get(email)

    if (!storedData) {
      return NextResponse.json({ success: false, error: "Código no encontrado o expirado" }, { status: 400 })
    }

    if (Date.now() > storedData.expires) {
      verificationCodes.delete(email)
      return NextResponse.json({ success: false, error: "El código ha expirado" }, { status: 400 })
    }

    if (storedData.code !== code) {
      return NextResponse.json({ success: false, error: "Código incorrecto" }, { status: 400 })
    }

    // Código válido, eliminar de la memoria
    verificationCodes.delete(email)

    return NextResponse.json({
      success: true,
      message: "Código verificado correctamente",
      name: storedData.name,
    })
  } catch (error) {
    console.error("Error verificando código:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}

export const runtime = "nodejs"
