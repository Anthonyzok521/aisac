"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Users, Mail } from "lucide-react"

interface GroupInvitationProps {
  userEmail?: string
  userRole?: string
}

export function GroupInvitation({ userEmail, userRole }: GroupInvitationProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <Users className="h-12 w-12 text-blue-600" />
        </div>
        <CardTitle className="text-xl">Únete al Grupo AISAC</CardTitle>
        <CardDescription>Conecta con la comunidad académica de AISAC-UNERG</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-800">Invitación enviada</span>
          </div>
          {userEmail && (
            <p className="text-sm text-blue-700">
              Hemos enviado una invitación a <strong>{userEmail}</strong>
            </p>
          )}
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">En el grupo podrás:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Recibir actualizaciones importantes</li>
            <li>• Participar en discusiones académicas</li>
            <li>• Conectar con otros {userRole === "teacher" ? "profesores" : "estudiantes"}</li>
            <li>• Acceder a recursos adicionales</li>
          </ul>
        </div>

        <Button asChild className="w-full">
          <a
            href="https://groups.google.com/g/aisac-unerg"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            Acceder al Grupo
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}
