import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Verificar que las variables de entorno estén disponibles
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Faltan variables de entorno de Supabase")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente para el servidor (solo si la service role key está disponible)
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
export const supabaseAdmin = serviceRoleKey ? createClient(supabaseUrl, serviceRoleKey) : null
