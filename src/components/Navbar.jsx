
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  BookOpen,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Later replace this with your actual auth user
  const user = null;

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
      isActive
        ? "text-blue-600 bg-blue-50"
        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
    }`;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <div className="flex items-center">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-blue-600"
          >
            <BookOpen className="h-7 w-7" />
            <span>BiblioDrop</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-2 lg:flex">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/books" className={navLinkClass}>
            Browse Books
          </NavLink>

          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
        </div>

        {/* Desktop Right Side */}
        <div className="hidden items-center gap-3 lg:flex">

          {user ? (
            <div className="relative">
              {/* Profile Button */}
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-white p-1 pr-3 transition hover:border-blue-400 hover:shadow-sm"
              >
                <img
                  src={
                    user.photo ||
                    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  }
                  alt="User Avatar"
                  className="h-9 w-9 rounded-full object-cover"
                />

                <span className="text-sm font-medium text-gray-700">
                  {user.name}
                </span>

                <ChevronDown
                  className={`h-4 w-4 text-gray-500 transition-transform ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">

                  <div className="border-b border-gray-100 px-4 py-3">
                    <p className="text-sm font-semibold text-gray-800">
                      {user.name}
                    </p>

                    <p className="text-xs capitalize text-gray-500">
                      {user.role || "user"}
                    </p>
                  </div>

                  <div className="p-2">

                    <Link
                      to={`/dashboard/${user.role || "user"}`}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 hover:text-blue-600"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>

                    <button
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>

                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-gray-700 transition hover:bg-gray-100 lg:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-gray-200 bg-white px-4 pb-4 lg:hidden">

          <div className="flex flex-col gap-1 pt-3">

            <NavLink
              to="/"
              onClick={() => setMobileOpen(false)}
              className={navLinkClass}
            >
              Home
            </NavLink>

            <NavLink
              to="/books"
              onClick={() => setMobileOpen(false)}
              className={navLinkClass}
            >
              Browse Books
            </NavLink>

            <NavLink
              to="/about"
              onClick={() => setMobileOpen(false)}
              className={navLinkClass}
            >
              About
            </NavLink>

          </div>

          {/* Mobile Auth */}
          {!user && (
            <div className="mt-4 flex gap-2 border-t border-gray-100 pt-4">

              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex-1 rounded-lg border border-blue-600 px-4 py-2 text-center text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Register
              </Link>

            </div>
          )}

        </div>
      )}
    </nav>
  );
}

