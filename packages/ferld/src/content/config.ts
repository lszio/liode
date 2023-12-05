/* eslint-disable import/no-unresolved */
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    image: z.string().optional(),
    labels: z.array(z.string()).optional(),
    summary: z.string(),
    created: z
      .string()
      .or(z.date())
      .transform((v) => new Date(v)),
    updated: z
      .string()
      .or(z.date())
      .transform((v) => new Date(v))
      .optional(),
    related: z.array(z.string()).optional(),
  }),
});

const tool = defineCollection({
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    labels: z.array(z.string()).optional(),
  }),
});

const code = defineCollection({
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    labels: z.array(z.string()).optional(),
  }),
});

export const collections = {
  blog,
  tool,
  code,
};
