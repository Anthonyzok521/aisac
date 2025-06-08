// Función simple para hash de contraseñas (en producción usar bcrypt)
export async function hashPassword(password: string): Promise<string> {
  // En un entorno real, usarías bcrypt o similar
  // Por ahora, usamos una función simple para demostración
  const encoder = new TextEncoder()
  const data = encoder.encode(password + "aisac_salt")
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password)
  return passwordHash === hash
}

export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (password.length < 6) {
    errors.push("La contraseña debe tener al menos 6 caracteres")
  }

  if (!/[A-Za-z]/.test(password)) {
    errors.push("La contraseña debe contener al menos una letra")
  }

  if (!/[0-9]/.test(password)) {
    errors.push("La contraseña debe contener al menos un número")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
