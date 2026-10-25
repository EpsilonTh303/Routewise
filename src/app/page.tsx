"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import type { Profile, Program } from "@/lib/types";
import { matchPrograms } from "@/lib/scoring";
import {BROWSER_PROFILE_KEY,parseBrowserProfile,persistBrowserProfile} from "@/lib/browser-profile";
import {EMPTY_PERSONA,type Persona} from "@/lib/persona";
import { Background } from "@/components/atlas/Background";
import { Navbar } from "@/components/atlas/Navbar";
import { Hero } from "@/components/atlas/Hero";
import { Wizard } from "@/components/atlas/Wizard";
import { Results } from "@/components/atlas/Results";
import { Explorer } from "@/components/atlas/Explorer";
import { Footer } from "@/components/atlas/Footer";
import {ProfilePage} from "@/components/atlas/ProfilePage";

const STORAGE_KEY = BROWSER_PROFILE_KEY;
type View = "landing" | "wizard" | "results" | "explore" | "profile";

export default function Home() {
  const [view, setView] = useState<View>("landing");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [persona,setPersona]=useState<Persona>({...EMPTY_PERSONA});
  const [profileEditing,setProfileEditing]=useState(false);
  const [saveError,setSaveError]=useState<string|null>(null);
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
        const saved = parseBrowserProfile(raw);
        setProfile(saved.profile);setPersona(saved.persona);
        if (raw && !saved.profile) localStorage.removeItem(STORAGE_KEY);
      } catch { /* ignore */ }
      setHydrated(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const results = useMemo(() => (profile && programs ? matchPrograms(programs,profile) : []), [profile,programs]);
  const programCount=programs?.length??0;
  const countryCount=new Set(programs?.map(p=>p.country)??[]).size;

  const startWizard = () => {
    setSaveError(null);
    setProfileEditing(true);
    setView(profile?"profile":"wizard");
    window.scrollTo({ top: 0 });
  };

  const complete = (p: Profile) => {
    try {persistBrowserProfile(localStorage,p,persona);} catch(error) {setSaveError(error instanceof Error?error.message:"Profile could not be saved.");return;}
    setSaveError(null);setProfile(p);
    setView("results");
    window.scrollTo({ top: 0 });
  };

  const saveProfile=(p:Profile,identity:Persona)=>{
    persistBrowserProfile(localStorage,p,identity);
    setProfile(p);setPersona(identity);setSaveError(null);
  };

  const navTo = (v: "landing" | "explore" | "strategy" | "profile") => {
    // "My strategy" jumps straight to results when a profile exists,
    // otherwise it opens the wizard. Logo still returns to the hero.
    if (v === "strategy") {
      setView(profile ? "results" : "wizard");
    } else if(v==="profile") {
      setProfileEditing(false);setView(profile?"profile":"wizard");
    } else {
      setView(v);
    }
    window.scrollTo({ top: 0 });
  };

  return (
    <MotionConfig reducedMotion="user">
    <div className="relative flex min-h-screen flex-col">
      <Background />
      <Navbar view={view} onNav={navTo} photo={persona.photo}/>

      <main className="flex-1">
        {saveError&&<p role="alert" className="mx-auto mt-4 max-w-3xl rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">{saveError}</p>}
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
                <Results profile={profile} results={results} onEdit={startWizard} persona={persona} onViewProfile={()=>navTo("profile")} />
              </motion.div>
            )}

            {view === "explore" && (
              <motion.div key="explore"
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <Explorer programs={programs} savedProfile={profile} />
              </motion.div>
            )}

            {view==="profile"&&profile&&<motion.div key="profile" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
              <ProfilePage key={profileEditing?"edit":"view"} profile={profile} persona={persona} onSave={saveProfile} onStrategy={()=>navTo("strategy")} initiallyEditing={profileEditing}/>
            </motion.div>}
          </AnimatePresence>
        )}
      </main>

      {programs && <Footer programCount={programCount} countryCount={countryCount} />}
    </div>
    </MotionConfig>
  );
}
