import { useState } from "react"
import { FaChevronDown, FaChevronUp } from "react-icons/fa"
import type { Company } from "../interfaces/company.interface"

interface Props {
  company: Company
}

export function CompanyCard({ company }: Props) {
  const [isCompanyExpanded, setIsCompanyExpanded] = useState(false)
  const [isShareholdersExpanded, setIsShareholdersExpanded] = useState(false)

  const toggleCompany = () => setIsCompanyExpanded((prev) => !prev)
  const toggleShareholders = () => setIsShareholdersExpanded((prev) => !prev)

  return (
    <div className="rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-md backdrop-blur-md transition-all duration-300 hover:shadow-xl">
      <div className="group flex cursor-pointer items-center justify-between" onClick={toggleCompany}>
        <h3 className="text-xl font-bold text-[#155567]">{company.name}</h3>
        {isCompanyExpanded ? (
          <FaChevronUp className="text-[#155567] transition group-hover:scale-110" />
        ) : (
          <FaChevronDown className="text-[#155567] transition group-hover:scale-110" />
        )}
      </div>

      {isCompanyExpanded && (
        <div className="mt-3 ml-4 space-y-3">
          <p className="text-gray-700">
            Total Capital: <strong>{company.totalCapital}</strong>
          </p>
          {company.user && (
            <div className="space-y-1 text-sm text-gray-500">
              <p>Created By: {company.user.name}</p>
              <p>Email: {company.user.email}</p>
            </div>
          )}

          <button className="mt-2 font-semibold text-[#155567] hover:text-[#134047]" onClick={toggleShareholders}>
            Shareholders {isShareholdersExpanded ? "▲" : "▼"}
          </button>

          {isShareholdersExpanded && (
            <div className="mt-2 ml-4 max-h-60 space-y-3 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 p-3 shadow-inner">
              {company.shareholders.map((sh, idx) => (
                <div key={idx} className="rounded-lg border border-gray-200 bg-white p-3 transition hover:shadow-md">
                  {sh.firstName} {sh.lastName} - {sh.nationality}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
