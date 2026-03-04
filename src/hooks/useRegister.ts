import { useState } from "react"
import type { RegisterData } from "../interfaces/user.interface"

export function useRegister() {
  const [loading, setLoading] = useState(false)

  const register = async (data: RegisterData) => {
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.message || "Registration failed")

      localStorage.setItem("token", result.token)
      localStorage.setItem("role", result.user.role)

      return result
    } finally {
      setLoading(false)
    }
  }

  return { register, loading }
}
