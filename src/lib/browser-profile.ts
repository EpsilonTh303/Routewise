import type {Profile} from "./types";
import {profileSchema} from "./validation";
import {parseSavedProfile} from "./profile";
import {EMPTY_PERSONA,parsePersona,personaSchema,type Persona} from "./persona";

export const BROWSER_PROFILE_KEY="routewise-profile-v1";

export function parseBrowserProfile(raw:string|null):{profile:Profile|null;persona:Persona} {
  const profile=parseSavedProfile(raw);
  if(!profile||!raw) return {profile:null,persona:{...EMPTY_PERSONA}};
  try {
    const envelope=JSON.parse(raw);
    return {profile,persona:envelope?.version===3?parsePersona(JSON.stringify(envelope.persona)):{...EMPTY_PERSONA}};
  } catch {return {profile,persona:{...EMPTY_PERSONA}};}
}

export function serializeBrowserProfile(profile:Profile,persona:Persona):string {
  // Identity stays outside the strict assessment Profile and is never sent by evaluation clients.
  return JSON.stringify({version:3,profile:profileSchema.parse(profile),persona:personaSchema.parse(persona)});
}

/** One localStorage write is atomic, so photo and assessment settings cannot be half-saved. */
export function persistBrowserProfile(storage:Pick<Storage,"setItem">,profile:Profile,persona:Persona):void {
  const serialized=serializeBrowserProfile(profile,persona);
  try {storage.setItem(BROWSER_PROFILE_KEY,serialized);}
  catch {throw new Error("Your changes could not be saved in this browser. Your previous saved profile is unchanged. Free some browser storage and try again.");}
}
