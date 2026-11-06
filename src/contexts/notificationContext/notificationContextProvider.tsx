import type React from "react";
import { NotificationContext } from "./notificationContext";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../authContext/useAuth";

export function NotificationContextProvider({ children }: {children: React.ReactNode}) {
  const [count, setCount] = useState<number>(0);
  const { token } = useAuth();

  function getUnreadCount(): Promise<number> {
    return axios.get(`${import.meta.env.VITE_API_BASE_URL}/notifications/unread-count`, { headers: { Authorization: `Bearer ${token}` } }).then(res => {
      setCount(res.data.data.unreadCount);
      return res.data.data.unreadCount
    })
  }
  
  const { error, isError } = useQuery({
    queryKey: ['getUnreadCount'],
    queryFn: getUnreadCount,
    refetchInterval: (1000 * 60) * 5,
    enabled: token ? true : false,
  })
  if (isError) console.error(error);
  return (
    <NotificationContext.Provider value={{count}}>
      {children}
    </NotificationContext.Provider>
  )
}