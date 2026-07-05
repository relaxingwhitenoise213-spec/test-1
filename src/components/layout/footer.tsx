import Link from "next/link";
import { AudioLines } from "lucide-react";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <AudioLines className="h-4 w-4 text-primary" />
          <span>
            {siteConfig.name} — {siteConfig.tagline}.
          </span>
        </div>
        <nav className="flex items-center gap-4 text-sm text-muted-foreground" aria-label="Footer">
          <Link href="/settings" className="hover:text-foreground">
            Settings
          </Link>
          <Link href="/history" className="hover:text-foreground">
            History
          </Link>
          <span aria-hidden>·</span>
          <span>© {new Date().getFullYear()}</span>
        </nav>
      </div>
    </footer>
  );
}
