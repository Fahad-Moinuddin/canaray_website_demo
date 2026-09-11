"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/auth-context";

const nav = [
  { href: "/app", label: "Dashboard", exact: true },
  { href: "/app/referral", label: "Referral" },
  { href: "/app/book", label: "Book" },
  { href: "/app/messages", label: "Messages" },
  { href: "/app/consent", label: "Consent" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout, ready } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="skeleton h-8 w-40" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <p className="text-ink-soft">Sign in to explore the Canaray demo.</p>
        <Link href="/login">
          <Button>Sign in</Button>
        </Link>
      </div>
    );
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Logo href="/app" />
            <nav className="hidden items-center gap-1 lg:flex" aria-label="App">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(item.href, item.exact)
                      ? "bg-accent-soft text-accent-deep"
                      : "text-ink-soft hover:bg-background hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-ink">{user.name}</p>
              <p className="text-xs text-muted">
                {user.title}
                {user.practice ? ` · ${user.practice}` : ""}
              </p>
            </div>
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-xs font-bold text-white"
              aria-hidden
            >
              {user.initials}
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="hidden sm:inline-flex"
              onClick={() => {
                logout();
                router.push("/");
              }}
            >
              Sign out
            </Button>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line lg:hidden"
              aria-label="Open navigation"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
        {menuOpen ? (
          <nav className="border-t border-line px-4 py-3 lg:hidden" aria-label="Mobile app">
            <div className="flex flex-col gap-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive(item.href, item.exact)
                      ? "bg-accent-soft text-accent-deep"
                      : "text-ink-soft"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <button
                type="button"
                className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-danger"
                onClick={() => {
                  logout();
                  router.push("/");
                }}
              >
                Sign out
              </button>
            </div>
          </nav>
        ) : null}
      </header>
      <main id="main" className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
