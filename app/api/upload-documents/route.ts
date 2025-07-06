import { type NextRequest, NextResponse } from "next/server"
import { Client } from "basic-ftp"
import { Readable } from "stream"

export async function POST(request: NextRequest) {
  const client = new Client()
  client.ftp.verbose = true

  try {
    console.log("=== INICIANDO SUBIDA DE DOCUMENTOS ===")

    const formData = await request.formData()
    const files = formData.getAll("files") as File[]
    const teacherName = formData.get("teacherName") as string

    console.log("Archivos recibidos:", files.length)
    console.log("Nombre del profesor:", teacherName)

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, error: "No se recibieron archivos" }, { status: 400 })
    }

    if (!teacherName) {
      return NextResponse.json({ success: false, error: "Nombre del profesor requerido" }, { status: 400 })
    }

    // Configurar conexión FTP con las variables de entorno correctas
    const ftpConfig = {
      host: process.env.FTP_HOST!,
      port: Number.parseInt(process.env.FTP_PORT || "21"),
      user: process.env.FTP_USER!,
      password: process.env.FTP_PASSWORD!,
    }

    console.log("Configuración FTP:", {
      host: ftpConfig.host,
      port: ftpConfig.port,
      user: ftpConfig.user,
      password: "***",
    })

    // Conectar al servidor FTP
    await client.access(ftpConfig)
    console.log("Conectado al servidor FTP")

    // Crear directorio para el profesor si no existe
    const teacherDir = `/uploads/${teacherName.replace(/\s+/g, "_")}`
    try {
      await client.ensureDir(teacherDir)
      console.log("Directorio creado/verificado:", teacherDir)
    } catch (dirError) {
      console.log("Error creando directorio:", dirError)
      // Intentar crear manualmente
      try {
        await client.cd("/")
        await client.ensureDir("uploads")
        await client.cd("uploads")
        await client.ensureDir(teacherName.replace(/\s+/g, "_"))
        console.log("Directorio creado manualmente")
      } catch (manualError) {
        console.error("Error creando directorio manualmente:", manualError)
      }
    }

    const uploadedFiles = []
    const errors = []

    // Subir cada archivo
    for (const file of files) {
      try {
        console.log(`Subiendo archivo: ${file.name}`)

        // Convertir File a Buffer
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Generar nombre único para evitar conflictos
        const timestamp = Date.now()
        const fileName = `${file.name}`
        const remotePath = `${teacherDir}/${fileName}`

        // Crear stream desde buffer
        const stream = Readable.from(buffer)

        // Subir archivo con timeout
        await Promise.race([
          client.uploadFrom(stream, remotePath),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout al subir archivo")), 60000)),
        ])

        stream.destroy() // Cerrar stream después de subir

        uploadedFiles.push({
          originalName: file.name,
          fileName: fileName,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString(),
        })

        console.log(`Archivo subido exitosamente: ${fileName}`)
      } catch (fileError) {
        console.error(`Error subiendo ${file.name}:`, fileError)
        errors.push({
          fileName: file.name,
          error: fileError instanceof Error ? fileError.message : "Error desconocido",
        })
      }
    }

    // Crear archivo de metadatos
    try {
      const metadata = {
        teacherName,
        uploadDate: new Date().toISOString(),
        files: uploadedFiles,
        totalFiles: uploadedFiles.length,
      }

      const metadataBuffer = Buffer.from(JSON.stringify(metadata, null, 2))
      const metadataPath = `${teacherDir}/metadata_${Date.now()}.json`
      const metadataStream = Readable.from(metadataBuffer)
      await client.uploadFrom(metadataStream, metadataPath)
      console.log("Archivo de metadatos creado:", metadataPath)
    } catch (metaError) {
      console.warn("Error creando metadatos:", metaError)
    }

    client.close()

    // Enviar notificación por email
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notify-upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teacherName,
          fileCount: uploadedFiles.length,
          files: uploadedFiles,
        }),
      })
      console.log("Notificación de email enviada")
    } catch (emailError) {
      console.warn("Error enviando notificación:", emailError)
    }

    return NextResponse.json({
      success: true,
      message: `${uploadedFiles.length} archivo(s) subido(s) exitosamente`,
      uploadedFiles,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error("Error general en upload:", error)
    client.close()
    return NextResponse.json(
      {
        success: false,
        error: "Error al subir archivos: " + (error instanceof Error ? error.message : "Error desconocido"),
      },
      { status: 500 },
    )
  }
}

export const runtime = "nodejs"
