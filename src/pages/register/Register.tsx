import { useState } from "react"
import { FiEye, FiEyeOff, FiLoader } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import { useRegister } from "../../hooks/useRegister"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { toast } from "react-toastify"

const registerSchema = yup
  .object({
    name: yup.string().required("Full name is required"),
    email: yup.string().email("Invalid email address").required("Email is required"),
    password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required")
  })
  .required()

type RegisterFormInputs = yup.InferType<typeof registerSchema>

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { register: registerUser, loading } = useRegister()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<RegisterFormInputs>({
    resolver: yupResolver(registerSchema),
    mode: "onChange"
  })

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      const result = await registerUser(data)
      toast.success(result.message || "Registered successfully!")
      navigate("/home", { state: { user: result.user } })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to register"
      toast.error(message)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white/90 p-8 shadow-xl backdrop-blur-md">
        <h2 className="mb-2 text-center text-3xl font-bold text-[#155567]">Create Account</h2>
        <p className="mb-6 text-center text-sm text-gray-500">Register to start incorporating companies</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Full Name"
              className={`w-full rounded-xl border px-4 py-3 transition focus:ring-2 focus:outline-none ${errors.name ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-[#155567]"}`}
              {...register("name")}
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <input
              type="email"
              placeholder="Email Address"
              className={`w-full rounded-xl border px-4 py-3 transition focus:ring-2 focus:outline-none ${errors.email ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-[#155567]"}`}
              {...register("email")}
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={`w-full rounded-xl border px-4 py-3 pr-10 transition focus:ring-2 focus:outline-none ${errors.password ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-[#155567]"}`}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-[#155567] transition hover:opacity-70"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading || !isValid}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold text-white shadow-md transition duration-200 ${
              loading || !isValid ? "cursor-not-allowed bg-gray-400" : "bg-gradient-to-r from-[#155567] to-[#1c6e7c] hover:opacity-90"
            }`}
          >
            {loading ? <FiLoader className="animate-spin" size={18} /> : "Register"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <button type="button" onClick={() => navigate("/login")} className="font-medium text-[#155567] hover:underline">
            Login
          </button>
        </div>
      </div>
    </div>
  )
}
