import { createContext } from "react";

interface ActiveTabType {
  activeTab: 'all' | 'following',
  setActiveTab: (activeTab: 'all' | 'following') => void
}

export const ActiveTabContext = createContext<ActiveTabType>({
  activeTab: "all",
  setActiveTab: ()=>{}
})