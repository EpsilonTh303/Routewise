"use client";

import { motion } from "framer-motion";
import { Banknote, CalendarClock, Flag, ShieldCheck, TriangleAlert } from "lucide-react";
import type { MatchResult } from "@/lib/types";
import { CATEGORY_META } from "@/lib/types";

export function MatchRing({ pct, size = 64, stroke = 6, delay = 0 }: {
  pct: number; size?: number; stroke?: number; delay?: number;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const color = pct >= 72 ? "#34d399" : pct >= 55 ? "#fbbf24" : "#a8a29e";
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="oklch(0.3 0.01 100)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (c * pct) / 100 }}
          transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <span
        className="absolute inset-0 grid place-items-center font-extrabold"
        style={{ fontSize: size * 0.3, color }}
      >
        {pct}
      </span>
    </div>
  );
}

export function ProgramCard({ result, rank, onOpen, delay = 0 }: {
  result: MatchResult; rank?: number; onOpen: () => void; delay?: number;
}) {
  const p = result.program;
  const meta = CATEGORY_META[p.category];
  const cond = result.eligibility === "conditional";

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ delay, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      onClick={onOpen}
      className={`group relative w-full overflow-hidden rounded-2xl border p-5 text-left transition-shadow ${
        cond
          ? "border-amber-400/25 bg-card hover:shadow-[0_16px_40px_-16px_rgba(251,191,36,0.35)]"
          : "border-white/10 bg-card hover:border-emerald-400/30 hover:shadow-[0_16px_40px_-16px_rgba(16,185,129,0.4)]"
      }`}
    >
      {rank === 1 && (
        <span className="absolute right-0 top-0 rounded-bl-xl bg-gradient-to-r from-amber-400 to-amber-500 px-2.5 py-1 text-[10px] font-extrabold tracking-wider text-black">
          ★ TOP MATCH
        </span>
      )}

      <div className="flex items-start gap-4">
        <MatchRing pct={result.matchPct} delay={delay} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl leading-none">{p.flag}</span>
            <span className="truncate text-base font-bold">{p.country}</span>
            {p.dvLottery && p.dvLottery && (
              <span className="rounded bg-emerald-400/15 px-1.5 py-0.5 text-[9px] font-bold text-emerald-300">DV ✓</span>
            )}
          </div>
          <p className="mt-0.5 truncate text-sm font-medium text-emerald-300/90">{p.program}</p>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{p.tagline}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <span className={`rounded-md bg-white/5 px-2 py-1 text-[11px] font-semibold ${meta.color}`}>
          {meta.emoji} {meta.label}
        </span>
        {cond ? (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-400/10 px-2 py-1 text-[11px] font-semibold text-amber-300">
            <TriangleAlert className="h-3 w-3" /> {result.gateIssues[0] ?? "Conditional"}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-400/10 px-2 py-1 text-[11px] font-semibold text-emerald-300">
            <ShieldCheck className="h-3 w-3" /> Eligible
          </span>
        )}
        {p.passportAccess !== "visa-required" && (
          <span className="rounded-md bg-white/5 px-2 py-1 text-[11px] font-semibold text-muted-foreground">
            {p.passportAccess === "visa-free" ? "🟢 visa-free" : "🟡 e-visa"}
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/8 pt-3.5">
        <div>
          <p className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground"><Banknote className="h-3 w-3" /> Year 1</p>
          <p className="mt-0.5 text-sm font-bold">${result.adjustedCost.toLocaleString()}</p>
        </div>
        <div>
          <p className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground"><CalendarClock className="h-3 w-3" /> Decision</p>
          <p className="mt-0.5 text-sm font-bold">
            {p.processingWeeks >= 52 ? `${(p.processingWeeks / 52).toFixed(1)}y` : `${p.processingWeeks}w`}
          </p>
        </div>
        <div>
          <p className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground"><Flag className="h-3 w-3" /> Citizenship</p>
          <p className="mt-0.5 text-sm font-bold">
            {p.yearsToCitizenship === 0 ? "⚡ immediate" : p.yearsToCitizenship ? `${p.yearsToCitizenship}y` : "—"}
          </p>
        </div>
      </div>
    </motion.button>
  );
}
