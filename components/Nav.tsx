"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { label: "Home", href: "/" },
  {
    label: "Photo",
    href: "/photo",
    children: [
      { label: "Project", href: "/photo/project" },
      { label: "Japan", href: "/photo/japan" },
      { label: "UK", href: "/photo/uk" },
    ],
  },
  { label: "Designer", href: "/designer" },
  { label: "Book", href: "/book" },
  { label: "Services", href: "/services" },
];

export default function Nav() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <nav className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-sm font-bold tracking-widest uppercase">
          Architecture Library
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-6 text-[13px]">
          {navItems.map((item) => (
            <li
              key={item.href}
              className="relative"
              onMouseEnter={() => item.children && setOpenMenu(item.label)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <Link
                href={item.href}
                className={`hover:opacity-60 transition-opacity ${
                  pathname.startsWith(item.href) && item.href !== "/"
                    ? "border-b border-black"
                    : pathname === "/" && item.href === "/"
                    ? "border-b border-black"
                    : ""
                }`}
              >
                {item.label}
              </Link>

              {item.children && openMenu === item.label && (
                <ul className="absolute top-full left-0 mt-1 bg-white border border-gray-200 shadow-md min-w-[120px]">
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        className="block px-4 py-2 text-[12px] hover:bg-gray-50"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-xl"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="menu"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 pb-4">
          {navItems.map((item) => (
            <div key={item.href}>
              <Link
                href={item.href}
                className="block py-2 text-sm font-medium"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
              {item.children &&
                item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className="block py-1 pl-4 text-sm text-gray-600"
                    onClick={() => setMobileOpen(false)}
                  >
                    {child.label}
                  </Link>
                ))}
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
