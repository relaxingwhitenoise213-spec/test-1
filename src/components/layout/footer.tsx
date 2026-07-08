import Link from "next/link";
import { Landmark } from "lucide-react";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Landmark className="h-4 w-4 text-primary" />
          <span>
            {siteConfig.name} — {siteConfig.tagline}
          </span>
        </div>
        <nav
          className="flex items-center gap-4 text-sm text-muted-foreground"
          aria-label="Footer"
        >
          <Link href="/practice" className="hover:text-foreground">
            Practice
          </Link>
          <Link href="/mock-test" className="hover:text-foreground">
            Mock test
          </Link>
          <span aria-hidden>·</span>
          <span>© {new Date().getFullYear()}</span>
        </nav>
      </div>
      <div className="border-t bg-muted/40">
        <p className="mx-auto max-w-6xl px-4 py-3 text-center text-xs text-muted-foreground sm:px-6">
          Unofficial study aid. Not affiliated with the Home Office. Always
          study the official handbook &lsquo;Life in the United Kingdom: A
          Guide for New Residents&rsquo; and book the real test on GOV.UK.
        </p>
      </div>
    </footer>
  );
}
