import { useAuth } from "@/contexts/authContext/useAuth";
import { useShareDialog } from "@/contexts/shareDialogContextshareDialogContext/useShareDialog";
import { useTheme } from "@/theme/themeContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { FaXmark } from "react-icons/fa6";
import { ImSpinner8 } from "react-icons/im";
import { toast } from "react-toastify";

export default function ShareDialog() {
  const { ShareDialog, closeShareDialog } = useShareDialog();
  const { resolvedTheme } = useTheme();
  const { token } = useAuth();
  const [body, setBody] = useState("");
  const queryClient = useQueryClient();

  const postId: string = ShareDialog?.postId ? ShareDialog?.postId : "";

  function sharePost(postId: string) {
    return axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/posts/${postId}/share`,
      { body: body },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  const { mutate, isPending } = useMutation({
    mutationFn: sharePost,
    onSuccess: () => {
      toast.success("Post shared successfully", {
        position: "top-right",
        draggable: true,
        theme: resolvedTheme,
      });
      queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
      queryClient.invalidateQueries({ queryKey: ["getFollowingPosts"] });
      closeShareDialog();
      setBody("");
    },
    onError: () => {
      toast.error("Couldn't share post", {
        position: "top-right",
        draggable: true,
        theme: resolvedTheme,
      });
    },
  });

  return (
    <>
      <div
        hidden={ShareDialog === null}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            closeShareDialog();
            setBody("");
          }
        }}
        className="fixed top-0 bottom-0 right-0 left-0 bg-bg/30 backdrop-blur-md z-50 flex justify-center items-center p-4 md:p-6 overflow-hidden"
      >
        <div className="p-5 border border-border rounded-2xl bg-surface w-140 max-w-140 flex flex-col gap-4.5">
          <div className="flex justify-between items-center">
            <div className="text-xl md:text-2xl font-heading font-bold">
              Share post
            </div>
            <button
              onClick={() => {
                closeShareDialog();
                setBody("");
              }}
              className="text-muted hover:text-fg cursor-pointer"
            >
              <FaXmark />
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (body === '') {
                toast.error("Post must contain body text", {
                  position: "top-right",
                  draggable: true,
                  theme: resolvedTheme,
                });
              } else {
              mutate(postId);
              }
            }}
            className="flex flex-col gap-4.5"
          >
            <div>
              <textarea
                className="w-full bg-bg border border-border rounded-2xl px-4 py-3.5 resize-none outline-0 focus-visible:ring-1 focus-visible:ring-accent transition-all duration-200"
                placeholder="Add your comment"
                rows={3}
                value={body}
                onChange={(e) => setBody(e.currentTarget.value)}
              />
            </div>

            {ShareDialog?.post && <div className="border border-border rounded-2xl overflow-hidden p-3 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="size-10 rounded-full overflow-hidden"><img src={ShareDialog.post.user.photo} alt="" className="w-full h-full object-cover" /></div>
                <div className="font-semibold">{ShareDialog.post.user.name }</div>
              </div>
              {ShareDialog.post.body && <div className="ps-2">{ ShareDialog.post.body}</div>}
              {ShareDialog.post.image && <div className="w-full max-h-72 rounded-2xl overflow-hidden"><img src={ ShareDialog.post.image} alt="" className="w-full h-full object-cover" /></div>}
            </div>
            }

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  closeShareDialog();
                  setBody("");
                }}
                type="reset"
                className="button-outline font-semibold w-fit"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-1 button-primary font-semibold w-fit hover:scale-100"
              >
                Share
                {isPending && <ImSpinner8 className="animate-spin" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
