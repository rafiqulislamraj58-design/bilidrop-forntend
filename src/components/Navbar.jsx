import { Link, NavLink } from 'react-router-dom';
import { BookOpen, LogOut, LayoutDashboard, Menu } from 'lucide-react';

export default function Navbar() {
 
  const user = null; 

  const navLinks = (
    <>
      <li>
        <NavLink 
          to="/" 
          className={({ isActive }) => (isActive ? 'text-primary font-bold' : '')}
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink 
          to="/books" 
          className={({ isActive }) => (isActive ? 'text-primary font-bold' : '')}
        >
          Browse Books
        </NavLink>
      </li>
    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-md sticky top-0 z-50 px-4 sm:px-8">
   
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <Menu className="h-6 w-6" />
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 gap-1">
            {navLinks}
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost text-xl font-bold gap-2 text-primary">
          <BookOpen className="h-6 w-6" /> BiblioDrop
        </Link>
      </div>

      {/* Desktop Links */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2 text-base font-medium">
          {navLinks}
        </ul>
      </div>

      <div className="navbar-end gap-3">
        {user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border border-primary">
              <div className="w-10 rounded-full">
                <img alt="User Avatar" src={user.photo || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} />
              </div>
            </div>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li className="px-4 py-2 font-bold text-sm text-gray-500">{user.name}</li>
              <div className="divider my-0"></div>
              <li>
                <Link to={`/dashboard/${user.role || 'user'}`}>
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
              </li>
              <li>
                <button className="text-error">
                  <LogOut size={16} /> Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="btn btn-outline btn-primary btn-sm">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
          </div>
        )}
      </div>
    </div>
  );
}