"use client";

import { Compass, ShieldAlert } from "lucide-react";
import { PROGRAM_COUNT, COUNTRY_COUNT } from "@/lib/data";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/5 bg-black/30">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row">
          <div className="max-w-md">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 text-black">
                <Compass className="h-4 w-4" strokeWidth={2.4} />
              </span>
              <span className="font-bold tracking-tight">Route<span className="text-gradient-gold">Wise</span></span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              An independent strategy explorer: {PROGRAM_COUNT} residence &amp; citizenship programs across {COUNTRY_COUNT} countries,
              scored live in your browser against your own profile. Calibrated around the Azerbaijani passport —
              the most under-served passport in immigration tech.
            </p>
          </div>
          <div className="flex max-w-sm items-start gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <p className="text-xs leading-relaxed text-amber-100/80">
              <strong>Not legal or tax advice.</strong> Rules change constantly — figures are 2025-era
              estimates for orientation. Always verify with official program pages (linked in every card)
              and a licensed adviser before paying anything.
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-white/5 pt-5 text-[11px] text-muted-foreground/70">
          RouteWise · built with Next.js + scoring engine · all figures approximate, all decisions yours.
        </div>
      </div>
    </footer>
  );
}
