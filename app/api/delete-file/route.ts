import { type NextRequest, NextResponse } from "next/server"
import { Client } from "basic-ftp"

export async function DELETE(request: NextRequest) {
  const client = new Client()

  try {
    const { teacherName, fileName } = await request.json()

    console.log("=== ELIMINANDO ARCHIVO ===")
    console.log("Profesor:", teacherName)
    console.log("Archivo:", fileName)

    if (!teacherName || !fileName) {
      return NextResponse.json({ success: false, error: "Nombre del profesor y archivo requeridos" }, { status: 400 })
    }

    // Configurar conexión FTP
    const ftpConfig = {
      host: process.env.FTP_HOST!,
      port: Number.parseInt(process.env.FTP_PORT || "21"),
      user: process.env.FTP_USER!,
      password: process.env.FTP_PASSWORD!,
    }

    // Conectar al servidor FTP
    await client.access(ftpConfig)
    console.log("Conectado al servidor FTP para eliminar archivo")

    // Navegar al directorio del profesor
    const teacherDir = `/uploads/${teacherName.replace(/\s+/g, "_")}`
    const filePath = `${teacherDir}/${fileName}`

    try {
      await client.remove(filePath)
      console.log("Archivo eliminado:", filePath)
    } catch (deleteError) {
      console.error("Error eliminando archivo:", deleteError)
      client.close()
      return NextResponse.json({ success: false, error: "No se pudo eliminar el archivo" }, { status: 500 })
    }

    client.close()

    return NextResponse.json({
      success: true,
      message: "Archivo eliminado exitosamente",
    })
  } catch (error) {
    console.error("Error general eliminando archivo:", error)
    client.close()
    return NextResponse.json(
      {
        success: false,
        error: "Error al eliminar archivo: " + (error instanceof Error ? error.message : "Error desconocido"),
      },
      { status: 500 },
    )
  }
}

export const runtime = "nodejs"
