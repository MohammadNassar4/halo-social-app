import { Link } from "react-router";
import { ThemeToggle } from "./ThemeToggle";
import { BsBell } from "react-icons/bs";
import { useAuth } from "../contexts/authContext/useAuth";
import { FaArrowRightLong } from "react-icons/fa6";
import { useNotificationCount } from "@/contexts/notificationContext/useNotificationCount";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  LogOutIcon,
  UserIcon,
} from "lucide-react";
import useLogOut from "./useLogOut";

export default function Navbar() {
  const { userData } = useAuth();
  const { count } = useNotificationCount();
  const logOut = useLogOut();
  return (
    <header className="bg-header border-b border-b-border sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-10 lg:px-20 py-3 max-w-full">
        <nav className="flex items-center justify-between gap-4">
          <Link to="/home">
            <div className="flex items-center gap-2">
              <svg
                data-dc-tpl={7}
                width={36}
                height={36}
                viewBox="0 0 64 64"
                role="img"
                aria-label="Halo logo"
              >
                <defs data-dc-tpl={8}>
                  <linearGradient
                    data-dc-tpl={9}
                    id="hfd"
                    x1={0}
                    y1={0}
                    x2={1}
                    y2={1}
                  >
                    <stop data-dc-tpl={10} offset={0} stopColor="#7C3AED" />
                    <stop data-dc-tpl={11} offset="0.55" stopColor="#06B6D4" />
                    <stop data-dc-tpl={12} offset={1} stopColor="#34D399" />
                  </linearGradient>
                </defs>
                <circle
                  data-dc-tpl={13}
                  cx={30}
                  cy={34}
                  r={19}
                  fill="none"
                  stroke="url(#hfd)"
                  strokeWidth={7}
                />
                <circle
                  data-dc-tpl={14}
                  cx={50}
                  cy={14}
                  r={6}
                  fill="url(#hfd)"
                />
              </svg>
              <h1 className="text-2xl font-semibold font-heading">Halo</h1>
            </div>
          </Link>

          <div className="flex items-center gap-5">
            <ThemeToggle />
            <Link
              to="/notifications"
              className="w-11 h-11 border border-border rounded-full hidden sm:flex justify-center items-center bg-surface transition-colors hover:border-accent cursor-pointer relative"
            >
              <BsBell className="text-lg" />
              {count ? (
                <span className="bg-primary absolute size-6 rounded-full text-xs font-semibold flex justify-center items-center -top-2 -right-2 text-white">
                  {count > 99 ? "99+" : count}
                </span>
              ) : null}
            </Link>

            {userData ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <div className="bg-halo-gradient rounded-full p-0.5">
                        <div className="w-12 h-12 rounded-full bg-header flex justify-center items-center overflow-hidden">
                          <img
                            src={userData.photo}
                            alt="User profile picture"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </Button>
                  }
                />
                <DropdownMenuContent align="end" className="bg-surface">
                  <DropdownMenuGroup>
                    <Link to="/myProfile">
                      <DropdownMenuItem className="hover:bg-surface-2">
                        <UserIcon />
                        Profile
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <button className="w-full" onClick={logOut}>
                    <DropdownMenuItem className="hover:bg-red-500/20 text-red-500">
                      <LogOutIcon />
                      Log Out
                    </DropdownMenuItem>
                  </button>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                to="/register"
                className="bg-halo-gradient py-2 px-4 rounded-full text-white font-semibold cursor-pointer flex items-center gap-2 hover:gap-4 transition-all duration-200"
              >
                <span>Sign up</span>{" "}
                <span className="">
                  <FaArrowRightLong />
                </span>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
