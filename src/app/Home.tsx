import PostCard from "../myComponents/PostCard";
import { useQuery } from "@tanstack/react-query";
import type { PostType } from "../types";
import Spinner from "../myComponents/Spinner";
import { useAuth } from "../contexts/authContext/useAuth";
import { useActiveTab } from "../contexts/activeTabContext/useActiveTab";
import { TbPhoto } from "react-icons/tb";
import axios from "axios";
import { useDialog } from "../contexts/dialogContext/useDialog";
import PostsSkeleton from "@/myComponents/postsSkeleton";
import FollowSuggestionsMobile from "@/myComponents/FollowSuggestionsMobile";

function Home() {
  const { activeTab, setActiveTab } = useActiveTab();
  const { token, userData } = useAuth();
  const { openDialog } = useDialog();

  async function getAllPosts(): Promise<PostType[] | undefined> {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/posts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.data.success) throw new Error(response.data.success);
      return response.data.data.posts;
    } catch (e) {
      console.error("Failed to fetch posts ", e);
    }
  }

  async function getFollowingPosts(): Promise<PostType[] | undefined> {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/posts/feed?following&limit=40`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.data.success) throw new Error(response.data.success);
      return response.data.data.posts;
    } catch (e) {
      console.error("Failed to fetch posts ", e);
    }
  }

  const {
    data: allPosts,
    isLoading: allPostsLoading,
    isError: allPostsError,
  } = useQuery({
    queryKey: ["getAllPosts"],
    queryFn: getAllPosts,
    refetchInterval: 60000,
  });

  const {
    data: followingPosts,
    isLoading: followingPostsLoading,
    isError: followingPostsError,
  } = useQuery({
    queryKey: ["getFollowingPosts"],
    queryFn: getFollowingPosts,
    refetchInterval: 60000,
  });

  return (
    <>
      <div>
        <nav className="sticky top-17.25 md:pt-10 bg-bg border-b border-border flex justify-end items-baseline-last z-40">
          <button
            onClick={() => {
              window.scrollTo(0, 0);
              setActiveTab("following");
            }}
            className={`py-3 md:py-2 px-4 text-sm sm:text-base border-b-3 cursor-pointer transition-colors duration-200 w-1/2 font-semibold ${activeTab === "following" ? "border-accent" : "border-transparent"}`}
          >
            Following
          </button>
          <button
            onClick={() => {
              window.scrollTo(0, 0);
              setActiveTab("all");
            }}
            className={`py-3 md:py-2 px-4 text-sm sm:text-base border-b-3 cursor-pointer transition-colors duration-200 w-1/2 font-semibold ${activeTab === "all" ? "border-accent" : "border-transparent"}`}
          >
            All Posts
          </button>
        </nav>

        <div className="md:pt-5 border-b border-border md:border-0 mb-4 xl:mb-0">
          <div className="md:bg-surface p-5 flex flex-col gap-4 md:border border-border rounded-2xl">
            <div className="flex items-center gap-3.5 md:border-b md:border-border md:pb-4">
              <div className="size-12 rounded-full overflow-hidden shrink-0">
                <img
                  src={userData?.photo}
                  alt={userData?.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <button className="w-full">
                <input
                  onClick={() => openDialog()}
                  className="w-full bg-bg border border-border rounded-full px-4 py-3 text-xs  sm:text-base"
                  type="text"
                  placeholder={`What's on your mind, ${userData?.name}`}
                />
              </button>
            </div>

            <div className="hidden md:flex justify-between items-center">
              <div
                onClick={() => openDialog()}
                className="text-muted flex items-center gap-2 cursor-pointer"
              >
                <TbPhoto className="text-xl" /> Photo
              </div>
              <button
                onClick={() => openDialog()}
                className="button-primary w-fit hover:scale-100"
              >
                Post
              </button>
            </div>
          </div>
        </div>

        <div className="xl:hidden">
          <FollowSuggestionsMobile/>
        </div>

        <div className="posts-container md:grid md:gap-4 md:pt-4">
          {activeTab === "all" ? (
            <>
              {allPostsLoading && <PostsSkeleton />}
              {allPostsError && (
                <div className="text-center">
                  Failed to fetch posts something went wrong
                </div>
              )}
              {allPosts &&
                allPosts.map((post) => <PostCard key={post._id} post={post} />)}
            </>
          ) : (
            <>
              {followingPostsLoading && <Spinner />}
              {followingPostsError && (
                <div className="text-center">
                  Failed to fetch posts something went wrong
                </div>
              )}
              {followingPosts &&
                followingPosts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
            </>
          )}

          {allPosts && followingPosts && (
            <button className="text-center cursor-pointer text-accent font-medium">
              Load More Posts
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
