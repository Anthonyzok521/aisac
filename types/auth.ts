export type UserRole = "student" | "teacher"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  career?: string
  semester?: string
  is_active: boolean
  is_in_group: boolean
  created_at: string
  last_login?: string
}

export interface LoginFormData {
  email: string
  password: string
  role: UserRole
}

export interface RegisterFormData {
  name: string
  email: string
  password: string
  role: UserRole
  career?: string
  semester?: string
}

export interface EmailVerificationData {
  email: string
  code: string
}

export const CAREERS = [
  "Ingeniería en Sistemas",
  "Ingeniería Industrial",
  "Ingeniería Civil",
  "Medicina",
  "Derecho",
  "Administración",
  "Contaduría Pública",
  "Educación",
  "Psicología",
  "Enfermería",
] as const

export const SEMESTERS = [
  "1er Semestre",
  "2do Semestre",
  "3er Semestre",
  "4to Semestre",
  "5to Semestre",
  "6to Semestre",
  "7mo Semestre",
  "8vo Semestre",
  "9no Semestre",
  "10mo Semestre",
  "1er Año",
  "2do Año",
  "3er Año",
  "4to Año",
  "5to Año",
  "6to Año",
] as const
