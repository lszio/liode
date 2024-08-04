import { defineCollection, z } from "astro:content";

const tool = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    labels: z.string().array().optional(),
    summary: z.string(),
  }),
});

export const collections = {
  tool,
};