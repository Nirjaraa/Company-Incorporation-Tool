import { useState } from "react"
import type { LoginData } from "../interfaces/user.interface"

export function useLogin() {
  const [loading, setLoading] = useState(false)

  const login = async (data: LoginData) => {
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.message || "Login failed")

      localStorage.setItem("token", result.token)
      localStorage.setItem("role", result.user.role)

      return result
    } finally {
      setLoading(false)
    }
  }

  return { login, loading }
}
