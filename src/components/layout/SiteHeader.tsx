"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/auth-context";

const links = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#services", label: "Services" },
  { href: "/#for-dentists", label: "For dentists" },
  { href: "/#faq", label: "FAQ" },
];

export function SiteHeader() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Logo variant={pathname === "/" ? "light" : "dark"} />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <Link href="/app">
              <Button size="sm" variant="soft">
                Open dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold text-white/90 hover:text-white">
                Sign in
              </Link>
              <Link href="/login">
                <Button size="sm">Make a referral</Button>
              </Link>
            </>
          )}
        </div>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white md:hidden"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>
      {open ? (
        <div className="border-t border-white/10 bg-[#0b1f33]/95 px-4 py-4 backdrop-blur md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-lg px-2 py-2 text-sm font-medium text-white/90"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <Link href={user ? "/app" : "/login"} onClick={() => setOpen(false)}>
              <Button fullWidth>{user ? "Open dashboard" : "Sign in"}</Button>
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
