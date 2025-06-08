import { NextResponse } from "next/server"

export async function GET() {
  console.log("=== TEST UPLOAD API ===")

  // Verificar variables de entorno
  const envVars = {
    FTP_HOST: process.env.FTP_HOST ? "✓ Configurado" : "✗ Faltante",
    FTP_USER: process.env.FTP_USER ? "✓ Configurado" : "✗ Faltante",
    FTP_PASSWORD: process.env.FTP_PASSWORD ? "✓ Configurado" : "✗ Faltante",
    FTP_PORT: process.env.FTP_PORT ? "✓ Configurado" : "✗ Faltante",
  }

  return NextResponse.json(
    {
      success: true,
      message: "API de prueba funcionando correctamente",
      environment: process.env.NODE_ENV,
      envVars,
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  )
}

export async function POST() {
  return NextResponse.json(
    {
      success: true,
      message: "POST endpoint funcionando",
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  )
}
