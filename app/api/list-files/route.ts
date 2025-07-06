import { type NextRequest, NextResponse } from "next/server"
import { Client } from "basic-ftp"

export async function GET(request: NextRequest) {
  const client = new Client()

  try {
    const { searchParams } = new URL(request.url)
    const teacherName = searchParams.get("teacherName")

    console.log("=== LISTANDO ARCHIVOS ===")
    console.log("Profesor:", teacherName)

    if (!teacherName) {
      return NextResponse.json({ success: false, error: "Nombre del profesor requerido" }, { status: 400 })
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
    console.log("Conectado al servidor FTP para listar archivos")

    // Navegar al directorio del profesor
    const teacherDir = `/uploads/${teacherName.replace(/\s+/g, "_")}`

    try {
      await client.cd(teacherDir)
      console.log("Navegando a directorio:", teacherDir)
    } catch (cdError) {
      console.log("Directorio no existe:", teacherDir)
      client.close()
      return NextResponse.json({
        success: true,
        files: [],
        message: "No se encontraron archivos para este profesor",
      })
    }

    // Listar archivos
    const fileList = await client.list()
    console.log("Archivos encontrados:", fileList.length)

    // Filtrar solo archivos (no directorios) y excluir metadatos
    const files = fileList
      .filter((item) => item.type === 1 && !item.name.startsWith("metadata_")) // type 1 = archivo
      .map((file) => ({
        name: file.name,
        size: file.size,
        modifiedTime: file.modifiedAt,
        isDirectory: false,
      }))

    client.close()

    return NextResponse.json({
      success: true,
      files,
      totalFiles: files.length,
    })
  } catch (error) {
    console.error("Error listando archivos:", error)
    client.close()
    return NextResponse.json(
      {
        success: false,
        error: "Error al listar archivos: " + (error instanceof Error ? error.message : "Error desconocido"),
      },
      { status: 500 },
    )
  }
}

export const runtime = "nodejs"
