import { type NextRequest, NextResponse } from "next/server"
import { Client } from "basic-ftp"
import { Writable } from "stream"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  const client = new Client()
  try {
    const { teacherName, fileName } = await request.json()

    console.log("=== DESCARGANDO ARCHIVO ===")
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

    await client.access(ftpConfig)
    console.log("Conectado al servidor FTP para descargar archivo")

    const teacherDir = `/uploads/${teacherName.replace(/\s+/g, "_")}`
    const filePath = `${teacherDir}/${fileName}`

    // Descargar el archivo a un buffer usando un Writable personalizado
    const chunks: Buffer[] = []
    const writable = new Writable({
      write(chunk, _encoding, callback) {
        chunks.push(Buffer.from(chunk))
        callback()
      }
    })

    await client.downloadTo(writable, filePath)
    client.close()

    const fileBuffer = Buffer.concat(chunks)
    console.log("Archivo descargado:", filePath)

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    })
  } catch (error) {
    console.error("Error general descargando archivo:", error)
    client.close()
    return NextResponse.json(
      {
        success: false,
        error: "Error al descargar archivo: " + (error instanceof Error ? error.message : "Error desconocido"),
      },
      { status: 500 },
    )
  }
}