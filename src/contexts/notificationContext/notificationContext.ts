import { createContext } from "react";

export type NotificationContextType = {count:number}| null;

export const NotificationContext = createContext<NotificationContextType | null>(null);
