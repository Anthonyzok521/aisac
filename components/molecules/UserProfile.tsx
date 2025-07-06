"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/hooks/useAuth"
import { LogOut, Settings, LayoutDashboard, MessageSquare } from "lucide-react"

interface UserProfileProps {
  userName: string
}

export function UserProfile({ userName }: UserProfileProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const navigateToDashboard = () => {
    setIsDialogOpen(false)
    router.push("/dashboard")
  }

  const navigateToChat = () => {
    setIsDialogOpen(false)
    router.push("/chat")
  }

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
              <p className="text-sm text-muted-foreground">{user?.role === "teacher" ? "Profesor" : "Estudiante"}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
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
          <div className="flex flex-col gap-2">
            {user?.role === "teacher" && (
              <>
                <Button variant="outline" className="w-full flex items-center" onClick={navigateToDashboard}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
                <Button variant="outline" className="w-full flex items-center" onClick={navigateToChat}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Chat
                </Button>
              </>
            )}
            <Button
              variant="outline"
              className="w-full flex items-center"
              onClick={() => {
                setIsDialogOpen(false)
                // Aquí iría la lógica para mostrar la configuración
              }}
            >
              <Settings className="mr-2 h-4 w-4" />
              Configuración
            </Button>
            <Button variant="outline" className="w-full flex items-center" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
