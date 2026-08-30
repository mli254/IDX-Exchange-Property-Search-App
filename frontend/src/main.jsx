import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ListingsPage from "./pages/ListingsPage.jsx";
import NotFound from "./pages/NotFound.jsx";
import PropertyDetailPage from "./pages/PropertyDetailPage.jsx";
import "./main.css";

const router = createBrowserRouter([
  { path: "/", element: <ListingsPage /> },
  { path: "*", element: <NotFound /> },
  { path: "/property/:id", element: <PropertyDetailPage /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
      <RouterProvider router={router} />
  </StrictMode>,
);