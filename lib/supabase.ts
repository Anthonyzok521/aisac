import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Verificar que las variables de entorno estén disponibles
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Faltan variables de entorno de Supabase")
}

// Cliente para el lado del cliente (solo con anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// NO exportar supabaseAdmin desde aquí para evitar uso en el cliente
