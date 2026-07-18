"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { AuthSession } from "@/lib/auth/session";
import { getProfileMenuItems } from "@/lib/auth/profile-menu-items";
import { getUserInitials } from "@/lib/auth/user-initials";
import { cn } from "@/lib/utils";

type UserProfileMenuProps = {
  session: AuthSession;
  heroNav?: boolean;
  onSignOut: () => void | Promise<void>;
  isSigningOut?: boolean;
};

export function UserProfileMenu({
  session,
  heroNav = false,
  onSignOut,
  isSigningOut = false,
}: UserProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const initials = getUserInitials(session.fullName);
  const items = getProfileMenuItems(session.role);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label="Open account menu"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex size-10 items-center justify-center rounded-full text-sm font-semibold transition-all",
          "bg-violet-950 text-violet-100 ring-2 ring-violet-300/30 hover:ring-violet-200/50",
          heroNav && "ring-white/30 hover:ring-white/50"
        )}
      >
        {initials}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-50 min-w-[220px] overflow-hidden rounded-xl border border-white/10 bg-neutral-950/95 py-2 shadow-2xl shadow-black/40 backdrop-blur-md"
        >
          <div className="border-b border-white/10 px-4 py-3">
            <p className="truncate text-sm font-medium text-amber-50">
              {session.fullName}
            </p>
            <p className="truncate text-xs text-amber-50/60">{session.email}</p>
          </div>

          <div className="py-1">
            {items.map((item) => {
              const Icon = item.icon;

              if (item.type === "action") {
                return (
                  <button
                    key={item.label}
                    type="button"
                    role="menuitem"
                    disabled={isSigningOut}
                    onClick={() => {
                      setOpen(false);
                      void onSignOut();
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-amber-50/90 transition-colors hover:bg-white/10 disabled:opacity-50"
                  >
                    <Icon className="size-4 shrink-0 text-amber-50/70" />
                    {isSigningOut && item.action === "sign-out"
                      ? "Signing out..."
                      : item.label}
                  </button>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-amber-50/90 transition-colors hover:bg-white/10"
                >
                  <Icon className="size-4 shrink-0 text-amber-50/70" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
