"use client";

import { motion } from "framer-motion";

/** Fixed aurora + dot grid + noise backdrop. Dark premium, emerald/gold. */
export function Background() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-[#0d0f0c]">
      {/* aurora blobs */}
      <div className="absolute -top-40 -left-32 h-[34rem] w-[34rem] rounded-full bg-emerald-500/14 blur-[120px] animate-aurora" />
      <div className="absolute top-1/3 -right-40 h-[30rem] w-[30rem] rounded-full bg-amber-500/10 blur-[130px] animate-aurora-slow" />
      <div className="absolute bottom-0 left-1/3 h-[26rem] w-[26rem] rounded-full bg-teal-500/10 blur-[120px] animate-aurora" />
      {/* dot grid */}
      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage: "radial-gradient(oklch(0.85 0.1 100 / 0.5) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
          maskImage: "radial-gradient(ellipse 90% 70% at 50% 30%, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 70% at 50% 30%, black 30%, transparent 75%)",
        }}
      />
      {/* faint world-ish contour lines */}
      <svg className="absolute inset-x-0 top-24 mx-auto w-full max-w-5xl opacity-[0.07]" viewBox="0 0 800 300" fill="none">
        <path d="M0 150 Q 200 40 400 150 T 800 150" stroke="oklch(0.85 0.14 82)" strokeWidth="1" />
        <path d="M0 180 Q 200 70 400 180 T 800 180" stroke="oklch(0.8 0.15 162)" strokeWidth="1" />
        <path d="M0 120 Q 200 10 400 120 T 800 120" stroke="oklch(0.85 0.1 82)" strokeWidth="1" />
      </svg>
      {/* noise */}
      <div className="noise absolute inset-0" />
      {/* top vignette */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4 }}
        className="absolute inset-0"
      />
    </div>
  );
}
