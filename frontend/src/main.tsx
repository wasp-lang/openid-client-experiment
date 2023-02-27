import React from "react";
import ReactDOM from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App";
import AuthCallback from "./AuthCallback";
import "./index.css";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />
    },
    {
        path: "/auth/:provider/callback",
        element: <AuthCallback />
    }
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <RouterProvider router={router} />
);
