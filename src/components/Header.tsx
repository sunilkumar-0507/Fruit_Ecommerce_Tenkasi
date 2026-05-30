import { Link, useNavigate } from '@tanstack/react-router'
import { ShoppingCart, Search, Heart, Menu, X, Phone, LogOut, User } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '#/context/AuthContext'
import { useCart } from '#/context/CartContext'

const BASE_NAV = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Seasonal', to: '/seasonal' },
  { label: 'Baskets', to: '/baskets' },
  { label: 'Mobile App', to: '/mobile-app' },
] as const

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, isAdmin, logout } = useAuth()
  const { count: cartCount } = useCart()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    setUserMenuOpen(false)
    void navigate({ to: '/' })
  }

  return (
    <header className="sticky top-0 z-40">
      {/* Top Banner */}
      <div className="bg-[#2f6a4a] text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
          <span className="font-semibold tracking-wide text-xs sm:text-sm">
            FRESH FRUITS DELIVERED ACROSS TAMIL NADU
          </span>
          <div className="hidden sm:flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Phone size={13} />
              +91 98400 12345
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
              Same Day Delivery
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <nav className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-3">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 no-underline flex-shrink-0">
              <div className="w-11 h-11 bg-[#2f6a4a] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg leading-none font-serif">த</span>
              </div>
              <div>
                <p className="font-serif text-lg font-bold text-gray-900 leading-tight">Tenkasi Fresh</p>
                <p className="text-[10px] text-gray-500 tracking-widest uppercase">Farm to Home · Since 1987</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-7">
              {BASE_NAV.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-gray-700 font-medium text-sm hover:text-[#2f6a4a] transition-colors no-underline"
                  activeProps={{ className: 'text-[#2f6a4a] font-semibold no-underline' }}
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-gray-700 font-medium text-sm hover:text-[#2f6a4a] transition-colors no-underline"
                  activeProps={{ className: 'text-[#2f6a4a] font-semibold no-underline' }}
                >
                  Admin
                </Link>
              )}
            </div>

            {/* Search */}
            <div className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-2 w-56 gap-2">
              <Search size={15} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search mangoes, baskets..."
                className="bg-transparent w-full outline-none text-sm text-gray-600 placeholder-gray-400"
              />
            </div>

            {/* Icons */}
            <div className="flex items-center gap-1">
              {user ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 rounded-full transition"
                    aria-label="Account menu"
                  >
                    <div className="w-8 h-8 bg-[#2f6a4a] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm leading-none">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[80px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1 text-[10px] font-bold text-[#2f6a4a] bg-[#e7f3ec] px-2 py-0.5 rounded-full tracking-wide uppercase">
                            Admin
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut size={15} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#2f6a4a] text-white text-sm font-semibold rounded-full hover:bg-[#1f4a2f] transition-colors no-underline"
                >
                  <User size={15} />
                  Sign In
                </Link>
              )}
              <Link to="/shop" className="p-2 hover:bg-gray-100 rounded-full transition" aria-label="Wishlist">
                <Heart size={20} className="text-gray-600" />
              </Link>
              <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition" aria-label="Cart">
                <ShoppingCart size={20} className="text-gray-600" />
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button
                type="button"
                className="md:hidden p-2 hover:bg-gray-100 rounded-full transition ml-1"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={22} className="text-gray-700" /> : <Menu size={22} className="text-gray-700" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-100 py-3 space-y-1">
              {BASE_NAV.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2.5 text-gray-700 font-medium text-sm hover:bg-gray-50 rounded-lg no-underline"
                  activeProps={{ className: 'block px-4 py-2.5 text-[#2f6a4a] font-semibold text-sm bg-[#e7f3ec] rounded-lg no-underline' }}
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2.5 text-gray-700 font-medium text-sm hover:bg-gray-50 rounded-lg no-underline"
                  activeProps={{ className: 'block px-4 py-2.5 text-[#2f6a4a] font-semibold text-sm bg-[#e7f3ec] rounded-lg no-underline' }}
                >
                  Admin
                </Link>
              )}
              {!user && (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2.5 text-[#2f6a4a] font-semibold text-sm bg-[#e7f3ec] rounded-lg no-underline"
                >
                  Sign In / Register
                </Link>
              )}
              {user && (
                <button
                  type="button"
                  onClick={() => { handleLogout(); setIsMenuOpen(false) }}
                  className="w-full text-left block px-4 py-2.5 text-red-600 font-medium text-sm hover:bg-red-50 rounded-lg"
                >
                  Sign Out
                </button>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
