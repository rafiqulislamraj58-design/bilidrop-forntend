import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import BrowseBooks from "../pages/BrowseBooks";
import BookDetails from "../pages/BookDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/books", element: <BrowseBooks /> },
      { path: "/books/:id", element: <BookDetails /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
]);