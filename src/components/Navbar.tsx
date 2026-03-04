import { FiLogOut } from "react-icons/fi"

interface NavbarProps {
  onLogout: () => void
}

export default function Navbar({ onLogout }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-[#155567] text-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-2">
        <h1 className="cursor-pointer text-lg font-bold tracking-wide">Company Incorporation Tool</h1>
        <button onClick={onLogout} className="flex items-center gap-1 text-xs font-semibold transition-colors duration-200 hover:text-gray-200">
          <FiLogOut size={14} />
          Logout
        </button>
      </div>
    </nav>
  )
}
