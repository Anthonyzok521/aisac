import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ success: false, error: "Email requerido" }, { status: 400 })
    }

    // Verificar si el usuario existe
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, name, email")
      .eq("email", email)
      .single()

    if (userError || !user) {
      // Por seguridad, no revelamos si el email existe o no
      return NextResponse.json({
        success: true,
        message: "Si el correo existe, recibirás un enlace de recuperación",
      })
    }

    // Generar token seguro
    const token = crypto.randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hora

    // Guardar token en la base de datos
    const { error: tokenError } = await supabase.from("password_reset_tokens").insert([
      {
        user_id: user.id,
        token,
        expires_at: expires.toISOString(),
        used: false,
      },
    ])

    if (tokenError) {
      console.error("Error guardando token:", tokenError)
      return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
    }

    // Crear enlace de recuperación
    const resetLink = `/reset-password?token=${token}`

    // Preparar el correo
    const emailData = {
      to: email,
      from: "aisac@acteam.dev",
      subject: "Recuperación de Contraseña - AISAC",
      text: `
Hola ${user.name},

Recibimos una solicitud para restablecer tu contraseña en AISAC.

Para crear una nueva contraseña, haz clic en el siguiente enlace:
${resetLink}

Este enlace expira en 1 hora.

Si no solicitaste este cambio, puedes ignorar este correo.

Equipo AISAC - UNERG
      `,
      html: `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recuperación de Contraseña</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Recuperación de Contraseña</h1>
    <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">AISAC - UNERG</p>
  </div>
  
  <div style="background: white; padding: 30px; border: 1px solid #ddd; border-top: none;">
    <h2 style="color: #333; margin-top: 0;">Hola ${user.name},</h2>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
      Recibimos una solicitud para restablecer tu contraseña en AISAC.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetLink}" 
         style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; 
                font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
        Restablecer Contraseña
      </a>
    </div>
    
    <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; color: #856404; font-size: 14px;">
        <strong>Importante:</strong> Este enlace expira en 1 hora. Si no solicitaste este cambio, 
        puedes ignorar este correo de forma segura.
      </p>
    </div>
    
    <p style="font-size: 14px; color: #666; margin-top: 20px;">
      Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
      <a href="${resetLink}" style="color: #667eea; word-break: break-all;">${resetLink}</a>
    </p>
  </div>
  
  <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #ddd; border-top: none;">
    <p style="margin: 0; color: #666; font-size: 12px;">
      © 2024 AISAC - Universidad Nacional Experimental Rómulo Gallegos
    </p>
  </div>
</body>
</html>
      `,
    }

    // Enviar correo
    try {
      const emailResponse = await fetch("https://smtp-api-gilt.vercel.app/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      })

      if (!emailResponse.ok) {
        throw new Error("Error enviando correo")
      }

      return NextResponse.json({
        success: true,
        message: "Enlace de recuperación enviado a tu correo",
      })
    } catch (emailError) {
      console.error("Error enviando correo:", emailError)
      return NextResponse.json({ success: false, error: "Error enviando correo" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error en forgot-password:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}

export const runtime = "nodejs"
