"use client";

import { useState } from "react";
import Link from "next/link";
import Wordmark from "@/components/ui/Wordmark";
import UserMenu from "@/components/UserMenu";

type NavLink = {
  label: string;
  href: string;
};

const NAV_LINKS: NavLink[] = [
  { label: "Discover", href: "/" },
  { label: "Library", href: "/library" },
  { label: "Dashboard", href: "/dashboard" },
];

export type SiteHeaderUser = {
  email: string;
} | null;

type SiteHeaderProps = {
  user?: SiteHeaderUser;
};

export default function SiteHeader({ user = null }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-paper/95">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Wordmark />

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted-ink transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <UserMenu email={user.email} />
          ) : (
            <Link
              href="/sign-in"
              className="hidden rounded-md bg-ink px-5 py-2.5 text-sm font-semibold text-surface transition-colors hover:bg-ink/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 sm:inline-flex"
            >
              Sign in
            </Link>
          )}
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-hairline text-muted-ink transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:hidden"
          >
            <span aria-hidden="true" className="relative block h-3 w-4">
              <span
                className={`absolute left-0 block h-px w-4 bg-current transition-all ${
                  isMenuOpen ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 block h-px w-4 bg-current transition-opacity ${
                  isMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-px w-4 bg-current transition-all ${
                  isMenuOpen ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav className="border-t border-hairline bg-paper px-4 pb-5 pt-2 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="block rounded-md px-2 py-2.5 text-sm font-medium text-muted-ink transition-colors hover:bg-surface hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
          {!user && (
            <Link
              href="/sign-in"
              onClick={() => setIsMenuOpen(false)}
              className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-ink px-5 py-2.5 text-sm font-semibold text-surface"
            >
              Sign in
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
