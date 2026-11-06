import type { PostType } from "@/types";
import { createContext } from "react";
export type ShareDialogData = { postId: string; post: PostType }
export interface ShareDialogType {
  ShareDialog: ShareDialogData | null;
  openShareDialog: (dialog: ShareDialogData) => void;
  closeShareDialog: () => void;
};

export const ShareDialogContext = createContext<ShareDialogType | null>(null);
