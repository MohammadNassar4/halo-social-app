import { useState } from "react";
import { FaArrowUp } from "react-icons/fa6";

export default function ScrollToTop() {
  const [pageScroll, setPageScroll] = useState(0);
  window.addEventListener("scroll", () => {
    setPageScroll(window.scrollY);
  });
  return (
    <button
      onClick={() => {
        window.scrollTo(0, 0);
      }}
      className={`size-10 bg-primary text-white fixed z-40 bottom-19 md:bottom-4 right-4 rounded-full hidden md:flex items-center justify-center cursor-pointer hover:scale-105 transition-all duration-200 hover:shadow-xl shadow-primary ${pageScroll > 1000 ? "opacity-100 visible" : "opacity-0 invisible"}`}
    >
      <FaArrowUp />
    </button>
  );
}
