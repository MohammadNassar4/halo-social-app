import { useAuth } from "@/contexts/authContext/useAuth";
import useLogOut from "@/myComponents/useLogOut";
import { changePasswordSchema } from "@/schemas/changePasswordSchema";
import { useTheme } from "@/theme/themeContext";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { ImSpinner8 } from "react-icons/im";
import { toast } from "react-toastify";

interface ChangePassForm {
  password: string;
  newPassword: string;
  rePassword: string;
}

export default function Settings() {
  const { token, setToken } = useAuth();
  const { resolvedTheme } = useTheme();
  const [isShownCurrent, setIsShownCurrent] = useState(false);
  const [isShownNew, setIsShownNew] = useState(false);
  const [isShownConfirm, setIsShownConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const { setTheme, theme } = useTheme();
  const logOut = useLogOut();

  const { register, handleSubmit, formState } = useForm<ChangePassForm>({
    defaultValues: {
      password: "",
      newPassword: "",
      rePassword: "",
    },
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
  });

  function onSubmit(data: ChangePassForm) {
    const cleanedData = {
      password: data.password,
      newPassword: data.newPassword,
    };
    setIsLoading(true);
    setApiError(null);
    axios
      .patch(
        `${import.meta.env.VITE_API_BASE_URL}/users/change-password`,
        cleanedData,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((response) => {
        if (response.data.success) {
          setToken(response.data.data.token);
          localStorage.setItem("token", response.data.data.token);
          toast.success(response.data.message, {
            position: "top-right",
            draggable: true,
            theme: resolvedTheme,
          });
        }
      })
      .catch((error) => {
        setApiError(
          error.response?.data.message ||
            "Something went wrong! Please try again later.",
        );
        toast.error(error.response?.data.message || "Something went wrong!", {
          position: "top-right",
          draggable: true,
          theme: resolvedTheme,
        });
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <div className="min-h-screen p-4 md:p-0 overflow-hidden">
      <h2 className="text-3xl font-heading font-bold mt-8 mb-4">Settings</h2>

      <div className="bg-surface p-4 md:p-6 rounded-2xl border border-border mb-5">
        <h3 className="font-heading font-bold text-lg md:text-xl mb-6">
          Change password
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {apiError ? (
            <div className="bg-red-500/20 border border-red-600/50 text-red-500 rounded-xl py-2 px-4">
              {apiError}
            </div>
          ) : null}
          <div>
            <label className="flex flex-col gap-1 font-semibold text-sm md:text-base">
              <span className="ms-1">Current password</span>
              <div className="relative">
                <input
                  {...register("password")}
                  className={`bg-bg border-border border rounded-lg px-4 pe-6 py-2.5 font-normal outline-0 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary transition-all duration-200 w-full ${formState.errors.password && formState.touchedFields.password ? "focus-visible:ring-2 focus-visible:ring-red-500/40 focus-visible:border-red-500 border-red-500" : null}`}
                  type={isShownCurrent ? "text" : "password"}
                  placeholder="Enter your current password"
                />
                <button
                  onClick={() => setIsShownCurrent(!isShownCurrent)}
                  type="button"
                  className="absolute text-muted right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {isShownCurrent ? <FaRegEye /> : <FaRegEyeSlash />}
                </button>
              </div>
            </label>
            {formState.errors.password && formState.touchedFields.password ? (
              <p className="text-red-500 text-xs ps-1 mt-1">
                {formState.errors.password.message}
              </p>
            ) : null}
          </div>

          <div>
            <label className="flex flex-col gap-1 font-semibold text-sm md:text-base">
              <span className="ms-1">New password</span>
              <div className="relative">
                <input
                  {...register("newPassword")}
                  className={`bg-bg border-border border rounded-lg px-4 pe-6 py-2.5 font-normal outline-0 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary transition-all duration-200 w-full ${formState.errors.newPassword && formState.touchedFields.newPassword ? "focus-visible:ring-2 focus-visible:ring-red-500/40 focus-visible:border-red-500 border-red-500" : null}`}
                  type={isShownNew ? "text" : "password"}
                  placeholder="Enter your new password"
                />
                <button
                  onClick={() => setIsShownNew(!isShownNew)}
                  type="button"
                  className="absolute text-muted right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {isShownNew ? <FaRegEye /> : <FaRegEyeSlash />}
                </button>
              </div>
            </label>
            {formState.errors.newPassword &&
            formState.touchedFields.newPassword ? (
              <p className="text-red-500 text-xs ps-1 mt-1">
                {formState.errors.newPassword.message}
              </p>
            ) : null}
          </div>

          <div>
            <label className="flex flex-col gap-1 font-semibold text-sm md:text-base">
              <span className="ms-1">Confirm new password</span>
              <div className="relative">
                <input
                  {...register("rePassword")}
                  className={`bg-bg border-border border rounded-lg px-4 pe-6 py-2.5 font-normal outline-0 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary transition-all duration-200 w-full ${formState.errors.rePassword && formState.touchedFields.rePassword ? "focus-visible:ring-2 focus-visible:ring-red-500/40 focus-visible:border-red-500 border-red-500" : null}`}
                  type={isShownConfirm ? "text" : "password"}
                  placeholder="Confirm your new password"
                />
                <button
                  onClick={() => setIsShownConfirm(!isShownConfirm)}
                  type="button"
                  className="absolute text-muted right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {isShownConfirm ? <FaRegEye /> : <FaRegEyeSlash />}
                </button>
              </div>
            </label>
            {formState.errors.rePassword &&
            formState.touchedFields.rePassword ? (
              <p className="text-red-500 text-xs ps-1 mt-1">
                {formState.errors.rePassword.message}
              </p>
            ) : null}
          </div>

          <button
            disabled={isLoading}
            className="button-primary w-fit hover:scale-100 hover:opacity-90 outline-0 flex items-center gap-2"
          >
            Update password{" "}
            {isLoading && <ImSpinner8 className="animate-spin" />}
          </button>
        </form>
      </div>

      <div className="bg-surface p-4 md:p-6 rounded-2xl border border-border mb-5">
        <h3 className="font-heading font-bold text-lg md:text-xl mb-6">
          Appearance
        </h3>
        <div className="flex gap-3 items-center flex-wrap">
          <button
            onClick={() => setTheme("light")}
            className={`text-muted px-4 py-2 border border-muted rounded-full cursor-pointer font-semibold ${theme === 'light' && "bg-primary border-primary text-white"}`}
          >
            Light
          </button>
          <button onClick={() => setTheme("dark")} className={`text-muted px-4 py-2 border border-muted rounded-full cursor-pointer font-semibold ${theme === 'dark' && "bg-primary border-primary text-white"}`}>
            Dark
          </button>
          <button onClick={() => setTheme("system")} className={`text-muted px-4 py-2 border border-muted rounded-full cursor-pointer font-semibold ${theme === 'system' && "bg-primary border-primary text-white"}`}>
            System
          </button>
        </div>
      </div>

      <div className="bg-surface p-4 md:p-6 rounded-2xl border border-border">
        <div className="flex justify-between items-center">
          <div className="font-semibold">Log out</div>
          <button onClick={logOut} className="text-white bg-red-500 py-2 px-4 rounded-full font-semibold cursor-pointer hover:bg-red-600">Log out</button>
        </div>
      </div>
    </div>
  );
}
