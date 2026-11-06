import { useAuth } from "@/contexts/authContext/useAuth";
import { TimeAgo } from "@/myComponents/TimeAgo";
import { useTheme } from "@/theme/themeContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FaCheck } from "react-icons/fa6";
import { Link } from "react-router";
import { toast } from "react-toastify";

export default function Notification() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const { resolvedTheme } = useTheme();

  function getNotification(): Promise<Root> {
    return axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => res.data);
  }

  function markNotificationRead(id: string) {
    return axios.patch(
      `${import.meta.env.VITE_API_BASE_URL}/notifications/${id}/read`,
      null,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  }

  function markAllNotificationRead() {
    return axios.patch(
      `${import.meta.env.VITE_API_BASE_URL}/notifications/read-all`,
      null,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  }

  const { data, isLoading } = useQuery({
    queryKey: ["getNotification"],
    queryFn: getNotification,
  });

  const { mutate: markRead } = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getNotification"] });
      queryClient.invalidateQueries({ queryKey: ["getUnreadCount"] });
    },
    onError: () => {
      toast.error("Something went wrong!", {
        position: "top-right",
        draggable: true,
        theme: resolvedTheme,
      });
    },
  });

  const { mutate: markAllRead } = useMutation({
    mutationFn: markAllNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getNotification"] });
      queryClient.invalidateQueries({ queryKey: ["getUnreadCount"] });
    },
    onError: () => {
      toast.error("Something went wrong!", {
        position: "top-right",
        draggable: true,
        theme: resolvedTheme,
      });
    },
  });

  return (
    <div className="min-h-screen mt-8 p-2 sm:p-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-2xl md:text-3xl font-bold">
          Notification
        </h2>
        <button
          onClick={() => {
            markAllRead();
          }}
          className="button-outline text-xs md:text-sm"
        >
          Mark all as read
        </button>
      </div>
      <div className="bg-surface rounded-2xl overflow-hidden">
        {isLoading && (
          <div>
            <div className="p-4 bg-surface shadow border-b border-border">
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-surface-2 h-12 w-12"></div>
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-surface-2 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-surface-2 rounded"></div>
                    <div className="h-4 bg-surface-2 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-surface shadow border-b border-border">
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-surface-2 h-12 w-12"></div>
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-surface-2 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-surface-2 rounded"></div>
                    <div className="h-4 bg-surface-2 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-surface shadow border-b border-border">
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-surface-2 h-12 w-12"></div>
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-surface-2 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-surface-2 rounded"></div>
                    <div className="h-4 bg-surface-2 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-surface shadow border-b border-border">
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-surface-2 h-12 w-12"></div>
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-surface-2 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-surface-2 rounded"></div>
                    <div className="h-4 bg-surface-2 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-surface shadow border-b border-border">
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-surface-2 h-12 w-12"></div>
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-surface-2 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-surface-2 rounded"></div>
                    <div className="h-4 bg-surface-2 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-surface shadow border-b border-border">
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-surface-2 h-12 w-12"></div>
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-surface-2 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-surface-2 rounded"></div>
                    <div className="h-4 bg-surface-2 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-surface shadow border-b border-border">
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-surface-2 h-12 w-12"></div>
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-surface-2 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-surface-2 rounded"></div>
                    <div className="h-4 bg-surface-2 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-2xl overflow-hidden shadow">
          {data &&
            data.data.notifications.map((item) => {
              return (
                <Link
                  key={item._id}
                  to={
                    item.entityType === "post"
                      ? `/post/${item.entityId}`
                      : `/profile/${item.entityId}`
                  }
                  onClick={() => {
                    markRead(item._id);
                  }}
                  className={`border-b border-border p-4 block ${item.isRead ? "bg-primary/10" : "bg-surface"}`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="size-10 rounded-full bg-surface-2 overflow-hidden shrink-0">
                        <img
                          src={item.actor.photo}
                          className="w-full h-full object-cover"
                          alt={item.actor.name}
                        />
                      </div>
                      <div>
                        <div className="text-sm md:text-base">
                          <span className="font-semibold">
                            {item.actor.name}{" "}
                          </span>
                          {item.type === "comment_post"
                            ? `commented on your post`
                            : item.type === "follow_user"
                              ? `started following you`
                              : item.type === "like_post"
                                ? `liked your post`
                                : null}
                        </div>
                        <TimeAgo date={item.createdAt} />
                      </div>
                    </div>
                    <div>
                      {item.isRead ? (
                        <FaCheck className="text-accent" />
                      ) : (
                        <div className="size-3 bg-halo-gradient rounded-full"></div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export interface Root {
  success: boolean;
  message: string;
  data: Data;
  meta: Meta;
}

export interface Data {
  notifications: NotificationType[];
}

export interface NotificationType {
  _id: string;
  recipient: Recipient;
  actor: Actor;
  type: string;
  entityType: string;
  entityId: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
  entity: Entity;
}

export interface Recipient {
  _id: string;
  name: string;
  photo: string;
}

export interface Actor {
  _id: string;
  name: string;
  photo: string;
}

export interface Entity {
  _id: string;
  body?: string;
  image?: string;
  user?: string;
  commentsCount?: number;
  topComment?: TopComment;
  sharesCount?: number;
  likesCount?: number;
  isShare?: boolean;
  id?: string;
  name?: string;
  username?: string;
  photo?: string;
  followersCount?: number;
  followingCount?: number;
  bookmarksCount?: number;
  unavailable?: boolean;
}

export interface TopComment {
  _id: string;
  content: string;
  commentCreator: CommentCreator;
  post: string;
  parentComment: any;
  likes: string[];
  createdAt: string;
}

export interface CommentCreator {
  _id: string;
  name: string;
  username: string;
  photo: string;
}

export interface Meta {
  feedMode: string;
  pagination: Pagination;
}

export interface Pagination {
  currentPage: number;
  limit: number;
  total: number;
  numberOfPages: number;
  nextPage: number;
}
