"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DocumentUploader } from "@/components/molecules/DocumentUploader"
import { AdminPanel } from "@/components/organisms/AdminPanel"
import { useAuth } from "@/hooks/useAuth"
import { Users, FileText, Settings, MessageSquare, ExternalLink } from "lucide-react"

export function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState("documents")
  const { redirectToNotebook } = useAuth()

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Panel de Profesor</h2>
          <p className="text-muted-foreground">Gestiona documentos para entrenar la IA y administra usuarios</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={redirectToNotebook} className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Ir al Chat
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="documents" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="documents">
            <FileText className="h-4 w-4 mr-2" />
            Documentos
          </TabsTrigger>
{/*          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Usuarios
          </TabsTrigger>*/}
          {/*<TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Configuración
          </TabsTrigger>*/}
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          <DocumentUploader />
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <AdminPanel />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Configuración de la IA</h3>
            <p className="text-muted-foreground">
              Esta sección está en desarrollo. Próximamente podrás configurar parámetros avanzados de la IA.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
