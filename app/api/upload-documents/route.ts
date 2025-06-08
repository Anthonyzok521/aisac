import { type NextRequest, NextResponse } from "next/server"
import { Client } from "basic-ftp"
import { Readable } from "stream"

export async function POST(request: NextRequest) {
  console.log("=== INICIO UPLOAD API ===")
  let client: Client | null = null

  try {
    // Verificar variables de entorno
    const requiredEnvVars = ["FTP_HOST", "FTP_USER", "FTP_PASSWORD", "FTP_PORT"]
    const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])

    if (missingVars.length > 0) {
      console.error("Variables de entorno faltantes:", missingVars)
      return NextResponse.json(
        {
          success: false,
          error: `Configuración FTP incompleta: faltan ${missingVars.join(", ")}`,
        },
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }

    console.log("Variables de entorno verificadas")

    let formData: FormData
    try {
      formData = await request.formData()
      console.log("FormData parseado correctamente")
    } catch (formError) {
      console.error("Error parseando FormData:", formError)
      return NextResponse.json(
        {
          success: false,
          error: "Error procesando los archivos enviados",
        },
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }

    const files = formData.getAll("files") as File[]
    const descriptionsString = formData.get("descriptions") as string

    let descriptions = {}
    try {
      descriptions = JSON.parse(descriptionsString || "{}")
    } catch (parseError) {
      console.error("Error parsing descriptions:", parseError)
      descriptions = {}
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No se encontraron archivos para subir",
        },
        { status: 400 },
      )
    }

    console.log(`Iniciando subida de ${files.length} archivos`)

    // Configuración del cliente FTP
    client = new Client()
    client.ftp.verbose = false // Reducir logs para evitar problemas

    // Configurar timeout
    client.ftp.timeout = 30000 // 30 segundos

    try {
      // Conectar al servidor FTP
      console.log("Conectando al servidor FTP...")
      await client.access({
        host: process.env.FTP_HOST,
        user: process.env.FTP_USER,
        password: process.env.FTP_PASSWORD,
        port: Number.parseInt(process.env.FTP_PORT || "21"),
        secure: false,
      })

      console.log("Conectado al servidor FTP exitosamente")

      // Crear directorio para documentos de entrenamiento si no existe
      const remoteDir = "/aisac-training-docs"
      try {
        await client.ensureDir(remoteDir)
        console.log(`Directorio ${remoteDir} verificado/creado`)
      } catch (dirError) {
        console.log("Advertencia al crear directorio:", dirError)
        // Continuar aunque falle la creación del directorio
      }

      const uploadResults = []

      // Subir cada archivo
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        console.log(`Procesando archivo ${i + 1}/${files.length}: ${file.name}`)

        try {
          // Validar archivo
          if (file.size > 10 * 1024 * 1024) {
            uploadResults.push({
              originalName: file.name,
              error: "Archivo muy grande (máximo 10MB)",
              uploadedAt: new Date().toISOString(),
            })
            continue
          }

          // Generar nombre único para el archivo
          const timestamp = new Date().toISOString().replace(/[:.]/g, "-").split("T")[0] + "_" + Date.now()
          const fileExtension = file.name.split(".").pop() || ""
          const baseName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_")
          const fileName = `${timestamp}_${baseName}.${fileExtension}`
          const remotePath = `${remoteDir}/${fileName}`

          // Convertir File a Buffer
          const arrayBuffer = await file.arrayBuffer()
          const buffer = Buffer.from(arrayBuffer)

          // Crear stream desde buffer
          const stream = Readable.from(buffer)

          console.log(`Subiendo archivo: ${fileName}`)

          // Subir archivo con timeout
          await Promise.race([
            client.uploadFrom(stream, remotePath),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout al subir archivo")), 60000)),
          ])

          console.log(`Archivo subido exitosamente: ${fileName}`)

          // Crear archivo de metadatos si hay descripción
          const description = descriptions[file.name]
          if (description && description.trim()) {
            try {
              const metadataFileName = `${timestamp}_${baseName}.metadata.txt`
              const metadataPath = `${remoteDir}/${metadataFileName}`
              const metadataContent = `Archivo Original: ${file.name}
Archivo en Servidor: ${fileName}
Descripción: ${description}
Fecha de Subida: ${new Date().toISOString()}
Tamaño: ${file.size} bytes
Tipo MIME: ${file.type}
Sistema: AISAC Training Documents`

              const metadataStream = Readable.from(Buffer.from(metadataContent, "utf-8"))
              await client.uploadFrom(metadataStream, metadataPath)
              console.log(`Metadatos subidos: ${metadataFileName}`)
            } catch (metaError) {
              console.warn(`Error subiendo metadatos para ${file.name}:`, metaError)
              // No fallar por error en metadatos
            }
          }

          uploadResults.push({
            originalName: file.name,
            uploadedName: fileName,
            size: file.size,
            type: file.type,
            description: description || "",
            uploadedAt: new Date().toISOString(),
            remotePath: remotePath,
          })
        } catch (fileError) {
          console.error(`Error subiendo archivo ${file.name}:`, fileError)
          uploadResults.push({
            originalName: file.name,
            error: `Error al subir: ${fileError instanceof Error ? fileError.message : "Error desconocido"}`,
            uploadedAt: new Date().toISOString(),
          })
        }
      }

      // Cerrar conexión FTP
      client.close()
      client = null

      // Calcular resultados
      const successCount = uploadResults.filter((result) => !result.error).length
      const errorCount = uploadResults.filter((result) => result.error).length

      console.log(`Subida completada: ${successCount} exitosos, ${errorCount} errores`)

      return NextResponse.json(
        {
          success: successCount > 0,
          message:
            errorCount === 0
              ? `${successCount} archivos subidos correctamente`
              : `${successCount} de ${files.length} archivos subidos correctamente`,
          results: uploadResults,
          uploadedCount: successCount,
          totalCount: files.length,
          hasErrors: errorCount > 0,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    } catch (ftpError) {
      console.error("Error de conexión FTP:", ftpError)

      if (client) {
        try {
          client.close()
        } catch (closeError) {
          console.error("Error cerrando conexión FTP:", closeError)
        }
        client = null
      }

      return NextResponse.json(
        {
          success: false,
          error: "Error de conexión al servidor FTP",
          details: ftpError instanceof Error ? ftpError.message : "Error de conexión desconocido",
        },
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }
  } catch (error) {
    console.error("=== ERROR GENERAL EN UPLOAD API ===", error)

    // Asegurar que la conexión FTP se cierre
    if (client) {
      try {
        client.close()
      } catch (closeError) {
        console.error("Error cerrando conexión FTP en catch general:", closeError)
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : "Error desconocido",
        stack: process.env.NODE_ENV === "development" ? (error instanceof Error ? error.stack : undefined) : undefined,
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}

// Configuración para Next.js 13+
export const runtime = "nodejs"
export const maxDuration = 60 // 60 segundos máximo (límite de Vercel)
