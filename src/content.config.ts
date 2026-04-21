import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Define a multilingual string that can be a single string or an object with optional en/es/pt keys
const bilingualString = z.union([
  z.string(),
  z.object({
    en: z.string().optional(),
    es: z.string().optional(),
    pt: z.string().optional(),
  }).refine(data => data.en || data.es || data.pt, {
    message: "At least one of 'en', 'es', or 'pt' must be provided"
  }),
]);

const proofCollection = defineCollection({
  loader: glob({ pattern: '[^_]*.{md,mdx}', base: './src/content/proof' }),
  schema: z.object({
    title: bilingualString,
    client: z.string(),
    client_logo: z.string().optional(),
    client_logo_dark: z.string().optional(),
    logo: z.string().optional(),
    industry: bilingualString,
    challenge: bilingualString,
    summary: bilingualString.optional(),
    strategy: bilingualString.optional(),
    vision: bilingualString.optional(),
    heroImage: z.string().optional(),
    thumbImage: z.string().optional(),
    contentImage: z.string().optional(),
    solution_systems: z.array(z.string()), // must match SERVICES-AI.md system names
    results: z.array(z.object({
      metric: z.string(),
      label: bilingualString,
    })),
    featured: z.boolean().default(false),
    date: z.string(), // YYYY-MM
    ogImage: z.string().optional(),
    externalUrl: z.string().url().optional(), // when set, card links directly to external URL
    // Multilingual body content (replaces per-language MD files)
    body_en: z.string().optional(),
    body_es: z.string().optional(),
    body_pt: z.string().optional(),
  }),
});

export const collections = {
  'proof': proofCollection,
};
