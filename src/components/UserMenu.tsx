"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type UserMenuProps = {
  email: string;
};

export default function UserMenu({ email }: UserMenuProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  async function handleSignOut() {
    setIsSigningOut(true);
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  }

  const initial = email.charAt(0).toUpperCase();

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="flex items-center gap-2 rounded-md border border-hairline bg-surface py-1 pl-1 pr-3 transition-colors hover:border-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-ink text-sm font-semibold text-surface">
          {initial}
        </span>
        <ChevronDown className="h-4 w-4 text-muted-ink" />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-md border border-hairline bg-surface shadow-sm"
        >
          <div className="border-b border-hairline px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-ink/70">
              Signed in as
            </p>
            <p className="mt-0.5 truncate text-sm font-semibold text-ink">
              {email}
            </p>
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-muted-ink transition-colors hover:bg-paper hover:text-accent disabled:opacity-60"
          >
            <LogOut className="h-4 w-4" />
            {isSigningOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      )}
    </div>
  );
}
