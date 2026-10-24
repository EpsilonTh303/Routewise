"use client";

import { motion } from "framer-motion";
import { Compass, Globe2, Table2 } from "lucide-react";

export function Navbar({
  view,
  onNav,
}: {
  view: "landing" | "wizard" | "results" | "explore";
  onNav: (v: "landing" | "explore" | "strategy") => void;
}) {
  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
      className="sticky top-0 z-40 glass-strong border-b border-white/5"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <button
          onClick={() => onNav("landing")}
          className="flex items-center gap-2.5 group"
          aria-label="RouteWise home"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-black glow-emerald transition-transform group-hover:rotate-12">
            <Compass className="h-5 w-5" strokeWidth={2.4} />
          </span>
          <span className="text-lg font-bold tracking-tight">
            Route<span className="text-gradient-gold">Wise</span>
          </span>
        </button>

        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main">
          <button
            onClick={() => onNav("explore")}
            aria-label="Explore all routes"
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
              view === "explore"
                ? "bg-emerald-500/15 text-emerald-300"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`}
          >
            <Table2 className="h-4 w-4" />
            <span className="hidden sm:inline">Explore</span>
          </button>
          <button
            onClick={() => onNav("strategy")}
            aria-label="My strategy"
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
              view === "results"
                ? "bg-emerald-500/15 text-emerald-300"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`}
          >
            <Globe2 className="h-4 w-4" />
            <span className="hidden sm:inline">My strategy</span>
          </button>
        </nav>
      </div>
    </motion.header>
  );
}
