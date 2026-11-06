import React from "react";
import { DialogContext } from "./dialogContext";

export function DialogContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dialog, setDialog] = React.useState<boolean>(false);

  return (
    <DialogContext.Provider
      value={{
        dialog,
        openDialog: () => setDialog(true),
        closeDialog: () => setDialog(false),
      }}
    >
      {children}
    </DialogContext.Provider>
  );
}
