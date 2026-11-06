import { useContext } from "react";
import { NotificationContext } from "./notificationContext";

// Custom hook for safe consumption
export const useNotificationCount = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotificationCount must be used within a NotificationContextProvider");
  }
  return context;
};
