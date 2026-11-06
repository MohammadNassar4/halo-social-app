import { useAuth } from "@/contexts/authContext/useAuth";
import { useTheme } from "@/theme/themeContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ImSpinner8 } from "react-icons/im";
import { toast } from "react-toastify";

export default function FollowBtn({ userId }: { userId: string }) {
  const { token, userData } = useAuth();
  const { resolvedTheme } = useTheme();
  const queryClient = useQueryClient();

  function FollowUser() {
    return axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/users/${userId}/follow`,
      null,
      { headers: { Authorization: `Bearer ${token}` } },
    );
  }

  const { mutate, isPending } = useMutation({
    mutationFn: FollowUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getUserData"] });
    },
    onError: () => {
      toast.error("Failed to update comment!", {
        position: "top-right",
        draggable: true,
        theme: resolvedTheme,
      });
    },
  });

  return (
    <>
      {userData?.following?.some((id) => id === userId) ? (
        <button
          onClick={() => {
            mutate();
          }}
          className="rounded-full border border-border cursor-pointer text-muted py-1 px-3"
        >
          {isPending ? (
            <ImSpinner8 className="animate-spin" />
          ) : (
            <div className="flex items-center gap-1 text-xs font-bold">
              Following
            </div>
          )}
        </button>
      ) : userData?.following?.every((id) => id !== userId) &&
        userData?.followers?.some((id) => id === userId) ? (
        <button
          onClick={() => {
            mutate();
          }}
          className="button-outline py-1 px-3"
        >
          {isPending ? (
            <ImSpinner8 className="animate-spin" />
          ) : (
            <div className="flex items-center gap-1 text-xs font-bold">
              Follow back
            </div>
          )}
        </button>
      ) : (
        <button
          onClick={() => {
            mutate();
          }}
          className="button-outline py-1 px-3"
        >
          {isPending ? (
            <ImSpinner8 className="animate-spin" />
          ) : (
            <div className="flex items-center gap-1 text-xs font-bold">
              Follow
            </div>
          )}
        </button>
      )}
    </>
  );
}
