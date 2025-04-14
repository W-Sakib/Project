import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import App from "./App.jsx";
import SignInPage from "./auth/Sign-in/SignIn";
import "./index.css";

import { ClerkProvider } from "@clerk/clerk-react";
import Dashboard from "./dashboard/Dashboard";
import EditResume from "./dashboard/resume/[resumeid]/index.jsx";
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
  {
    path:'/dashboard/resume/:resumeId/edit',
    element:<EditResume/>
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <RouterProvider router={router} />
    </ClerkProvider>
  </StrictMode>
);
