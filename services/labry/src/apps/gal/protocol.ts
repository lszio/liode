import { z } from "zod";

export const Item = z
  .object({
    name: z.string(),
    tags: z.array(z.string()),
  })
  .passthrough();

export type Item = z.infer<typeof Item>;

export const Source = z.record(z.string(), z.array(Item));

export type Source = z.infer<typeof Source>;

export const Database = z.record(z.string(), Source);

export type Database = z.infer<typeof Database>;
