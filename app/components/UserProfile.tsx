import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

export default function UserProfile({ userName }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 rounded-full">
          <Avatar>
            <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Perfil de Usuario</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xl font-semibold">{userName}</p>
              <p className="text-sm text-muted-foreground">Miembro desde {new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Configuración</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="notifications" />
                <label htmlFor="notifications">Recibir notificaciones</label>
              </div>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={() => {
            setIsDialogOpen(false)
            // Aquí iría la lógica para mostrar las políticas de privacidad
          }}>
            Políticas de Privacidad
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
