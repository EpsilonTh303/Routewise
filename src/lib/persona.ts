import { z } from "zod";

export interface Persona {
  displayName: string;
  headline: string;
  location: string;
  bio: string;
  photo: string | null;
}

const photoSchema = z.string().max(400_000).regex(/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/, "Photo must be a JPEG, PNG, or WebP data URL.").nullable();

export const personaSchema: z.ZodType<Persona> = z.object({
  displayName: z.string().trim().max(80),
  headline: z.string().trim().max(120),
  location: z.string().trim().max(120),
  bio: z.string().trim().max(600),
  photo: photoSchema,
}).strict();

export const EMPTY_PERSONA: Persona = {
  displayName: "",
  headline: "",
  location: "",
  bio: "",
  photo: null,
};

/** Read untrusted local storage without letting malformed persona data break the app. */
export function parsePersona(raw: unknown): Persona {
  let value = raw;
  if (typeof raw === "string") {
    try { value = JSON.parse(raw); } catch { return { ...EMPTY_PERSONA }; }
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) return { ...EMPTY_PERSONA };
  const candidate = value as Record<string, unknown>;
  const bounded = (key: keyof Omit<Persona, "photo">, max: number) =>
    typeof candidate[key] === "string" ? (candidate[key] as string).trim().slice(0, max) : "";
  const photo = photoSchema.safeParse(candidate.photo);
  return {
    displayName: bounded("displayName", 80),
    headline: bounded("headline", 120),
    location: bounded("location", 120),
    bio: bounded("bio", 600),
    photo: photo.success ? photo.data : null,
  };
}

export function serializePersona(persona: Persona): string {
  return JSON.stringify(personaSchema.parse(persona));
}
