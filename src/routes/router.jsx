import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { 
        path: "/", 
        element: <div className="text-center py-20 text-3xl font-bold">Home Page Content Placeholder</div> 
      },
      { 
        path: "/books", 
        element: <div className="text-center py-20 text-3xl font-bold">Browse Books Page Placeholder</div> 
      },
      { 
        path: "/login", 
        element: <div className="text-center py-20 text-3xl font-bold">Login Page Placeholder</div> 
      },
      { 
        path: "/register", 
        element: <div className="text-center py-20 text-3xl font-bold">Register Page Placeholder</div> 
      },
    ],
  },
  {
    path: "*",
    element: <div className="text-center py-20 text-4xl font-bold text-error">404 - Page Not Found</div>,
  }
]);