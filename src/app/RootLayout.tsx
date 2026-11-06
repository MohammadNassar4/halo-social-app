import { Outlet, useLocation } from "react-router";
import Navbar from "../myComponents/Navbar";
import SideNav from "../myComponents/SideNav";
import MobileNav from "../myComponents/MobileNav";
import Sidebar from "../myComponents/Sidebar";

export default function RootLayout() {
  const { pathname } = useLocation();
  return (
    <>
      <Navbar />
      <main className="sm:p-8 sm:pt-0 pt-0 mb-15 md:mb-0">
        <div className="container mx-auto max-w-7xl flex items-start gap-8 relative">
          <div className="hidden md:block md:w-3/12 sticky top-27">
            <SideNav />
          </div>

          {pathname.toLocaleLowerCase().includes("profile") ? (
            <div className="w-12/12 lg:w-9/12 mt-8">
              <Outlet />
            </div>
          ) : (
            <div className="w-12/12 xl:w-6/12 md:w-9/12">
              <Outlet />
            </div>
          )}

          {pathname.toLocaleLowerCase().includes("profile") ? null : (
            <aside className="hidden xl:block w-3/12 sticky top-27">
              <Sidebar />
            </aside>
          )}
        </div>
      </main>
      <div className=" md:hidden">
        <MobileNav />
      </div>
    </>
  );
}
