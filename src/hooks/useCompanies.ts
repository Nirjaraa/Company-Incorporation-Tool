import { useState, useEffect, useCallback } from "react"
import { toast } from "react-toastify"
import type { User, Company, CompanyData } from "../interfaces/company.interface"
import { USER_ROLE } from "../interfaces/user.interface"

export function useCompanies(user: User) {
  const [companies, setCompanies] = useState<Company[]>([])
  const [allCompanies, setAllCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const token = localStorage.getItem("token")

  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true)
      setError("")

      const resUser = await fetch(`${import.meta.env.VITE_API_BASE_URL}/companies/my`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!resUser.ok) throw new Error("Failed to fetch your companies")
      const dataUser = await resUser.json()
      setCompanies(dataUser.data || [])

      if (user.role === USER_ROLE.ADMIN) {
        const resAll = await fetch(`${import.meta.env.VITE_API_BASE_URL}/companies`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!resAll.ok) throw new Error("Failed to fetch all companies")
        const dataAll = await resAll.json()
        setAllCompanies(dataAll.data || [])
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }, [user.role, token])

  useEffect(() => {
    fetchCompanies()
  }, [fetchCompanies])

  const createCompany = async (companyData: CompanyData) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/companies`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(companyData)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to create company")

      setCompanies((prev) => [...prev, data.data])
      if (user.role === "ADMIN") setAllCompanies((prev) => [...prev, data.data])

      toast.success(data.message || "Company created successfully!")
      fetchCompanies()
    } catch (err: any) {
      toast.error(err.message || "Error creating company")
    }
  }

  return {
    companies,
    allCompanies,
    loading,
    error,
    fetchCompanies,
    createCompany
  }
}
