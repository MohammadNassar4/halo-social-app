import { createContext } from "react";

// export type DialogState =
//   | { type: "createPost" }
//   | {
//       type: "updatePost";
//       postId: string;
//       initialBody: string;
//       initialImage?: string;
//     }
//   | { type: "createComment"; postId: string }
//   | {
//       type: "updateComment";
//       postId: string;
//       commentId: string;
//       initialBody: string;
//       initialImage?: string;
//     };

interface DialogContextType {
  dialog: boolean;
  openDialog: () => void;
  closeDialog: () => void;
}

export const DialogContext = createContext<DialogContextType | null>(null);
