import {z} from 'zod';
import {programSchema} from './validation';

/** Public program data only; never profiles, saved results or database files. */
export const publicCatalogSchema=z.object({
  schemaVersion:z.literal(1),
  engineVersion:z.string().regex(/^\d+\.\d+\.\d+$/),
  generatedAt:z.iso.datetime(),
  catalogVersion:z.string().regex(/^[a-f0-9]{64}$/),
  programs:z.array(programSchema).min(1).max(500),
}).strict();
