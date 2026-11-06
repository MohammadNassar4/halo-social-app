import { useContext } from "react";
import { AuthContext } from "./AuthContext";

// Custom hook for safe consumption
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
