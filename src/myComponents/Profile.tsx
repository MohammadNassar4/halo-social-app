import type { ProfileDataType } from "@/app/MyProfile";
import { FaRegEdit } from "react-icons/fa";
import { HiOutlineCog8Tooth } from "react-icons/hi2";
import FollowBtn from "./FollowBtn";
import { IoCameraOutline } from "react-icons/io5";
import { useRef, useState, type ChangeEvent } from "react";
import type { PostType } from "@/types";
import PostCard from "./PostCard";
import { useAuth } from "@/contexts/authContext/useAuth";
import axios from "axios";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TbPhoto } from "react-icons/tb";
import { FaXmark } from "react-icons/fa6";
import { toast } from "react-toastify";
import { useTheme } from "@/theme/themeContext";
import { ImSpinner8 } from "react-icons/im";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";

export default function Profile({
  user,
  mine,
  posts,
}: {
  user: ProfileDataType | undefined;
  mine: boolean;
  posts: PostType[] | undefined;
}) {
  const { token } = useAuth();
  const { resolvedTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("about");
  const currentYear = new Date().getFullYear();
  const [isOpen, setIsOpen] = useState(false);
  const [uploadedImg, setUploadedImg] = useState<string | null>(null);
  const [img, setImg] = useState<null | File>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const [dialogType, setDialogType] = useState("photo");

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

  function prepareData() {
    const formData = new FormData();
    if (img) formData.append(dialogType, img);
    if (!img) {
      toast.error("Please upload an image", {
        position: "top-right",
        draggable: true,
        theme: resolvedTheme,
      });
      return;
    }
    return formData;
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  }

  // function getUser(id: string): Promise<ProfileDataType> {
  //   return axios
  //     .get(`${import.meta.env.VITE_API_BASE_URL}/users/${id}/profile`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     })
  //     .then((res) => res.data.data.user);
  // };

  // function getUsers(ids: string[]): Promise<ProfileDataType[]> {
  //   return Promise.all(ids.map(getUser))
  // }

  function changeProfilePics() {
    return axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/users/upload-${dialogType}`,
      prepareData(),
      { headers: { Authorization: `Bearer ${token}` } },
    );
  }

  const { mutate: changeProfilePicMutate, isPending } = useMutation({
    mutationFn: changeProfilePics,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getMyProfile"] });
      handleCloseImg();
    },
    onError: () => {
      toast.error("Something went wrong!", {
        position: "top-right",
        draggable: true,
        theme: resolvedTheme,
      });
    },
  });

  const { mutate: changeCoverPicMutate, isPending: coverPending } = useMutation(
    {
      mutationFn: changeProfilePics,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getMyProfile"] });
        handleCloseImg();
      },
      onError: () => {
        toast.error("Something went wrong!", {
          position: "top-right",
          draggable: true,
          theme: resolvedTheme,
        });
      },
    },
  );

  return (
    <>
      {user && (
        <div className="flex flex-col gap-5 md:p-0 min-h-screen">
          <div className="px-4 sm:p-0">
            <div className="bg-surface rounded-2xl overflow-hidden border border-border">
              <div className="relative h-40 md:h-62.5 bg-halo-gradient">
                {user.cover && (
                  <img
                    src={user.cover}
                    alt=""
                    className="w-full h-full object-cover object-center"
                  />
                )}
                {coverPending && (
                  <div className="absolute top-0 bottom-0 right-0 left-0 bg-black/40 flex items-center justify-center">
                    <ImSpinner8 className="animate-spin text-2xl" />
                  </div>
                )}
                {mine && (
                  <button
                    onClick={() => {
                      setDialogType("cover");
                      setIsOpen(true);
                    }}
                    className="absolute bg-surface p-2 text-muted hover:text-fg top-2 md:top-4 right-2 md:right-4 rounded-full cursor-pointer"
                  >
                    <FaRegEdit />
                  </button>
                )}
              </div>

              <div className="h-55 sm:h-57 md:h-67 lg:h-30 border-b border-border relative">
                <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end absolute -top-14  md:-top-26 w-full p-2 md:p-5">
                  <div className="flex flex-col lg:flex-row items-center sm:items-end gap-2 md:gap-5 mb-2 lg:mb-0">
                    <div className="relative mx-auto">
                      <div className="rounded-full size-25 md:size-40 p-0.75 bg-halo-gradient overflow-hidden ">
                        <img
                          src={user.photo}
                          alt="user profile picture"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      {isPending && (
                        <div className="absolute top-0 bottom-0 right-0 left-0 bg-black/40 rounded-full flex items-center justify-center">
                          <ImSpinner8 className="animate-spin text-2xl" />
                        </div>
                      )}
                      {mine && (
                        <button
                          onClick={() => {
                            setDialogType("photo");
                            setIsOpen(true);
                          }}
                          className="absolute p-2 bg-surface-2 rounded-full cursor-pointer bottom-0 right-0 md:right-4 text-muted hover:text-fg"
                        >
                          <IoCameraOutline />
                        </button>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 text-center lg:text-start mx-auto">
                      <div className="text-base sm:text-lg md:text-2xl font-bold">
                        {user.name}
                      </div>
                      <div className="text-muted text-xs sm:text-sm">
                        @{user.username}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center mb-2 lg:mb-0">
                    <button className="text-center hover:bg-border/50 p-2 rounded-md cursor-pointer">
                      <div className="font-bold">{user.followersCount}</div>
                      <div className="text-muted text-xs">Followers</div>
                    </button>
                    <button className="text-center hover:bg-border/50 p-2 rounded-md cursor-pointer">
                      <div className="font-bold">{user.followingCount}</div>
                      <div className="text-muted text-xs">Following</div>
                    </button>
                  </div>
                  {mine ? (
                    <Link
                      to="/settings"
                      className="border border-muted text-muted rounded-full px-3 py-1 font-semibold cursor-pointer text-xs lg:text-sm flex items-center gap-1"
                    >
                      <HiOutlineCog8Tooth className="text-base" />
                      <span className="">Edit profile</span>
                    </Link>
                  ) : (
                    <FollowBtn userId={user._id} />
                  )}
                </div>
              </div>
              <div className="px-4">
                <button
                  onClick={() => setActiveTab("about")}
                  className={`px-4 py-3 text-sm sm:text-base font-medium hover:bg-surface-2 cursor-pointer border-b-3 ${activeTab === "about" ? "border-accent" : "border-transparent"}`}
                >
                  About
                </button>
                <button
                  onClick={() => setActiveTab("posts")}
                  className={`px-4 py-3 text-sm sm:text-base font-medium hover:bg-surface-2 cursor-pointer border-b-3 ${activeTab === "posts" ? "border-accent" : "border-transparent"}`}
                >
                  Posts
                </button>
              </div>
            </div>
          </div>

          {/* about section */}
          <section
            className="rounded-2xl border border-border bg-surface p-4"
            aria-labelledby="profile-details-heading"
            hidden={activeTab !== "about"}
          >
            <h2
              id="profile-details-heading"
              className="mb-2 text-base font-semibold"
            >
              Profile details
            </h2>
            <dl className="divide-y divide-border">
              <div className="flex items-baseline justify-between gap-4 py-2.5 text-sm">
                <dt className="shrink-0 text-muted">Name</dt>
                <dd className="min-w-0 wrap-break-word text-right font-medium">
                  {user.name}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-2.5 text-sm">
                <dt className="shrink-0 text-muted">Username</dt>
                <dd className="min-w-0 wrap-break-word text-right font-medium">
                  @{user.username}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-2.5 text-sm">
                <dt className="shrink-0 text-muted">Age</dt>
                <dd className="min-w-0 wrap-break-word text-right font-medium">
                  {currentYear - +user.dateOfBirth.slice(0, 4)} years
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-2.5 text-sm">
                <dt className="shrink-0 text-muted">Gender</dt>
                <dd className="min-w-0 wrap-break-word text-right font-medium">
                  {user.gender}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-2.5 text-sm">
                <dt className="shrink-0 text-muted">Email</dt>
                <dd className="min-w-0 wrap-break-word text-right font-medium">
                  {user.email}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-2.5 text-sm">
                <dt className="shrink-0 text-muted">Date of birth</dt>
                <dd className="min-w-0 wrap-break-word text-right font-medium">
                  {formatDate(user?.dateOfBirth || "")}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-2.5 text-sm">
                <dt className="shrink-0 text-muted">Joined</dt>
                <dd className="min-w-0 wrap-break-word text-right font-medium">
                  {formatDate(user?.createdAt || "")}
                </dd>
              </div>
            </dl>
          </section>

          {/* posts section */}
          <section hidden={activeTab !== "posts"} className="flex flex-col gap-0 md:gap-4">
            {posts &&
              posts?.map((post) => <PostCard key={post._id} post={post} />)}
          </section>
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-sm md:max-w-lg bg-surface border border-border ring-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (dialogType === "photo") {
                changeProfilePicMutate();
              } else {
                changeCoverPicMutate();
              }
            }}
          >
            <DialogHeader className="mb-4">
              <DialogTitle className="text-fg font-bold text-2xl">
                Upload an image
              </DialogTitle>
            </DialogHeader>

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
              <div className="relative size-35 overflow-hidden rounded-xl">
                <button
                  type="button"
                  onClick={handleCloseImg}
                  className="absolute top-2 right-2 cursor-pointer bg-border p-2 rounded-full"
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
                    }}
                    className="button-outline"
                  >
                    Cancel
                  </button>
                }
              />
              <button
                onClick={() => setIsOpen(false)}
                disabled={isPending}
                type="submit"
                className="button-primary sm:w-fit flex items-center gap-1 justify-center hover:scale-100"
              >
                Upload {isPending && <ImSpinner8 className="animate-spin" />}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
