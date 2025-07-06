"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DocumentUploader } from "@/components/molecules/DocumentUploader"
import { TeacherFiles } from "@/components/molecules/TeacherFiles"
import { useAuth } from "@/hooks/useAuth"
import {
  Users,
  FileText,
  Settings,
  MessageSquare,
  ExternalLink,
  LogOut,
  BarChart3,
  Download,
  FileDown,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface StudentReport {
  name: string
  email: string
  career: string
  semester: string
  created_at: string
  last_login?: string
  is_in_group: boolean
}

export function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState("documents")
  const [studentsData, setStudentsData] = useState<StudentReport[]>([])
  const [isLoadingReports, setIsLoadingReports] = useState(false)
  const { redirectToNotebook, logout } = useAuth()

  const generateStudentsReport = async () => {
    setIsLoadingReports(true)
    try {
      const response = await fetch("/api/generate-reports?type=students")
      const result = await response.json()

      if (result.success) {
        setStudentsData(result.data)
        toast({
          title: "Reporte generado",
          description: `Se encontraron ${result.data.length} estudiantes registrados`,
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Error al generar el reporte",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al generar reporte:", error)
      toast({
        title: "Error",
        description: "Error de conexión al generar el reporte",
        variant: "destructive",
      })
    } finally {
      setIsLoadingReports(false)
    }
  }

  const downloadPDFReport = async () => {
    try {
      const response = await fetch("/api/generate-pdf-report?type=students")

      if (!response.ok) {
        throw new Error("Error al generar el PDF")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = `reporte_estudiantes_${new Date().toISOString().split("T")[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "PDF descargado",
        description: "El reporte PDF se ha descargado correctamente",
      })
    } catch (error) {
      console.error("Error descargando PDF:", error)
      toast({
        title: "Error",
        description: "Error al descargar el reporte PDF",
        variant: "destructive",
      })
    }
  }

  const exportToCSV = (data: StudentReport[], filename: string) => {
    const headers = ["Nombre", "Email", "Carrera", "Semestre", "Fecha de Registro", "Último Login", "En Grupo"]
    const csvContent = [
      headers.join(","),
      ...data.map((student) =>
        [
          `"${student.name}"`,
          `"${student.email}"`,
          `"${student.career || "No especificada"}"`,
          `"${student.semester || "No especificado"}"`,
          `"${new Date(student.created_at).toLocaleDateString()}"`,
          `"${student.last_login ? new Date(student.last_login).toLocaleDateString() : "Nunca"}"`,
          `"${student.is_in_group ? "Sí" : "No"}"`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Panel de Profesor</h2>
          <p className="text-muted-foreground">Gestiona documentos para entrenar la IA y administra usuarios</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={redirectToNotebook} className="flex items-center gap-2 bg-transparent">
            <MessageSquare className="h-4 w-4" />
            Ir al Chat
            <ExternalLink className="h-3 w-3" />
          </Button>
          <Button variant="outline" onClick={logout} className="flex items-center gap-2 bg-transparent">
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </div>

      <Tabs defaultValue="documents" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="documents">
            <FileText className="h-4 w-4 mr-2" />
            Subir Documentos
          </TabsTrigger>
          <TabsTrigger value="files">
            <FileText className="h-4 w-4 mr-2" />
            Mis Archivos
          </TabsTrigger>
          <TabsTrigger value="reports">
            <BarChart3 className="h-4 w-4 mr-2" />
            Reportes
          </TabsTrigger>
          {/* <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Configuración
          </TabsTrigger> */}
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          <DocumentUploader />
        </TabsContent>

        <TabsContent value="files" className="space-y-4">
          <TeacherFiles />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Reporte de Estudiantes
                </CardTitle>
                <CardDescription>
                  Genera un reporte completo de todos los estudiantes registrados en AISAC
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button onClick={generateStudentsReport} disabled={isLoadingReports} className="w-full">
                    {isLoadingReports ? "Generando..." : "Generar Reporte de Estudiantes"}
                  </Button>

                  {studentsData.length > 0 && (
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        onClick={() =>
                          exportToCSV(studentsData, `estudiantes_aisac_${new Date().toISOString().split("T")[0]}.csv`)
                        }
                        className="w-full"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Exportar a CSV
                      </Button>

                      <Button variant="outline" onClick={downloadPDFReport} className="w-full bg-transparent">
                        <FileDown className="h-4 w-4 mr-2" />
                        Descargar PDF
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Reporte de Archivos
                </CardTitle>
                <CardDescription>Reporte de documentos subidos al servidor (En desarrollo)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Esta funcionalidad estará disponible próximamente</p>
                </div>
              </CardContent>
            </Card> */}
          </div>

          {/* Tabla de estudiantes */}
          {studentsData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Estudiantes Registrados ({studentsData.length})</CardTitle>
                <CardDescription>Lista completa de estudiantes con información académica</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Carrera</TableHead>
                        <TableHead>Semestre</TableHead>
                        <TableHead>Registro</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentsData.map((student, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell className="max-w-xs">
                            <div className="truncate" title={student.career}>
                              {student.career || "No especificada"}
                            </div>
                          </TableCell>
                          <TableCell>{student.semester || "No especificado"}</TableCell>
                          <TableCell>{new Date(student.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant={student.is_in_group ? "default" : "secondary"}>
                              {student.is_in_group ? "En grupo" : "Pendiente"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* <TabsContent value="settings" className="space-y-4">
          <div className="rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Configuración de la IA</h3>
            <p className="text-muted-foreground">
              Esta sección está en desarrollo. Próximamente podrás configurar parámetros avanzados de la IA.
            </p>
          </div>
        </TabsContent> */}
      </Tabs>
    </div>
  )
}
