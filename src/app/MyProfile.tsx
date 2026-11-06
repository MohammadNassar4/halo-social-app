import { useAuth } from "@/contexts/authContext/useAuth";
import Profile from "@/myComponents/Profile";
import ProfileSkeleton from "@/myComponents/ProfileSkeleton";
import type { PostType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function MyProfile() {
  const { token, userData } = useAuth();

  function getMyProfile(): Promise<ProfileDataType> {
    return axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/users/profile-data`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => res.data.data.user);
  }

  function getMyPosts(): Promise<PostType[]> {
    return axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/users/${userData?._id}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => res.data.data.posts);
  }

  const { data, isLoading } = useQuery({
    queryKey: ["getMyProfile"],
    queryFn: getMyProfile,
  });

  const { data: myPosts } = useQuery({
    queryKey: ["getMyPosts"],
    queryFn: getMyPosts,
  });

  return <>{isLoading ? <ProfileSkeleton /> : <Profile posts={myPosts} user={data} mine={true} />}</>;
}

export interface ProfileDataType {
  _id: string;
  name: string;
  username: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  photo: string;
  cover: string;
  bookmarks?: string[];
  followers: string[];
  following: string[];
  createdAt: string;
  passwordChangedAt: string;
  followersCount: number;
  followingCount: number;
  bookmarksCount: number;
  id: string;
}
