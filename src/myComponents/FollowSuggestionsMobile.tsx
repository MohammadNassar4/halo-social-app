import axios from "axios";
import { useAuth } from "../contexts/authContext/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import FollowBtn from "./FollowBtn";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { ImSpinner8 } from "react-icons/im";

export default function FollowSuggestionsMobile() {
  const { token } = useAuth();
  const [currentPage, setCurrentPage] = useState(null);
  const [requiredPage, setRequiredPage] = useState<number | null>(1);
  const [suggestionsData, setSuggestionsData] = useState<Suggestion[] | null>(
    null,
  );

  async function getFollowSuggestions(): Promise<Root | undefined> {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/users/suggestions?limit=10&page=${requiredPage}`,
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
    queryKey: ["getFollowSuggestionsMobile", requiredPage],
    queryFn: getFollowSuggestions,
    enabled: true,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="overflow-hidden max-w-full px-4 md:p-0">
      <h3 className="font-heading font-bold text-base sm:text-lg mb-4 ps-1">
        People you may know
      </h3>
      <div className="flex gap-4 overflow-x-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent pb-2.5">
        {isLoading && (
          <>
            <div className="flex items-center gap-3 bg-surface border border-border p-4 rounded-2xl flex-col shrink-0 w-37.5">
              <div className="flex flex-col items-center gap-4 shrink-0">
                <div className="flex flex-col items-center gap-3">
                  <div className="size-12 rounded-full bg-surface-2 animate-pulse"></div>
                  <div className="flex flex-col gap-2">
                    <div className="bg-surface-2 text-center mx-auto w-25 h-3 rounded-full animate-pulse" />
                    <div className="bg-surface-2 text-center mx-auto w-20 h-3 rounded-full animate-pulse" />
                  </div>
                </div>
                <div className="bg-surface-2 h-6 w-16 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-surface border border-border p-4 rounded-2xl flex-col shrink-0 w-37.5">
              <div className="flex flex-col items-center gap-4 shrink-0">
                <div className="flex flex-col items-center gap-3">
                  <div className="size-12 rounded-full bg-surface-2 animate-pulse"></div>
                  <div className="flex flex-col gap-2">
                    <div className="bg-surface-2 text-center mx-auto w-25 h-3 rounded-full animate-pulse" />
                    <div className="bg-surface-2 text-center mx-auto w-20 h-3 rounded-full animate-pulse" />
                  </div>
                </div>
                <div className="bg-surface-2 h-6 w-16 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-surface border border-border p-4 rounded-2xl flex-col shrink-0 w-37.5">
              <div className="flex flex-col items-center gap-4 shrink-0">
                <div className="flex flex-col items-center gap-3">
                  <div className="size-12 rounded-full bg-surface-2 animate-pulse"></div>
                  <div className="flex flex-col gap-2">
                    <div className="bg-surface-2 text-center mx-auto w-25 h-3 rounded-full animate-pulse" />
                    <div className="bg-surface-2 text-center mx-auto w-20 h-3 rounded-full animate-pulse" />
                  </div>
                </div>
                <div className="bg-surface-2 h-6 w-16 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-surface border border-border p-4 rounded-2xl flex-col shrink-0 w-37.5">
              <div className="flex flex-col items-center gap-4 shrink-0">
                <div className="flex flex-col items-center gap-3">
                  <div className="size-12 rounded-full bg-surface-2 animate-pulse"></div>
                  <div className="flex flex-col gap-2">
                    <div className="bg-surface-2 text-center mx-auto w-25 h-3 rounded-full animate-pulse" />
                    <div className="bg-surface-2 text-center mx-auto w-20 h-3 rounded-full animate-pulse" />
                  </div>
                </div>
                <div className="bg-surface-2 h-6 w-16 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-surface border border-border p-4 rounded-2xl flex-col shrink-0 w-37.5">
              <div className="flex flex-col items-center gap-4 shrink-0">
                <div className="flex flex-col items-center gap-3">
                  <div className="size-12 rounded-full bg-surface-2 animate-pulse"></div>
                  <div className="flex flex-col gap-2">
                    <div className="bg-surface-2 text-center mx-auto w-25 h-3 rounded-full animate-pulse" />
                    <div className="bg-surface-2 text-center mx-auto w-20 h-3 rounded-full animate-pulse" />
                  </div>
                </div>
                <div className="bg-surface-2 h-6 w-16 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-surface border border-border p-4 rounded-2xl flex-col shrink-0 w-37.5">
              <div className="flex flex-col items-center gap-4 shrink-0">
                <div className="flex flex-col items-center gap-3">
                  <div className="size-12 rounded-full bg-surface-2 animate-pulse"></div>
                  <div className="flex flex-col gap-2">
                    <div className="bg-surface-2 text-center mx-auto w-25 h-3 rounded-full animate-pulse" />
                    <div className="bg-surface-2 text-center mx-auto w-20 h-3 rounded-full animate-pulse" />
                  </div>
                </div>
                <div className="bg-surface-2 h-6 w-16 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-surface border border-border p-4 rounded-2xl flex-col shrink-0 w-37.5">
              <div className="flex flex-col items-center gap-4 shrink-0">
                <div className="flex flex-col items-center gap-3">
                  <div className="size-12 rounded-full bg-surface-2 animate-pulse"></div>
                  <div className="flex flex-col gap-2">
                    <div className="bg-surface-2 text-center mx-auto w-25 h-3 rounded-full animate-pulse" />
                    <div className="bg-surface-2 text-center mx-auto w-20 h-3 rounded-full animate-pulse" />
                  </div>
                </div>
                <div className="bg-surface-2 h-6 w-16 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-surface border border-border p-4 rounded-2xl flex-col shrink-0 w-37.5">
              <div className="flex flex-col items-center gap-4 shrink-0">
                <div className="flex flex-col items-center gap-3">
                  <div className="size-12 rounded-full bg-surface-2 animate-pulse"></div>
                  <div className="flex flex-col gap-2">
                    <div className="bg-surface-2 text-center mx-auto w-25 h-3 rounded-full animate-pulse" />
                    <div className="bg-surface-2 text-center mx-auto w-20 h-3 rounded-full animate-pulse" />
                  </div>
                </div>
                <div className="bg-surface-2 h-6 w-16 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-surface border border-border p-4 rounded-2xl flex-col shrink-0 w-37.5">
              <div className="flex flex-col items-center gap-4 shrink-0">
                <div className="flex flex-col items-center gap-3">
                  <div className="size-12 rounded-full bg-surface-2 animate-pulse"></div>
                  <div className="flex flex-col gap-2">
                    <div className="bg-surface-2 text-center mx-auto w-25 h-3 rounded-full animate-pulse" />
                    <div className="bg-surface-2 text-center mx-auto w-20 h-3 rounded-full animate-pulse" />
                  </div>
                </div>
                <div className="bg-surface-2 h-6 w-16 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-surface border border-border p-4 rounded-2xl flex-col shrink-0 w-37.5">
              <div className="flex flex-col items-center gap-4 shrink-0">
                <div className="flex flex-col items-center gap-3">
                  <div className="size-12 rounded-full bg-surface-2 animate-pulse"></div>
                  <div className="flex flex-col gap-2">
                    <div className="bg-surface-2 text-center mx-auto w-25 h-3 rounded-full animate-pulse" />
                    <div className="bg-surface-2 text-center mx-auto w-20 h-3 rounded-full animate-pulse" />
                  </div>
                </div>
                <div className="bg-surface-2 h-6 w-16 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-surface border border-border p-4 rounded-2xl flex-col shrink-0 w-37.5">
              <div className="flex flex-col items-center gap-4 shrink-0">
                <div className="flex flex-col items-center gap-3">
                  <div className="size-12 rounded-full bg-surface-2 animate-pulse"></div>
                  <div className="flex flex-col gap-2">
                    <div className="bg-surface-2 text-center mx-auto w-25 h-3 rounded-full animate-pulse" />
                    <div className="bg-surface-2 text-center mx-auto w-20 h-3 rounded-full animate-pulse" />
                  </div>
                </div>
                <div className="bg-surface-2 h-6 w-16 rounded-full animate-pulse"></div>
              </div>
            </div>
          </>
        )}
        {isError && (
          <div className="text-center mx-auto text-muted">
            Failed to get follow suggestions
          </div>
        )}
        {!isLoading &&
          !isError &&
          suggestionsData &&
          suggestionsData.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-3 bg-surface border border-border p-4 rounded-2xl flex-col shrink-0 w-37.5"
            >
              <Link
                to={`/profile/${user._id}`}
                className="flex flex-col items-center gap-3 shrink"
              >
                <div className="size-12 rounded-full flex justify-center items-center bg-surface-2 overflow-hidden shrink">
                  <img src={user.photo} alt={user.name} loading="lazy" />
                </div>
                <div>
                  <div
                    className="text-fg text-xs sm:text-sm text-center font-semibold line-clamp-1"
                    title={user.name}
                  >
                    {user.name}
                  </div>
                  <div
                    title={user.username}
                    className="text-muted text-xs text-center line-clamp-1 truncate"
                  >
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
      </div>

      <div className="flex items-center justify-between mt-2">
        <button
          onClick={() => {
            setRequiredPage(
              data?.meta.pagination.prevPage
                ? data?.meta.pagination.prevPage
                : null,
            );
          }}
          disabled={data?.meta.pagination.prevPage ? false : true}
          className={`text-xs sm:text-sm font-semibold bg-surface-2 rounded-md px-3 py-1.5 flex items-center gap-1 ${!data?.meta.pagination.prevPage ? "opacity-50" : "opacity-100 cursor-pointer"}`}
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
          className={`text-xs sm:text-sm font-semibold bg-surface-2 rounded-md px-3 py-1.5 flex items-center gap-1 ${!data?.meta.pagination.nextPage ? "opacity-50" : "opacity-100 cursor-pointer"}`}
        >
          Next <FaChevronRight />
        </button>
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
