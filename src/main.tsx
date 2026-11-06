import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Home from "./app/Home.tsx";
import { createBrowserRouter, Navigate } from "react-router";
import { RouterProvider } from "react-router/dom";
import { ThemeProvider } from "./theme/ThemeProvider.tsx";
import RootLayout from "./app/RootLayout.tsx";
import Login from "./app/Login.tsx";
import Register from "./app/Register.tsx";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContextProvider } from "./contexts/authContext/AuthContextProvider.tsx";
import { GuestRoute, ProtectedRoute } from "./myComponents/ProtectRoutes.tsx";
import PostDetails from "./app/PostDetails.tsx";
import { ActiveTabContextProvider } from "./contexts/activeTabContext/ActiveTabContextProvider.tsx";
import { DialogContextProvider } from "./contexts/dialogContext/dialogContextProvider.tsx";
import Dialog from "./myComponents/Dialog.tsx";
import ShareDialog from "./myComponents/ShareDialog.tsx";
import { ShareDialogContextProvider } from "./contexts/shareDialogContextshareDialogContext/ShareDialogContextProvider.tsx";
import NotFound from "./app/NotFound.tsx";
import MyProfile from "./app/MyProfile.tsx";
import UserProfile from "./app/UserProfile.tsx";
import Saved from "./app/Saved.tsx";
import Notification from "./app/Notification.tsx";
import { NotificationContextProvider } from "./contexts/notificationContext/notificationContextProvider.tsx";
import ScrollToTop from "./myComponents/ScrollToTop.tsx";
import Settings from "./app/Settings.tsx";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <RootLayout />,
        children: [
          { index: true, element: <Navigate to="/home" replace/> },
          { path: "/home", element: <Home /> },
          { path: "/myProfile", element: <MyProfile /> },
          { path: "/profile/:userId", element: <UserProfile /> },
          { path: "/post/:postId", element: <PostDetails /> },
          { path: "/saved", element: <Saved /> },
          { path: "/notifications", element: <Notification /> },
          { path: "/settings", element: <Settings /> },

          { path: "*", element: <NotFound /> }
        ],
      },
    ],
  },
  {
    element: <GuestRoute />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <ThemeProvider>
          <ActiveTabContextProvider>
            <DialogContextProvider>
              <ShareDialogContextProvider>
                <NotificationContextProvider>
                  <RouterProvider router={router} />
                  <ToastContainer pauseOnFocusLoss={false} />
                  <Dialog />
                  <ShareDialog />
                  <ScrollToTop/>
                </NotificationContextProvider>
              </ShareDialogContextProvider>
            </DialogContextProvider>
          </ActiveTabContextProvider>
        </ThemeProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  </StrictMode>,
);
