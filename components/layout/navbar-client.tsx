"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Building2, LogOut, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import type { AuthSession } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants/site";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type NavbarClientProps = {
  session: AuthSession | null;
};

export function NavbarClient({ session }: NavbarClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = pathname === "/";
  const heroNav = isHome && !scrolled && !mobileOpen;

  useEffect(() => {
    if (!isHome) {
      setScrolled(false);
      return;
    }

    function onScroll() {
      setScrolled(window.scrollY > 48);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  async function handleSignOut() {
    setIsSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setMobileOpen(false);
    router.push("/");
    router.refresh();
    setIsSigningOut(false);
  }

  const showOwnerCta = !session || session.role === "owner";

  return (
    <header
      className={cn(
        "z-50 w-full transition-colors duration-300",
        isHome
          ? cn(
              "fixed top-0",
              heroNav
                ? "border-b-0 bg-transparent"
                : "border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
            )
          : "sticky top-0 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2 font-semibold tracking-tight transition-colors",
            heroNav ? "text-white" : "text-foreground"
          )}
        >
          <span
            className={cn(
              "flex size-8 items-center justify-center rounded-lg",
              heroNav
                ? "bg-white/15 text-white ring-1 ring-white/20"
                : "bg-primary text-primary-foreground"
            )}
          >
            <Building2 className="size-4" />
          </span>
          <span>{SITE_NAME}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                heroNav
                  ? "text-white/85 hover:bg-white/10 hover:text-white"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {session ? (
            <>
              <span
                className={cn(
                  "hidden max-w-[140px] truncate text-sm lg:inline",
                  heroNav ? "text-white/70" : "text-muted-foreground"
                )}
              >
                {session.fullName}
              </span>
              <Button
                variant="ghost"
                className={cn(
                  heroNav &&
                    "text-white hover:bg-white/10 hover:text-white"
                )}
                render={<Link href={session.dashboardPath} />}
              >
                Dashboard
              </Button>
              <Button
                variant="outline"
                className={cn(
                  heroNav &&
                    "border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
                )}
                onClick={handleSignOut}
                disabled={isSigningOut}
              >
                <LogOut className="size-4" />
                {isSigningOut ? "Signing out..." : "Sign out"}
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              className={cn(
                heroNav && "text-white hover:bg-white/10 hover:text-white"
              )}
              render={<Link href="/login" />}
            >
              Sign in
            </Button>
          )}

          {showOwnerCta && (
            <Button
              className={cn(
                heroNav &&
                  "bg-white text-foreground hover:bg-white/90"
              )}
              render={
                <Link
                  href={
                    session?.role === "owner"
                      ? "/dashboard/owner/listings/new"
                      : "/register?role=owner"
                  }
                />
              }
            >
              List your property
            </Button>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "md:hidden",
            heroNav && "text-white hover:bg-white/10 hover:text-white"
          )}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>

      <div
        className={cn(
          "border-t md:hidden",
          mobileOpen ? "block" : "hidden",
          heroNav
            ? "border-white/10 bg-black/80 backdrop-blur-md"
            : "border-border bg-background"
        )}
      >
        <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                heroNav
                  ? "text-white/90 hover:bg-white/10"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <div
            className={cn(
              "mt-2 flex flex-col gap-2 border-t pt-3",
              heroNav ? "border-white/10" : "border-border"
            )}
          >
            {session ? (
              <>
                <p
                  className={cn(
                    "px-3 text-sm",
                    heroNav ? "text-white/70" : "text-muted-foreground"
                  )}
                >
                  Signed in as {session.fullName}
                </p>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full",
                    heroNav &&
                      "border-white/30 bg-transparent text-white hover:bg-white/10"
                  )}
                  render={<Link href={session.dashboardPath} />}
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </Button>
                <Button
                  className="w-full"
                  variant="secondary"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                >
                  {isSigningOut ? "Signing out..." : "Sign out"}
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                className={cn(
                  "w-full",
                  heroNav &&
                    "border-white/30 bg-transparent text-white hover:bg-white/10"
                )}
                render={<Link href="/login" />}
                onClick={() => setMobileOpen(false)}
              >
                Sign in
              </Button>
            )}

            {showOwnerCta && (
              <Button
                className={cn(
                  "w-full",
                  heroNav && "bg-white text-foreground hover:bg-white/90"
                )}
                render={
                  <Link
                    href={
                      session?.role === "owner"
                        ? "/dashboard/owner/listings/new"
                        : "/register?role=owner"
                    }
                  />
                }
                onClick={() => setMobileOpen(false)}
              >
                List your property
              </Button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
