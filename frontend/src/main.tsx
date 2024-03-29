import React from "react";
import ReactDOM from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App";
import AuthCallback from "./AuthCallback";
import "./index.css";

import { QueryClient, QueryClientProvider } from "react-query";

export const queryClient = new QueryClient();

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
    <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
    </QueryClientProvider>
);
