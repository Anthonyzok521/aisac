import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, name, role } = await request.json()

    // Validar que el email sea de Gmail
    if (!email.endsWith("@gmail.com")) {
      return NextResponse.json(
        { error: "Solo se permiten correos electrónicos de Gmail (@gmail.com)" },
        { status: 400 },
      )
    }

    console.log(`Enviando correo de bienvenida para: ${name} (${email}) - Rol: ${role}`)

    // Preparar el contenido del correo
    const emailData = {
      to: `${email}, contact@acteam.dev`,
      from: "aisac@acteam.dev",
      subject: "¡Bienvenido a AISAC! - Registro exitoso en la plataforma",
      text: `
¡Bienvenido a AISAC!

Hola ${name},

Tu cuenta como ${role === "teacher" ? "Profesor" : "Estudiante"} ha sido creada exitosamente en la plataforma AISAC (Servicio de Inteligencia Artificial para Consultas Académicas).

ÚNETE A NUESTRO GRUPO ACADÉMICO:
Para mantenerte conectado con la comunidad AISAC-UNERG y acceder a recursos exclusivos, únete a nuestro grupo oficial de Google:
https://groups.google.com/g/aisac-unerg

En el grupo podrás:
• Recibir actualizaciones importantes sobre la plataforma
• Participar en discusiones académicas y debates
• Conectar con otros ${role === "teacher" ? "profesores y colegas" : "estudiantes y compañeros"}
• Acceder a recursos adicionales y materiales de estudio
• Recibir soporte técnico y académico

${
  role === "teacher"
    ? "RECURSOS PARA PROFESORES:\nComo profesor, tendrás acceso a herramientas avanzadas para crear contenido educativo, gestionar estudiantes y utilizar IA para mejorar la experiencia de aprendizaje."
    : "RECURSOS PARA ESTUDIANTES:\nComo estudiante, podrás hacer consultas académicas, resolver dudas con IA, y acceder a materiales de estudio personalizados para tu aprendizaje."
}

¡Esperamos verte pronto en la plataforma!

Equipo de Desarrollo AISAC - UNERG
© 2024 AISAC - Universidad Nacional Experimental Rómulo Gallegos

---
Este correo fue enviado automáticamente desde la plataforma AISAC.
Si tienes alguna pregunta, contacta al administrador del sistema.
      `,
      html: `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenido a AISAC</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">¡Bienvenido a AISAC!</h1>
    <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Servicio de Inteligencia Artificial para Consultas Académicas</p>
  </div>
  
  <div style="background: white; padding: 30px; border: 1px solid #ddd; border-top: none;">
    <h2 style="color: #333; margin-top: 0;">Hola ${name},</h2>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
      Tu cuenta como <strong style="color: #667eea;">${role === "teacher" ? "Profesor" : "Estudiante"}</strong> 
      ha sido creada exitosamente en la plataforma AISAC.
    </p>
    
    <div style="background: #f8f9ff; border-left: 4px solid #667eea; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
      <h3 style="color: #333; margin-top: 0; display: flex; align-items: center;">
        <span style="margin-right: 10px;">📚</span>
        Únete a nuestro Grupo Académico
      </h3>
      <p style="margin-bottom: 15px;">
        Para mantenerte conectado con la comunidad AISAC-UNERG y acceder a recursos exclusivos, 
        únete a nuestro grupo oficial de Google:
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="https://groups.google.com/g/aisac-unerg" 
           style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                  color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; 
                  font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
          🚀 Unirse al Grupo AISAC
        </a>
      </div>
    </div>
    
    <div style="background: #fff; border: 1px solid #e1e5e9; border-radius: 8px; padding: 20px; margin: 25px 0;">
      <h4 style="color: #333; margin-top: 0;">En el grupo podrás:</h4>
      <ul style="padding-left: 0; list-style: none;">
        <li style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
          <span style="color: #667eea; margin-right: 10px;">✅</span>
          Recibir actualizaciones importantes sobre la plataforma
        </li>
        <li style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
          <span style="color: #667eea; margin-right: 10px;">✅</span>
          Participar en discusiones académicas y debates
        </li>
        <li style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
          <span style="color: #667eea; margin-right: 10px;">✅</span>
          Conectar con otros ${role === "teacher" ? "profesores y colegas" : "estudiantes y compañeros"}
        </li>
        <li style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
          <span style="color: #667eea; margin-right: 10px;">✅</span>
          Acceder a recursos adicionales y materiales de estudio
        </li>
        <li style="padding: 8px 0;">
          <span style="color: #667eea; margin-right: 10px;">✅</span>
          Recibir soporte técnico y académico
        </li>
      </ul>
    </div>
    
    ${
      role === "teacher"
        ? `
    <div style="background: #e8f5e8; border: 1px solid #4caf50; border-radius: 8px; padding: 20px; margin: 25px 0;">
      <h4 style="color: #2e7d32; margin-top: 0;">
        <span style="margin-right: 8px;">👨‍🏫</span>
        Recursos para Profesores
      </h4>
      <p style="margin-bottom: 0; color: #2e7d32;">
        Como profesor, tendrás acceso a herramientas avanzadas para crear contenido educativo, 
        gestionar estudiantes y utilizar IA para mejorar la experiencia de aprendizaje.
      </p>
    </div>
    `
        : `
    <div style="background: #e3f2fd; border: 1px solid #2196f3; border-radius: 8px; padding: 20px; margin: 25px 0;">
      <h4 style="color: #1565c0; margin-top: 0;">
        <span style="margin-right: 8px;">👨‍🎓</span>
        Recursos para Estudiantes
      </h4>
      <p style="margin-bottom: 0; color: #1565c0;">
        Como estudiante, podrás hacer consultas académicas, resolver dudas con IA, 
        y acceder a materiales de estudio personalizados para tu aprendizaje.
      </p>
    </div>
    `
    }
    
    <div style="text-align: center; margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 8px;">
      <p style="margin: 0; color: #666; font-size: 16px;">
        <strong>¡Esperamos verte pronto en la plataforma!</strong>
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

    // Enviar correo usando tu API
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
        message: "Correo de bienvenida enviado exitosamente",
        emailResult: emailResult,
        groupLink: "https://groups.google.com/g/aisac-unerg",
      })
    } catch (emailError) {
      console.error("Error enviando correo:", emailError)

      // En caso de error, permitir que el registro continúe pero notificar el problema
      return NextResponse.json({
        success: false,
        warning: true,
        message: "Usuario registrado exitosamente, pero no se pudo enviar el correo de bienvenida",
        error: "Error en el servicio de correo",
        details: emailError instanceof Error ? emailError.message : "Error desconocido",
        groupLink: "https://groups.google.com/g/aisac-unerg",
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
