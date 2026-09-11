import Link from "next/link";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted">
            Specialized oral radiology and advanced dental imaging for dentists,
            offices, and patients across Canada.
          </p>
          <p className="mt-4 text-xs text-muted">
            Demo prototype — fictional data only. Not connected to Canaray production systems.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-ink">For professionals</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>
              <Link href="/login" className="hover:text-accent">
                Make a referral
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-accent">
                Book imaging
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-accent">
                View reports
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-ink">Patients</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>
              <Link href="/login" className="hover:text-accent">
                Book an appointment
              </Link>
            </li>
            <li>
              <Link href="/app/consent" className="hover:text-accent">
                Consent form (kiosk demo)
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} Canaray Demo · Proof of concept
      </div>
    </footer>
  );
}
