import { useState, type ChangeEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../contexts/authContext/useAuth";
import { FaXmark } from "react-icons/fa6";
import { TbPhoto } from "react-icons/tb";
import axios from "axios";
import { toast } from "react-toastify";
import { useTheme } from "../theme/themeContext";
import { ImSpinner8 } from "react-icons/im";
import { useDialog } from "../contexts/dialogContext/useDialog";

export default function Dialog() {
  const { resolvedTheme } = useTheme();
  const { token, userData } = useAuth();
  const { dialog, closeDialog } = useDialog();
  const [uploadedImg, setUploadedImg] = useState<string | null>(null);
  const queryClient = useQueryClient();
    const [body, setBody] = useState('');
    const [img, setImg] = useState<null | File>(null);

  function handleImgPreview(e: ChangeEvent<HTMLInputElement>) {
    const imgSrc = URL.createObjectURL(e.target.files![0]);
    setUploadedImg(imgSrc);
  }

  function handleCloseImg() {
    setUploadedImg(null);
    if (img) setImg(null);
  }

  function prepareData() {
    const formData = new FormData();
    if (img) formData.append("image", img);
    if (body && body !== null) formData.append("body", body.trim());
    if (!img && !body.trim()) {
      toast.error("Post must contain text or image", {
        position: "top-right",
        draggable: true,
        theme: resolvedTheme,
      });
    }
    return formData;
  }

  function createPost() {
    return axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/posts`,
      prepareData(),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  const { mutate: createPostMutate, isPending } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
      queryClient.invalidateQueries({ queryKey: ["getFollowingPosts"] });
      toast.success("Post Created successfully", {
        position: "top-right",
        draggable: true,
        theme: resolvedTheme,
      });
      setUploadedImg(null);
      closeDialog();
      if (img) setImg(null);
      if (body) setBody("");
    },
    onError: () => {
      toast.error("Failed to create Post", {
        position: "top-right",
        draggable: true,
        theme: resolvedTheme,
      });
    },
  });

  return (
    <>
      <div
        hidden={!dialog}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            closeDialog();
            setBody("");
            setImg(null);
          }
        }}
        className="fixed top-0 bottom-0 right-0 left-0 bg-bg/30 backdrop-blur-md z-50 flex justify-center items-center p-4 md:p-6 overflow-hidden"
      >
        <div className="p-5 border border-border rounded-2xl bg-surface w-140 max-w-140 flex flex-col gap-4.5">
          <div className="flex justify-between items-center">
            <div className="text-xl md:text-2xl font-heading font-bold">
                Create post
            </div>
            <button
              onClick={() => {
                closeDialog();
                setBody("");
                setImg(null);
                handleCloseImg();
              }}
              className="text-muted hover:text-fg cursor-pointer"
            >
              <FaXmark />
            </button>
          </div>

          <form
            className="flex flex-col gap-4.5"
            onSubmit={(e) => {
              e.preventDefault();
              createPostMutate();
            }}
          >
            <div>
              <textarea
                className="w-full bg-bg border border-border rounded-2xl px-4 py-3.5 resize-none outline-0 focus-visible:ring-1 focus-visible:ring-accent transition-all duration-200"
                rows={5}
                placeholder={`What's on your mind, ${userData?.name}`}
                value={body}
                onChange={(e) => setBody(e.currentTarget.value)}
              />
            </div>

            <div className="group border border-dashed border-muted px-4 py-2 rounded-lg hover:border-accent transition-colors duration-200">
              <label
                htmlFor="photo"
                className="text-muted flex gap-2 font-medium cursor-pointer group-hover:text-accent transition-colors duration-200"
              >
                <span>
                  <TbPhoto className="text-2xl" />
                </span>{" "}
                Add a photo
              </label>
              <input
                onChange={(e) => {
                  handleImgPreview(e);
                  setImg(e.target.files?.[0] ?? null);
                }}
                type="file"
                accept="image/*"
                multiple={false}
                className="hidden"
                id="photo"
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

            <div className="flex items-center justify-end gap-2">
              <button
                type="reset"
                onClick={() => {
                  closeDialog();
                  setUploadedImg(null);
                  setBody("");
                  setImg(null);
                }}
                className="button-outline font-semibold w-fit"
              >
                Cancel
              </button>
              <button
                disabled={isPending}
                type="submit"
                className="flex items-center gap-1 button-primary font-semibold w-fit hover:scale-100"
              >
                  Post
                {isPending && <ImSpinner8 className="animate-spin" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
