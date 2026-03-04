export const USER_ROLE = {
  ADMIN: "ADMIN",
  USER: "USER"
} as const

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}
