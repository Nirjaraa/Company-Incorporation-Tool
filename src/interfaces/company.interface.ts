export interface Shareholder {
  firstName: string
  lastName: string
  nationality: string
  id?: string
}

export interface CompanyUser {
  id: string
  name: string
  email: string
}

export interface Company {
  id: string
  name: string
  totalCapital: number
  shareholders: Shareholder[]
  user?: CompanyUser
}

export interface CompanyData {
  name: string
  totalCapital: number
  shareholders: Shareholder[]
}

export interface User {
  role: "ADMIN" | "USER"
}
