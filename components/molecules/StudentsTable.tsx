"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, MoreHorizontal } from "lucide-react"

interface Student {
  id: string
  name: string
  email: string
  lastActive: string
  status: "online" | "offline" | "idle"
  progress: number
}

interface StudentsTableProps {
  students: Student[]
  onMessageClick?: (studentId: string) => void
}

export function StudentsTable({ students, onMessageClick }: StudentsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Estudiante</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Último acceso</TableHead>
            <TableHead>Progreso</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    student.status === "online"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : student.status === "idle"
                        ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                        : "bg-gray-50 text-gray-700 border-gray-200"
                  }
                >
                  <span
                    className={`mr-1 h-2 w-2 rounded-full ${
                      student.status === "online"
                        ? "bg-green-500"
                        : student.status === "idle"
                          ? "bg-yellow-500"
                          : "bg-gray-500"
                    }`}
                  ></span>
                  {student.status === "online" ? "En línea" : student.status === "idle" ? "Inactivo" : "Desconectado"}
                </Badge>
              </TableCell>
              <TableCell>{student.lastActive}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${student.progress}%` }}></div>
                  </div>
                  <span className="text-xs font-medium">{student.progress}%</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onMessageClick && onMessageClick(student.id)}>
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
