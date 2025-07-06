"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/hooks/useAuth"
import { Upload, FileText, X, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface FileWithDescription {
  file: File
  description: string
}

interface UploadResult {
  originalName: string
  uploadedName?: string
  error?: string
  size?: number
  type?: string
  description?: string
  uploadedAt: string
}

export function DocumentUploader() {
  const { user } = useAuth()
  const [files, setFiles] = useState<FileWithDescription[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([])
  const [showResults, setShowResults] = useState(false)

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])
    const newFiles = selectedFiles.map((file) => ({
      file,
      description: "",
    }))
    setFiles((prev) => [...prev, ...newFiles])
  }, [])

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const updateDescription = useCallback((index: number, description: string) => {
    setFiles((prev) => prev.map((item, i) => (i === index ? { ...item, description } : item)))
  }, [])

  const handleUpload = async () => {
    if (files.length === 0 || !user) return

    setIsUploading(true)
    setUploadProgress(0)
    setShowResults(false)

    try {
      const formData = new FormData()

      // Agregar archivos
      files.forEach(({ file }) => {
        formData.append("files", file)
      })

      // Agregar descripciones
      const descriptions = files.reduce(
        (acc, { file, description }) => {
          acc[file.name] = description
          return acc
        },
        {} as Record<string, string>,
      )

      formData.append("descriptions", JSON.stringify(descriptions))

      // Agregar información del profesor
      formData.append("teacherName", user.name)
      formData.append("teacherEmail", user.email)

      // Simular progreso
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 500)

      const response = await fetch("/api/upload-documents", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      const result = await response.json()

      if (result.success) {
        setUploadResults(result.results)
        setShowResults(true)
        setFiles([]) // Limpiar archivos después de subir

        toast({
          title: "Archivos subidos",
          description: `${result.uploadedCount} de ${result.totalCount} archivos subidos correctamente`,
        })
      } else {
        throw new Error(result.error || "Error al subir archivos")
      }
    } catch (error) {
      console.error("Error uploading files:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al subir archivos",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      setTimeout(() => setUploadProgress(0), 2000)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Subir Documentos de Entrenamiento
          </CardTitle>
          <CardDescription>
            Sube documentos para entrenar la IA de AISAC. Los archivos se guardarán con tu nombre para identificación.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Selector de archivos */}
          <div className="space-y-2">
            <Label htmlFor="file-upload">Seleccionar archivos</Label>
            <Input
              id="file-upload"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
              disabled={isUploading}
            />
            <p className="text-sm text-muted-foreground">
              Formatos soportados: PDF, DOC, DOCX, TXT, JPG, PNG (máximo 10MB por archivo)
            </p>
          </div>

          {/* Lista de archivos seleccionados */}
          {files.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium">Archivos seleccionados ({files.length})</h3>
              <div className="space-y-3">
                {files.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{item.file.name}</span>
                        <span className="text-sm text-muted-foreground">({formatFileSize(item.file.size)})</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeFile(index)} disabled={isUploading}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Vista previa del nombre final */}
                    {user && (
                      <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
                        <strong>Nombre en servidor:</strong> {user.name.replace(/[^a-zA-Z0-9_-]/g, "_")}_[fecha]_
                        {item.file.name}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor={`description-${index}`}>Descripción (opcional)</Label>
                      <Textarea
                        id={`description-${index}`}
                        placeholder="Describe el contenido de este archivo..."
                        value={item.description}
                        onChange={(e) => updateDescription(index, e.target.value)}
                        disabled={isUploading}
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progreso de subida */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Subiendo archivos...</span>
                <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          {/* Botón de subida */}
          <Button onClick={handleUpload} disabled={files.length === 0 || isUploading} className="w-full">
            {isUploading ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-pulse" />
                Subiendo {files.length} archivo{files.length !== 1 ? "s" : ""}...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Subir {files.length} archivo{files.length !== 1 ? "s" : ""}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Resultados de la subida 
      {showResults && uploadResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Resultados de la Subida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploadResults.map((result, index) => (
                <Alert key={index} variant={result.error ? "destructive" : "default"}>
                  <div className="flex items-start gap-2">
                    {result.error ? (
                      <AlertCircle className="h-4 w-4 mt-0.5" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
                    )}
                    <div className="flex-1">
                      <AlertDescription>
                        <div className="font-medium">{result.originalName}</div>
                        {result.error ? (
                          <div className="text-sm text-destructive mt-1">{result.error}</div>
                        ) : (
                          <div className="text-sm text-muted-foreground mt-1">
                            Subido como: {result.uploadedName}
                            {result.description && <div className="mt-1">Descripción: {result.description}</div>}
                          </div>
                        )}
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      */}
    </div>
  )
}
