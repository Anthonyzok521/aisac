"use client"

import { Badge } from "@/components/ui/badge"
import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText, Upload, X, Check, AlertCircle, Loader2, Server, Cloud } from "lucide-react"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  description: string
  uploadedAt: Date
  remotePath?: string
  uploadedName?: string
}

interface UploadResult {
  originalName: string
  uploadedName?: string
  size?: number
  type?: string
  description?: string
  uploadedAt: string
  remotePath?: string
  error?: string
}

export function DocumentUploader() {
  const [files, setFiles] = useState<File[]>([])
  const [descriptions, setDescriptions] = useState<Record<string, string>>({})
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)

      // Validar tipos de archivo
      const allowedTypes = [".pdf", ".docx", ".txt", ".doc"]
      const invalidFiles = newFiles.filter((file) => {
        const extension = "." + file.name.split(".").pop()?.toLowerCase()
        return !allowedTypes.includes(extension)
      })

      if (invalidFiles.length > 0) {
        setErrorMessage(
          `Archivos no válidos: ${invalidFiles.map((f) => f.name).join(", ")}. Solo se permiten: PDF, DOCX, TXT, DOC`,
        )
        return
      }

      // Validar tamaño de archivo (máximo 10MB por archivo)
      const oversizedFiles = newFiles.filter((file) => file.size > 10 * 1024 * 1024)
      if (oversizedFiles.length > 0) {
        setErrorMessage(
          `Archivos muy grandes: ${oversizedFiles.map((f) => f.name).join(", ")}. Máximo 10MB por archivo`,
        )
        return
      }

      setFiles((prev) => [...prev, ...newFiles])
      setErrorMessage(null)

      // Inicializar descripciones para los nuevos archivos
      const newDescriptions = { ...descriptions }
      newFiles.forEach((file) => {
        newDescriptions[file.name] = ""
      })
      setDescriptions(newDescriptions)
    }
  }

  const handleRemoveFile = (fileName: string) => {
    setFiles(files.filter((file) => file.name !== fileName))

    // Eliminar descripción del archivo
    const newDescriptions = { ...descriptions }
    delete newDescriptions[fileName]
    setDescriptions(newDescriptions)
  }

  const handleDescriptionChange = (fileName: string, value: string) => {
    setDescriptions((prev) => ({
      ...prev,
      [fileName]: value,
    }))
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    setUploadStatus("uploading")
    setErrorMessage(null)
    setSuccessMessage(null)
    setUploadProgress(0)

    try {
      // Crear FormData para enviar archivos
      const formData = new FormData()

      files.forEach((file) => {
        formData.append("files", file)
      })

      formData.append("descriptions", JSON.stringify(descriptions))

      // Simular progreso mientras se sube
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 1000)

      console.log("Iniciando subida de archivos...")

      // Enviar archivos al servidor con timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 300000) // 5 minutos timeout

      let response: Response
      try {
        response = await fetch("/api/upload-documents", {
          method: "POST",
          body: formData,
          signal: controller.signal,
        })
      } catch (fetchError) {
        clearTimeout(timeoutId)
        clearInterval(progressInterval)
        console.error("Error en fetch:", fetchError)

        if (fetchError instanceof Error && fetchError.name === "AbortError") {
          throw new Error("La subida fue cancelada por timeout (5 minutos)")
        }
        throw new Error("Error de conexión con el servidor")
      }

      clearTimeout(timeoutId)
      clearInterval(progressInterval)
      setUploadProgress(100)

      console.log("Respuesta recibida, status:", response.status)
      console.log("Content-Type:", response.headers.get("content-type"))

      // Obtener el texto de la respuesta primero
      let responseText: string
      try {
        responseText = await response.text()
        console.log("Respuesta como texto:", responseText.substring(0, 500))
      } catch (textError) {
        console.error("Error leyendo respuesta como texto:", textError)
        throw new Error("No se pudo leer la respuesta del servidor")
      }

      // Verificar si la respuesta es JSON válida
      let result: any
      try {
        result = JSON.parse(responseText)
        console.log("JSON parseado correctamente:", result)
      } catch (jsonError) {
        console.error("Error parseando JSON:", jsonError)
        console.error("Respuesta completa:", responseText)
        throw new Error(`El servidor devolvió una respuesta inválida: ${responseText.substring(0, 200)}...`)
      }

      if (!response.ok) {
        throw new Error(result.error || `Error del servidor: ${response.status} - ${responseText}`)
      }

      if (result.success) {
        setUploadStatus("success")
        setSuccessMessage(result.message)
        setUploadResults(result.results || [])

        // Agregar archivos exitosos a la lista de subidos
        const successfulUploads = result.results.filter((r: UploadResult) => !r.error)
        const newUploadedFiles = successfulUploads.map((result: UploadResult) => ({
          id: Math.random().toString(36).substring(2, 9),
          name: result.originalName,
          uploadedName: result.uploadedName,
          size: result.size || 0,
          type: result.type || "",
          description: result.description || "",
          uploadedAt: new Date(result.uploadedAt),
          remotePath: result.remotePath,
        }))

        setUploadedFiles((prev) => [...prev, ...newUploadedFiles])

        // Limpiar formulario
        setFiles([])
        setDescriptions({})

        // Resetear el input de archivos
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }

        // Mostrar errores si los hay
        const failedUploads = result.results.filter((r: UploadResult) => r.error)
        if (failedUploads.length > 0) {
          setErrorMessage(
            `Algunos archivos no se pudieron subir: ${failedUploads.map((r: UploadResult) => r.originalName).join(", ")}`,
          )
        }
      } else {
        throw new Error(result.error || "Error desconocido al subir archivos")
      }
    } catch (error) {
      console.error("=== ERROR EN UPLOAD CLIENT ===")
      console.error("Error completo:", error)
      console.error("Stack trace:", error instanceof Error ? error.stack : "No stack available")

      setUploadStatus("error")

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          setErrorMessage("La subida fue cancelada por timeout (5 minutos)")
        } else {
          setErrorMessage(error.message)
        }
      } else {
        setErrorMessage("Error desconocido al subir archivos")
      }
    }

    // Resetear estado después de un tiempo
    setTimeout(() => {
      if (uploadStatus !== "uploading") {
        setUploadStatus("idle")
        setUploadProgress(0)
        if (uploadStatus === "success") {
          setSuccessMessage(null)
        }
      }
    }, 5000)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Subir Documentos para Entrenamiento
          </CardTitle>
          <CardDescription>
            Sube documentos para entrenar la IA de AISAC. Los archivos se almacenarán en el servidor FTP.
            <br />
            <strong>Formatos soportados:</strong> PDF, DOCX, TXT, DOC (máximo 10MB por archivo)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={triggerFileInput}
          >
            <Input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              multiple
              accept=".pdf,.docx,.txt,.doc"
            />
            <Cloud className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">Arrastra archivos aquí o haz clic para seleccionar</p>
            <p className="text-sm text-muted-foreground mt-1">Máximo 10MB por archivo • PDF, DOCX, TXT, DOC</p>
          </div>

          {/* Lista de archivos seleccionados */}
          {files.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Archivos seleccionados ({files.length})</h3>
              {files.map((file, index) => (
                <div key={`${file.name}-${index}`} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type || "Documento"}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveFile(file.name)}
                      className="h-8 w-8 rounded-full hover:bg-red-100 hover:text-red-600"
                      disabled={uploadStatus === "uploading"}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`description-${index}`}>Descripción (opcional)</Label>
                    <Textarea
                      id={`description-${index}`}
                      placeholder="Describe el contenido del documento para mejorar el entrenamiento de la IA..."
                      value={descriptions[file.name] || ""}
                      onChange={(e) => handleDescriptionChange(file.name, e.target.value)}
                      className="resize-none"
                      rows={2}
                      disabled={uploadStatus === "uploading"}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Barra de progreso durante la subida */}
          {uploadStatus === "uploading" && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subiendo archivos al servidor FTP...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Este proceso puede tomar varios minutos dependiendo del tamaño de los archivos.
              </p>
            </div>
          )}

          {/* Mensajes de estado */}
          {uploadStatus === "success" && successMessage && (
            <Alert className="bg-green-50 border-green-200 text-green-800">
              <Check className="h-4 w-4" />
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          {uploadStatus === "error" && errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {errorMessage && uploadStatus !== "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {/* Mostrar resultados detallados si hay errores parciales */}
          {uploadResults.length > 0 && uploadResults.some((r) => r.error) && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Detalles de la subida:</h4>
              {uploadResults.map((result, index) => (
                <div
                  key={index}
                  className={`text-xs p-2 rounded ${result.error ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}
                >
                  <strong>{result.originalName}:</strong> {result.error || "Subido correctamente"}
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleUpload}
            disabled={files.length === 0 || uploadStatus === "uploading"}
            className="w-full"
          >
            {uploadStatus === "uploading" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Subiendo al servidor FTP...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Subir {files.length} {files.length === 1 ? "documento" : "documentos"} al servidor
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Lista de documentos subidos */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Documentos en el Servidor FTP
            </CardTitle>
            <CardDescription>Documentos disponibles para el entrenamiento de la IA</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB • Subido el {file.uploadedAt.toLocaleDateString()}
                      </p>
                      {file.description && <p className="text-sm mt-1 text-gray-600">{file.description}</p>}
                      {file.remotePath && (
                        <p className="text-xs text-blue-600 mt-1">Servidor: {file.uploadedName || file.name}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <Check className="h-3 w-3 mr-1" />
                      En servidor
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
