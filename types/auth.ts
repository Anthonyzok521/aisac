export type UserRole = "student" | "teacher" | "admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  created_at: string
  updated_at: string
  last_login?: string
  is_active: boolean
  is_in_group: boolean
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface LoginFormData {
  email: string
  password: string
  role: UserRole
}

export interface RegisterFormData extends LoginFormData {
  name: string
}
