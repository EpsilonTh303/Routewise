import type { Profile } from "./types";
import { profileSchema } from "./validation";

/** Reject old, partial, or tampered browser storage before it reaches scoring. */
export function isProfile(value: unknown): value is Profile {
  return profileSchema.safeParse(value).success;
}

export function parseSavedProfile(raw: string | null): Profile | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if(isProfile(value)) return value; // migrate v1 without inventing evidence
    if(value && typeof value === "object" && "version" in value && (value.version===2||value.version===3) && "profile" in value && isProfile(value.profile)) return value.profile;
    return null;
  } catch {
    return null;
  }
}

export function serializeSavedProfile(profile:Profile):string {
  return JSON.stringify({version:2,profile:profileSchema.parse(profile)});
}
