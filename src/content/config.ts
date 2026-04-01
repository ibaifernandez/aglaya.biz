import { defineCollection, z } from 'astro:content';

const proofCollection = defineCollection({
  schema: z.object({
    title: z.object({
      en: z.string(),
      es: z.string(),
    }),
    client: z.string(),
    industry: z.string(),
    challenge: z.object({
      en: z.string(),
      es: z.string(),
    }),
    solution_systems: z.array(z.enum([
      'Systemic Alchemy',
      'Narrative Delivery',
      'Zero-Leak Architecture',
      'AI Orchestration',
      'Productive Friction'
    ])),
    results: z.array(z.object({
      metric: z.string(),
      label: z.object({
        en: z.string(),
        es: z.string(),
      }),
    })),
    featured: z.boolean(),
    date: z.string(),
    ogImage: z.string().optional(),
  }),
});

export const collections = {
  proof: proofCollection,
};