import { useDialog } from "@/contexts/dialogContext/useDialog";
import { useNotificationCount } from "@/contexts/notificationContext/useNotificationCount";
import { BsBell, BsBookmark } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import { RiHomeLine, RiUser3Line } from "react-icons/ri";
import { NavLink } from "react-router";

export default function MobileNav() {
  const { openDialog } = useDialog();
  const { count } = useNotificationCount();
  
  return (
    <div className="fixed bottom-0 right-0 left-0 h-15 bg-header border-t border-border">
      <div className="px-4 flex items-center justify-between sm:justify-around h-full">
        <NavLink
          to="/home"
          onClick={() => {
            window.scrollTo(0, 0);
          }}
          className={({ isActive }) =>
            `flex flex-col items-center ${isActive ? "text-accent" : "text-muted"}`
          }
        >
          <RiHomeLine className="text-2xl" />
        </NavLink>
        <NavLink
          to="/myProfile"
          className={({ isActive }) =>
            `flex flex-col items-center ${isActive ? "text-accent" : "text-muted"}`
          }
        >
          <RiUser3Line className="text-2xl" />
        </NavLink>

        <button onClick={openDialog} className="size-13 button-primary p-0 relative -top-3 text-white flex items-center justify-center hover:shadow-[0_5px_20px_var(--primary)]">
          <FaPlus className="text-xl"/>
        </button>

        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            `flex flex-col items-center relative ${isActive ? "text-accent" : "text-muted"}`
          }
        >
          <BsBell className="text-2xl" />
          {count ? (
            <span className="bg-primary absolute size-5 rounded-full text-xs font-semibold flex justify-center items-center -top-2 -right-2 text-white">
              {count > 99 ? "99+" : count}
            </span>
          ) : null}
        </NavLink>
        <NavLink
          to="/saved"
          className={({ isActive }) =>
            `flex flex-col items-center ${isActive ? "text-accent" : "text-muted"}`
          }
        >
          <BsBookmark className="text-2xl" />
        </NavLink>
      </div>
    </div>
  );
}
