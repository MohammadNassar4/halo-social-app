import { useContext } from "react";
import { ActiveTabContext } from "./ActiveTabContext";

// Custom hook for safe consumption
export const useActiveTab = () => {
  const context = useContext(ActiveTabContext);
  if (!context) {
    throw new Error("useActiveTab must be used within a ActiveTabProvider");
  }
  return context;
};
