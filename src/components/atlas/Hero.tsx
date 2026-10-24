"use client";

import { useRef } from "react";
import {
  motion, useMotionValue, useSpring, useTransform,
} from "framer-motion";
import { ArrowRight, Globe2, MapPin, Route } from "lucide-react";
import { PROGRAM_COUNT, COUNTRY_COUNT } from "@/lib/data";

const FLOATING_FLAGS = [
  { flag: "🇩🇪", x: "-8%", y: "6%", delay: 0 },
  { flag: "🇬🇧", x: "104%", y: "12%", delay: 0.4 },
  { flag: "🇦🇪", x: "-14%", y: "58%", delay: 0.8 },
  { flag: "🇺🇸", x: "102%", y: "66%", delay: 1.2 },
  { flag: "🇵🇹", x: "3%", y: "106%", delay: 0.6 },
  { flag: "🇸🇬", x: "88%", y: "104%", delay: 1.0 },
];

function PassportCard() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [14, -14]), { stiffness: 140, damping: 16 });
  const ry = useSpring(useTransform(mx, [0, 1], [-16, 16]), { stiffness: 140, damping: 16 });

  return (
    <div
      className="relative h-[290px] w-[420px] max-w-[86vw] [perspective:1200px]"
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      onMouseLeave={() => { mx.set(0.5); my.set(0.5); }}
    >
      {FLOATING_FLAGS.map((f, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 + f.delay * 0.35, type: "spring", stiffness: 200 }}
          className="absolute z-10 grid h-11 w-11 place-items-center rounded-full glass text-xl shadow-lg animate-float"
          style={{ left: f.x, top: f.y, animationDelay: `${i * 0.7}s` }}
        >
          {f.flag}
        </motion.span>
      ))}

      <motion.div
        ref={ref}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        initial={{ opacity: 0, y: 30, rotate: -4 }}
        animate={{ opacity: 1, y: 0, rotate: -2 }}
        transition={{ type: "spring", stiffness: 60, damping: 14, delay: 0.3 }}
        className="relative h-full w-full rounded-2xl border border-emerald-300/20 bg-gradient-to-br from-emerald-950 via-[#0e2a1e] to-emerald-900 p-6 shadow-[0_30px_80px_-20px_rgba(16,185,129,0.35)]"
      >
        {/* guilloche texture */}
        <svg className="absolute inset-0 h-full w-full rounded-2xl opacity-[0.08]" aria-hidden>
          <defs>
            <pattern id="gll" width="26" height="26" patternUnits="userSpaceOnUse">
              <circle cx="13" cy="13" r="10" fill="none" stroke="white" strokeWidth="0.6" />
              <circle cx="0" cy="0" r="10" fill="none" stroke="white" strokeWidth="0.6" />
              <circle cx="26" cy="26" r="10" fill="none" stroke="white" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gll)" />
        </svg>

        <div className="relative flex h-full flex-col justify-between [transform:translateZ(40px)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] tracking-[0.28em] text-emerald-200/80">AZƏRBAYCAN RESPUBLİKASI</p>
              <p className="mt-0.5 text-[10px] tracking-[0.28em] text-emerald-200/50">REPUBLIC OF AZERBAIJAN</p>
            </div>
            <span className="rounded-md bg-amber-400/15 px-2 py-1 text-[10px] font-bold tracking-widest text-amber-300">PASSPORT</span>
          </div>

          <div className="flex items-center gap-4">
            {/* flame emblem hint */}
            <div className="grid h-16 w-16 place-items-center rounded-xl border border-amber-300/30 bg-amber-400/10 text-2xl">🔥</div>
            <div>
              <p className="text-xs text-emerald-200/60">VIZA / VISA</p>
              <p className="mt-0.5 font-mono text-sm text-emerald-100">P&lt;AZN ROUTEWISE&lt;&lt;STRATEGY&lt;&lt;&lt;&lt;</p>
              <p className="font-mono text-sm text-emerald-100">AZ76FREEDOM4504567890&lt;&lt;&lt;&lt;&lt;&lt;</p>
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] tracking-widest text-emerald-200/60">STARTING POINT</p>
              <p className="text-lg font-bold text-white">Baku → anywhere</p>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-200">
              📍 76 visa-free
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const STATS = [
  { icon: Route, value: String(PROGRAM_COUNT), label: "visa programs" },
  { icon: Globe2, value: `${COUNTRY_COUNT}`, label: "countries" },
  { icon: MapPin, value: "6", label: "continents" },
];

export function Hero({ onStart, onExplore }: { onStart: () => void; onExplore: () => void }) {
  return (
    <section className="relative mx-auto flex max-w-6xl flex-col items-center gap-12 px-4 pb-16 pt-14 sm:px-6 lg:flex-row lg:items-center lg:gap-8 lg:pt-24">
      <div className="flex-1 text-center lg:text-left">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-emerald-300 lg:mx-0"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 [animation:pulse-ring_1.8s_ease-out_infinite]" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Calibrated for the Azerbaijani passport
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, type: "spring", stiffness: 70 }}
          className="text-balance text-4xl font-extrabold leading-[1.06] tracking-tight sm:text-5xl lg:text-[3.6rem]"
        >
          One passport in.
          <br />
          <span className="text-gradient-emerald">Sixty-two routes</span>
          <br />
          <span className="text-gradient-gold">out.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0"
        >
          Enter your citizenship, budget, family and career — RouteWise scores{" "}
          <strong className="text-foreground">{PROGRAM_COUNT} real residence &amp; citizenship programs</strong>{" "}
          across {COUNTRY_COUNT} countries, filters what you actually qualify for, and assembles a
          Plan A → B → C relocation strategy with costs and timelines.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
        >
          <button
            onClick={onStart}
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 px-7 py-3.5 text-base font-bold text-black glow-emerald transition-transform hover:scale-[1.03] active:scale-95"
          >
            Build my strategy
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button
            onClick={onExplore}
            className="rounded-full glass px-6 py-3.5 text-base font-semibold text-foreground transition-colors hover:bg-white/10"
          >
            Browse all routes
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-4 sm:gap-8 lg:justify-start"
        >
          {STATS.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-emerald-400">
                <s.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xl font-extrabold leading-none">{s.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="relative flex flex-1 justify-center lg:justify-end">
        <PassportCard />
      </div>
    </section>
  );
}
