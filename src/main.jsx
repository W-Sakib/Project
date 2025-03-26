import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import SignInPage from "./auth/Sign-in/SignIn";

import Dashboard from "./dashboard/Dashboard";
import { ClerkProvider } from "@clerk/clerk-react";
import Home from "./home/Home";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const router = createBrowserRouter([
  {
    element: <App />,
    children: [],
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/auth/Sign-in",
    element: <SignInPage />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <RouterProvider router={router} />
    </ClerkProvider>
  </StrictMode>
);
