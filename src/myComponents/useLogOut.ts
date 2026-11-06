import { useAuth } from "@/contexts/authContext/useAuth";
import { useNavigate } from "react-router";

export default function useLogOut() {
  const { setToken, setUserData } = useAuth();
  const navigate = useNavigate();

  function logOut() {
    setToken(null);
    setUserData(null);
    localStorage.removeItem("token");
    navigate("/login");
  }

  return logOut;
}
