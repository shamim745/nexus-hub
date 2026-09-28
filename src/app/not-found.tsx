import Link from "next/link";
import { Compass, SearchX } from "lucide-react";
import { buttonVariants } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="grid size-16 place-items-center rounded-2xl bg-panel-2 text-brand-500">
        <SearchX className="size-7" />
      </div>
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-3">Error 404</p>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">This route does not exist</h1>
        <p className="max-w-md text-sm text-ink-3">
          The requested resource is outside the configured route table. Return to the console to continue.
        </p>
      </div>
      <Link href="/" className={buttonVariants("primary", "md")}>
        <Compass className="size-4" />
        Back to home
      </Link>
    </div>
  );
}
