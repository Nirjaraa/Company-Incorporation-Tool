import { useState, useEffect } from "react"
import * as yup from "yup"
import { toast } from "react-toastify"
import type { CompanyData, Shareholder } from "../interfaces/company.interface"

interface Props {
  onClose: () => void
  onSubmit: (company: CompanyData) => void
}

// Yup schemas
const companySchema = yup.object().shape({
  name: yup.string().required("Company name is required"),
  totalCapital: yup
    .number()
    .typeError("Total capital must be a number")
    .min(1, "Total capital must be greater than 0")
    .required("Total capital is required"),
  numberOfShareholders: yup
    .number()
    .typeError("Number of shareholders must be a number")
    .min(1, "At least 1 shareholder is required")
    .required("Number of shareholders is required")
})

const shareholderSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  nationality: yup.string().required("Nationality is required")
})

export function CompanyForm({ onClose, onSubmit }: Props) {
  const [step, setStep] = useState(1)
  const [companyInfo, setCompanyInfo] = useState({
    name: "",
    totalCapital: 0,
    numberOfShareholders: 1
  })
  const [shareholders, setShareholders] = useState<Shareholder[]>([])
  const [companyErrors, setCompanyErrors] = useState<Record<string, string>>({})
  const [shareholderErrors, setShareholderErrors] = useState<Record<number, Record<string, string>>>({})

  useEffect(() => {
    companySchema
      .validate(companyInfo, { abortEarly: false })
      .then(() => setCompanyErrors({}))
      .catch((err) => {
        const errs: Record<string, string> = {}
        err.inner.forEach((e: any) => {
          if (e.path) errs[e.path] = e.message
        })
        setCompanyErrors(errs)
      })
  }, [companyInfo])

  useEffect(() => {
    const allErrors: Record<number, Record<string, string>> = {}
    shareholders.forEach((sh, idx) => {
      try {
        shareholderSchema.validateSync(sh, { abortEarly: false })
        allErrors[idx] = {}
      } catch (err: any) {
        const errs: Record<string, string> = {}
        err.inner.forEach((e: any) => {
          if (e.path) errs[e.path] = e.message
        })
        allErrors[idx] = errs
      }
    })
    setShareholderErrors(allErrors)
  }, [shareholders])

  const handleCompanyInfoNext = () => {
    companySchema
      .validate(companyInfo, { abortEarly: false })
      .then(() => {
        setShareholders(
          Array.from({ length: Number(companyInfo.numberOfShareholders) }, () => ({
            firstName: "",
            lastName: "",
            nationality: ""
          }))
        )
        setStep(2)
      })
      .catch((err) => {
        const errs: Record<string, string> = {}
        err.inner.forEach((e: any) => {
          if (e.path) errs[e.path] = e.message
        })
        setCompanyErrors(errs)
        toast.error("Please fix the errors before continuing")
      })
  }

  const handleShareholderChange = (index: number, field: keyof Shareholder, value: string) => {
    const updated = [...shareholders]
    updated[index][field] = value
    setShareholders(updated)
  }

  const handleBackToCompanyInfo = () => setStep(1)

  const handleSubmit = () => {
    let hasError = false

    shareholders.forEach((sh) => {
      try {
        shareholderSchema.validateSync(sh, { abortEarly: false })
      } catch {
        hasError = true
      }
    })

    if (hasError) return toast.error("Please fix shareholder errors before submitting")

    const companyData = {
      name: companyInfo.name.trim(),
      totalCapital: Number(companyInfo.totalCapital),
      shareholders: shareholders.map((sh) => ({
        firstName: sh.firstName.trim(),
        lastName: sh.lastName.trim(),
        nationality: sh.nationality.trim()
      }))
    }

    onSubmit(companyData)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="animate-fadeIn relative w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl">
        <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={onClose}>
          ✕
        </button>

        {step === 1 && (
          <div>
            <h3 className="mb-6 border-b pb-2 text-2xl font-semibold text-[#155567]">Step 1: Company Information</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-gray-700">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={companyInfo.name}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 transition focus:bg-white focus:ring-2 focus:ring-[#155567] focus:outline-none"
                />
                {companyErrors.name && <p className="mt-1 text-sm text-red-500">{companyErrors.name}</p>}
              </div>

              <div>
                <label className="mb-1 block text-gray-700">
                  Total Capital <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  value={companyInfo.totalCapital}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, totalCapital: Number(e.target.value) })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 transition focus:bg-white focus:ring-2 focus:ring-[#155567] focus:outline-none"
                />
                {companyErrors.totalCapital && <p className="mt-1 text-sm text-red-500">{companyErrors.totalCapital}</p>}
              </div>

              <div>
                <label className="mb-1 block text-gray-700">
                  Number of Shareholders <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  value={companyInfo.numberOfShareholders}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, numberOfShareholders: Number(e.target.value) })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 transition focus:bg-white focus:ring-2 focus:ring-[#155567] focus:outline-none"
                />
                {companyErrors.numberOfShareholders && <p className="mt-1 text-sm text-red-500">{companyErrors.numberOfShareholders}</p>}
              </div>

              <button
                onClick={handleCompanyInfoNext}
                disabled={Object.keys(companyErrors).length > 0}
                className={`mt-4 w-full rounded-xl py-3 text-white transition ${
                  Object.keys(companyErrors).length > 0 ? "cursor-not-allowed bg-gray-400" : "bg-[#155567] hover:bg-[#134047]"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="mb-6 border-b pb-2 text-2xl font-semibold text-[#155567]">Step 2: Shareholder Information</h3>
            <div className="max-h-[60vh] space-y-4 overflow-y-auto p-2">
              {shareholders.map((sh, idx) => (
                <div key={idx} className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-inner">
                  <h4 className="mb-2 font-semibold text-gray-700">Shareholder {idx + 1}</h4>

                  <input
                    type="text"
                    placeholder="First Name"
                    value={sh.firstName}
                    onChange={(e) => handleShareholderChange(idx, "firstName", e.target.value)}
                    className="mb-2 w-full rounded border border-gray-200 bg-white px-3 py-2 focus:ring-2 focus:ring-[#155567] focus:outline-none"
                  />
                  {shareholderErrors[idx]?.firstName && <p className="mb-2 text-sm text-red-500">{shareholderErrors[idx].firstName}</p>}

                  <input
                    type="text"
                    placeholder="Last Name"
                    value={sh.lastName}
                    onChange={(e) => handleShareholderChange(idx, "lastName", e.target.value)}
                    className="mb-2 w-full rounded border border-gray-200 bg-white px-3 py-2 focus:ring-2 focus:ring-[#155567] focus:outline-none"
                  />
                  {shareholderErrors[idx]?.lastName && <p className="mb-2 text-sm text-red-500">{shareholderErrors[idx].lastName}</p>}

                  <input
                    type="text"
                    placeholder="Nationality"
                    value={sh.nationality}
                    onChange={(e) => handleShareholderChange(idx, "nationality", e.target.value)}
                    className="w-full rounded border border-gray-200 bg-white px-3 py-2 focus:ring-2 focus:ring-[#155567] focus:outline-none"
                  />
                  {shareholderErrors[idx]?.nationality && <p className="mt-1 text-sm text-red-500">{shareholderErrors[idx].nationality}</p>}
                </div>
              ))}

              <div className="mt-4 flex justify-between">
                <button onClick={handleBackToCompanyInfo} className="rounded bg-gray-300 px-4 py-2 transition hover:bg-gray-400">
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={shareholders.some((_, idx) => Object.keys(shareholderErrors[idx] || {}).length > 0)} // disable if any shareholder has errors
                  className={`rounded px-4 py-2 text-white transition ${
                    shareholders.some((_, idx) => Object.keys(shareholderErrors[idx] || {}).length > 0)
                      ? "cursor-not-allowed bg-gray-400"
                      : "bg-[#155567] hover:bg-[#134047]"
                  }`}
                >
                  Submit Company
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
