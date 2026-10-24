"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Profile } from "@/lib/types";
import { matchAll } from "@/lib/scoring";
import { Background } from "@/components/atlas/Background";
import { Navbar } from "@/components/atlas/Navbar";
import { Hero } from "@/components/atlas/Hero";
import { Wizard } from "@/components/atlas/Wizard";
import { Results } from "@/components/atlas/Results";
import { Explorer } from "@/components/atlas/Explorer";
import { Footer } from "@/components/atlas/Footer";

const STORAGE_KEY = "routewise-profile-v1";
type View = "landing" | "wizard" | "results" | "explore";

export default function Home() {
  const [view, setView] = useState<View>("landing");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // restore saved profile (deferred to keep SSR/hydration consistent)
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) setProfile(JSON.parse(raw) as Profile);
      } catch { /* ignore */ }
      setHydrated(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const results = useMemo(() => (profile ? matchAll(profile) : []), [profile]);

  const startWizard = () => {
    setView("wizard");
    window.scrollTo({ top: 0 });
  };

  const complete = (p: Profile) => {
    setProfile(p);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch { /* ignore */ }
    setView("results");
    window.scrollTo({ top: 0 });
  };

  const navTo = (v: "landing" | "explore" | "strategy") => {
    // "My strategy" jumps straight to results when a profile exists,
    // otherwise it opens the wizard. Logo still returns to the hero.
    if (v === "strategy") {
      setView(profile ? "results" : "wizard");
    } else {
      setView(v);
    }
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="relative flex min-h-screen flex-col">
      <Background />
      <Navbar view={view} onNav={navTo} />

      <main className="flex-1">
        {!hydrated ? (
          <div className="flex h-[60vh] items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="h-8 w-8 rounded-full border-2 border-emerald-400 border-t-transparent"
            />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {view === "landing" && (
              <motion.div key="landing"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <Hero onStart={startWizard} onExplore={() => navTo("explore")} />
              </motion.div>
            )}

            {view === "wizard" && (
              <motion.div key="wizard"
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <Wizard initial={profile} onComplete={complete} onCancel={() => navTo("landing")} />
              </motion.div>
            )}

            {view === "results" && profile && (
              <motion.div key="results"
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <Results profile={profile} results={results} onEdit={startWizard} />
              </motion.div>
            )}

            {view === "explore" && (
              <motion.div key="explore"
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <Explorer savedProfile={profile} />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

      <Footer />
    </div>
  );
}
