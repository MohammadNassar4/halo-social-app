import Profile from "@/myComponents/Profile";
import { useAuth } from "@/contexts/authContext/useAuth";
import ProfileSkeleton from "@/myComponents/ProfileSkeleton";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { ProfileDataType } from "./MyProfile";
import { useParams } from "react-router";
import type { PostType } from "@/types";

export default function UserProfile() {
  const { token } = useAuth();
  const {userId} = useParams()
  function getUserProfile(): Promise<ProfileDataType> {
    return axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/users/${userId}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => res.data.data.user);
  }

  function getUserPosts(): Promise<PostType[]> {
    return axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/users/${userId}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => res.data.data.posts);
  }

  const { data, isLoading } = useQuery({
    queryKey: ["getUserProfile", userId],
    queryFn: getUserProfile,
  });
  
  const { data: userPosts } = useQuery({
    queryKey: ["getUserPosts", userId],
    queryFn: getUserPosts,
  });
  
  return (
    <>{isLoading ? <ProfileSkeleton /> : <Profile posts={userPosts} user={data} mine={false} />}</>
  );
}
