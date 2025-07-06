import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import jsPDF from "jspdf"

// Crear cliente de Supabase con service role para acceso completo
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reportType = searchParams.get("type")

    console.log("=== GENERANDO REPORTE PDF ===")
    console.log("Tipo de reporte:", reportType)

    if (reportType !== "students") {
      return NextResponse.json({ success: false, error: "Tipo de reporte no válido" }, { status: 400 })
    }

    // Obtener datos de estudiantes
    const { data: students, error: studentsError } = await supabaseAdmin
      .from("users")
      .select("name, email, career, semester, created_at, last_login, is_in_group")
      .eq("role", "student")
      .order("created_at", { ascending: false })

    if (studentsError) {
      console.error("Error obteniendo estudiantes:", studentsError)
      return NextResponse.json({ success: false, error: "Error al obtener datos de estudiantes" }, { status: 500 })
    }

    console.log("Estudiantes encontrados:", students?.length || 0)

    // Crear PDF
    const doc = new jsPDF()

    // Configurar fuente
    doc.setFont("helvetica")

    // Título
    doc.setFontSize(20)
    doc.setTextColor(40, 40, 40)
    doc.text("REPORTE DE ESTUDIANTES AISAC", 20, 30)

    // Información del reporte
    doc.setFontSize(12)
    doc.setTextColor(100, 100, 100)
    doc.text(`Generado el: ${new Date().toLocaleDateString("es-ES")}`, 20, 45)
    doc.text(`Total de estudiantes: ${students?.length || 0}`, 20, 55)

    // Línea separadora
    doc.setDrawColor(200, 200, 200)
    doc.line(20, 65, 190, 65)

    let yPosition = 80

    if (!students || students.length === 0) {
      doc.setFontSize(14)
      doc.setTextColor(150, 150, 150)
      doc.text("No hay estudiantes registrados", 20, yPosition)
    } else {
      // Encabezados de tabla
      doc.setFontSize(10)
      doc.setTextColor(60, 60, 60)
      doc.setFont("helvetica", "bold")

      doc.text("NOMBRE", 20, yPosition)
      doc.text("CARRERA", 80, yPosition)
      doc.text("SEMESTRE", 130, yPosition)
      doc.text("GRUPO", 160, yPosition)

      yPosition += 10

      // Línea bajo encabezados
      doc.setDrawColor(150, 150, 150)
      doc.line(20, yPosition - 2, 190, yPosition - 2)

      // Datos de estudiantes
      doc.setFont("helvetica", "normal")
      doc.setFontSize(9)

      students.forEach((student, index) => {
        if (yPosition > 270) {
          // Nueva página si se acaba el espacio
          doc.addPage()
          yPosition = 30

          // Repetir encabezados en nueva página
          doc.setFont("helvetica", "bold")
          doc.setFontSize(10)
          doc.text("NOMBRE", 20, yPosition)
          doc.text("CARRERA", 80, yPosition)
          doc.text("SEMESTRE", 130, yPosition)
          doc.text("GRUPO", 160, yPosition)
          yPosition += 10
          doc.line(20, yPosition - 2, 190, yPosition - 2)
          doc.setFont("helvetica", "normal")
          doc.setFontSize(9)
        }

        // Alternar color de fondo para filas
        if (index % 2 === 0) {
          doc.setFillColor(248, 249, 250)
          doc.rect(20, yPosition - 8, 170, 12, "F")
        }

        doc.setTextColor(40, 40, 40)
        doc.text(student.name || "N/A", 20, yPosition)
        doc.text(student.career || "N/A", 80, yPosition)
        doc.text(student.semester || "N/A", 130, yPosition)
        doc.text(student.is_in_group ? "Sí" : "No", 160, yPosition)

        yPosition += 12
      })
    }

    // Pie de página
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text(`Página ${i} de ${pageCount}`, 20, 285)
      doc.text("AISAC - Sistema de Inteligencia Artificial para Consultas Académicas", 20, 292)
    }

    // Generar PDF como buffer
    const pdfBuffer = Buffer.from(doc.output("arraybuffer"))

    // Retornar PDF
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="reporte_estudiantes_${new Date().toISOString().split("T")[0]}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Error generando PDF:", error)
    return NextResponse.json({ success: false, error: "Error al generar el reporte PDF" }, { status: 500 })
  }
}

export const runtime = "nodejs"
