import React from "react";
import { ShareDialogContext, type ShareDialogData } from "./shareDialogContext";

export function ShareDialogContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ShareDialog, setShareDialog] = React.useState<ShareDialogData | null>(null);

  return (
    <ShareDialogContext.Provider
      value={{
        ShareDialog,
        openShareDialog: setShareDialog,
        closeShareDialog: () => setShareDialog(null),
      }}
    >
      {children}
    </ShareDialogContext.Provider>
  );
}
