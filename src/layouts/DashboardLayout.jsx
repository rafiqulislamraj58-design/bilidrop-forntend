import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import {
  User,
  Truck,
  Heart,
  PlusCircle,
  Book,
  Users,
  BarChart3,
  LogOut,
  Menu,
  Home,
  BookOpen,
  ArrowLeft
} from 'lucide-react';

export default function DashboardLayout() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  return (
    <div className="drawer lg:drawer-open min-h-screen bg-base-200">
      
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col">
    
        <header className="navbar bg-base-100 border-b border-base-300 px-4 sm:px-6 sticky top-0 z-30">
          <div className="flex-1 gap-2">
            <label htmlFor="dashboard-drawer" className="btn btn-square btn-ghost drawer-button lg:hidden">
              <Menu size={20} />
            </label>
            <h1 className="text-xl font-bold capitalize">
              {user?.role || 'User'} Dashboard
            </h1>
          </div>

          <div className="flex-none gap-3">
            <Link to="/" className="btn btn-outline btn-sm gap-2">
              <ArrowLeft size={16} /> Back to Home
            </Link>
          </div>
        </header>

        <main className="p-4 sm:p-8 flex-grow">
          <Outlet />
        </main>
      </div>

      <div className="drawer-side z-40">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <aside className="menu p-4 w-72 min-h-full bg-base-100 text-base-content border-r border-base-300 flex flex-col justify-between">
          
          <div className="space-y-6">
         
            <div className="px-2">
              <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
                <BookOpen className="h-7 w-7" /> BiblioDrop
              </Link>
            </div>

            <div className="flex items-center gap-3 bg-base-200 p-3 rounded-xl">
              <div className="avatar">
                <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
                  <img src={user?.photo || 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'} alt={user?.name} />
                </div>
              </div>
              <div className="overflow-hidden">
                <h3 className="font-bold text-sm truncate">{user?.name || 'User Name'}</h3>
                <span className="badge badge-primary badge-sm capitalize text-[10px] py-1 font-semibold">
                  {user?.role || 'user'}
                </span>
              </div>
            </div>

            <div className="divider my-0"></div>

         
            <ul className="space-y-1 font-medium">
            
              {user?.role === 'user' && (
                <>
                  <li>
                    <NavLink to="/dashboard/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
                      <User size={18} /> My Profile
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/dashboard/my-deliveries" className={({ isActive }) => (isActive ? 'active' : '')}>
                      <Truck size={18} /> My Deliveries
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/dashboard/wishlist" className={({ isActive }) => (isActive ? 'active' : '')}>
                      <Heart size={18} /> My Wishlist
                    </NavLink>
                  </li>
                </>
              )}

      
              {user?.role === 'librarian' && (
                <>
                  <li>
                    <NavLink to="/dashboard/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
                      <User size={18} /> Profile
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/dashboard/add-book" className={({ isActive }) => (isActive ? 'active' : '')}>
                      <PlusCircle size={18} /> Add New Book
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/dashboard/my-books" className={({ isActive }) => (isActive ? 'active' : '')}>
                      <Book size={18} /> My Added Books
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/dashboard/manage-deliveries" className={({ isActive }) => (isActive ? 'active' : '')}>
                      <Truck size={18} /> Delivery Requests
                    </NavLink>
                  </li>
                </>
              )}

              {user?.role === 'admin' && (
                <>
                  <li>
                    <NavLink to="/dashboard/admin-overview" className={({ isActive }) => (isActive ? 'active' : '')}>
                      <BarChart3 size={18} /> Admin Overview
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/dashboard/manage-users" className={({ isActive }) => (isActive ? 'active' : '')}>
                      <Users size={18} /> Manage Users
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/dashboard/manage-deliveries" className={({ isActive }) => (isActive ? 'active' : '')}>
                      <Truck size={18} /> All Deliveries
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>

       
          <div className="space-y-2 pt-4 border-t border-base-200">
            <Link to="/" className="btn btn-ghost btn-sm w-full justify-start gap-2">
              <Home size={18} /> Main Home
            </Link>
            <button onClick={handleLogout} className="btn btn-error btn-outline btn-sm w-full justify-start gap-2">
              <LogOut size={18} /> Sign Out
            </button>
          </div>

        </aside>
      </div>
    </div>
  );
}