"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useAuth } from "@/hooks/useAuth"
import { FileText, Trash2, RefreshCw, Download } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { set } from "react-hook-form"

interface FileInfo {
  name: string
  size: number
  modifiedTime?: string
  type: string
}

export function TeacherFiles() {
  const { user } = useAuth()
  const [files, setFiles] = useState<FileInfo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDownloading, setIsDownloading] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const loadFiles = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/list-files?teacherName=${encodeURIComponent(user.name)}`)
      const result = await response.json()

      if (result.success) {
        setFiles(result.files)
      } else {
        console.error("Error cargando archivos:", result.error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los archivos",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error cargando archivos:", error)
      toast({
        title: "Error",
        description: "Error de conexión al cargar archivos",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const deleteFile = async (teacherName: string, fileName: string) => {
    setIsDeleting(fileName)    

    try {
      const response = await fetch("/api/delete-file", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teacherName, fileName }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Archivo eliminado",
          description: `El archivo ${fileName} ha sido eliminado correctamente`,
        })
        // Recargar la lista de archivos
        loadFiles()
      } else {
        toast({
          title: "Error",
          description: result.error || "No se pudo eliminar el archivo",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error eliminando archivo:", error)
      toast({
        title: "Error",
        description: "Error de conexión al eliminar archivo",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)      
    }
  }

  const downloadFile = async (teacherName: string, fileName: string) => {
    try {      
      setIsDownloading(fileName)
      const response = await fetch("/api/download-file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teacherName, fileName }),
      })

      if (!response.ok) {
        toast({
          title: "Error",
          description: "No se pudo descargar el archivo",
          variant: "destructive",
        })
        return
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)

      // Notificación de éxito
      toast({
        title: "Descarga iniciada",
        description: `El archivo ${fileName} se está descargando.`,
        variant: "default"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Error de conexión al descargar archivo",
        variant: "destructive",
      })
    } finally {      
      setIsDownloading(null)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileTypeColor = (type: string) => {
    console.log("File type:", type)
    switch (type.toLowerCase()) {
      case "pdf":
        return "bg-red-100 text-red-800"
      case "doc":
      case "docx":
        return "bg-blue-100 text-blue-800"
      case "txt":
        return "bg-gray-100 text-gray-800"
      case "jpg":
      case "jpeg":
      case "png":
        return "bg-green-100 text-green-800"
      default:
        return "bg-purple-100 text-purple-800"
    }
  }

  useEffect(() => {
    loadFiles()
  }, [user])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Mis Archivos Subidos
            </CardTitle>
            <CardDescription>Archivos que has subido al servidor para entrenar la IA</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={loadFiles} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Cargando archivos...</p>
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Sin archivos subidos</h3>
            <p className="text-muted-foreground">
              No has subido ningún archivo aún. Usa la pestaña "Documentos" para subir archivos.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Total: {files.length} archivo{files.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre del Archivo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Tamaño</TableHead>
                    <TableHead>Fecha de Modificación</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {files.map((file, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate max-w-xs" title={file.name}>
                            {file.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getFileTypeColor(file.name.split('.').pop() || "")}>
                          {file.name.split('.').pop()?.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatFileSize(file.size)}</TableCell>
                      <TableCell>
                        {file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString("es-ES") : "No disponible"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadFile(user!.name, file.name)}
                            disabled={isDeleting === file.name}
                          >
                            {isDownloading === file.name ? (
                                  <RefreshCw className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Download className="h-4 w-4" />
                                )}                            
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" disabled={isDeleting === file.name}>
                                {isDeleting === file.name ? (
                                  <RefreshCw className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Eliminar archivo?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. El archivo "{file.name}" será eliminado
                                  permanentemente del servidor.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteFile(user!.name, file.name)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
