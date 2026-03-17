import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useState } from 'react'
import { useUser } from '../context/UserContext'

export default function Header() {
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();
  const isLoggedIn = !!localStorage.getItem('accessToken');
  const isAdmin = isLoggedIn && user && user.role === 'admin';

  // No localStorage user logic; rely on context user for admin icon visibility

  return (
    <header className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 text-white shadow-lg sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
            <Link to="/" className="flex items-center space-x-1 sm:space-x-2 group" onClick={() => { window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }); }}>
            <div className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-pink-400 to-yellow-300 bg-clip-text text-transparent truncate">
              💍 AS Store
            </div>
            {/* Removed 'Box' for 'AS Store' branding */}
          </Link>

          {/* Center Navigation - Hidden on mobile */}
          <div className="hidden md:flex space-x-4 lg:space-x-8">
              {/* Add scroll-to-top for Home nav */}
              <Link to="/" className="hover:text-pink-300 transition duration-200 font-medium text-sm lg:text-base" onClick={() => { window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }); }}>
                Home
            </Link>
              <Link
                to="/collection"
                className="hover:text-pink-300 transition duration-200 font-medium text-sm lg:text-base"
              >
                Collection
              </Link>
            <Link to="/about" className="hover:text-pink-300 transition duration-200 font-medium text-sm lg:text-base" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}>
              About
            </Link>
            <Link to="/contact" className="hover:text-pink-300 transition duration-200 font-medium text-sm lg:text-base" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}>
              Contact
            </Link>
            {isLoggedIn && (
              <Link
                to="/orders"
                className="hover:text-pink-300 transition duration-200 font-medium text-sm lg:text-base"
              >
                My Orders
              </Link>
            )}
          </div>

          {/* Right Side - Icons and Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-1 lg:space-x-2">
            {/* Cart Icon - Visible on all screens */}
            <Link
              to="/cart"
              className="relative px-2 py-2 rounded-lg font-medium hover:bg-white hover:text-purple-900 transition duration-200 flex items-center text-lg"
              title="Cart"
            >
              🛒
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>

            {/* Desktop Auth Links */}
            <div className="hidden sm:flex items-center space-x-1 lg:space-x-2">
              {isLoggedIn && (
                <>
                  <Link
                    to="/my-account"
                    className="px-2 py-2 rounded-lg font-medium hover:bg-white hover:text-purple-900 transition duration-200 text-lg"
                    title="Account"
                  >
                    👤
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="hidden lg:inline-block px-3 py-2 bg-yellow-500 text-gray-900 rounded-lg font-bold hover:bg-yellow-600 transition duration-200 text-sm"
                      title="Admin Dashboard"
                    >
                      ⚙️
                    </Link>
                  )}
                </>
              )}
              {!isLoggedIn && (
                <>
                  <Link
                    to="/login"
                    className="hidden lg:inline-block px-3 py-2 rounded-lg font-medium hover:bg-white hover:text-purple-900 transition duration-200 text-sm"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="hidden lg:inline-block px-3 py-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg font-medium hover:shadow-lg transition duration-200 text-sm whitespace-nowrap"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="sm:hidden text-2xl ml-1"
              title="Menu"
            >
              {isMenuOpen ? '✕' : '☰'}
            </button>
          </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="sm:hidden pb-4 space-y-2 border-t border-purple-700 pt-100">
            <Link
                to="/"
                className="block px-3 py-2 bg-yellow-500 text-gray-900 rounded-lg font-bold hover:bg-yellow-600 transition text-sm"
                onClick={() => { setIsMenuOpen(false); window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }); }}
            >
              🏠 Home
            </Link>
            <a
              href="#collection"
              className="block px-3 py-2 bg-yellow-500 text-gray-900 rounded-lg font-bold hover:bg-yellow-600 transition text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              📦 Collection
            </a>
            <Link
              to="/about"
              className="block px-3 py-2 bg-yellow-500 text-gray-900 rounded-lg font-bold hover:bg-yellow-600 transition text-sm"
              onClick={() => { setIsMenuOpen(false); window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }); }}
            >
              ℹ️ About
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 bg-yellow-500 text-gray-900 rounded-lg font-bold hover:bg-yellow-600 transition text-sm"
              onClick={() => { setIsMenuOpen(false); window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }); }}
            >
              ✉️ Contact
            </Link>
            <Link
              to="/orders"
              className="block px-3 py-2 bg-yellow-500 text-gray-900 rounded-lg font-bold hover:bg-yellow-600 transition text-sm"
            >
              My Orders
            </Link>
            <div className="border-t border-purple-700 pt-2 mt-2 space-y-2">
              <Link
                to="/cart"
                className="block px-3 py-2 bg-yellow-500 text-gray-900 rounded-lg font-bold hover:bg-yellow-600 transition text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                🛒 Cart {cart.length > 0 && `(${cart.length})`}
              </Link>
              {isLoggedIn && (
                <>
                  <Link
                    to="/my-account"
                    className="block px-3 py-2 bg-yellow-500 text-gray-900 rounded-lg font-bold hover:bg-yellow-600 transition text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    👤 My Account
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="block px-3 py-2 bg-yellow-500 text-gray-900 rounded-lg font-bold hover:bg-yellow-600 transition text-sm"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      ⚙️ Admin
                    </Link>
                  )}
                </>
              )}
              {!isLoggedIn && (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 bg-yellow-500 text-gray-900 rounded-lg font-bold hover:bg-yellow-600 transition text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    🔐 Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 bg-yellow-500 text-gray-900 rounded-lg font-bold hover:bg-yellow-600 transition text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ✍️ Register Now
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
        </div>
      </nav>
    </header>
  );
}

