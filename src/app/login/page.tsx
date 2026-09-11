"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo } from "react";
import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { Alert } from "@/components/ui/Badge";
import { useAuth } from "@/context/auth-context";
import { DEMO_USERS } from "@/lib/mock-data";
import type { UserRole } from "@/lib/types";

function LoginContent() {
  const { login, user } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const preferred = params.get("role") as UserRole | null;

  const users = useMemo(() => {
    if (!preferred) return DEMO_USERS;
    const preferredUsers = DEMO_USERS.filter((u) => u.role === preferred);
    const rest = DEMO_USERS.filter((u) => u.role !== preferred);
    return [...preferredUsers, ...rest];
  }, [preferred]);

  useEffect(() => {
    if (user) router.replace("/app");
  }, [user, router]);

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div className="hero-atmosphere absolute inset-x-0 top-0 h-64 opacity-90" aria-hidden />
      <div className="relative mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-10 sm:px-6">
        <Logo variant="light" />
        <div className="mt-16 rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-md)] sm:p-8">
          <h1 className="font-display text-3xl text-ink">Sign in to the demo</h1>
          <p className="mt-2 text-sm text-muted">
            Choose a fictional persona. No passwords — this is a front-end prototype with mock data.
          </p>
          <Alert tone="accent" title="Demo authentication" >
            Progress for referrals and bookings is saved in your browser so you won&apos;t lose work mid-flow.
          </Alert>
          <ul className="mt-6 space-y-3">
            {users.map((u) => (
              <li key={u.id}>
                <button
                  type="button"
                  onClick={() => {
                    login(u.id);
                    router.push(u.role === "patient" ? "/app/book" : "/app");
                  }}
                  className="flex w-full items-center gap-4 rounded-xl border border-line bg-background px-4 py-3 text-left transition-colors hover:border-accent hover:bg-accent-soft/40"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
                    {u.initials}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-ink">{u.name}</span>
                    <span className="block truncate text-xs text-muted">
                      {u.title}
                      {u.practice ? ` · ${u.practice}` : ""}
                    </span>
                  </span>
                  <span className="text-xs font-semibold capitalize text-accent">{u.role}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-center text-sm text-muted">
            <Link href="/" className="font-medium text-accent hover:underline">
              Back to homepage
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="skeleton h-10 w-48" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
