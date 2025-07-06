import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    // Validar que el email sea de UNERG
    if (!email.endsWith("@unerg.edu.ve")) {
      return NextResponse.json(
        { success: false, error: "Solo se permiten correos institucionales (@unerg.edu.ve)" },
        { status: 400 },
      )
    }

    // Generar código de 6 dígitos
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

    // Guardar el código en memoria temporal (en producción usar Redis o base de datos)
    // Por ahora usaremos una variable global temporal
    global.verificationCodes = global.verificationCodes || new Map()
    global.verificationCodes.set(email, {
      code: verificationCode,
      expires: Date.now() + 10 * 60 * 1000, // 10 minutos
      name,
    })

    console.log(`Código de verificación para ${email}: ${verificationCode}`)

    // Preparar el contenido del correo
    const emailData = {
      to: email,
      from: "aisac@acteam.dev",
      subject: "Código de Verificación - AISAC UNERG",
      text: `
Hola ${name},

Tu código de verificación para AISAC es: ${verificationCode}

Este código expira en 10 minutos.

Si no solicitaste este código, puedes ignorar este mensaje.

Equipo AISAC - UNERG
      `,
      html: `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Código de Verificación AISAC</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Código de Verificación</h1>
    <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">AISAC - Universidad Nacional Experimental Rómulo Gallegos</p>
  </div>
  
  <div style="background: white; padding: 30px; border: 1px solid #ddd; border-top: none;">
    <h2 style="color: #333; margin-top: 0;">Hola ${name},</h2>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
      Para completar tu registro como profesor en AISAC, necesitamos verificar tu correo institucional.
    </p>
    
    <div style="background: #f8f9ff; border: 2px solid #667eea; padding: 30px; margin: 25px 0; border-radius: 10px; text-align: center;">
      <h3 style="color: #333; margin-top: 0; margin-bottom: 15px;">Tu código de verificación es:</h3>
      <div style="font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace;">
        ${verificationCode}
      </div>
      <p style="color: #666; margin-top: 15px; margin-bottom: 0; font-size: 14px;">
        Este código expira en <strong>10 minutos</strong>
      </p>
    </div>
    
    <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; color: #856404; font-size: 14px;">
        <strong>Importante:</strong> Si no solicitaste este código, puedes ignorar este mensaje. 
        Tu cuenta no será creada sin la verificación.
      </p>
    </div>
    
    <div style="text-align: center; margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 8px;">
      <p style="margin: 0; color: #666; font-size: 16px;">
        <strong>¡Bienvenido al equipo de profesores AISAC!</strong>
      </p>
      <p style="margin: 10px 0 0 0; color: #888; font-size: 14px;">
        Equipo de Desarrollo AISAC - UNERG
      </p>
    </div>
  </div>
  
  <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #ddd; border-top: none;">
    <p style="margin: 0; color: #666; font-size: 12px;">
      Este correo fue enviado automáticamente desde la plataforma AISAC.<br>
      Si tienes alguna pregunta, contacta al administrador del sistema.
    </p>
    <p style="margin: 10px 0 0 0; color: #888; font-size: 11px;">
      © 2024 AISAC - Universidad Nacional Experimental Rómulo Gallegos
    </p>
  </div>
</body>
</html>
      `,
    }

    // Enviar correo usando la API externa
    try {
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
        throw new Error(`Error en la API de correo: ${emailResponse.status}`)
      }

      const emailResult = await emailResponse.json()
      console.log("Código de verificación enviado:", emailResult)

      return NextResponse.json({
        success: true,
        message: "Código de verificación enviado a tu correo institucional",
      })
    } catch (emailError) {
      console.error("Error enviando código:", emailError)
      return NextResponse.json(
        {
          success: false,
          error: "Error al enviar el código de verificación",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error general:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}

export const runtime = "nodejs"
