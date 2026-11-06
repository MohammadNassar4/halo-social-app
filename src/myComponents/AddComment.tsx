import { FaPaperPlane, FaXmark } from "react-icons/fa6";
import { useAuth } from "../contexts/authContext/useAuth";
import { TbPhoto } from "react-icons/tb";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImSpinner8 } from "react-icons/im";
import { useRef, useState, type ChangeEvent } from "react";
import { useTheme } from "@/theme/themeContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function AddComment({ postId }: { postId: string | undefined }) {
  const { userData, token } = useAuth();
  const { resolvedTheme } = useTheme();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [uploadedImg, setUploadedImg] = useState<string | null>(null);
  const [content, setContent] = useState<string>("");
  const [img, setImg] = useState<null | File>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      toast.error("Please choose an image", {
        position: "top-right",
        draggable: true,
        theme: resolvedTheme,
      });
      return;
    }
    if (uploadedImg) URL.revokeObjectURL(uploadedImg); // free the old preview
    setImg(selected);
    setUploadedImg(URL.createObjectURL(selected));
  };

  function handleCloseImg() {
    if (uploadedImg) URL.revokeObjectURL(uploadedImg);
    setImg(null);
    setUploadedImg(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function prepareData() {
    const formData = new FormData();
    if (img) formData.append("image", img);
    if (content && content !== null) formData.append("content", content.trim());
    if (!img && !content.trim()) {
      toast.error("Post must contain text or image", {
        position: "top-right",
        draggable: true,
        theme: resolvedTheme,
      });
      return;
    }
    return formData;
  }

  function createComment(postId: string) {
    return axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/posts/${postId}/comments`,
      prepareData(),
      { headers: { Authorization: `Bearer ${token}` } },
    );
  }

  const { mutate: createCommentMutate, isPending } = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      toast.success("Comment created successfully", {
        position: "top-right",
        draggable: true,
        theme: resolvedTheme,
      });
      queryClient.invalidateQueries({ queryKey: ["getPostComments", postId] });
      queryClient.invalidateQueries({
        queryKey: ["getPostDetails", postId],
      });
      handleCloseImg();
      setContent("");
      setIsOpen(false);
    },
    onError: () => {
      toast.error("Failed to create comment!", {
        position: "top-right",
        draggable: true,
        theme: resolvedTheme,
      });
    },
  });

  return (
    <>
      <div className="">
        <div className="flex gap-3 items-center">
          <div className="size-10 rounded-full overflow-hidden shrink-0">
            <img
              src={userData?.photo}
              alt={userData?.name}
              className="w-full object-cover h-full"
            />
          </div>
          <div className="grow shrink min-w-10">
            <input
              onClick={() => setIsOpen(true)}
              type="text"
              className="w-full border border-border h-12 rounded-full px-4 py-2 outline-0 focus-visible:ring-1 focus-visible:ring-accent transition-all duration-200"
              placeholder="Write a comment"
            />
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="button-primary p-0 size-10 flex justify-center items-center shrink-0"
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-sm md:max-w-lg bg-surface border border-border ring-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createCommentMutate(postId || "");
            }}
          >
            <DialogHeader className="mb-4">
              <DialogTitle className="text-fg font-bold text-2xl">
                Create comment
              </DialogTitle>
            </DialogHeader>
            <div className="mb-4">
              <textarea
                className="w-full bg-bg border border-border rounded-2xl px-4 py-3.5 resize-none outline-0 focus-visible:ring-1 focus-visible:ring-accent transition-all duration-200"
                rows={5}
                placeholder={`What's on your mind, ${userData?.name}`}
                value={content}
                onChange={(e) => setContent(e.currentTarget.value)}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="photo-comment"
                className="text-muted flex gap-2 font-medium cursor-pointer hover:text-accent transition-colors duration-200 border border-dashed border-muted px-4 py-2 rounded-lg hover:border-accent"
              >
                <span>
                  <TbPhoto className="text-2xl" />
                </span>{" "}
                Add a photo
              </label>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleChange}
                multiple={false}
                className="hidden"
                id="photo-comment"
              />
            </div>

            {uploadedImg && (
              <div className="relative size-25 overflow-hidden rounded-xl">
                <button
                  type="button"
                  onClick={handleCloseImg}
                  className="absolute top-2 right-2 cursor-pointer"
                >
                  <FaXmark className="text-red-600" />
                </button>
                <img
                  src={uploadedImg}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <DialogFooter className="bg-surface border-0">
              <DialogClose
                render={
                  <button
                    type="reset"
                    onClick={() => {
                      handleCloseImg();
                      setContent("");
                    }}
                    className="button-outline"
                  >
                    Cancel
                  </button>
                }
              />
              <button
                type="submit"
                className="button-primary sm:w-fit flex items-center gap-1 justify-center hover:scale-100"
              >
                Comment {isPending && <ImSpinner8 className="animate-spin" />}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
