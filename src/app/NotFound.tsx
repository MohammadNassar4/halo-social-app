import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { HaloMark } from "../myComponents/HaloMark";

export default function NotFound() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const previous = document.title;
    document.title = "Page not found | Halo";
    return () => {
      document.title = previous;
    };
  }, []);

  // key === "default" means this was the first page in the tab, so there is nothing to go back to
  const goBack = () => (location.key !== "default" ? navigate(-1) : navigate("/"));

  return (
    <div className="flex min-h-screen flex-col bg-bg font-sans text-fg">

      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12 text-center">
        {/* screen readers hear "Error 404" once instead of "4, 4" */}
        <p
          role="img"
          aria-label="Error 404"
          className="flex items-center gap-1 font-display text-[96px] leading-none font-bold sm:gap-2 sm:text-[168px]"
        >
          <span aria-hidden="true">4</span>
          <HaloMark className="size-21 sm:size-37.5" />
          <span aria-hidden="true">4</span>
        </p>

        <h1 className="font-display text-[26px] font-bold sm:text-4xl">
          This page drifted out of orbit
        </h1>

        <p className="max-w-md text-base leading-relaxed text-muted sm:text-lg">
          The page you’re looking for doesn’t exist, or it has moved somewhere else.
        </p>

        <div className="h-0.75 w-12 rounded-full bg-halo-gradient" />

        <div className="mt-3 flex w-full max-w-xs flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-white shadow-[0_0_24px_var(--glow)] transition-opacity hover:opacity-90"
          >
            Back to home
          </Link>
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center justify-center rounded-full border border-accent px-7 py-3 text-base font-semibold text-accent transition-colors hover:bg-accent/10"
          >
            Go back
          </button>
        </div>
      </main>
    </div>
  );
}