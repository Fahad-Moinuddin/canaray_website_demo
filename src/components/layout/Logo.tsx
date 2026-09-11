import Link from "next/link";

export function Logo({
  variant = "dark",
  href = "/",
}: {
  variant?: "dark" | "light";
  href?: string;
}) {
  const color = variant === "light" ? "text-white" : "text-ink";
  return (
    <Link href={href} className={`inline-flex items-center gap-2.5 ${color}`}>
      <span
        className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white"
        aria-hidden
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="9" cy="9" r="2.5" fill="currentColor" />
          <path d="M9 2.5V4.5M9 13.5V15.5M2.5 9H4.5M13.5 9H15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </span>
      <span className="font-display text-xl tracking-tight">Canaray</span>
    </Link>
  );
}
