import axios from "axios";
import type { CommentType } from "../types";
import { TimeAgo } from "./TimeAgo";
import { useAuth } from "../contexts/authContext/useAuth";
import { toast } from "react-toastify";
import { useTheme } from "../theme/themeContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FaChevronDown,
  FaChevronUp,
  FaRegThumbsUp,
  FaThumbsUp,
  FaXmark,
} from "react-icons/fa6";
import { ImSpinner8 } from "react-icons/im";
import { useRef, useState, type ChangeEvent } from "react";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TbPhoto } from "react-icons/tb";
import { Link } from "react-router";

export default function CommentCard({
  comment,
  postId,
}: {
  comment: CommentType;
  postId: string | undefined;
}) {
  const { token, userData } = useAuth();
  const { resolvedTheme } = useTheme();
  const queryClient = useQueryClient();
  const [showReplies, setShowReplies] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [uploadedImgEdit, setUploadedImgEdit] = useState<string | null>(null);
  const [contentEdit, setContentEdit] = useState<string>("");
  const [imgEdit, setImgEdit] = useState<null | File>(null);
  const inputRefEdit = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [uploadedImg, setUploadedImg] = useState<string | null>(null);
  const [content, setContent] = useState<string>("");
  const [img, setImg] = useState<null | File>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [commentToEdit, setcommentToEdit] = useState<string>("");


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

  const handleChangeEdit = (e: ChangeEvent<HTMLInputElement>) => {
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
    if (uploadedImgEdit) URL.revokeObjectURL(uploadedImgEdit); // free the old preview
    setImgEdit(selected);
    setUploadedImgEdit(URL.createObjectURL(selected));
  };
  
  function handleCloseImgEdit() {
    if (uploadedImgEdit) URL.revokeObjectURL(uploadedImgEdit);
    setImgEdit(null);
    setUploadedImgEdit(null);
    if (inputRefEdit.current) inputRefEdit.current.value = "";
  }

  async function likeComment(commentId: string) {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/posts/${comment.post}/comments/${commentId}/like`,
        null,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.data.success) throw new Error("Failed to like comment!");
      queryClient.invalidateQueries({
        queryKey: ["getPostComments", comment.post],
      });
      queryClient.invalidateQueries({
        queryKey: ["getPostDetails", comment.post],
      });
      queryClient.invalidateQueries({
        queryKey: ["getCommentReplies", comment._id],
      });
    } catch (e) {
      toast.error("Failed to like comment!", {
        position: "top-right",
        draggable: true,
        theme: resolvedTheme,
      });
      console.error(e);
    }
  }

  function deleteComment(commentId: string) {
    return axios.delete(
      `${import.meta.env.VITE_API_BASE_URL}/posts/${postId}/comments/${commentId}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
  }

  const { mutate: deleteCommentMutate } =
    useMutation({
      mutationKey:["deleteComment", comment._id],
      mutationFn: deleteComment,
      onSuccess: () => {
        toast.success("Comment deleted successfully", {
          position: "top-right",
          draggable: true,
          theme: resolvedTheme,
        });
        queryClient.invalidateQueries({
          queryKey: ["getPostComments", postId],
        });
        queryClient.invalidateQueries({
          queryKey: ["getCommentReplies", comment._id],
        });
        queryClient.invalidateQueries({
          queryKey: ["getPostDetails", postId],
        });
      },
      onError: () => {
        toast.error("Failed to delete comment!", {
          position: "top-right",
          draggable: true,
          theme: resolvedTheme,
        });
      },
    });

  function getCommentReplies(commentId: string): Promise<ReplyType[]> {
    return axios
      .get(
        `${import.meta.env.VITE_API_BASE_URL}/posts/${postId}/comments/${commentId}/replies?page=1&limit=10`,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((res) => {
        return res.data.data.replies;
      });
    // .catch((error) => {
    //   console.error(error);
    //   toast.error("Failed to fetch comment replies!", {
    //     position: "top-right",
    //     draggable: true,
    //     theme: resolvedTheme,
    //   });
    // });
  }

  const { data: commentReplies, isLoading: repliesLoading } = useQuery({
    queryKey: ["getCommentReplies", comment._id],
    queryFn: () => getCommentReplies(comment._id),
    enabled: showReplies,
  });

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
  
  function createReply(commentId: string) {
    return axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/posts/${postId}/comments/${commentId}/replies`,
      prepareData(),
      { headers: { Authorization: `Bearer ${token}` } },
    );
  }

  const { mutate: createReplyMutate, isPending: createReplyPending } = useMutation({
    mutationFn: createReply,
    onSuccess: () => {
      toast.success("Reply created successfully", {
        position: "top-right",
        draggable: true,
        theme: resolvedTheme,
      });
      queryClient.invalidateQueries({ queryKey: ["getPostComments", postId] });
      queryClient.invalidateQueries({ queryKey: ["getCommentReplies", comment._id] });
      handleCloseImg();
      setContent("");
      setIsOpen(false);
    },
    onError: () => {
      toast.error("Failed to create reply!", {
        position: "top-right",
        draggable: true,
        theme: resolvedTheme,
      });
    },
  })

  function prepareDataEdit() {
    const formData = new FormData();
    if (imgEdit) formData.append("image", imgEdit);
    if (contentEdit && contentEdit !== null) formData.append("content", contentEdit.trim());
    if (!imgEdit && !contentEdit.trim()) {
      toast.error("Post must contain text or image", {
        position: "top-right",
        draggable: true,
        theme: resolvedTheme,
      });
      return;
    }
    return formData;
  }

  function editComment(commentId: string) {
    return axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/posts/${postId}/comments/${commentId}`,
      prepareDataEdit(),
      { headers: { Authorization: `Bearer ${token}` } },
    );
  }
  
  const { mutate: editCommentMutate, isPending: editCommentPending } = useMutation({
    mutationFn: editComment,
    onSuccess: () => {
      toast.success("Comment updated successfully", {
        position: "top-right",
        draggable: true,
        theme: resolvedTheme,
      });
      queryClient.invalidateQueries({ queryKey: ["getPostComments", postId] });
      queryClient.invalidateQueries({ queryKey: ["getCommentReplies", comment._id] });
      handleCloseImgEdit();
      setContentEdit("");
      setIsEditOpen(false);
    },
    onError: () => {
      toast.error("Failed to update comment!", {
        position: "top-right",
        draggable: true,
        theme: resolvedTheme,
      });
    },
  })
  return (
    <>
    <div className="flex gap-3 items-start">
      <Link to={userData?._id === comment.commentCreator._id ? "/myProfile" : `/profile/${comment.commentCreator._id}`} className="size-10 rounded-full overflow-hidden shrink-0">
        <img
          src={comment.commentCreator.photo}
          alt={comment.commentCreator.name}
          className="w-full h-full object-cover"
        />
      </Link>

      <div className="">
        <div className="bg-surface px-4 pb-4 py-2 rounded-2xl border border-border mb-1 shadow shadow-surface-2">
          <Link to={userData?._id === comment.commentCreator._id ? "/myProfile" : `/profile/${comment.commentCreator._id}`} className="font-semibold">{comment.commentCreator.name}</Link>
          <div className="whitespace-pre-wrap wrap-anywhere">{comment.content}</div>
          {comment.image && (
            <div className="max-h-80 max-w-2xs rounded-2xl mt-2 overflow-hidden">
              <img
                src={comment.image}
                className="w-full h-full object-cover"
                alt=""
              />
            </div>
          )}
        </div>

        <div className="ps-4 flex items-center gap-2 sm:gap-4 flex-wrap">
          <button
            onClick={() => likeComment(comment._id)}
            className={`${comment.likes.some((userId) => userId === userData?._id) ? "text-accent" : "text-muted hover:text-fg"} font-semibold text-sm cursor-pointer flex items-center gap-1`}
          >
            {comment.likes.some((userId) => userId === userData?._id) ? (
              <FaThumbsUp />
            ) : (
              <FaRegThumbsUp />
            )}{" "}
            {comment.likes.length > 0 && `${comment.likes.length}`}
          </button>
          <button onClick={()=> setIsOpen(true)} className="text-muted hover:text-fg font-semibold text-xs sm:text-sm cursor-pointer">
            Reply
          </button>
          {userData?._id === comment.commentCreator._id && (
            <>
              <button onClick={() => {
                setIsEditOpen(true);
                setcommentToEdit(comment._id);
              }} className="text-muted hover:text-fg font-semibold text-xs sm:text-sm cursor-pointer">
                Edit
              </button>
              <button
                onClick={() => {
                  deleteCommentMutate(comment._id);
                }}
                className="text-red-400 hover:text-red-500 font-semibold text-xs sm:text-sm cursor-pointer flex items-center gap-1"
              >
                Delete{" "}
              </button>
            </>
          )}

          <span className="font-medium ">
            <TimeAgo date={comment.createdAt} />
          </span>
        </div>

        {comment.repliesCount ? (
          <button
            onClick={() => setShowReplies((prev) => !prev)}
            className="ps-4 mt-2 text-muted flex items-center gap-1 text-sm hover:text-fg cursor-pointer"
          >
            {showReplies ? (
              <>
                <FaChevronUp />
                Hide {comment.repliesCount === 1 ? "reply" : "replies"}
              </>
            ) : (
              <>
                <FaChevronDown />
                Show {comment.repliesCount}{" "}
                {comment.repliesCount === 1 ? "reply" : "replies"}
              </>
            )}
          </button>
        ) : null}

        {/* Replies */}
        {showReplies && (
          <div className="mt-4 flex flex-col gap-4">
            {repliesLoading && <ImSpinner8 className="animate-spin" />}
            
            {commentReplies?.map((reply) => (
              <div key={reply._id} className="flex gap-3 items-start">
                <Link to={userData?._id === comment.commentCreator._id ? "/myProfile" : `/profile/${comment.commentCreator._id}`} className="size-8 rounded-full overflow-hidden shrink-0">
                  <img
                    src={reply.commentCreator.photo}
                    alt={reply.commentCreator.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                <div className="grow">
                  <div className="bg-surface px-4 pb-4 py-2 rounded-2xl border border-border mb-1 shadow shadow-surface-2">
                    <Link to={userData?._id === comment.commentCreator._id ? "/myProfile" : `/profile/${comment.commentCreator._id}`} className="font-semibold">{reply.commentCreator.name}</Link>
                    <div className="whitespace-pre-wrap wrap-anywhere">{reply?.content}</div>
                    {reply?.image && (
                      <div className="max-h-80 max-w-2xs rounded-2xl mt-2 overflow-hidden">
                        <img
                          src={reply?.image}
                          className="w-full h-full object-cover"
                          alt=""
                        />
                      </div>
                    )}
                  </div>

                  <div className="ps-4 flex items-center gap-2 sm:gap-4 flex-wrap">
                    <button
                      onClick={() => likeComment(reply._id)}
                      className={`${reply.likes.some((userId) => userId === userData?._id) ? "text-accent" : "text-muted hover:text-fg"} font-semibold text-sm cursor-pointer flex items-center gap-1`}
                    >
                      {reply.likes.some((userId) => userId === userData?._id) ? (
                        <FaThumbsUp />
                      ) : (
                        <FaRegThumbsUp />
                      )}{" "}
                      {reply.likes.length > 0 && `${reply.likes.length}`}
                    </button>
                    <button onClick={()=> setIsOpen(true)} className="text-muted hover:text-fg font-semibold text-xs sm:text-sm cursor-pointer">
                      Reply
                    </button>
                    {userData?._id === reply.commentCreator._id && (
                      <>
                        <button onClick={() => {
                          setIsEditOpen(true);
                          setcommentToEdit(reply._id);
                        }} className="text-muted hover:text-fg font-semibold text-xs sm:text-sm cursor-pointer">
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            deleteCommentMutate(reply._id);
                          }}
                          className="text-red-400 hover:text-red-500 font-semibold text-xs sm:text-sm cursor-pointer flex items-center gap-1"
                        >
                          Delete{" "}
                        </button>
                      </>
                    )}
          
                    <span className="font-medium">
                      <TimeAgo date={reply.createdAt} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>


    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-sm md:max-w-lg bg-surface border border-border ring-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createReplyMutate(comment._id);
          }}
        >
          <DialogHeader className="mb-4">
            <DialogTitle className="text-fg font-bold text-2xl">
              Create Reply
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
              Reply {createReplyPending && <ImSpinner8 className="animate-spin" />}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>


    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
      <DialogContent className="sm:max-w-sm md:max-w-lg bg-surface border border-border ring-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            editCommentMutate(commentToEdit);
          }}
        >
          <DialogHeader className="mb-4">
            <DialogTitle className="text-fg font-bold text-2xl">
              Edit Comment
            </DialogTitle>
          </DialogHeader>
          <div className="mb-4">
            <textarea
              className="w-full bg-bg border border-border rounded-2xl px-4 py-3.5 resize-none outline-0 focus-visible:ring-1 focus-visible:ring-accent transition-all duration-200"
              rows={5}
              placeholder={`What's on your mind, ${userData?.name}`}
              value={contentEdit}
              onChange={(e) => setContentEdit(e.currentTarget.value)}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="photo-comment-edit"
              className="text-muted flex gap-2 font-medium cursor-pointer hover:text-accent transition-colors duration-200 border border-dashed border-muted px-4 py-2 rounded-lg hover:border-accent"
            >
              <span>
                <TbPhoto className="text-2xl" />
              </span>{" "}
              Add a photo
            </label>
            <input
              ref={inputRefEdit}
              type="file"
              accept="image/*"
              onChange={handleChangeEdit}
              multiple={false}
              className="hidden"
              id="photo-comment-edit"
            />
          </div>

          {uploadedImgEdit && (
            <div className="relative size-25 overflow-hidden rounded-xl">
              <button
                type="button"
                onClick={handleCloseImgEdit}
                className="absolute top-2 right-2 cursor-pointer"
              >
                <FaXmark className="text-red-600" />
              </button>
              <img
                src={uploadedImgEdit}
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
                    handleCloseImgEdit();
                    setContentEdit("");
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
              Edit {editCommentPending && <ImSpinner8 className="animate-spin" />}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
}

export interface ReplyType {
  _id: string;
  content: string;
  commentCreator: CommentCreator;
  post: string;
  parentComment: string;
  likes: string[];
  createdAt: string;
  likesCount: number;
  isReply: boolean;
  id: string;
  image?: string;
}

export interface CommentCreator {
  _id: string;
  name: string;
  username: string;
  photo: string;
  followersCount: number;
  followingCount: number;
  bookmarksCount: number;
  id: string;
}
