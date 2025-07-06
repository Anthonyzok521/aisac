"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CheckCircle, XCircle, Clock, Users, UserCheck, UserX, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/useAuth"

interface PendingUser {
  id: string
  name: string
  email: string
  role: string
  created_at: string
  is_in_group: boolean
}

export function AdminPanel() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState<string | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
  })
  const { user } = useAuth()

  // Cargar usuarios pendientes
  const loadUsers = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from("users")
        .select("id, name, email, role, created_at, is_in_group")
        .eq("is_active", true)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error cargando usuarios:", error)
        return
      }

      setPendingUsers(data || [])

      // Calcular estadísticas
      const total = data?.length || 0
      const approved = data?.filter((u) => u.is_in_group).length || 0
      const pending = total - approved

      setStats({ total, approved, pending })
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  // Aprobar usuario
  const approveUser = async (userId: string) => {
    try {
      setIsProcessing(userId)
      const { error } = await supabase.from("users").update({ is_in_group: true }).eq("id", userId)

      if (error) {
        console.error("Error aprobando usuario:", error)
        return
      }

      // Recargar la lista
      await loadUsers()
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsProcessing(null)
    }
  }

  // Rechazar/remover usuario del grupo
  const rejectUser = async (userId: string) => {
    try {
      setIsProcessing(userId)
      const { error } = await supabase.from("users").update({ is_in_group: false }).eq("id", userId)

      if (error) {
        console.error("Error rechazando usuario:", error)
        return
      }

      // Recargar la lista
      await loadUsers()
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsProcessing(null)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Usuarios registrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprobados</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">Con acceso a AISAC</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <UserX className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">En lista de espera</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de usuarios */}
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Usuarios</CardTitle>
          <CardDescription>Aprobar o rechazar el acceso de usuarios a la plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingUsers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No hay usuarios registrados en el sistema</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Fecha de Registro</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role === "teacher" ? "Profesor" : "Estudiante"}</Badge>
                    </TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString("es-ES")}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          user.is_in_group
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-orange-50 text-orange-700 border-orange-200"
                        }
                      >
                        {user.is_in_group ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Aprobado
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3 mr-1" />
                            Pendiente
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {isProcessing === user.id ? (
                          <Button size="sm" disabled>
                            <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            Procesando...
                          </Button>
                        ) : !user.is_in_group ? (
                          <Button
                            size="sm"
                            onClick={() => approveUser(user.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Aprobar
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => rejectUser(user.id)}
                            className="border-red-200 text-red-700 hover:bg-red-50"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Remover
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
