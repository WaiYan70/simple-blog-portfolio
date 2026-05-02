"use client";

import { useEffect, useState } from "react";
import NavbarLinks from "./NavbarLinks";
import { NavbarActions } from "./NavbarActions";
import { NavbarBrand } from "./NavbarBrand";
import { MobileNavbar } from "./MobileNavbar";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-300 ${
        scrolled
          ? "bg-card/60 backdrop-blur-sm border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-3">
        <NavbarBrand />
        <NavbarLinks />
        <NavbarActions />
        <MobileNavbar />
      </div>
    </header>
  );
}
