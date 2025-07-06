"use client"

import type { UserRole } from "@/types/auth"
import { cn } from "@/lib/utils"
import { GraduationCap, BookOpen } from "lucide-react"

interface RoleSelectorProps {
  selectedRole: UserRole | null
  onRoleSelect: (role: UserRole) => void
  className?: string
}

export function RoleSelector({ selectedRole, onRoleSelect, className }: RoleSelectorProps) {
  return (
    <div className={cn("flex gap-4 w-full", className)}>
      <button
        type="button"
        onClick={() => onRoleSelect("teacher")}
        className={cn(
          "flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-lg border transition-all",
          selectedRole === "teacher"
            ? "border-primary bg-primary/10 text-primary"
            : "border-border hover:border-primary/50",
        )}
      >
        <GraduationCap size={24} />
        <span className="font-medium">Profesor</span>
      </button>

      <button
        type="button"
        onClick={() => onRoleSelect("student")}
        className={cn(
          "flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-lg border transition-all",
          selectedRole === "student"
            ? "border-primary bg-primary/10 text-primary"
            : "border-border hover:border-primary/50",
        )}
      >
        <BookOpen size={24} />
        <span className="font-medium">Estudiante</span>
      </button>
    </div>
  )
}
