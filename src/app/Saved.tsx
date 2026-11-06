import { useAuth } from "@/contexts/authContext/useAuth";
import PostCard from "@/myComponents/PostCard";
import PostsSkeleton from "@/myComponents/postsSkeleton";
import type { PostType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function Saved() {
  const { token } = useAuth();
  function getSavedPosts(): Promise<PostType[]> {
    return axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/users/bookmarks`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => res.data.data.bookmarks);
  }

  const { data: savedPosts, isLoading } = useQuery({
    queryKey: ["getSavedPosts"],
    queryFn: getSavedPosts,
  });

  return (
    <div className="min-h-screen mt-8">
      <h2 className="text-2xl md:text-3xl font-bold font-heading mb-4 ps-4 md:p-0">Saved posts</h2>
      {isLoading ? (
        <PostsSkeleton />
      ) : (
        <div className="flex flex-col gap-4">
          {savedPosts &&
            savedPosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      )}
    </div>
  );
}
