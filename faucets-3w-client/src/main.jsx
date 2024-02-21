import React from "react";
import ReactDOM from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home/Home";
import MainLayout from "./layouts/MainLayout/MainLayout";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import AuthProvider from "./Provider/AuthProvider";
import { Toaster } from "react-hot-toast";
import Admin from "./pages/Admin/Admin";
import PrivateRoutes from "./routes/PrivateRoutes/PrivateRoutes";
import AuthPrivateRoutes from "./routes/AuthPrivateRoutes/AuthPrivateRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children: [
      {
        index: true,
        element: <Home></Home>,
      },
      {
        path: "register",
        element: (
          <AuthPrivateRoutes>
            <Register></Register>
          </AuthPrivateRoutes>
        ),
      },
      {
        path: "login",
        element: (
          <AuthPrivateRoutes>
            <Login></Login>
          </AuthPrivateRoutes>
        ),
      },
      {
        path: "admin",
        element: (
          <PrivateRoutes>
            <Admin></Admin>
          </PrivateRoutes>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      {" "}
      <Toaster></Toaster>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
