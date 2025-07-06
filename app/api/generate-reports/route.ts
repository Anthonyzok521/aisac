import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

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

    console.log("=== GENERANDO REPORTE ===")
    console.log("Tipo de reporte:", reportType)

    if (reportType === "students") {
      // Obtener datos de estudiantes usando el cliente admin
      const { data: students, error: studentsError } = await supabaseAdmin
        .from("users")
        .select("name, email, career, semester, created_at, last_login, is_in_group")
        .eq("role", "student")
        .order("created_at", { ascending: false })

      if (studentsError) {
        console.error("Error obteniendo estudiantes:", studentsError)
        return NextResponse.json(
          { success: false, error: "Error al obtener datos de estudiantes: " + studentsError.message },
          { status: 500 },
        )
      }

      console.log("Estudiantes encontrados:", students?.length || 0)

      return NextResponse.json({
        success: true,
        data: students || [],
        totalStudents: students?.length || 0,
      })
    } else {
      return NextResponse.json({ success: false, error: "Tipo de reporte no válido" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error generando reporte:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor: " + (error instanceof Error ? error.message : "Unknown") },
      { status: 500 },
    )
  }
}

export const runtime = "nodejs"
