import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../pages/Home";
import BrowseBooks from "../pages/BrowseBooks";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminOverview from "../pages/dashboard/AdminOverview";
import PrivateRoute from "./PrivateRoute";
import LibrarianRoute from "./LibrarianRoute";
import AdminRoute from "./AdminRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/books", element: <BrowseBooks /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { path: "/dashboard", element: <Navigate to="/dashboard/profile" replace /> },
      { path: "profile", element: <div className="text-2xl font-bold">User Profile Page</div> },
      { path: "my-deliveries", element: <div className="text-2xl font-bold">My Orders / Deliveries</div> },
      { path: "wishlist", element: <div className="text-2xl font-bold">My Wishlist Page</div> },

      // Librarian Routes
      {
        path: "add-book",
        element: (
          <LibrarianRoute>
            <div className="text-2xl font-bold">Add Book Page</div>
          </LibrarianRoute>
        ),
      },
      {
        path: "my-books",
        element: (
          <LibrarianRoute>
            <div className="text-2xl font-bold">My Books List Page</div>
          </LibrarianRoute>
        ),
      },
      {
        path: "manage-deliveries",
        element: (
          <LibrarianRoute>
            <div className="text-2xl font-bold">Manage Deliveries Page</div>
          </LibrarianRoute>
        ),
      },

      // Admin Routes
      {
        path: "admin-overview",
        element: (
          <AdminRoute>
            <AdminOverview />
          </AdminRoute>
        ),
      },
      {
        path: "manage-users",
        element: (
          <AdminRoute>
            <div className="text-2xl font-bold">Manage Users Page</div>
          </AdminRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <div className="text-center py-20 text-4xl font-bold text-error">404 - Page Not Found</div>,
  }
]);