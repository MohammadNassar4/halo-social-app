import { SlOptions } from "react-icons/sl";
import {
  FaBookmark,
  FaRegBookmark,
  FaHeart,
  FaRegHeart,
  FaXmark,
} from "react-icons/fa6";
import { LuMessageSquare, LuShare } from "react-icons/lu";
import type { PostType } from "../types";
import { TimeAgo } from "./TimeAgo";
import { Link, useNavigate, useParams } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../contexts/authContext/useAuth";
import { toast } from "react-toastify";
import { useTheme } from "../theme/themeContext";
import { ImSpinner8 } from "react-icons/im";
import { PencilIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useShareDialog } from "@/contexts/shareDialogContextshareDialogContext/useShareDialog";
import { useRef, useState, type ChangeEvent } from "react";
import { TbPhoto } from "react-icons/tb";
import FollowBtn from "./FollowBtn";

export default function PostCard({ post }: { post: PostType }) {
  const queryClient = useQueryClient();
  const { resolvedTheme } = useTheme();
  const navigate = useNavigate();
  const { token, userData } = useAuth();
  const { postId: postid } = useParams();
  const { openShareDialog } = useShareDialog();
  const [isOpen, setIsOpen] = useState(false);
  const [uploadedImg, setUploadedImg] = useState<string | null>(null);
  const [body, setBody] = useState<string>("");
  const [img, setImg] = useState<null | File>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLikePending, setIsLikePending] = useState<boolean>(false);

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

  async function likePost(postId: string) {
    try {
      setIsLikePending(true);
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/posts/${postId}/like`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.data.success) throw new Error("Failed to like post!");

      if (postid) {
        queryClient.invalidateQueries({ queryKey: ["getPostDetails"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
        queryClient.invalidateQueries({ queryKey: ["getFollowingPosts"] });
        queryClient.invalidateQueries({ queryKey: ["getMyPosts"] });
        queryClient.invalidateQueries({ queryKey: ["getUserPosts"] });
      }
      queryClient.invalidateQueries({ queryKey: ["getPostLikes"] });
    } catch (e) {
      console.error("Failed to like post: ", e);
      toast.error("Failed to like post, Please try again later");
    } finally {
      setIsLikePending(false);
    }
  }

  function deletePost(postId: string) {
    return axios.delete(
      `${import.meta.env.VITE_API_BASE_URL}/posts/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  function savePost(postId: string) {
    return axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/posts/${postId}/bookmark`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  const { mutate: deletePostMutate, isPending: deletePending } = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      toast.success("Post deleted successfully", {
        position: "top-right",
        draggable: true,
        theme: resolvedTheme,
      });
      queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
      queryClient.invalidateQueries({ queryKey: ["getFollowingPosts"] });
      if (postid) navigate("/home");
    },
    onError: () => {
      toast.error("Failed to delete post!", {
        position: "top-right",
        draggable: true,
        theme: resolvedTheme,
      });
    },
  });

  const { mutate: savePostMutate, isPending: savePostPending } = useMutation({
    mutationFn: savePost,
    onSuccess: (res) => {
      if (res?.data.data.bookmarked) {
        toast.success("Post saved successfully", {
          position: "top-right",
          draggable: true,
          theme: resolvedTheme,
        });
      } else {
        toast.success("Post unsaved successfully", {
          position: "top-right",
          draggable: true,
          theme: resolvedTheme,
        });
      }
      queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
      queryClient.invalidateQueries({ queryKey: ["getFollowingPosts"] });
      queryClient.invalidateQueries({ queryKey: ["getUserData"] });
    },
    onError: () => {
      toast.error("Failed to save post!", {
        position: "top-right",
        draggable: true,
        theme: resolvedTheme,
      });
    },
  });

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
      return;
    }
    return formData;
  }

  function editPost(postId: string) {
    return axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/posts/${postId}`,
      prepareData(),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  const { mutate: editPostMutate, isPending: editPending } = useMutation({
    mutationFn: editPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
      queryClient.invalidateQueries({ queryKey: ["getFollowingPosts"] });
      queryClient.invalidateQueries({ queryKey: ["getPostDetails"] });
      toast.success("Post updated successfully", {
        position: "top-right",
        draggable: true,
        theme: resolvedTheme,
      });
      handleCloseImg();
      if (body) setBody("");
      setIsOpen(false);
    },
    onError: () => {
      toast.error("Failed to update Post", {
        position: "top-right",
        draggable: true,
        theme: resolvedTheme,
      });
    },
  });

  return (
    <>
      {post.sharedPost ? (
        <div className=" p-4 border-b border-border flex flex-col gap-4 md:bg-surface md:border md:rounded-2xl md:p-5 overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="bg-halo-gradient rounded-full p-0.5">
                <Link
                  to={userData?._id === post.user._id ? "/myProfile" : `/profile/${post.user._id}`}
                  className="size-12 rounded-full overflow-hidden flex justify-center items-center bg-surface-2"
                >
                  <img
                    src={post.user.photo}
                    alt={post.user.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </Link>
              </div>
              <div>
                <Link
                  to={userData?._id === post.user._id ? "/myProfile" : `/profile/${post.user._id}`}
                  className="text-fg text-sm sm:text-base font-semibold"
                >
                  {post.user.name}
                </Link>
                <span className="block font-medium">
                  <TimeAgo date={post.createdAt} />
                </span>
              </div>
            </div>
            {post.user._id === userData?._id ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button className="size-10 rounded-full bg-transparent hover:bg-surface-2 flex justify-center items-center cursor-pointer">
                      <SlOptions className="text-muted" />
                    </Button>
                  }
                />
                <DropdownMenuContent className="bg-surface border border-border">
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="w-full hover:bg-surface-2/60 px-2 py-2 rounded-lg cursor-pointer text-sm font-medium ">
                      <PencilIcon />
                      Edit
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      variant="destructive"
                      className="w-full text-sm text-red-500 hover:bg-red-500/10 px-2 py-2 rounded-lg font-semibold cursor-pointer"
                      onClick={() => deletePostMutate(post._id)}
                    >
                      <TrashIcon />
                      Delete{" "}
                      {deletePending && <ImSpinner8 className="animate-spin" />}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : <div><FollowBtn userId={post.user._id} /></div>}
          </div>

          <div className="font-medium whitespace-pre-wrap wrap-anywhere">
            {post.body}
          </div>

          {/* shared  post */}
          <div className="border border-border md:border-0 rounded-2xl">
            <div className="p-3 border-b border-border flex flex-col gap-4 md:bg-surface md:border md:rounded-2xl">
              <div className="flex justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-halo-gradient rounded-full p-0.5">
                    <Link
                      to={`profile/${post.sharedPost.user._id}`}
                      className="size-10 rounded-full overflow-hidden flex justify-center items-center bg-surface-2"
                    >
                      <img
                        src={post.sharedPost.user.photo}
                        alt={post.sharedPost.user.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </Link>
                  </div>
                  <div>
                    <Link
                      to={`profile/${post.sharedPost.user._id}`}
                      className="text-fg text-base font-semibold"
                    >
                      {post.sharedPost.user.name}
                    </Link>
                    <span className="block font-medium">
                      <TimeAgo date={post.sharedPost.createdAt} />
                    </span>
                  </div>
                </div>
              </div>

              <div className="font-medium whitespace-pre-wrap wrap-anywhere">
                {post.sharedPost.body}
              </div>

              {post.sharedPost.image && (
                <div className="rounded-2xl max-h-225 overflow-hidden">
                  <img src={post.sharedPost.image} alt="" className="w-full" />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center text-muted md:pt-4 md:border-t-2 md:border-border">
            <div className="flex items-center gap-1">
              {isLikePending ? (
                <ImSpinner8 className="animate-spin" />
              ) : post.likes.some((userId) => userId === userData?._id) ? (
                <button
                  onClick={() => likePost(post._id)}
                  className="text-[15px] font-semibold text-accent flex items-center gap-1 px-3 py-2 rounded-full bg-[#06b6d4]/15 cursor-pointer"
                >
                  <FaHeart className="text-lg" />{" "}
                  {post.likesCount ? post.likesCount : null}
                </button>
              ) : (
                <button
                  onClick={() => {
                    likePost(post._id);
                  }}
                  className="text-[15px] font-semibold flex items-center gap-1 px-3 py-2 rounded-full hover:bg-surface-2 cursor-pointer"
                >
                  <FaRegHeart className="text-lg" />{" "}
                  {post.likesCount ? post.likesCount : null}
                </button>
              )}
              <Link
                to={`/post/${post._id}`}
                className="text-[15px] font-semibold flex items-center gap-1 px-4 py-2 rounded-full hover:bg-surface-2 cursor-pointer"
              >
                <LuMessageSquare className="text-lg" />{" "}
                {post.commentsCount ? post.commentsCount : null}{" "}
              </Link>
              <button
                onClick={() => {
                  openShareDialog({ postId: post.sharedPost?._id, post: post.sharedPost });
                }}
                className="text-[15px] font-semibold flex items-center gap-1 px-4 py-2 rounded-full hover:bg-surface-2 cursor-pointer"
              >
                <LuShare className="text-lg" />{" "}
                <span>{post.sharesCount ? post.sharesCount : null}</span>{" "}
              </button>
            </div>

            <button
              onClick={() => savePostMutate(post._id)}
              className={`text-[15px] font-semibold flex items-center gap-1 px-4 py-2 rounded-full cursor-pointer ${userData?.bookmarks?.some((postId) => postId === post._id) ? "text-accent" : "text-muted hover:bg-surface-2"}`}
            >
              {savePostPending ? (
                <ImSpinner8 className="animate-spin" />
              ) : userData?.bookmarks?.some((postId) => postId === post._id) ? (
                <FaBookmark className="text-lg" />
              ) : (
                <FaRegBookmark className="text-lg" />
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className=" p-4 border-b border-border flex flex-col gap-4 md:bg-surface md:border md:rounded-2xl md:p-5 overflow-hidden">
          <div className="flex justify-between items-start gap-1">
            <div className="flex items-center gap-3">
              <div className="bg-halo-gradient rounded-full p-0.5">
                <Link
                  to={userData?._id === post.user._id ? "/myProfile" : `/profile/${post.user._id}`}
                  className="size-12 rounded-full overflow-hidden flex justify-center items-center bg-surface-2"
                >
                  <img
                    src={post.user.photo}
                    alt={post.user.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </Link>
              </div>
              <div>
                <Link
                  to={userData?._id === post.user._id ? "/myProfile" : `/profile/${post.user._id}`}
                  className="text-fg text-sm sm:text-base font-semibold overflow-hidden line-clamp-2"
                >
                  {post.user.name}
                </Link>
                <span className="block font-medium">
                  <TimeAgo date={post.createdAt} />
                </span>
              </div>
            </div>
            {post.user._id === userData?._id ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button className="size-10 rounded-full bg-transparent hover:bg-surface-2 flex justify-center items-center cursor-pointer">
                      <SlOptions className="text-muted" />
                    </Button>
                  }
                />
                <DropdownMenuContent className="bg-surface border border-border">
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => {
                        if (post.body) setBody(post.body);

                        setIsOpen(true);
                      }}
                      className="w-full hover:bg-surface-2/60 px-2 py-2 rounded-lg cursor-pointer text-sm font-medium "
                    >
                      <PencilIcon />
                      Edit
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      variant="destructive"
                      className="w-full text-sm text-red-500 hover:bg-red-500/10 px-2 py-2 rounded-lg font-semibold cursor-pointer"
                      onClick={() => deletePostMutate(post._id)}
                    >
                      <TrashIcon />
                      Delete{" "}
                      {deletePending && <ImSpinner8 className="animate-spin" />}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : <div><FollowBtn userId={post.user._id} /></div>}
          </div>

          <div className="font-medium whitespace-pre-wrap wrap-anywhere">
            {post.body}
          </div>

          {post.image && (
            <div className="rounded-2xl max-h-225 overflow-hidden">
              <img src={post.image} alt="" className="w-full" />
            </div>
          )}

          <div className="flex justify-between items-center text-muted md:pt-4 md:border-t-2 md:border-border">
            <div className="flex items-center gap-1">
              {isLikePending ? (
                <ImSpinner8 className="animate-spin" />
              ) : post.likes.some((userId) => userId === userData?._id) ? (
                <button
                  onClick={() => likePost(post._id)}
                  className="text-[15px] font-semibold text-accent flex items-center gap-1 px-3 py-2 rounded-full bg-[#06b6d4]/15 cursor-pointer"
                >
                  <FaHeart className="text-lg" />{" "}
                  {post.likesCount ? post.likesCount : null}
                </button>
              ) : (
                <button
                  onClick={() => {
                    likePost(post._id);
                  }}
                  className="text-[15px] font-semibold flex items-center gap-1 px-3 py-2 rounded-full hover:bg-surface-2 cursor-pointer"
                >
                  <FaRegHeart className="text-lg" />{" "}
                  {post.likesCount ? post.likesCount : null}
                </button>
              )}
              <Link
                to={`/post/${post._id}`}
                className="text-[15px] font-semibold flex items-center gap-1 px-4 py-2 rounded-full hover:bg-surface-2 cursor-pointer"
              >
                <LuMessageSquare className="text-lg" />{" "}
                {post.commentsCount ? post.commentsCount : null}{" "}
              </Link>
              <button
                onClick={() => {
                  openShareDialog({ postId: post._id, post: post });
                }}
                className="text-[15px] font-semibold flex items-center gap-1 px-4 py-2 rounded-full hover:bg-surface-2 cursor-pointer"
              >
                <LuShare className="text-lg" />{" "}
                <span>{post.sharesCount ? post.sharesCount : null}</span>{" "}
              </button>
            </div>

            <button
              onClick={() => savePostMutate(post._id)}
              className={`text-[15px] font-semibold flex items-center gap-1 px-4 py-2 rounded-full cursor-pointer ${userData?.bookmarks?.some((postId) => postId === post._id) ? "text-accent" : "text-muted hover:bg-surface-2"}`}
            >
              {savePostPending ? (
                <ImSpinner8 className="animate-spin" />
              ) : userData?.bookmarks?.some((postId) => postId === post._id) ? (
                <FaBookmark className="text-lg" />
              ) : (
                <FaRegBookmark className="text-lg" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* post edit dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-sm md:max-w-lg bg-surface border border-border ring-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              editPostMutate(post._id);
            }}
          >
            <DialogHeader className="mb-4">
              <DialogTitle className="text-fg font-bold text-2xl">
                Edit post
              </DialogTitle>
            </DialogHeader>
            <div className="mb-4">
              <textarea
                className="w-full bg-bg border border-border rounded-2xl px-4 py-3.5 resize-none outline-0 focus-visible:ring-1 focus-visible:ring-accent transition-all duration-200"
                rows={5}
                placeholder={`What's on your mind, ${userData?.name}`}
                value={body}
                onChange={(e) => setBody(e.currentTarget.value)}
              />
            </div>

            <div>
              <label
                htmlFor="photo-edit"
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
                id="photo-edit"
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
                  <button type="reset" className="button-outline">
                    Cancel
                  </button>
                }
              />
              <button
                type="submit"
                className="button-primary w-fit flex items-center gap-1 hover:scale-100"
              >
                Update {editPending && <ImSpinner8 className="animate-spin" />}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
