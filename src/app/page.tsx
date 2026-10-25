"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import type { Profile, Program } from "@/lib/types";
import { matchPrograms } from "@/lib/scoring";
import { parseSavedProfile, serializeSavedProfile } from "@/lib/profile";
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
  const [programs,setPrograms]=useState<Program[]|null>(null);
  const [catalogError,setCatalogError]=useState(false);
  const [catalogReload,setCatalogReload]=useState(0);

  useEffect(()=>{
    const controller=new AbortController();
    void (async()=>{
      try {
        const items:Program[]=[];let offset:number|null=0;let version:string|undefined;
        while(offset!==null) {
          const response=await fetch(`/api/v1/programs?limit=100&offset=${offset}`,{signal:controller.signal,cache:"no-store"});
          if(!response.ok) throw new Error("Catalog unavailable");
          const {data}=await response.json() as {data:{items:Program[];nextOffset:number|null;catalogVersion:string}};
          if(version && version!==data.catalogVersion) throw new Error("Catalog changed during loading");
          version=data.catalogVersion;
          items.push(...data.items);offset=data.nextOffset;
        }
        if(!items.length) throw new Error("Catalog empty");
        if(!controller.signal.aborted) setPrograms(items);
      } catch {if(!controller.signal.aborted) setCatalogError(true);}
    })();
    return ()=>controller.abort();
  },[catalogReload]);

  // restore saved profile (deferred to keep SSR/hydration consistent)
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const saved = parseSavedProfile(raw);
        setProfile(saved);
        if (raw && !saved) localStorage.removeItem(STORAGE_KEY);
      } catch { /* ignore */ }
      setHydrated(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const results = useMemo(() => (profile && programs ? matchPrograms(programs,profile) : []), [profile,programs]);
  const programCount=programs?.length??0;
  const countryCount=new Set(programs?.map(p=>p.country)??[]).size;

  const startWizard = () => {
    setView("wizard");
    window.scrollTo({ top: 0 });
  };

  const complete = (p: Profile) => {
    setProfile(p);
    try { localStorage.setItem(STORAGE_KEY, serializeSavedProfile(p)); } catch { /* ignore */ }
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
    <MotionConfig reducedMotion="user">
    <div className="relative flex min-h-screen flex-col">
      <Background />
      <Navbar view={view} onNav={navTo} />

      <main className="flex-1">
        {catalogError ? <div className="mx-auto max-w-xl px-6 py-24 text-center"><h1 className="text-2xl font-bold">Program catalog unavailable</h1><p className="mt-3 text-muted-foreground">Program data could not be loaded. Please try again.</p><button className="mt-5 rounded-xl border px-4 py-2" onClick={()=>{setCatalogError(false);setPrograms(null);setCatalogReload(v=>v+1);}}>Try again</button></div> : !hydrated || !programs ? (
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
                <Hero programCount={programCount} countryCount={countryCount} onStart={startWizard} onExplore={() => navTo("explore")} />
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
                <Explorer programs={programs} savedProfile={profile} />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

      {programs && <Footer programCount={programCount} countryCount={countryCount} />}
    </div>
    </MotionConfig>
  );
}
