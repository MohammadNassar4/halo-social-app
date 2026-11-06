import { createContext } from "react";

export interface UserDataType {
  _id: string
  name: string
  username: string
  email: string
  dateOfBirth?: string
  gender?: string
  photo: string
  cover: string
  bookmarks?: string[]
  followers?: string[]
  following?: string[]
  createdAt?: string
  followersCount?: number
  followingCount?: number
  bookmarksCount?: number
  id?: string
}

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  userData: UserDataType | null;
  setUserData: (userData: UserDataType | null) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
