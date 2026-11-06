import axios from "axios";
import { FaArrowLeft, FaXmark } from "react-icons/fa6";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { useAuth } from "../contexts/authContext/useAuth";
import { useQuery } from "@tanstack/react-query";
import type { CommentType, PostType } from "../types";
import Spinner from "../myComponents/Spinner";
import PostCard from "../myComponents/PostCard";
import AddComment from "../myComponents/AddComment";
import CommentCard from "../myComponents/CommentCard";
import { useEffect, useState } from "react";
import type { PostLikesType } from "@/postLikesType";
import FollowBtn from "@/myComponents/FollowBtn";

export default function PostDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, userData } = useAuth();
  const { postId } = useParams();
  const [showLikes, setShowLikes] = useState(false);

  const goBack = () => {
    if (location.key === "default") {
      // No in-app history — fall back to a known route
      navigate("/home", { replace: true });
    } else {
      navigate(-1);
    }
  };

  function getPostDetails(postId: string): Promise<PostType> {
    return axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data.data.post);
  }

  function getPostComments(postId: string): Promise<CommentType[]> {
    return axios
      .get(
        `${import.meta.env.VITE_API_BASE_URL}/posts/${postId}/comments?page=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => res.data.data.comments);
  }

  function getPostLikes(postId: string): Promise<PostLikesType> {
    return axios
      .get(
        `${import.meta.env.VITE_API_BASE_URL}/posts/${postId}/likes?page=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => res.data);
  }

  const { data: postDetailsData, isLoading: postDetailsLoading } = useQuery({
    queryKey: ["getPostDetails", postId],
    queryFn: () => getPostDetails(postId!),
    enabled: !!postId,
    refetchInterval: 60000,
  });

  const { data: postCommentsData, isLoading: postCommentsLoading } = useQuery({
    queryKey: ["getPostComments", postId],
    queryFn: () => getPostComments(postId!),
    enabled: !!postId,
    refetchInterval: 60000,
  });

  const { data: postLikesData } = useQuery({
    queryKey: ["getPostLikes", postId],
    queryFn: () => getPostLikes(postId!),
    enabled: !!postId,
    refetchInterval: 60000,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col gap-5">
      <button
        onClick={goBack}
        className="flex items-center gap-2 w-fit font-semibold text-muted pt-5 hover:text-fg cursor-pointer px-4"
      >
        <FaArrowLeft /> Post
      </button>

      {postDetailsLoading && (
        <div className="h-100 flex justify-center items-center">
          <Spinner />
        </div>
      )}

      {postDetailsData && (
        <div>
          <PostCard post={postDetailsData} />
        </div>
      )}

      {postLikesData && postLikesData?.meta.pagination.total > 2 ? (
        <div
          onClick={() => setShowLikes(true)}
          className="text-muted px-4 md:px-2 text-sm cursor-pointer hover:text-fg"
        >
          Liked by{" "}
          {`${postLikesData?.data.likes
            .slice(0, 2)
            .map((user) => (user._id === userData?._id ? "You" : user.name))
            .join(", ")}`}{" "}
          and {postLikesData.data.likes.length - 2} others
        </div>
      ) : postLikesData?.meta.pagination.total === 0 ? (
        <div
          onClick={() => setShowLikes(true)}
          className="text-muted px-4 md:px-2 text-sm cursor-pointer hover:text-fg"
        >
          Be the first one to like this post
        </div>
      ) : (
        <div
          onClick={() => setShowLikes(true)}
          className="text-muted px-4 md:px-2 text-sm cursor-pointer hover:text-fg"
        >
          Liked by{" "}
          {`${postLikesData?.data.likes.map((user) => (user._id === userData?._id ? "You" : user.name)).join(" and ")}`}
        </div>
      )}

      {showLikes && (
        <div
          onClick={(e) => {
            if (e.currentTarget === e.target) {
              setShowLikes(false);
            }
          }}
          className="fixed top-0 bottom-0 right-0 left-0 bg-surface/20 backdrop-blur-sm flex justify-center items-center z-50"
        >
          <div className="bg-surface rounded-2xl border border-border overflow-x-hidden overflow-y-scroll px-4 py-0 md:p-5 md:pt-0 min-h-72 max-h-96 min-w-75 max-w-lg w-100 flex flex-col gap-5 relative">
            <header className="flex justify-between items-center sticky top-0 bg-surface py-4 border-b border-b-border">
              <div className="text-fg text-lg font-semibold">Post likes</div>
              <button
                onClick={() => setShowLikes(false)}
                className="text-muted hover:text-fg cursor-pointer"
              >
                <FaXmark />
              </button>
            </header>

            {postLikesData?.meta.pagination.total === 0 ? (
              <div className="grow flex justify-center items-center">
                <p className="text-muted">No Likes yet</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {postLikesData?.data.likes.map((user) => (
                  <div
                    key={user._id}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/profile/${user._id}`}
                        className="size-11 rounded-full overflow-hidden"
                      >
                        <img
                          src={user.photo}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      </Link>
                      <div>
                        <Link
                          to={`/profile/${user._id}`}
                          className="text-fg font-semibold block line-clamp-1"
                        >
                          {user.name}
                        </Link>
                        <Link
                          to={`/profile/${user._id}`}
                          className="text-muted text-sm block line-clamp-1"
                        >
                          @{user.username}
                        </Link>
                      </div>
                    </div>

                    {userData?._id !== user._id && <FollowBtn userId={user._id} />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="px-4 sm:px-0">
        <AddComment postId={postId} />
      </div>

      <div className="flex flex-col gap-5 px-4 sm:px-0">
        {postCommentsLoading && <Spinner />}
        {postCommentsData && postCommentsData.length !== 0 ? (
          postCommentsData.map((comment) => (
            <CommentCard
              key={comment._id}
              comment={comment}
              postId={postDetailsData?._id}
            />
          ))
        ) : (
          <div className="text-muted font-semibold text-center">
            No comments yet
          </div>
        )}
      </div>
    </div>
  );
}
