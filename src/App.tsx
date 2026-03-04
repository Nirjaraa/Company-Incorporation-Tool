import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { Home } from "./pages/home/Home"
import { LoginPage } from "./pages/login/Login"
import { RegisterPage } from "./pages/register/Register"
import { USER_ROLE } from "./interfaces/user.interface"

export default function App() {
  return (
    <div className="flex flex-col bg-gray-100">
      <div className="flex-1">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/home" element={<ProtectedCompaniesPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </div>
  )
}

function ProtectedCompaniesPage() {
  const location = useLocation()
  const userFromState = location.state?.user as { role: typeof USER_ROLE.ADMIN | typeof USER_ROLE.USER } | undefined
  const user = userFromState || {
    role: localStorage.getItem("role") === USER_ROLE.ADMIN ? USER_ROLE.ADMIN : USER_ROLE.USER
  }

  const token = localStorage.getItem("token")
  if (!token) return <Navigate to="/" replace />

  return <Home user={user} />
}
