import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import * as z from "zod";
import { registerSchema } from "../schemas/registerSchema";
import Navbar from "../myComponents/Navbar";
import { ThemeToggle } from "../myComponents/ThemeToggle";
import logo from "../assets/logo.png";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiLoader4Line } from "react-icons/ri";
import { toast } from "react-toastify";
import { useTheme } from "../theme/themeContext";
import axios from "axios";
import { useAuth } from "../contexts/authContext/useAuth";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

export default function Register() {
  const { setToken, setUserData } = useAuth();
  const navigate = useNavigate();
  const { resolvedTheme } = useTheme();
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPassShown, setIsPassShown] = useState(false);
  const [isRePassShown, setIsRePassShown] = useState(false);
  const { register, handleSubmit, formState } = useForm<
    z.infer<typeof registerSchema>
  >({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      dateOfBirth: "",
      gender: "",
      password: "",
      rePassword: "",
    },
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  async function onSubmit(data: z.infer<typeof registerSchema>) {
    setIsLoading(true);
    setApiError(null);
    axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/users/signup`, data)
      .then((response) => {
        if (response.data.success) {
          setToken(response.data.data.token);
          localStorage.setItem("token", response.data.data.token);
          setUserData(response.data.data.user);
          navigate("/home");

          toast.success(response.data.message, {
            position: "top-right",
            draggable: true,
            theme: resolvedTheme,
          });
        }
      })
      .catch((error) => {
        setApiError(
          error.response.data.message ||
            "Something went wrong! Please try again later.",
        );
        toast.error(error.response.data.message || "Something went wrong!", {
          position: "top-right",
          draggable: true,
          theme: resolvedTheme,
        });
      })
      .finally(() => setIsLoading(false));
  }
  return (
    <>
      <div className="lg:hidden sticky top-0">
        <Navbar />
      </div>
      <div className="flex items-stretch">
        <div className="hidden w-1/2 min-h-screen bg-header lg:flex flex-col justify-between py-14 px-16 border-r border-border">
          <div className="flex items-center gap-2">
            <img
              width={44}
              height={44}
              src={logo}
              alt="logo"
              draggable={false}
            />
            <h3 className="text-fg text-3xl font-semibold">Halo</h3>
          </div>

          <div className="max-w-md">
            <h1 className="text-[3.25rem]/18 font-bold mb-4">
              Keep your people <span className="text-accent">in orbit.</span>
            </h1>
            <p className="text-muted text-lg">
              Share what's on your mind and stay close to the people who matter.
            </p>
          </div>
          <div className="flex justify-between items-center">
            <div className="w-12 h-1 rounded-full bg-halo-gradient"></div>
            <ThemeToggle />
          </div>
        </div>

        <div className="w-12/12 lg:w-1/2  bg-bg p-4 md:p-12 flex justify-center items-center">
          <div className="bg-surface w-full max-w-120 p-5 sm:p-9 rounded-2xl border border-border flex flex-col gap-5">
            <h2 className="text-fg text-xl sm:text-[1.75rem] font-semibold">
              Create your account
            </h2>
            {apiError ? (
              <div className="bg-red-500/20 border border-red-600/50 text-red-500 rounded-xl py-2 px-4">
                {apiError}
              </div>
            ) : null}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-5 pb-5 border-b border-border"
            >
              <div className="flex flex-col gap-2">
                <label className="ms-1 text-fg font-medium" htmlFor="name">
                  Name
                </label>
                <input
                  {...register("name")}
                  id="name"
                  type="text"
                  className={`text-fg font-body bg-bg rounded-xl py-2.5 px-4 border border-border focus-visible:ring-1 ring-accent outline-0 transition-all duration-200 ${formState.errors.name && formState.touchedFields.name ? "ring-1 ring-red-600" : ""}`}
                  placeholder="Enter Your Name"
                />
                {formState.errors.name && formState.touchedFields.name && (
                  <p className="text-sm text-red-600">
                    {formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="ms-1 text-fg font-medium" htmlFor="username">
                  Username
                </label>
                <input
                  {...register("username")}
                  id="username"
                  type="text"
                  className={`text-fg font-body bg-bg rounded-xl py-2.5 px-4 border border-border focus-visible:ring-1 ring-accent outline-0 transition-all duration-200 ${formState.errors.username && formState.touchedFields.username ? "ring-1 ring-red-600" : ""}`}
                  placeholder="Enter Your username"
                />
                {formState.errors.username &&
                  formState.touchedFields.username && (
                    <p className="text-sm text-red-600">
                      {formState.errors.username.message}
                    </p>
                  )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="ms-1 text-fg font-medium" htmlFor="email">
                  Email
                </label>
                <input
                  {...register("email")}
                  id="email"
                  type="email"
                  className={`text-fg font-body bg-bg rounded-xl py-2.5 px-4 border border-border focus-visible:ring-1 ring-accent outline-0 transition-all duration-200 ${formState.errors.email && formState.touchedFields.email ? "ring-1 ring-red-600" : ""}`}
                  placeholder="Enter Your email"
                />
                {formState.errors.email && formState.touchedFields.email && (
                  <p className="text-sm text-red-600">
                    {formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="ms-1 text-fg font-medium" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...register("password")}
                    id="password"
                    type={isPassShown ? "text" : "password"}
                    className={`w-full text-fg font-body bg-bg rounded-xl py-2.5 px-4 pe-10 border border-border focus-visible:ring-1 ring-accent outline-0 transition-all duration-200 ${formState.errors.password && formState.touchedFields.password ? "ring-1 ring-red-600" : ""}`}
                    placeholder="Your password"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-3.5 text-muted cursor-pointer"
                    onClick={() => setIsPassShown(!isPassShown)}
                  >
                    {isPassShown ? <FaRegEye /> : <FaRegEyeSlash />}
                  </button>
                </div>
                {formState.errors.password &&
                  formState.touchedFields.password && (
                    <p className="text-sm text-red-600">
                      {formState.errors.password.message}
                    </p>
                  )}
              </div>

              <div className="flex flex-col gap-2">
                <label
                  className="ms-1 text-fg font-medium"
                  htmlFor="rePassword"
                >
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    {...register("rePassword")}
                    id="rePassword"
                    type={isRePassShown ? "text" : "password"}
                    className={`w-full text-fg font-body bg-bg rounded-xl py-2.5 px-4 pe-10 border border-border focus-visible:ring-1 ring-accent outline-0 transition-all duration-200 ${formState.errors.rePassword && formState.touchedFields.rePassword ? "ring-1 ring-red-600" : ""}`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-3.5 text-muted cursor-pointer"
                    onClick={() => setIsRePassShown(!isRePassShown)}
                  >
                    {isRePassShown ? <FaRegEye /> : <FaRegEyeSlash />}
                  </button>
                </div>
                {formState.errors.rePassword &&
                  formState.touchedFields.rePassword && (
                    <p className="text-sm text-red-600">
                      {formState.errors.rePassword.message}
                    </p>
                  )}
              </div>

              <div className="flex flex-col gap-5 sm:flex-row sm:gap-2">
                <div className="flex flex-col gap-2 w-full">
                  <label className="ms-1 text-fg font-medium" htmlFor="gender">
                    Gender
                  </label>
                  <select
                    {...register("gender")}
                    id="gender"
                    className={`text-fg font-body bg-bg rounded-xl py-2.5 px-4 border border-border focus-visible:ring-1 ring-accent outline-0 transition-all duration-200 appearance-none ${formState.errors.gender && formState.touchedFields.name && formState.touchedFields.gender ? "ring-1 ring-red-600" : ""}`}
                  >
                    <option value="" disabled>
                      Select a gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  {formState.errors.gender &&
                    formState.touchedFields.gender && (
                      <p className="text-sm text-red-600">
                        {formState.errors.gender.message}
                      </p>
                    )}
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <label
                    className="ms-1 text-fg font-medium"
                    htmlFor="dateOfBirth"
                  >
                    Date of birth
                  </label>
                  <input
                    {...register("dateOfBirth")}
                    id="dateOfBirth"
                    type="date"
                    className={`text-fg font-body bg-bg rounded-xl py-2.5 px-4 border border-border focus-visible:ring-1 ring-accent outline-0 transition-all duration-200 ${formState.errors.dateOfBirth && formState.touchedFields.dateOfBirth ? "ring-1 ring-red-600" : ""}`}
                    placeholder="Confirm your password"
                  />
                  {formState.errors.dateOfBirth &&
                    formState.touchedFields.dateOfBirth && (
                      <p className="text-sm text-red-600">
                        {formState.errors.dateOfBirth.message}
                      </p>
                    )}
                </div>
              </div>

              <div>
                <button
                  className="w-full text-white bg-primary rounded-full py-3.5 px-5 font-semibold cursor-pointer hover:scale-105 hover:shadow-[0_0_20px_rgba(108,92,231,0.4)] transition-all duration-300 active:scale-100"
                  disabled={isLoading}
                >
                  <span>Create account</span>{" "}
                  {isLoading && (
                    <RiLoader4Line className="text-xl animate-spin inline" />
                  )}
                </button>
              </div>
            </form>
            <span className="text-muted text-center">
              Already on Halo?{" "}
              <Link to="/login" className="text-accent font-semibold">
                Sign In
              </Link>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
