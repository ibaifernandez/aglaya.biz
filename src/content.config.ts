import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const proofCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/proof' }),
  schema: z.object({
    title: z.union([
      z.string(),
      z.object({ en: z.string(), es: z.string() }),
    ]),
    client: z.string(),
    client_logo: z.string().optional(),
    logo: z.string().optional(),
    industry: z.union([
      z.string(),
      z.object({ en: z.string(), es: z.string() }),
    ]),
    challenge: z.union([
      z.string(),
      z.object({ en: z.string(), es: z.string() }),
    ]),
    solution_systems: z.array(z.string()), // must match SERVICES-AI.md system names
    results: z.array(z.object({
      metric: z.string(),
      label: z.union([
        z.string(),
        z.object({ en: z.string(), es: z.string() }),
      ]),
    })),
    featured: z.boolean().default(false),
    date: z.string(), // YYYY-MM
    ogImage: z.string().optional(),
  }),
});

export const collections = {
  'proof': proofCollection,
};
