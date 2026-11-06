import { useContext } from "react";
import { ShareDialogContext } from "./shareDialogContext";

// Custom hook for safe consumption
export const useShareDialog = () => {
  const context = useContext(ShareDialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
};
