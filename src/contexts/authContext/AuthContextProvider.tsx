import React, { useState } from "react";
import { AuthContext, type UserDataType } from "./AuthContext";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/myComponents/Loading";

export function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token"),
  );
  const [userData, setUserData] = useState<UserDataType | null>(null);
  

  function getUserData() {
    return axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/users/profile-data`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUserData(response.data.data.user);
        return response.data.data.user;
      })
      .catch((error) => {
        if (!error.response.data.success && error.response.data.errors === "invalid token") {
          setToken(null);
          setUserData(null);
          localStorage.removeItem("token");
        }
        return null;
      });
  }

  const { isLoading } = useQuery({
    queryKey: ["getUserData"],
    queryFn: getUserData,
    enabled: token ? true : false,
  });

  return (
    <AuthContext.Provider value={{ token, setToken, userData, setUserData }}>
      {isLoading ? <Loading /> : children}
    </AuthContext.Provider>
  );
}
