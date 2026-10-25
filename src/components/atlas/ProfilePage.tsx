"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import type { Education, Goal, Profile, WorkField } from "@/lib/types";
import { CITIZENSHIPS } from "@/lib/types";
import { profileSchema } from "@/lib/validation";
import { ApplicantEvidenceEditor } from "./ApplicantEvidenceEditor";
import { AvatarUpload } from "./AvatarUpload";
import { RegionPicker } from "./RegionPicker";
import { personaSchema, type Persona } from "@/lib/persona";

const inputClass = "mt-1 block min-h-11 w-full min-w-0 rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-base text-white sm:text-sm";
const labelClass = "block min-w-0 text-sm font-medium";
const fieldClass = "min-w-0";
const educationLabels: Record<Education, string> = { highschool: "High school", bachelor: "Bachelor's", master: "Master's", phd: "Doctorate" };
const fieldLabels: Record<WorkField, string> = { it: "IT / software", medicine: "Medicine", engineering: "Engineering", finance: "Finance", business: "Business", creative: "Creative", trades: "Skilled trades", other: "Other" };
const goalLabels: Record<Goal, string> = { citizenship: "Citizenship", "pr-fast": "Fast residence decision", "lowest-cost": "Lowest cost", "top-qol": "Quality of life", remote: "Remote work", business: "Business / startup", study: "Study", "family-safe": "Family inclusion" };
const timelineLabels: Record<Profile["timeline"], string> = { asap: "As soon as possible", "6m": "Within 6 months", "1y": "Within 1 year", flexible: "Flexible" };

function displayNumber(value: number) { return Number.isFinite(value) ? String(value) : ""; }
function money(value: number) { return `$${Math.round(value).toLocaleString("en-US")}`; }

