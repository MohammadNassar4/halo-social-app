import axios from "axios";
import { useAuth } from "../contexts/authContext/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import FollowBtn from "./FollowBtn";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { ImSpinner8 } from "react-icons/im";

export default function Sidebar() {
  const { token } = useAuth();
  const [currentPage, setCurrentPage] = useState(null);
  const [requiredPage, setRequiredPage] = useState<number | null>(1);
  const [suggestionsData, setSuggestionsData] = useState<Suggestion[] | null>(
    null,
  );

  async function getFollowSuggestions(): Promise<Root | undefined> {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/users/suggestions?limit=5&page=${requiredPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.data.success) throw new Error(response.data.message);
      setSuggestionsData(response.data.data.suggestions);
      setCurrentPage(response.data.meta.pagination.currentPage);
      return response.data;
    } catch (e) {
      console.error("Failed to fetch follow suggestion ", e);
    }
  }

  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ["getFollowSuggestions", requiredPage],
    queryFn: getFollowSuggestions,
    enabled: true,
    refetchOnWindowFocus: false,
  });

  return (
    <div>
      <div className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-4 overflow-hidden max-w-76.5">
        <div className="text-fg text-lg font-bold font-heading">
          People you may know
          <div className="h-1 bg-halo-gradient rounded-full w-20 mt-2" />
        </div>

        {isLoading && (
          <>
            <div className="h-10 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-surface-2 animate-pulse"></div>
                <div className="flex flex-col gap-2">
                  <div className="bg-surface-2 w-25 h-3 rounded-full animate-pulse" />
                  <div className="bg-surface-2 w-20 h-3 rounded-full animate-pulse" />
                </div>
              </div>
              <div className="bg-surface-2 h-6 w-16 rounded-full animate-pulse"></div>
            </div>
            <div className="h-10 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-surface-2 animate-pulse"></div>
                <div className="flex flex-col gap-2">
                  <div className="bg-surface-2 w-25 h-3 rounded-full animate-pulse" />
                  <div className="bg-surface-2 w-20 h-3 rounded-full animate-pulse" />
                </div>
              </div>
              <div className="bg-surface-2 h-6 w-16 rounded-full animate-pulse"></div>
            </div>
            <div className="h-10 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-surface-2 animate-pulse"></div>
                <div className="flex flex-col gap-2">
                  <div className="bg-surface-2 w-25 h-3 rounded-full animate-pulse" />
                  <div className="bg-surface-2 w-20 h-3 rounded-full animate-pulse" />
                </div>
              </div>
              <div className="bg-surface-2 h-6 w-16 rounded-full animate-pulse"></div>
            </div>
            <div className="h-10 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-surface-2 animate-pulse"></div>
                <div className="flex flex-col gap-2">
                  <div className="bg-surface-2 w-25 h-3 rounded-full animate-pulse" />
                  <div className="bg-surface-2 w-20 h-3 rounded-full animate-pulse" />
                </div>
              </div>
              <div className="bg-surface-2 h-6 w-16 rounded-full animate-pulse"></div>
            </div>
            <div className="h-10 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-surface-2 animate-pulse"></div>
                <div className="flex flex-col gap-2">
                  <div className="bg-surface-2 w-25 h-3 rounded-full animate-pulse" />
                  <div className="bg-surface-2 w-20 h-3 rounded-full animate-pulse" />
                </div>
              </div>
              <div className="bg-surface-2 h-6 w-16 rounded-full animate-pulse"></div>
            </div>
          </>
        )}
        {isError && (
          <div className="text-center text-muted">
            Failed to get follow suggestions
          </div>
        )}
        {!isLoading &&
          !isError &&
          suggestionsData &&
          suggestionsData.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between gap-1"
            >
              <Link
                to={`/profile/${user._id}`}
                className="flex items-center gap-3 shrink"
              >
                <div className="size-10 rounded-full flex justify-center items-center bg-surface-2 overflow-hidden shrink">
                  <img src={user.photo} alt={user.name} loading="lazy" />
                </div>
                <div className="max-w-31.25">
                  <div
                    className="text-fg text-sm font-semibold line-clamp-1"
                    title={user.name}
                  >
                    {user.name}
                  </div>
                  <div title={ user.username} className="text-muted text-xs line-clamp-1 truncate">
                    @{user.username}
                  </div>
                </div>
              </Link>
              <div
                onClick={() => {
                  setTimeout(() => {
                    refetch();
                  }, 1000);
                }}
                className="shrink-0"
              >
                <FollowBtn userId={user._id} />
              </div>
            </div>
          ))}

        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setRequiredPage(
                data?.meta.pagination.prevPage
                  ? data?.meta.pagination.prevPage
                  : null,
              );
            }}
            disabled={data?.meta.pagination.prevPage ? false : true}
            className={`text-sm font-semibold bg-surface-2 rounded-md px-3 py-1 flex items-center gap-2 ${!data?.meta.pagination.prevPage ? "opacity-50" : "opacity-100 cursor-pointer"}`}
          >
            <FaChevronLeft /> Prev
          </button>

          <div className="text-sm font-semibold flex items-center gap-2">
            {currentPage} {isLoading && <ImSpinner8 className="animate-spin" />}
          </div>

          <button
            onClick={() => {
              setRequiredPage(
                data?.meta.pagination.nextPage
                  ? data?.meta.pagination.nextPage
                  : null,
              );
            }}
            disabled={data?.meta.pagination.nextPage ? false : true}
            className={`text-sm font-semibold bg-surface-2 rounded-md px-3 py-1 flex items-center gap-2 ${!data?.meta.pagination.nextPage ? "opacity-50" : "opacity-100 cursor-pointer"}`}
          >
            Next <FaChevronRight />
          </button>
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
  suggestions: Suggestion[];
}

export interface Suggestion {
  _id: string;
  name: string;
  username: string;
  photo: string;
  mutualFollowersCount: number;
  followersCount: number;
}

export interface Meta {
  pagination: Pagination;
}

export interface Pagination {
  currentPage: number;
  limit: number;
  total: number;
  numberOfPages: number;
  nextPage: number;
  prevPage: number;
}
