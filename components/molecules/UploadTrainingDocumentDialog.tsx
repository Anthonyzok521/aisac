'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UploadTrainingDocumentDialogProps {
  userName: string
}

export function UploadTrainingDocumentDialog({ userName }: UploadTrainingDocumentDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [trainingType, setTrainingType] = useState('')
  const [area, setArea] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para manejar la subida del documento
    console.log('Subiendo documento:', { trainingType, area, userName })
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          Subir documento de entrenamiento
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Subir documento de entrenamiento</DialogTitle>
          <DialogDescription>
            Esta opción es para entrenar la IA. Por favor, complete el siguiente formulario.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="trainingType">Tipo de entrenamiento</Label>
            <Select value={trainingType} onValueChange={setTrainingType}>
              <SelectTrigger id="trainingType">
                <SelectValue placeholder="Seleccione el tipo de entrenamiento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="specific">Específico</SelectItem>
                <SelectItem value="advanced">Avanzado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="area">Área</Label>
            <Input
              id="area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="Ingrese el área de entrenamiento"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="userName">Nombre de usuario</Label>
            <Input id="userName" value={userName} disabled />
          </div>
          <Button type="submit" className="w-full">Subir documento</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

