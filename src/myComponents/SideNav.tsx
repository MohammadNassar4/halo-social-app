import { NavLink } from "react-router";
import { BsBell, BsBookmark, BsSliders } from "react-icons/bs";
import { RiHomeLine, RiUser3Line } from "react-icons/ri";
import { useDialog } from "../contexts/dialogContext/useDialog";
import { useNotificationCount } from "@/contexts/notificationContext/useNotificationCount";
import useLogOut from "./useLogOut";
import { MdLogout } from "react-icons/md";


type navLink = { title: string; to: string; icon: React.ReactNode };

export default function SideNav() {
  const { openDialog } = useDialog();
  const { count } = useNotificationCount();
  const navLinks: navLink[] = [
    { title: "Home", to: "/home", icon: <RiHomeLine /> },
    { title: "Profile", to: "/myProfile", icon: <RiUser3Line /> },
    { title: "Saved", to: "/saved", icon: <BsBookmark /> },
    { title: "Notification", to: "/notifications", icon: <BsBell /> },
    { title: "Settings", to: "/settings", icon: <BsSliders /> },
  ];
  const logOut = useLogOut();

  return (
    <nav className="hidden md:block ">
      <ul className="flex flex-col gap-2">
        {navLinks.map((link, i) => (
          <li key={i} className="w-full">
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 relative ${
                  isActive
                    ? "border border-border bg-surface font-semibold text-fg shadow-[0_0_4px_rgba(108,92,231,0.4)]"
                    : "text-muted hover:text-fg"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`text-xl ${isActive && "text-accent"}`}>
                    {link.icon}
                  </span>{" "}
                  <span>{link.title}</span>
                  {link.title === "Notification" && count ? (
                    <span className="bg-primary absolute size-6 rounded-full text-xs font-semibold flex justify-center items-center top-3 right-2 text-white">
                      {count > 99 ? "99+" : count}
                    </span>
                  ) : null}
                </>
              )}
            </NavLink>
          </li>
        ))}
        <li className="w-full">
          <button
            className="px-4 py-3 text-red-500 flex items-center gap-3 rounded-lg hover:bg-red-500/20 w-full transition-colors duration-200 cursor-pointer font-semibold"
            onClick={() => {
              logOut();
            }}
          >
            <MdLogout className="text-xl" />
            Log out
          </button>
        </li>
      </ul>
      <button
        onClick={() => {
          openDialog();
        }}
        className="button-primary py-2 text-lg font-bold mt-4 hover:scale-100"
      >
        New Post
      </button>
    </nav>
  );
}