export function ProfilePage({ profile, persona, onSave, onStrategy, initiallyEditing = false }: {
  profile: Profile;
  persona: Persona;
  onSave: (profile: Profile, persona: Persona) => void | Promise<void>;
  onStrategy: () => void;
  initiallyEditing?: boolean;
}) {
  const [editing, setEditing] = useState(initiallyEditing);
  const [draft, setDraft] = useState(profile);
  const [personaDraft, setPersonaDraft] = useState(persona);
  const [evidenceValid, setEvidenceValid] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const beginEdit = () => { setDraft(profile); setPersonaDraft(persona); setEvidenceValid(true); setError(""); setSuccess(false); setEditing(true); };
  const cancel = () => { setDraft(profile); setPersonaDraft(persona); setEvidenceValid(true); setError(""); setSuccess(false); setEditing(false); };
  const setProfile = <K extends keyof Profile>(key: K, value: Profile[K]) => setDraft(current => ({ ...current, [key]: value }));

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(""); setSuccess(false);
    if (!evidenceValid) { setError("Finish or remove the invalid route evidence before saving."); return; }
    const parsedProfile = profileSchema.safeParse(draft);
    const parsedPersona = personaSchema.safeParse(personaDraft);
    if (!parsedProfile.success) { const issue = parsedProfile.error.issues[0]; setError(`${issue.path.join(".") || "Profile"}: ${issue.message}`); return; }
    if (!parsedPersona.success) { const issue = parsedPersona.error.issues[0]; setError(`${issue.path.join(".") || "Identity"}: ${issue.message}`); return; }
    setSaving(true);
    try {
      await onSave(parsedProfile.data, parsedPersona.data);
      setDraft(parsedProfile.data); setPersonaDraft(parsedPersona.data); setEditing(false); setSuccess(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Your profile could not be saved. Please try again.");
    } finally { setSaving(false); }
  };

  const title = persona.displayName.trim() || "Your profile";
  const citizenship = CITIZENSHIPS.find(item => item.key === profile.citizenship);
  const summaryItem = (label: string, value: string) => <div className="min-w-0 rounded-xl border border-white/10 bg-white/[0.02] p-3"><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-1 break-words text-sm font-semibold">{value}</dd></div>;
  const textInput = (label: string, key: "displayName" | "headline" | "location", maxLength: number) => <label className={labelClass}>{label}<input className={inputClass} maxLength={maxLength} value={personaDraft[key]} onChange={event => setPersonaDraft(current => ({ ...current, [key]: event.target.value }))} /></label>;
  const numeric = (label: string, key: "age" | "dependents" | "budget" | "monthlyIncome" | "expectedSalary" | "experience", options: { min: number; max: number; step?: string; hint?: string }) => <label className={labelClass}>{label}<input className={inputClass} type="number" inputMode="decimal" min={options.min} max={options.max} step={options.step ?? "1"} value={displayNumber(draft[key])} onChange={event => setProfile(key, event.target.value.trim() === "" ? Number.NaN : Number(event.target.value))} />{options.hint && <span className="mt-1 block text-xs text-muted-foreground">{options.hint}</span>}</label>;
  const select = <T extends string | number>(label: string, value: T, options: readonly { value: T; label: string }[], onChange: (value: T) => void) => <label className={labelClass}>{label}<select className={inputClass} value={value} onChange={event => onChange((typeof value === "number" ? Number(event.target.value) : event.target.value) as T)}>{options.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>;

  return <section aria-label="Profile" className="mx-auto w-full max-w-5xl min-w-0 px-4 py-6 sm:px-6 sm:py-10">
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-card shadow-xl">
      <div className="border-b border-white/10 bg-gradient-to-br from-emerald-400/10 via-transparent to-cyan-400/10 p-5 sm:p-8">
        <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
          <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-full border border-white/15 bg-white/5 text-3xl text-muted-foreground">{persona.photo ? <img src={persona.photo} alt="Profile photo" className="h-full w-full object-cover" /> : <span aria-hidden="true">◎</span>}</div>
          <div className="min-w-0 flex-1"><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">Profile</p><h1 className="mt-1 break-words text-3xl font-extrabold sm:text-4xl">{title}</h1>
            {persona.headline && <p className="mt-1 break-words text-base text-white/80">{persona.headline}</p>}
            {persona.location && <p className="mt-1 break-words text-sm text-muted-foreground">{persona.location}</p>}
            {persona.bio && <p className="mt-3 max-w-2xl whitespace-pre-wrap break-words text-sm leading-relaxed text-white/80">{persona.bio}</p>}
          </div>
          <div className="flex shrink-0 flex-wrap gap-2"><button type="button" onClick={editing ? cancel : beginEdit} className="min-h-11 rounded-xl border border-white/15 px-4 py-2 text-sm font-bold hover:bg-white/5">{editing ? "Cancel editing" : "Edit profile"}</button><button type="button" onClick={onStrategy} className="min-h-11 rounded-xl bg-emerald-400 px-4 py-2 text-sm font-extrabold text-black hover:bg-emerald-300">View strategy</button></div>
        </div>
      </div>
      {success && !editing && <p className="px-5 pt-4 text-sm text-emerald-200" role="status">Profile saved.</p>}
      {!editing ? <div className="space-y-7 p-5 sm:p-8">
        <section aria-labelledby="overview-personal"><h2 id="overview-personal" className="text-lg font-bold">Personal overview</h2><dl className="mt-3 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {summaryItem("Citizenship", `${citizenship?.flag ?? ""} ${citizenship?.name ?? profile.citizenship}`)}{summaryItem("Age", String(profile.age))}{summaryItem("Family", `${profile.familyStatus}${profile.dependents ? ` · ${profile.dependents} dependents` : ""}`)}
        </dl></section>
        <section aria-labelledby="overview-career"><h2 id="overview-career" className="text-lg font-bold">Career</h2><dl className="mt-3 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {summaryItem("Education", educationLabels[profile.education])}{summaryItem("Field", fieldLabels[profile.field])}{summaryItem("Experience", `${profile.experience} years`)}{summaryItem("English", ["None", "Basic", "Conversational", "Fluent"][profile.englishLevel])}{summaryItem("Other languages", [profile.turkish && "Turkish", profile.russian && "Russian"].filter(Boolean).join(", ") || "None listed")}
        </dl></section>
        <section aria-labelledby="overview-finance"><h2 id="overview-finance" className="text-lg font-bold">Finances & preferences</h2><dl className="mt-3 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {summaryItem("Available savings", money(profile.budget))}{summaryItem("Monthly income", money(profile.monthlyIncome))}{summaryItem("Expected salary", money(profile.expectedSalary))}{summaryItem("Job offer", profile.hasJobOffer ? "Yes" : "No")}{summaryItem("Goal", goalLabels[profile.goal])}{summaryItem("Timeline", timelineLabels[profile.timeline])}{summaryItem("Risk preference", profile.risk)}{summaryItem("Remote work", profile.remoteWork ? "Yes" : "No")}
        </dl><p className="mt-3 text-xs text-muted-foreground">Preferred regions: {profile.regions.length ? profile.regions.join(", ") : "All regions"}</p></section>
      </div> : <form onSubmit={event => void save(event)} className="space-y-7 p-5 sm:p-8" noValidate>
        <section className="space-y-4" aria-labelledby="edit-identity"><div><h2 id="edit-identity" className="text-lg font-bold">Identity</h2><p className="mt-1 text-sm text-muted-foreground">Your profile identity is stored separately from route matching details.</p></div>
          <AvatarUpload value={personaDraft.photo} onChange={value => setPersonaDraft(current => ({ ...current, photo: value }))} />
          <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">{textInput("Display name", "displayName", 80)}{textInput("Headline", "headline", 120)}{textInput("Location", "location", 120)}<label className={`${labelClass} sm:col-span-2`}>About you<textarea className={`${inputClass} min-h-32 resize-y`} maxLength={600} value={personaDraft.bio} onChange={event => setPersonaDraft(current => ({ ...current, bio: event.target.value }))} /></label></div>
        </section>
        <section className="space-y-4" aria-labelledby="edit-personal"><h2 id="edit-personal" className="text-lg font-bold">Personal</h2><div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {select("Citizenship", draft.citizenship, CITIZENSHIPS.map(item => ({ value: item.key, label: `${item.flag} ${item.name}` })), value => setProfile("citizenship", value))}
          {numeric("Age", "age", { min: 0, max: 120 })}
          {select("Family status", draft.familyStatus, [{ value: "single", label: "Single" }, { value: "couple", label: "Couple" }, { value: "family", label: "Family" }], value => setProfile("familyStatus", value))}
          {numeric("Dependents", "dependents", { min: 0, max: 100 })}
        </div></section>
        <section className="space-y-4" aria-labelledby="edit-career"><h2 id="edit-career" className="text-lg font-bold">Career</h2><div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {select("Education", draft.education, Object.entries(educationLabels).map(([value, label]) => ({ value: value as Education, label })), value => setProfile("education", value))}
          {numeric("Years of experience", "experience", { min: 0, max: 100 })}
          {select("Work field", draft.field, Object.entries(fieldLabels).map(([value, label]) => ({ value: value as WorkField, label })), value => setProfile("field", value))}
          {select("English level", draft.englishLevel, [{ value: 0, label: "None" }, { value: 1, label: "Basic" }, { value: 2, label: "Conversational" }, { value: 3, label: "Fluent" }], value => setProfile("englishLevel", value))}
          <label className="flex min-h-11 items-center gap-3 rounded-xl border border-white/10 px-3 text-sm"><input type="checkbox" checked={draft.turkish} onChange={event => setProfile("turkish", event.target.checked)} className="h-4 w-4 accent-emerald-400" />Turkish language</label>
          <label className="flex min-h-11 items-center gap-3 rounded-xl border border-white/10 px-3 text-sm"><input type="checkbox" checked={draft.russian} onChange={event => setProfile("russian", event.target.checked)} className="h-4 w-4 accent-emerald-400" />Russian language</label>
        </div></section>
        <section className="space-y-4" aria-labelledby="edit-finances"><h2 id="edit-finances" className="text-lg font-bold">Finances</h2><div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {numeric("Available savings (USD)", "budget", { min: 0, max: Number.MAX_SAFE_INTEGER, step: "any" })}
          {numeric("Monthly income (USD)", "monthlyIncome", { min: 0, max: Number.MAX_SAFE_INTEGER, step: "any" })}
          {numeric("Expected monthly salary (USD)", "expectedSalary", { min: 0, max: Number.MAX_SAFE_INTEGER, step: "any" })}
          <label className="flex min-h-11 items-center gap-3 rounded-xl border border-white/10 px-3 text-sm"><input type="checkbox" checked={draft.hasJobOffer} onChange={event => setProfile("hasJobOffer", event.target.checked)} className="h-4 w-4 accent-emerald-400" />I have a job offer</label>
        </div></section>
        <section className="space-y-4" aria-labelledby="edit-preferences"><h2 id="edit-preferences" className="text-lg font-bold">Preferences</h2><div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {select("Goal", draft.goal, Object.entries(goalLabels).map(([value, label]) => ({ value: value as Goal, label })), value => setProfile("goal", value))}
          {select("Timeline", draft.timeline, Object.entries(timelineLabels).map(([value, label]) => ({ value: value as Profile["timeline"], label })), value => setProfile("timeline", value))}
          {select("Risk preference", draft.risk, [{ value: "low", label: "Low" }, { value: "medium", label: "Medium" }, { value: "high", label: "High" }], value => setProfile("risk", value))}
          <label className="flex min-h-11 items-center gap-3 rounded-xl border border-white/10 px-3 text-sm"><input type="checkbox" checked={draft.remoteWork} onChange={event => setProfile("remoteWork", event.target.checked)} className="h-4 w-4 accent-emerald-400" />I work remotely</label>
        </div><RegionPicker label="Profile preferred regions" value={draft.regions} onChange={regions => setProfile("regions", regions)} /></section>
        <section aria-labelledby="edit-evidence" className="space-y-3"><div><h2 id="edit-evidence" className="text-lg font-bold">Route evidence</h2><p className="mt-1 text-sm text-muted-foreground">Optional documented facts remain attached to your profile.</p></div><ApplicantEvidenceEditor profile={draft} onChange={setDraft} onValidityChange={setEvidenceValid} /></section>
        {error && <p className="break-words rounded-xl border border-rose-400/30 bg-rose-400/10 p-3 text-sm text-rose-100" role="alert">{error}</p>}
        <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-4"><button type="submit" disabled={saving || !evidenceValid} className="min-h-11 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-extrabold text-black disabled:opacity-50">{saving ? "Saving…" : "Save changes"}</button><button type="button" disabled={saving} onClick={cancel} className="min-h-11 rounded-xl border border-white/15 px-5 py-3 text-sm font-bold disabled:opacity-50">Cancel</button></div>
      </form>}
    </section>
  </section>;
}
