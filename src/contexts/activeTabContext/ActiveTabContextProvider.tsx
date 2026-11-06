import React from "react";
import { ActiveTabContext } from "./ActiveTabContext";

export function ActiveTabContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = React.useState<"all" | "following">("all");

  return (
    <ActiveTabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </ActiveTabContext.Provider>
  );
}
