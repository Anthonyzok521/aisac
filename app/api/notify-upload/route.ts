import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { teacherEmail, teacherName, uploadedFiles } = await request.json()

    // Crear lista de archivos subidos
    const filesList = uploadedFiles
      .filter((file: any) => !file.error)
      .map(
        (file: any) => `
        <li>
          <strong>${file.originalName}</strong><br>
          <small>Tamaño: ${(file.size / 1024 / 1024).toFixed(2)} MB</small><br>
          ${file.description ? `<small>Descripción: ${file.description}</small><br>` : ""}
          <small>Archivo en servidor: ${file.uploadedName}</small>
        </li>
      `,
      )
      .join("")

    const failedFiles = uploadedFiles
      .filter((file: any) => file.error)
      .map((file: any) => `<li><strong>${file.originalName}</strong>: ${file.error}</li>`)
      .join("")

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">📁 Nuevos Documentos Subidos - AISAC</h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1e40af;">Información del Profesor</h3>
          <p><strong>Nombre:</strong> ${teacherName}</p>
          <p><strong>Email:</strong> ${teacherEmail}</p>
          <p><strong>Fecha:</strong> ${new Date().toLocaleString("es-ES")}</p>
        </div>

        ${
          filesList
            ? `
        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #16a34a;">✅ Archivos Subidos Exitosamente</h3>
          <ul style="padding-left: 20px;">
            ${filesList}
          </ul>
        </div>
        `
            : ""
        }

        ${
          failedFiles
            ? `
        <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #dc2626;">❌ Archivos con Errores</h3>
          <ul style="padding-left: 20px;">
            ${failedFiles}
          </ul>
        </div>
        `
            : ""
        }

        <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px; color: #64748b;">
            Este es un mensaje automático del sistema AISAC. Los archivos han sido almacenados en el servidor FTP para el entrenamiento de la IA.
          </p>
        </div>
      </div>
    `

    // Preparar el contenido del correo
    const emailData = {
      to: `contact@acteam.dev`,
      from: "aisac@acteam.dev",
      subject: "Un profesor ha subido archivos - AISAC",
      text: `Archivos subidos por ${teacherName} (${teacherEmail}) el ${new Date().toLocaleString("es-ES")}.`,
      html: htmlContent,
    }

   try {
      console.log("Enviando correo a través de la API externa...")

      const emailResponse = await fetch("https://smtp-api-gilt.vercel.app/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      })

      if (!emailResponse.ok) {
        const errorText = await emailResponse.text()
        console.error("Error en la API de correo:", errorText)
        throw new Error(`Error en la API de correo: ${emailResponse.status} - ${errorText}`)
      }

      const emailResult = await emailResponse.json()
      console.log("Correo enviado exitosamente:", emailResult)

      return NextResponse.json({
        success: true,
        message: "Correo de notificación enviado exitosamente",
        emailResult: emailResult,
      })
    } catch (emailError) {
      console.error("Error enviando correo:", emailError)

      // En caso de error, permitir que el registro continúe pero notificar el problema
      return NextResponse.json({
        success: false,
        warning: true,
        message: "Usuario notificado exitosamente, pero no se pudo enviar el correo",
        error: "Error en el servicio de correo",
        details: emailError instanceof Error ? emailError.message : "Error desconocido",
      })
    }
  } catch (error) {
    console.error("Error general en el endpoint de correo:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}

// Usar Node.js runtime
export const runtime = "nodejs"