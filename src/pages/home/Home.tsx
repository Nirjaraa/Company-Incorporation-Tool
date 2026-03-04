import { useState } from "react"
import { FaPlus } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import Navbar from "../../components/Navbar"
import { CompanyCard } from "../../components/CompanyCard"
import { CompanyForm } from "../../components/CompanyForm"
import { useCompanies } from "../../hooks/useCompanies"
import { FiLoader } from "react-icons/fi"
import type { CompanyData, User } from "../../interfaces/company.interface"

export function Home({ user }: { user: User }) {
  const [showForm, setShowForm] = useState(false)
  const navigate = useNavigate()

  const { companies, allCompanies, loading, error, createCompany } = useCompanies(user)

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  const handleCompanySubmit = async (companyData: CompanyData) => {
    await createCompany(companyData)
    setShowForm(false)
  }

  const openForm = () => setShowForm(true)

  if (loading)
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <FiLoader className="animate-spin text-5xl text-[#155567]" />
      </div>
    )

  if (!loading && error)
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <p className="text-center text-lg text-gray-600">{error ? error : "No companies found."}</p>
      </div>
    )

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 px-6 pt-20 pb-24">
      <Navbar onLogout={handleLogout} />

      <div className="mx-auto mb-6 flex max-w-5xl items-center justify-between">
        <h2 className="text-2xl font-semibold text-[#155567]">Your Companies ({companies.length})</h2>
        <button
          onClick={openForm}
          className="flex items-center rounded-xl bg-[#155567] px-5 py-2.5 text-white shadow-md transition-all duration-200 hover:scale-[1.03] hover:shadow-lg active:scale-95"
        >
          <FaPlus className="mr-2" /> Create
        </button>
      </div>

      {companies.length > 0 ? (
        <div className="mx-auto max-w-5xl space-y-6">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      ) : (
        <p className="text-center text-lg text-gray-600">{error ? error : "No companies found."}</p>
      )}

      {user.role === "ADMIN" && allCompanies.length > 0 && (
        <>
          <h2 className="mx-auto mt-12 mb-4 max-w-5xl text-xl font-semibold text-[#155567]">All Companies ({allCompanies.length})</h2>
          <div className="mx-auto max-w-5xl space-y-6">
            {allCompanies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        </>
      )}

      {showForm && <CompanyForm onClose={() => setShowForm(false)} onSubmit={handleCompanySubmit} />}
    </div>
  )
}
